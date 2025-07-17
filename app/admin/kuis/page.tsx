'use client';

import React, { useEffect, useState } from 'react'
import KuisActions from './KuisActions';

interface Kuis {
  id: string;
  title: string;
  tag: string;
}


const AdminKuis = () => {
  const [kuis, setKuis] = useState<Kuis[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kuis`);
        const data = await response.json();
        setKuis(data.data);
      } catch (error) {
        console.error(error);
      }
    };


    fetchData();


  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manajemen Kuis</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Judul</th>
              <th className="py-2 px-4 border-b">Tag</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {
              kuis && (
                kuis.map((kuis) => (
                  <tr key={kuis.id}>
                    <td className="py-2 px-4 border-b text-xs">{kuis.id}</td>
                    <td className="py-2 px-4 border-b">{kuis.title}</td>
                    <td className="py-2 px-4 border-b">{kuis.tag}</td>
                    <td className="py-2 px-4 border-b">
                      <KuisActions kuis={kuis} setKuis={setKuis} kuisId={kuis.id} />
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