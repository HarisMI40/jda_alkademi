// File: app/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Tag {
  id: number,
  name: string
}

// 1. Definisikan state awal untuk form
const initialFormState = {
  title: '',
  description: '',
  tag_id: '',
};

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<Tag[]>([]);
  const [formValues, setFormValues] = useState(initialFormState);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tag');
        if (!response.ok) {
          throw new Error('Gagal mengambil data tag');
        }
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Gagal mengambil tags:", error);
        alert('Gagal memuat data tag.');
      }
    };

    fetchTags();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };


  const handleSelectChange = (value: string) => {
    setFormValues(prev => ({ ...prev, tag_id: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);


      const { title, tag_id, description } = formValues;

      // Validasi sederhana
      if (!title || !tag_id) {
        toast.error("Judul dan Tag tidak boleh kosong.");
        return;
      }

      await axios.post('/api/kuis', { title: title, tag_id: tag_id, description: description });

      toast.success('Kuis Berhasil Di Tambah');


      setFormValues(initialFormState);

    } catch (error) {
      console.log(error)
      toast.error("Gagal menambahkan kuis.");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container mx-auto w-8/12 bg-white p-5 rounded-lg'>
      <h1 className="text-2xl font-bold mb-4">Tambah Kuis</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Judul
            </Label>
            <Input id="title" name="title" value={formValues.title} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="grid items-center gap-4">
            <Label htmlFor="tag" className="text-right">
              Tag
            </Label>
            <Select name="tag_id" value={formValues.tag_id} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full col-span-3">
                <SelectValue placeholder="Pilih tag..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Daftar Tag</SelectLabel>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id.toString()}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Deskripsi
            </Label>
            <Textarea id="description" name="description" value={formValues.description} onChange={handleChange} className="col-span-3" />
          </div>
        </div>
        <Button variant={"secondary"} type='button'><Link href="./"> Kembali </Link></Button>
        <Button variant={"default"} type="submit">
          {loading ? <><LoaderCircle className='animate-spin' /> Loading ... </> : "Tambah"}
        </Button>
      </form>
    </div>
  );
}