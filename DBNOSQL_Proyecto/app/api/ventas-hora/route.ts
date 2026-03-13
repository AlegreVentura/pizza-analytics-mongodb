import clientPromise from '@/lib/mongo';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)');

const querySchema = z.object({
  startDate: isoDate,
  endDate: isoDate,
  mall: z.string().max(100).optional().default('all'),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = querySchema.safeParse({
      startDate: url.searchParams.get('startDate'),
      endDate: url.searchParams.get('endDate'),
      mall: url.searchParams.get('mall') ?? 'all',
    });

    if (!parsed.success) {
      return NextResponse.json({ error: 'Parámetros inválidos: se requieren startDate y endDate en formato YYYY-MM-DD' }, { status: 400 });
    }

    const { startDate, endDate, mall } = parsed.data;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const client = await clientPromise;
    const db = client.db('pizzaDB');
    const collection = db.collection('menu');

    const matchStage: Record<string, unknown> = {
      order_date: { $exists: true },
      order_time: { $exists: true },
      total_price: { $exists: true },
      quantity: { $exists: true },
    };

    if (mall !== 'all') {
      matchStage['mall'] = mall;
    }

    const data = await collection.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          datetime: {
            $toDate: {
              $concat: ['$order_date', 'T', '$order_time'],
            },
          },
          price_num: { $toDouble: '$total_price' },
          qty_num: { $toInt: '$quantity' },
        },
      },
      {
        $match: {
          datetime: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $hour: '$datetime' },
          totalVentas: { $sum: '$price_num' },
          totalPizzas: { $sum: '$qty_num' },
        },
      },
      {
        $project: {
          _id: 0,
          hour: '$_id',
          totalVentas: 1,
          totalPizzas: 1,
        },
      },
      { $sort: { hour: 1 } },
    ]).toArray();

    // Also fetch distinct malls for the filter dropdown
    const malls = await collection.distinct('mall');

    const totalVentas = data.reduce((s: number, d: { totalVentas: number }) => s + d.totalVentas, 0);

    return NextResponse.json({ data, malls: malls.filter(Boolean).sort(), totalVentas });
  } catch (error) {
    console.error('API error /api/ventas-hora:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
