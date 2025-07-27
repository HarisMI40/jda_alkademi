'use client';

import React, { useEffect, useState } from 'react'
import KuisActions from './KuisActions';
import { LoaderCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Kuis {
  id: string;
  title: string;
  tag: string;
}


const AdminKuis = () => {
  const [kuis, setKuis] = useState<Kuis[]>([]);
  const [loading, setLoading] = useState(false);
  let no = 1;

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kuis`);
        const data = await response.json();
        console.log(data)
        setKuis(data);
      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false);
      }
    };


    fetchData();


  }, []);
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Manajemen Kuis</h1>
      <Button variant={'default'} className='my-4'> <Plus /><Link href="./kuis/create"> Tambah Kuis </Link></Button>
      <div className="relative overflow-x-auto shadow-md sm:rounded">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                NO
              </th>
              <th scope="col" className="px-6 py-3">
                Judul
              </th>
              <th scope="col" className="px-6 py-3">
                Kuis
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className='p-4'>
              <div className='flex justify-center gap-2'><LoaderCircle className='animate-spin' /> Loading ...</div></td></tr>}
            {
              kuis && (
                kuis.map((kuis) => (
                  <tr key={kuis.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {no++}
                    </th>
                    <td className="px-6 py-4">
                      {kuis.title}
                    </td>
                    <td className="px-6 py-4">
                      {kuis.tag}
                    </td>
                    <td className="px-6 py-4">
                      <KuisActions kuis={kuis} setKuis={setKuis} kuisId={kuis.id} />
                    </td>
                  </tr>
                ))
              )
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AdminKuis