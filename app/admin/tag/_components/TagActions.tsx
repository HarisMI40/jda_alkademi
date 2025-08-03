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
import { toast } from 'sonner';

interface Tag {
  id: string;
  name: string;
}

interface KuisActionsProps {
  tagId: string;
  tag: Tag;
  setTag: React.Dispatch<React.SetStateAction<Tag[]>>
}

export default function TagActions({ tagId, tag, setTag }: KuisActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState({ delete: false, update: false })

  const handleDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();


    if (!confirm('Apakah Anda yakin ingin menghapus kuis dengan id ?' + tagId)) {
      return;
    }

    try {
      setLoading({ delete: true, update: false });
      const response = await fetch(`/api/tag/${tagId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Tag berhasil di Hapus')
        const data: Tag[] = await response.json();
        setTag(data);
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
    const name = formData.get('name') as string;

    if (!name) {
      alert('Nama tidak boleh kosong.');
      return;
    }

    try {
      setLoading({ delete: false, update: true });
      const response = await fetch(`/api/tag/${tagId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        alert(`Gagal mengupdate Tag: ${message || 'Terjadi kesalahan'}`);
        return
      }

      const result = await response.json();
      // API mengembalikan seluruh array yang sudah diupdate
      setTag(result);
      toast.success('Tag berhasil Di Update')

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
            <DialogTitle>Update Tag</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Nama
                </Label>
                <Input id="title" name="name" defaultValue={tag.name} className="col-span-3" />
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
