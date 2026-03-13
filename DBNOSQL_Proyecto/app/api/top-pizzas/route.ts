import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const data = await collection.aggregate([
      { $match: { pizza_name: { $exists: true }, quantity: { $gt: 0 } } },
      {
        $group: {
          _id: "$pizza_name",
          pizzasTotal: { $sum: "$quantity" }
        }
      },
      {
        $project: {
          pizza_name: "$_id",
          pizzasTotal: 1,
          _id: 0
        }
      },
      { $sort: { pizzasTotal: -1 } },
      { $limit: 10 }
    ]).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
