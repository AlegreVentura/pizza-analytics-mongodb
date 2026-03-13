import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const data = await collection.aggregate([
      // 1. Filtrar registros que tienen order_date
      {
        $match: {
          order_date: { $exists: true }
        }
      },
      // 2. Convertir order_date a tipo fecha (Date)
      {
        $addFields: {
          order_date_date: {
            $toDate: "$order_date"
          }
        }
      },
      // 3. Agrupar por fecha individual primero para obtener total diario real
      {
        $group: {
          _id: {
            dow: { $dayOfWeek: "$order_date_date" },
            fecha: { $dateToString: { format: "%Y-%m-%d", date: "$order_date_date" } }
          },
          totalDia: { $sum: "$quantity" }
        }
      },
      // 4. Promediar los totales diarios por día de semana
      {
        $group: {
          _id: "$_id.dow",
          total: { $avg: "$totalDia" }
        }
      },
      // 5. Ajustar para que Lunes = 0, ..., Domingo = 6
      {
        $addFields: {
          dayOfWeek: {
            $mod: [{ $add: ["$_id", 5] }, 7]
          }
        }
      },
      // 6. Proyección limpia
      {
        $project: {
          _id: 0,
          dayOfWeek: 1,
          total: 1
        }
      },
      // 6. Ordenar cronológicamente
      {
        $sort: { dayOfWeek: 1 }
      }
    ]).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
