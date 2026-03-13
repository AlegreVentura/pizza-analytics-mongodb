import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");

    const result = await db.collection("menu").aggregate([
      { $match: { pizza_ingredients: { $exists: true, $type: "object" } } },
      { $project: { kv: { $objectToArray: "$pizza_ingredients" } } },
      { $unwind: "$kv" },
      { $group: { _id: "$kv.k" } },
      { $sort: { _id: 1 } },
      { $group: { _id: null, ingredientes: { $push: "$_id" } } },
      { $project: { _id: 0, ingredientes: 1 } },
    ]).toArray();

    return NextResponse.json(result[0]?.ingredientes ?? []);
  } catch (error) {
    console.error("Error en /api/ingredientes/list:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
