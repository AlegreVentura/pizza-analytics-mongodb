import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const top25 = await collection.aggregate([
      {
        $match: {
          pizza_ingredients: { $exists: true, $type: 'object' },
          t_prep: { $exists: true },
        },
      },
      {
        $project: {
          ingredients: { $objectToArray: '$pizza_ingredients' },
          t_prep: { $toDouble: '$t_prep' },
        },
      },
      { $match: { t_prep: { $gt: 0, $lt: 100 } } },
      { $unwind: '$ingredients' },
      {
        $group: {
          _id: '$ingredients.k',
          promedio_tiempo: { $avg: '$t_prep' },
        },
      },
      {
        $project: {
          _id: 0,
          ingrediente: '$_id',
          promedio_tiempo: { $round: ['$promedio_tiempo', 2] },
        },
      },
      { $sort: { promedio_tiempo: -1 } },
      { $limit: 25 },
    ]).toArray();

    return NextResponse.json(top25);
  } catch (error) {
    console.error("Error en /api/top-ingredientes-preparacion:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
