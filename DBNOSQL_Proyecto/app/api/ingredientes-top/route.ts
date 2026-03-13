import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    // Todo el cálculo se hace en MongoDB — Node.js solo recibe 10 filas
    const top10 = await collection.aggregate([
      {
        $match: {
          pizza_ingredients: { $exists: true, $type: 'object' },
          quantity: { $gt: 0 },
          order_date: { $exists: true },
        },
      },
      // Convertir el objeto pizza_ingredients a array [{k, v}]
      {
        $project: {
          ingredients: { $objectToArray: '$pizza_ingredients' },
          quantity: 1,
          weekKey: {
            $concat: [
              { $toString: { $isoWeekYear: { $toDate: '$order_date' } } },
              '-W',
              { $toString: { $isoWeek: { $toDate: '$order_date' } } },
            ],
          },
        },
      },
      { $unwind: '$ingredients' },
      // Parsear "100g" → 100 y multiplicar por quantity
      {
        $project: {
          ingrediente: '$ingredients.k',
          gramos: {
            $multiply: [
              {
                $toDouble: {
                  $trim: {
                    input: {
                      $replaceAll: { input: '$ingredients.v', find: 'g', replacement: '' },
                    },
                  },
                },
              },
              '$quantity',
            ],
          },
          weekKey: 1,
        },
      },
      // Sumar gramos por ingrediente + semana
      {
        $group: {
          _id: { ingrediente: '$ingrediente', weekKey: '$weekKey' },
          gramos_semana: { $sum: '$gramos' },
        },
      },
      // Promedio semanal por ingrediente
      {
        $group: {
          _id: '$_id.ingrediente',
          promedio_semanal_gramos: { $avg: '$gramos_semana' },
        },
      },
      {
        $project: {
          _id: 0,
          ingrediente: '$_id',
          promedio_semanal_gramos: { $round: ['$promedio_semanal_gramos', 1] },
        },
      },
      { $sort: { promedio_semanal_gramos: -1 } },
      { $limit: 10 },
    ]).toArray();

    return NextResponse.json(top10);
  } catch (error) {
    console.error("Error en /api/ingredientes-top:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
