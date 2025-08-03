import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // mengambil parameter, contoh "https://www.web.com/api/123"
  try {
    const id = (await params).id;

    const hapus = await prisma.tag.delete({
      where: {
        id:  parseInt(id),
      },
    })

    if (!hapus) {
      throw new Error();
    }

    const data = await prisma.tag.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error)
  }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const { name } = await request.json();

    await prisma.tag.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
      },
    })

    const data = await prisma.tag.findMany();


    return NextResponse.json(data);

  } catch (error) {
    if (error && typeof error == "object" && "message" in error) {
      return NextResponse.json({ message: 'Terjadi kesalahan pada server', error: error.message }, { status: 500 });
    }
  }
}