import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import prisma from "@/lib/db";
import { QuizOption } from "@/type/formQuestion";
import { tipe_pertanyaan } from "@prisma/client"; // Impor tipe ENUM dari Prisma

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = neon(`${process.env.DATABASE_URL}`)
  const data = await sql`select * from quiz where id = ${id}`;

  return NextResponse.json(data[0]);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const quizId = parseInt(id);
    const body = await request.json();
    const { title, description, questions } = body;

    let answer_options:any = [];

    const dataQuestions = questions.map((question: any, index: any) => {
      
      const answer_option = question.options.map((option: any, optionIndex: number) => ({
        id: parseInt(option.id),
        question_id: parseInt(question.id),
        options_text: option.text,
        is_right: option.isCorrect,
        order: optionIndex + 1,
      }))


      answer_options = [...answer_options, ...answer_option];

      return {
        id: parseInt(question.id),
        quiz_id: parseInt(id),
        question_text: question.question,
        question_type: question.type,
        order_number: index + 1,
        required: question.required,
      }
    });


    await prisma.$transaction([

      prisma.quiz.update({
        where: { id: quizId },
        data: {
          title: title,
          description: description,
          updated_at: new Date(),
        },
      }),

      prisma.questions.deleteMany({
        where: { quiz_id: quizId },
      }),

      prisma.questions.createMany({
        data : dataQuestions
      }),

      prisma.answer_options.createMany({
        data : answer_options
      })
  ]);

    return NextResponse.json({ success: true, message: "Quiz saved successfully" });
  } catch (error) {
    console.error("Failed to save quiz:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    const errorCode = error instanceof Object && 'code' in error ? error.code : undefined;
    return NextResponse.json(
      { error: "Failed to save quiz", details: errorMessage, code: errorCode },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // mengambil parameter, contoh "https://www.web.com/api/123"
  try {
    const id = (await params).id;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const hapus = await sql`DELETE FROM quiz where id = ${id}`;

    if (!hapus) {
      throw new Error();
    }

    const data = await sql`select * from quiz`;

    return NextResponse.json(data);
  } catch (error) {
    console.error(error)
  }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const { title, tag } = await request.json();

    const sql = neon(`${process.env.DATABASE_URL}`);

    await sql`UPDATE quiz SET title = ${title}, tag = ${tag} where id = ${id}`;

    const data = await sql`select * from quiz`;
    return NextResponse.json(data);

  } catch (error) {
    if (error && typeof error == "object" && "message" in error) {
      return NextResponse.json({ message: 'Terjadi kesalahan pada server', error: error.message }, { status: 500 });
    }
  }
}