import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    // Agrupamos en MongoDB y calculamos la mediana en JS sobre arrays pequeños (1 por categoría)
    const grupos = await collection.aggregate([
      {
        $match: {
          pizza_category: { $exists: true },
          t_prep: { $exists: true },
        },
      },
      {
        $project: {
          pizza_category: 1,
          t_prep: { $toDouble: '$t_prep' },
        },
      },
      { $match: { t_prep: { $gt: 0, $lt: 100 } } },
      {
        $group: {
          _id: '$pizza_category',
          tiempos: { $push: '$t_prep' },
        },
      },
    ]).toArray();

    const resumen = grupos.map(({ _id, tiempos }) => {
      const sorted = (tiempos as number[]).sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];
      return { pizza_category: _id, t_prep_median: median };
    });

    return NextResponse.json(resumen);
  } catch (error) {
    console.error("Error en /api/preparacion-por-categoria:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
