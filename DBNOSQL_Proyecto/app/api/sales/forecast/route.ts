import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");

    const forecast = await db
      .collection("forecasts")
      .find({})
      .sort({ date: 1 })
      .project({ _id: 0, date: 1, mean: 1, min: 1, max: 1 })
      .toArray();

    if (forecast.length === 0) {
      return NextResponse.json(
        { error: "Forecast no disponible. Ejecuta el notebook 4_Forecast_Prophet.ipynb." },
        { status: 404 }
      );
    }

    return NextResponse.json(forecast);
  } catch (error) {
    console.error("Error al obtener forecast:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
