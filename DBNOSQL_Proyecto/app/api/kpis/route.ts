import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const collection = client.db("pizzaDB").collection("menu");

    // Query 1: obtener el año más reciente con datos
    const [{ max: maxDate } = { max: null }] = await collection.aggregate([
      { $match: { order_date: { $exists: true } } },
      { $group: { _id: null, max: { $max: { $toDate: "$order_date" } } } },
    ]).toArray();

    const year = maxDate ? new Date(maxDate).getFullYear() : new Date().getFullYear();

    // Query 2: todos los KPIs en UN solo scan usando $facet
    const [result] = await collection.aggregate([
      {
        $addFields: {
          _year: { $year: { $toDate: "$order_date" } },
          _day:  { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$order_date" } } },
        },
      },
      { $match: { _year: year } },
      // Agrupar por día para calcular ingreso diario promedio
      {
        $group: {
          _id: "$_day",
          ingresoDelDia: { $sum: "$total_price" },
          pizzasDelDia:  { $sum: "$quantity" },
        },
      },
      // Un solo $group final para todos los KPIs
      {
        $group: {
          _id:            null,
          ingresoAnual:   { $sum: "$ingresoDelDia" },
          ingresoDiario:  { $avg: "$ingresoDelDia" },
          pizzasVendidas: { $sum: "$pizzasDelDia" },
          totalVentaSum:  { $sum: "$ingresoDelDia" },
          totalQtySum:    { $sum: "$pizzasDelDia" },
        },
      },
      {
        $project: {
          _id:            0,
          ingresoAnual:   1,
          ingresoDiario:  1,
          pizzasVendidas: 1,
          precioPromedio: {
            $cond: [
              { $eq: ["$totalQtySum", 0] },
              0,
              { $divide: ["$totalVentaSum", "$totalQtySum"] },
            ],
          },
        },
      },
    ]).toArray();

    return NextResponse.json({
      ingresoAnual:   result?.ingresoAnual   ?? 0,
      ingresoDiario:  result?.ingresoDiario  ?? 0,
      pizzasVendidas: result?.pizzasVendidas ?? 0,
      precioPromedio: result?.precioPromedio ?? 0,
    });
  } catch (error) {
    console.error("Error en /api/kpis:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
