import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const kuisList = [
  {
    title: "Matematika Dasar",
    slug: "matematika-dasar",
    img: "/matematika-dasar.png",
    desc: "Uji kemampuan dasar matematika kamu di sini!",
  },
  {
    title: "Fisika Dasar",
    slug: "fisika-dasar",
    img: '/fisika-dasar-removebg-preview.png',
    desc: "Pelajari dan kerjakan soal-soal fisika dasar.",
  },
  {
    title: "Bahasa Inggris Dasar",
    slug: "bahasa-inggris-dasar",
    img: '/inggris-dasar.jpg',
    desc: "Asah kemampuan bahasa Inggrismu dengan kuis ini.",
  },
];

const KuisSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Coba Kuis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kuisList.map((kuis) => (
            <Link href={`/kuis/${kuis.slug}`} key={kuis.slug}>
              <Card className="hover:shadow-lg transition w-full gap-0">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    {kuis.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {kuis.img && (
                    <div className="flex justify-center mb-4">
                      <Image
                        src={kuis.img}
                        alt={kuis.title}
                        width={240}
                        height={240}
                      />
                    </div>
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