import { NextResponse } from "next/server";

import { neon } from '@neondatabase/serverless';
import prisma from "@/lib/db";


export async function GET() {
  const data = await prisma.quiz.findMany({
    include : {
      tag : true
    }
  });

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

    const data = await sql`INSERT INTO quiz (title, tag) VALUES (${title}, ${tag})`;

    return NextResponse.json({ data: data }, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Request body tidak valid atau bukan JSON." },
      { status: 400 }
    );
  }
}