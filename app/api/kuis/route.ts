import { NextResponse } from "next/server";
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
    const { title, tag_id, description } = body;

    if (!title || !tag_id) {
      return NextResponse.json(
        { error: "Properti 'title' dan 'tag wajib diisi." },
        { status: 400 }
      );
    }

      const data = await prisma.quiz.create({
      data: {
        title: title,
        tag_id : tag_id,
        description : description
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