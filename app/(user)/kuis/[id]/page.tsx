import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import Link from 'next/link';
import { Quiz } from '@/type/formQuestion';

interface KuisPageProps {
  params: Promise<{ id: string }>
}

interface Tag {
  id: number;
  name: string;
}

type QuizWithTag = Quiz & {
  tag: Tag; // Kuis bisa saja tidak memiliki tag
};

const showKuis = async (id: number) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/kuis/${id}?view=summary`);
  return response.data;
}

const Kuis = async (props: KuisPageProps) => {
  const params = await props.params;
  const { id } = params;

  const kuis:QuizWithTag = await showKuis(parseInt(id));

  return (
    <div className="flex justify-center items-start min-h-[60vh]">
      <Card className="w-full max-w-md mt-10">
        <CardHeader>
          <CardTitle className="capitalize text-2xl">{kuis.title}</CardTitle>

          <span className="mt-2 text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full w-max">
            {kuis.tag.name}
          </span>
        </CardHeader>
        <CardContent>
          <p>{kuis.description}. </p>
          <p>Klik tombol di bawah untuk memulai!</p>
        </CardContent>
        <CardFooter>
          <Link href={`/kuis/${id}/play`}><Button>Mulai</Button></Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Kuis