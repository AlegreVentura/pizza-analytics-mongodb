// app/api/rawdata/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(request: Request) {
  const rl = rateLimit(`rawdata:${getClientIp(request)}`, { limit: 3, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un momento." }, { status: 429 });
  }

  try {
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100000'), 100000);
    const page = Math.max(parseInt(url.searchParams.get('page') ?? '1'), 1);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db('pizzaDB');
    const collection = db.collection('menu');

    const [data, total] = await Promise.all([
      collection.find({}).project({ _id: 0 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(),
    ]);

    return NextResponse.json({ data, total, page, limit });
  } catch (error) {
    console.error('Error en /api/rawdata:', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
