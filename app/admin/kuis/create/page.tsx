// File: app/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { neon } from '@neondatabase/serverless';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
  const [form, setForm] = useState({ title: "", tag: "" });
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/kuis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, tag: form.tag }),
      });

      if (!res.ok) {
        throw new Error();
      }

      alert("Kuis Berhasil Di Tambah");

      setForm({ title: "", tag: "" });

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Tambah Kuis</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Judul
            </Label>
            <Input id="title" name="title" value={form.title} className="col-span-3" onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} />
          </div>
          <div className="grid items-center gap-4">
            <Label htmlFor="tag" className="text-right">
              Tag
            </Label>
            <Input id="tag" name="tag" value={form.tag} className="col-span-3" onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} />
          </div>
        </div>
        <Button variant={"secondary"} type='button'><Link href="./"> Kembali </Link></Button>
        <Button variant={"default"}>
          {loading ? <><LoaderCircle className='animate-spin' /> Loading ... </> : "Tambah"}
        </Button>
      </form>
    </>
  );
}