import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request: Request) {
  const rl = rateLimit(`top-leales:${getClientIp(request)}`, { limit: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un momento." }, { status: 429 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const result = await collection.aggregate([
      {
        $match: {
          customer_id: { $exists: true, $ne: null },
          order_date: { $exists: true },
          quantity: { $gt: 0 },
          pizza_name: { $exists: true },
        },
      },
      // Agrupar por cliente: órdenes únicas, fechas extremas, pizzas compradas
      {
        $group: {
          _id: "$customer_id",
          order_ids: { $addToSet: "$order_id" },
          primer: { $min: { $toDate: "$order_date" } },
          ultimo: { $max: { $toDate: "$order_date" } },
          pizzas: { $push: { pizza_name: "$pizza_name", quantity: "$quantity" } },
        },
      },
      // Calcular número de pedidos únicos y días entre primer y último pedido
      {
        $addFields: {
          num_pedidos: { $size: "$order_ids" },
          dias: {
            $divide: [
              { $subtract: ["$ultimo", "$primer"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      // Marcar como leal: >= 5 pedidos únicos y >= 60 días de actividad
      {
        $addFields: {
          es_leal: {
            $and: [
              { $gte: ["$num_pedidos", 5] },
              { $gte: ["$dias", 60] },
            ],
          },
        },
      },
      { $unwind: "$pizzas" },
      // Agrupar por pizza: total vendido y total vendido a leales
      {
        $group: {
          _id: "$pizzas.pizza_name",
          total: { $sum: "$pizzas.quantity" },
          total_leal: {
            $sum: { $cond: ["$es_leal", "$pizzas.quantity", 0] },
          },
        },
      },
      {
        $addFields: {
          proporcion_lealtad: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $divide: ["$total_leal", "$total"] },
            ],
          },
        },
      },
      { $sort: { proporcion_lealtad: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          pizza_name: "$_id",
          proporcion_lealtad: 1,
        },
      },
    ]).toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en /api/top-leales:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
