import { NextResponse } from "next/server";

import { neon } from '@neondatabase/serverless';
import prisma from "@/lib/db";


export async function GET() {
  const data = await prisma.tag.findMany();

  return NextResponse.json(data);
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Properti 'name' diisi." },
        { status: 400 }
      );
    }


    const data = await prisma.tag.create({
      data: {
        name: name,
      },
    })

    return NextResponse.json({ data: data }, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Request body tidak valid atau bukan JSON." },
      { status: 400 }
    );
  }
}
