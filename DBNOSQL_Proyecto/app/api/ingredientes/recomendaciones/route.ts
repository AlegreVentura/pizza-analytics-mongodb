import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const querySchema = z.object({
  ingrediente: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-'().]+$/, "Nombre de ingrediente inválido"),
});

export async function GET(request: Request) {
  const rl = rateLimit(`recomendaciones:${getClientIp(request)}`, { limit: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un momento." }, { status: 429 });
  }

  try {
    const url = new URL(request.url);
    const parsed = querySchema.safeParse({ ingrediente: url.searchParams.get("ingrediente") });
    if (!parsed.success) {
      return NextResponse.json({ error: "Parámetro 'ingrediente' inválido o faltante" }, { status: 400 });
    }
    const { ingrediente } = parsed.data;

    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    // Total de transacciones (denominador del support)
    const totalTransacciones = await collection.countDocuments({
      pizza_ingredients: { $exists: true },
      total_price: { $exists: true },
    });

    // Solo las transacciones que contienen el ingrediente seleccionado
    const data = await collection
      .find({
        [`pizza_ingredients.${ingrediente}`]: { $exists: true },
        total_price: { $exists: true },
      })
      .project({ pizza_ingredients: 1, total_price: 1 })
      .toArray();

    const registros: { ingredientes: string[]; precio: number }[] = data.map((row) => ({
      ingredientes: Object.keys(row.pizza_ingredients),
      precio: Number(row.total_price),
    }));

    const transacciones = registros.map((r) => r.ingredientes);
    const itemsetCounter = new Map<string, { count: number; items: string[] }>();

    for (const ingredientes of transacciones) {
      const set = new Set(ingredientes);
      const combinaciones = Array.from(set).filter((i) => i !== ingrediente);
      if (combinaciones.length < 2) continue;

      for (let i = 0; i < combinaciones.length; i++) {
        for (let j = i + 1; j < combinaciones.length; j++) {
          const combo = [ingrediente, combinaciones[i], combinaciones[j]].sort();
          const key = combo.join("|");
          if (!itemsetCounter.has(key)) {
            itemsetCounter.set(key, { count: 0, items: combo });
          }
          itemsetCounter.get(key)!.count += 1;
        }
      }
    }

    const topCombinaciones = Array.from(itemsetCounter.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const combinacionResultados = topCombinaciones.map(({ items }) => {
      const itemset = new Set(items);
      // Solo transacciones que tienen los 3 ingredientes del combo (support correcto)
      const similares = registros.filter((r) => {
        const comunes = r.ingredientes.filter((i) => itemset.has(i));
        return comunes.length === itemset.size;
      });

      const promedio =
        similares.length > 0
          ? similares.reduce((acc, val) => acc + val.precio, 0) / similares.length
          : 0;

      return {
        itemset: items,
        support: similares.length / totalTransacciones,
        promedio,
      };
    });

    return NextResponse.json(combinacionResultados);
  } catch (error) {
    console.error("Error en /api/ingredientes/recomendaciones:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
