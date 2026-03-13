import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';
import { z } from 'zod';

const querySchema = z.object({
  mall: z.string().min(1).max(100),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ mall: searchParams.get('mall') });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Parámetro mall inválido o faltante' }, { status: 400 });
  }
  const { mall } = parsed.data;

  try {
    const client = await clientPromise;
    const col = client.db('pizzaDB').collection('menu');

    const [general] = await col.aggregate([
      { $match: { mall, total_price: { $exists: true } } },
      {
        $group: {
          _id: null,
          total_registros: { $sum: 1 },
          revenue_total: { $sum: { $toDouble: '$total_price' } },
          t_prep_promedio: { $avg: { $toDouble: '$t_prep' } },
          ordenes_unicas: { $addToSet: '$order_id' },
        },
      },
      {
        $project: {
          _id: 0,
          total_registros: 1,
          revenue_total: { $round: ['$revenue_total', 2] },
          t_prep_promedio: { $round: ['$t_prep_promedio', 1] },
          total_ordenes: { $size: '$ordenes_unicas' },
        },
      },
    ]).toArray();

    const [topPizza] = await col.aggregate([
      { $match: { mall, pizza_name: { $exists: true } } },
      { $group: { _id: '$pizza_name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      { $project: { _id: 0, pizza: '$_id', count: 1 } },
    ]).toArray();

    return NextResponse.json({
      ...general,
      pizza_mas_vendida: topPizza?.pizza ?? '—',
    });
  } catch (error) {
    console.error('Error en /api/branches/stats:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
