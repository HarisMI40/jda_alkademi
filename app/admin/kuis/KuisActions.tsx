'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input';
import { EllipsisVertical, LoaderCircle, Pencil, Trash } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Kuis {
  id: string;
  title: string;
  tag: string;
}

interface KuisActionsProps {
  kuisId: string;
  kuis: Kuis;
  setKuis: React.Dispatch<React.SetStateAction<Kuis[]>>
}

export default function KuisActions({ kuisId, kuis, setKuis }: KuisActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState({ delete: false, update: false })

  const handleDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();


    if (!confirm('Apakah Anda yakin ingin menghapus kuis dengan id ?' + kuisId)) {
      return;
    }

    try {
      setLoading({ delete: true, update: false });
      const response = await fetch(`/api/kuis/${kuisId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data: Kuis[] = await response.json();
        setKuis(data);
      } else {
        const { message }: { message?: string } = await response.json();
        alert(`Gagal menghapus kuis: ${message || 'Terjadi kesalahan'}`);
      }
    } catch (error) {
      alert('Gagal menghubungi server.');
      console.error(error)
    } finally {
      setLoading({ delete: false, update: false });
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const tag = formData.get('tag') as string;

    if (!title || !tag) {
      alert('Judul dan Tag tidak boleh kosong.');
      return;
    }

    try {
      setLoading({ delete: false, update: true });
      const response = await fetch(`/api/kuis/${kuisId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, tag }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        alert(`Gagal mengupdate kuis: ${message || 'Terjadi kesalahan'}`);
        return
      }

      const result = await response.json();
      // API mengembalikan seluruh array yang sudah diupdate
      setKuis(result);
      alert('Kuis berhasil diupdate');

      setIsDialogOpen(false); // Tutup dialog setelah berhasil

    } catch (error) {
      alert('Gagal menghubungi server.');
      console.error(error)
    } finally {
      setLoading({ delete: false, update: false });
    }
  };

  return (
    <div className="flex gap-2">

      <DropdownMenu>
        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}><div className='hover:bg-gray-300 hover:cursor-pointer py-2 px-1 rounded-full'><EllipsisVertical /></div></DropdownMenuTrigger>
        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel>Opsi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            setIsDialogOpen(true)
            }}><div className='text-green-500 flex gap-2 items-center font-semibold'><Pencil color="green" /> Update</div></DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>{loading.delete ? <><LoaderCircle className='animate-spin' /> Menghapus ... </> : <div className='text-red-500 flex gap-2 items-center font-semibold'><Trash color="red" /> Hapus</div>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Kuis</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Judul
                </Label>
                <Input id="title" name="title" defaultValue={kuis.title} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tag" className="text-right">
                  Tag
                </Label>
                <Input id="tag" name="tag" defaultValue={kuis.tag} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" variant={'success'}>
                {loading.update ? <><LoaderCircle className='animate-spin' /> Mengupdate ... </> : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
