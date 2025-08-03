import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { QuizOption, QuizQuestion } from "@/type/formQuestion";

// Perbaikan pada GET
export async function GET(request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
  ) {
  const { id } = await params; 

  const data = await prisma.quiz.findFirst({
    include: {
      questions: {
        include: {
          answer_options: true,
        },
      }
    },
    where: {
      id: parseInt(id)
    }
  });

  return NextResponse.json(data);
}

// Perbaikan pada POST
export async function POST(request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
  ) {
  try {
    const { id } = await params; 
    const quizId = parseInt(id);
    const body = await request.json();
    const { title, description, questions } = body;

    let answer_options: QuizOption[] = [];

    const dataQuestions = questions.map((question: QuizQuestion, index: number) => {
      const answer_option: QuizOption[] = question.answer_options.map((option: QuizOption, optionIndex: number) => ({
        id: option.id,
        question_id: parseInt(question.id),
        options_text: option.options_text,
        is_right: option.is_right,
        order: optionIndex + 1,
      }));

      answer_options = [...answer_options, ...answer_option];

      return {
        id: parseInt(question.id),
        quiz_id: parseInt(id),
        question_text: question.question_text,
        question_type: question.question_type,
        order_number: index + 1,
        required: question.required,
      };
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
        data: dataQuestions
      }),
      prisma.answer_options.createMany({
        data: answer_options.map(ao => ({ ...ao, order: ao.order || 0 }))
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

// Perbaikan pada DELETE
export async function DELETE(request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    const { id } = await params; // DIUBAH: Hapus await dan ubah cara akses

    await prisma.quiz.delete({
      where: {
        id: parseInt(id),
      },
    })

    const data = await prisma.quiz.findMany({
      include: {
        tag: true
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
}

// Perbaikan pada PUT
export async function PUT(request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
  ) {
  try {
    const { id } = await params; // DIUBAH: Hapus await dan ubah cara akses
    const { title, tag_id } = await request.json(); // Menggunakan tag_id agar lebih jelas

    await prisma.quiz.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: title,
        tag_id: tag_id ? parseInt(tag_id) : null, // Pastikan tag_id adalah angka atau null
      },
    })

    const data = await prisma.quiz.findMany({
      include: {
        tag: true
      }
    });

    return NextResponse.json(data);

  } catch (error) {
    if (error && typeof error == "object" && "message" in error) {
      return NextResponse.json({ message: 'Terjadi kesalahan pada server', error: error.message }, { status: 500 });
    }
  }
}