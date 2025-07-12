'use client'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <DotLottieReact
        src="https://lottie.host/36788746-15aa-454e-906a-a50380b2ca34/XqMu7UOSYH.lottie"
        loop
        autoplay
        className='w-4/12'
      />
      <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-gray-500 mb-6">Halaman tidak ditemukan.</p>
      <Link
        href="/"
        className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}