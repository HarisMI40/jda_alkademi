'use client';

import React, { useEffect, useState } from 'react'
import KuisActions from './KuisActions';
import { LoaderCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BProgress } from '@bprogress/core';

interface tag {
  id : number,
  name : string
}
interface Kuis {
  id: string;
  title: string;
  tag: tag;
}


const AdminKuis = () => {
  const [kuis, setKuis] = useState<Kuis[]>([]);
  const [loading, setLoading] = useState(false);

  const [tags, setTags] = useState<tag[]>([]);

  const router = useRouter();
  let no = 1;

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/kuis`);
        const data = await response.data;
        setKuis(data);
      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false);
      }
    };


    fetchData();
    
    
  }, []);
  
  
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


  const pushHandler = (id : string) => {
    BProgress.start();
    router.push(`./kuis/${id}`)
  }
  return (
    <div className='container mx-auto w-8/12 bg-white p-5 rounded-lg'>
      <h1 className="text-2xl font-bold mb-4">Manajemen Kuis</h1>
      <Button variant={'default'} className='my-4'> <Plus /><Link href="./kuis/create"> Tambah Kuis </Link></Button>
      <div className="relative overflow-x-auto sm:rounded">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10">
          <tbody>
            {loading && <tr className='bg-white'><td colSpan={4} className='p-4'>
              <div className='flex justify-center gap-2'><LoaderCircle className='animate-spin' /> Loading ...</div></td></tr>}
            {
              kuis && (
                kuis.map((kuis) => (
                  <tr key={kuis.id} className="border-b dark:border-gray-700 border-gray-300 hover:bg-gray-50 text-black">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {no++}
                    </th>
                    <td className="px-6 py-4">
                      {kuis.title}
                    </td>
                    <td className="px-6 py-4">
                      {kuis?.tag?.name}
                    </td>
                    <td className="px-6 py-4 flex justify-end">
                      <KuisActions kuis={kuis} setKuis={setKuis} kuisId={kuis.id} tags={tags} pushHandler={pushHandler} />
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