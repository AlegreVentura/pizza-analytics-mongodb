import clientPromise from '@/lib/mongo';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('pizzaDB');
    const collection = db.collection('menu');

    const data = await collection.aggregate([
      { $match: { order_date: { $exists: true }, total_price: { $exists: true }, quantity: { $exists: true } } },
      {
        $addFields: {
          order_date_date: { $toDate: '$order_date' },
          price_num: { $toDouble: '$total_price' },
          qty_num: { $toInt: '$quantity' },
        },
      },
      // Group by {dow, fecha} to get per-day totals
      {
        $group: {
          _id: {
            dow: { $dayOfWeek: '$order_date_date' },
            fecha: { $dateToString: { format: '%Y-%m-%d', date: '$order_date_date' } },
          },
          totalVentasDia: { $sum: '$price_num' },
          totalPizzasDia: { $sum: '$qty_num' },
        },
      },
      // Average across days of the same weekday
      {
        $group: {
          _id: '$_id.dow',
          avgVentas: { $avg: '$totalVentasDia' },
          avgPizzas: { $avg: '$totalPizzasDia' },
        },
      },
      // Normalize: MongoDB $dayOfWeek is 1=Sunday ... 7=Saturday → remap to 0=Monday ... 6=Sunday
      {
        $addFields: {
          dayOfWeek: { $mod: [{ $add: ['$_id', 5] }, 7] },
        },
      },
      {
        $project: {
          _id: 0,
          dayOfWeek: 1,
          avgVentas: 1,
          avgPizzas: 1,
        },
      },
      { $sort: { dayOfWeek: 1 } },
    ]).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error /api/ventas-dia:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
