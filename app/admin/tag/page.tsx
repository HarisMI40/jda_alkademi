'use client';

import React, { useEffect, useState } from 'react'
import { LoaderCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';
import TagActions from './_components/TagActions';

interface Tag {
  id: string;
  name: string;
}


const AdminKuis = () => {
  const [tag, setTag] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  let no = 1;

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tag`);
        const data = await response.data;
        setTag(data);
      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false);
      }
    };


    fetchData();


  }, []);


  return (
    <div className='container mx-auto w-8/12 bg-white p-5 rounded-lg'>
      <h1 className="text-2xl font-bold mb-4">Manajemen Tag</h1>
      <Button variant={'default'} className='my-4'> <Plus /><Link href="./tag/create"> Tambah Tag </Link></Button>
      <div className="relative overflow-x-auto sm:rounded">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10">
          <tbody>
            {loading && <tr className='bg-white'><td colSpan={4} className='p-4'>
              <div className='flex justify-center gap-2'><LoaderCircle className='animate-spin' /> Loading ...</div></td></tr>}
            {
              tag && (
                tag.map((tag) => (
                  <tr key={tag.id} className="border-b dark:border-gray-700 border-gray-300 hover:bg-blue-100 active:bg-blue-100/50 text-black hover:cursor-pointer">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {no++}
                    </th>
                    <td className="px-6 py-4">
                      {tag.name}
                    </td>
                    <td className="px-6 py-4 flex justify-end">
                      <TagActions tag={tag} setTag={setTag} tagId={tag.id} />
                    </td>
                  </tr>
                ))
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminKuis