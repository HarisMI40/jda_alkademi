import { NextResponse } from "next/server";
import * as crypto from "node:crypto";


const randomId = () => crypto.randomBytes(20).toString('hex');
const kuis = [
  { id: randomId(), title: "Kuis Matematika Dasar", tag: "Matematika", questions: [] },
  { id: randomId(), title: "Kuis Fisika Dasar", tag: "Fisika", questions: [] },
  { id: randomId(), title: "Kuis Pemrograman Dasar", tag: "Pemrograman", questions: [] },
]

export async function GET() {
  return NextResponse.json({ data: kuis });
}



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, tag } = body;

    if (!title || !tag) {
      return NextResponse.json(
        { error: "Properti 'title' dan 'tag wajib diisi." },
        { status: 400 }
      );
    }

    const newKuis = { id: randomId(), title, tag, questions: [] };
    kuis.push(newKuis);

    return NextResponse.json({ data: newKuis }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Request body tidak valid atau bukan JSON." },
      { status: 400 }
    );
  }
}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID Kuis wajib disertakan' }, { status: 400 });
    }

    const updateKuis = kuis.filter((kuis) => kuis.id !== id);

    return NextResponse.json({ message: `Kuis dengan ID ${id} berhasil dihapus`, data : updateKuis });
  } catch (error: any) {
    return NextResponse.json({ message: 'Terjadi kesalahan pada server', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // mengambil query, contoh "https://www.web.com/api/kuis?id=123"
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const {title, tag} = await request.json();

    const updateKuis = kuis.map(kuis => {
      if(kuis.id == id){
        return {
          ...kuis,
          title,
          tag
        }
      }

      return {...kuis}
    })

    return NextResponse.json({ message: `Kuis dengan ID ${id} berhasil diUpdate`, data : updateKuis });
    

  } catch (error: any) {
    return NextResponse.json({ message: 'Terjadi kesalahan pada server', error: error.message }, { status: 500 });
  }
}