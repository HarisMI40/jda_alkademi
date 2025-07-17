import { NextRequest, NextResponse } from "next/server";

const kuis = [
  { id: "1", title: "Kuis Matematika Dasar", tag: "Matematika", questions: [] },
  { id: "2", title: "Kuis Fisika Dasar", tag: "Fisika", questions: [] },
  { id: "3", title: "Kuis Pemrograman Dasar", tag: "Pemrograman", questions: [] },
]

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: request });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    try {
      const id = (await params).id;

      if (!id) {
        return NextResponse.json({ message: 'ID Kuis wajib disertakan' }, { status: 400 });
      }

      const updateKuis = kuis.filter((kuis) => kuis.id !== id);

      return NextResponse.json({ message: `Kuis dengan ID ${id} berhasil dihapus`, data: updateKuis });
    } catch (error: any) {
      return NextResponse.json({ message: 'Terjadi kesalahan pada server', error: error.message }, { status: 500 });
    }
  } catch (error: any) {

  }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    const { title, tag } = await request.json();

    const updateKuis = kuis.map(kuis => {
      if (kuis.id == id) {
        return {
          ...kuis,
          title,
          tag
        }
      }

      return { ...kuis }
    })

    return NextResponse.json({ message: `Kuis dengan ID ${id} berhasil diUpdate`, data: updateKuis });


  } catch (error: any) {
    return NextResponse.json({ message: 'Terjadi kesalahan pada server', error: error.message }, { status: 500 });
  }
}