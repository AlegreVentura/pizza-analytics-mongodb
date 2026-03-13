import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const resumen = await collection.aggregate([
      {
        $match: {
          pizza_ingredients: { $exists: true, $type: 'object' },
          total_price: { $exists: true },
        },
      },
      {
        $project: {
          ingredients: { $objectToArray: '$pizza_ingredients' },
          total_price: { $toDouble: '$total_price' },
        },
      },
      { $unwind: '$ingredients' },
      {
        $group: {
          _id: '$ingredients.k',
          total_ventas: { $sum: '$total_price' },
        },
      },
      {
        $project: {
          _id: 0,
          label: '$_id',
          value: { $round: ['$total_ventas', 2] },
        },
      },
    ]).toArray();

    const sorted = [...resumen].sort((a: any, b: any) => b.value - a.value);
    const top = sorted.slice(0, 10);
    const bottom = [...resumen].sort((a: any, b: any) => a.value - b.value).slice(0, 10);

    return NextResponse.json({ top, bottom });
  } catch (error) {
    console.error("Error en /api/ingredientes-funnel:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
