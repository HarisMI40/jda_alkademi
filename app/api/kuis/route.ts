import { NextResponse } from "next/server";

import { neon } from '@neondatabase/serverless';


export async function GET() {
   const sql = neon(`${process.env.DATABASE_URL}`);
   const data = await sql`select * from kuis`;

  
   return NextResponse.json(data);
}



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, tag } = body;

    const sql = neon(`${process.env.DATABASE_URL}`);

    if (!title || !tag) {
      return NextResponse.json(
        { error: "Properti 'title' dan 'tag wajib diisi." },
        { status: 400 }
      );
    }

    const data = await sql`INSERT INTO kuis (title, tag) VALUES (${title}, ${tag})`;

    return NextResponse.json({ data: data }, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Request body tidak valid atau bukan JSON." },
      { status: 400 }
    );
  }
}