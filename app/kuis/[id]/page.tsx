import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

interface KuisPageProps {
  params: Promise<{ id: string }>
}

const Kuis = async (props: KuisPageProps) => {
  const params = await props.params;
  const { id } = params;

  const image = {
    'matematika-dasar' : '/matematika-dasar.png',
    'fisika-dasar' : '/fisika-dasar.jpg',
    'bahasa-inggris-dasar' : '/inggris-dasar.png'
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className='mb-5'>
          <Image
            src={image[id as keyof typeof image]}
            alt={id}
            width={240}
            height={240}
            priority
          />
          </div>
          <CardTitle className="capitalize text-2xl">{id.replace(/-/g, " ")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Selamat datang di kuis <span className="font-semibold">{id.replace(/-/g, " ")}</span>. Klik tombol di bawah untuk memulai!</p>
        </CardContent>
        <CardFooter>
          <Button>Mulai</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Kuis