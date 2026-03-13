import clientPromise from '@/lib/mongo';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('pizzaDB');
    const collection = db.collection('menu');

    const data = await collection.aggregate([
      { $match: { order_date: { $exists: true }, total_price: { $exists: true } } },
      {
        $addFields: {
          order_date_date: { $toDate: '$order_date' },
          price_num: { $toDouble: '$total_price' },
        },
      },
      { $match: { 'order_date_date': { $gte: new Date('2015-01-01') } } },
      {
        $group: {
          _id: {
            year: { $year: '$order_date_date' },
            quarter: {
              $ceil: { $divide: [{ $month: '$order_date_date' }, 3] },
            },
          },
          totalVentas: { $sum: '$price_num' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          quarter: '$_id.quarter',
          totalVentas: 1,
        },
      },
      { $sort: { year: 1, quarter: 1 } },
    ]).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error /api/temporadas:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
