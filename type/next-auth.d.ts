// File ini adalah file deklarasi tipe TypeScript (.d.ts).
// Tujuannya adalah untuk "memberitahu" TypeScript tentang bentuk (shape) dari objek
// yang tidak diketahui secara default. Dalam kasus ini, kita memperluas tipe bawaan dari NextAuth
// untuk menambahkan properti kustom seperti 'role' agar tidak terjadi error saat kompilasi.

// Mengimpor tipe-tipe dasar dari NextAuth yang akan kita perluas.
// DefaultSession dan DefaultUser adalah tipe asli dari NextAuth.
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
// Mengimpor tipe JWT (JSON Web Token) yang digunakan oleh NextAuth saat menggunakan strategy "jwt".
import { JWT } from "next-auth/jwt"

// 'declare module' digunakan untuk memperluas atau "menggabungkan" tipe dari modul eksternal.
// Di sini, kita akan menambahkan properti ke tipe-tipe yang diekspor oleh modul 'next-auth'.
declare module "next-auth" {
  /**
   * Tipe ini akan digunakan untuk objek 'session' yang dikembalikan oleh hook `useSession`,
   * fungsi `getSession`, dan diterima sebagai prop oleh `SessionProvider`.
   */
  interface Session {
    // Kita mendefinisikan bahwa objek 'user' di dalam 'session' akan memiliki properti tambahan.
    user: {
      /** Properti kustom: peran (role) dari pengguna. */
      role?: string // Tanda tanya (?) berarti properti ini opsional.
    } & DefaultSession["user"] // Tanda '&' menggabungkan tipe kustom kita dengan tipe 'user' bawaan dari DefaultSession.
  }

  // Memperluas tipe 'User' bawaan dari NextAuth.
  // Tipe ini merepresentasikan objek 'user' yang dikembalikan oleh fungsi 'authorize' di dalam CredentialsProvider.
  interface User extends DefaultUser {
    /** Properti kustom: peran (role) dari pengguna. */
    role?: string
  }
}

// Sama seperti sebelumnya, kita juga perlu memperluas tipe dari modul 'next-auth/jwt'.
// Ini penting karena data dari 'authorize' pertama kali masuk ke callback 'jwt' sebelum ke 'session'.
declare module "next-auth/jwt" {
  /**
   * Tipe ini merepresentasikan token JWT yang di-decode.
   * Ini digunakan di dalam callback 'jwt'.
   */
  interface JWT {
    /** Properti kustom: peran (role) dari pengguna yang akan disimpan di dalam token. */
    role?: string
  }
}