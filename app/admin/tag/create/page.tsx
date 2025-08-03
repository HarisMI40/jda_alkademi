// File: app/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Page() {
  const [form, setForm] = useState({ name : "" });
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name :form.name }),
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success('Tag berhasil tersimpan')

      setForm({ name : "" });

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container mx-auto w-8/12 bg-white p-5 rounded-lg'>
      <h1 className="text-2xl font-bold mb-4">Tambah Tag</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nama
            </Label>
            <Input id="name" name="name" value={form.name} className="col-span-3" onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} />
          </div>
        </div>
        <Button variant={"secondary"} type='button'><Link href="./"> Kembali </Link></Button>
        <Button variant={"default"}>
          {loading ? <><LoaderCircle className='animate-spin' /> Loading ... </> : "Tambah"}
        </Button>
      </form>
    </div>
  );
}