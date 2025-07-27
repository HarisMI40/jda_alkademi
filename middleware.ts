import { NextResponse } from "next/server"
import withAuth from "next-auth/middleware"

export default withAuth(
  // `withAuth` akan menambahkan token pengguna ke dalam `Request`.
  function middleware(req) {
    // Cek jika path adalah /admin dan role pengguna BUKAN 'admin'.
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
      // Jika tidak sesuai, redirect ke halaman lain, misalnya halaman utama.
      return NextResponse.rewrite( // NextResponse.rewrite akan menyajika konten dari URL lain tanpa merubah URL di bilah browser, ini berbeda dari NextResponse.redirect
        new URL("/unauthorized", req.url)
      );
    }
  },
  {
    callbacks: {
      // Callback `authorized` digunakan untuk menentukan apakah pengguna diizinkan mengakses halaman.
      // Jika `authorized` mengembalikan `false`, pengguna akan diarahkan ke halaman login.
      authorized: ({ token }) => !!token,
    },
    pages: {
      // Tentukan halaman sign-in. Middleware akan mengarahkan ke sini jika otorisasi gagal.
      signIn: '/login',
    },
  }
);

export const config = {
  // Terapkan middleware ini pada semua path di dalam /dashboard dan /admin.
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}