import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';


export async function GET(request: NextRequest) {
  return NextResponse.json({ data: request });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // mengambil parameter, contoh "https://www.web.com/api/123"
  try {
    const id = (await params).id;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const hapus = await sql`DELETE FROM kuis where id = ${id}`;

    if(!hapus){
      throw new Error();
    }

    const data = await sql`select * from kuis`;

    return NextResponse.json(data);
  } catch (error: any) {

  }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const {title, tag} = await request.json();

    const sql = neon(`${process.env.DATABASE_URL}`);

    const update = await sql`UPDATE kuis SET title = ${title}, tag = ${tag} where id = ${id}`;

    const data = await sql`select * from kuis`;
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ message: 'Terjadi kesalahan pada server', error: error.message }, { status: 500 });
  }
}