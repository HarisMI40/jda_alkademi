import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import prisma from "@/lib/db";

interface QuizResult {
  id : number
  title: string
  description: string | null
  tag_id : bigint | null
  tag : {
    id : bigint,
    name : string
  } | null
}

const KuisSection = async () => {
  const kuisList: QuizResult[] = await prisma.quiz.findMany({
    include: {
      tag: true, // Pastikan Anda menyertakan relasi yang dibutuhkan
    },
    orderBy: {
      created_at: 'desc', // Contoh: urutkan berdasarkan yang terbaru
    },
    take: 6, // Contoh: batasi hanya 6 kuis yang ditampilkan
  });

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Coba Kuis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kuisList.map((kuis:QuizResult) => (
            <Link href={`/kuis/${kuis.id}`} key={kuis.id}>
              <Card className="hover:shadow-lg transition w-full h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-center text-xl">
                    {kuis.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center text-center">
                  <p className="text-sm text-gray-600">{kuis.description || "Tidak ada deskripsi."}</p>
                  {kuis.tag && (
                    <span className="mt-2 text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {kuis.tag.name}
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KuisSection;