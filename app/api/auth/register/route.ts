import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  fullname: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    // Jika validasi gagal
    if (!validation.success) {
      // Kembalikan respons dengan detail error dari Zod
      return NextResponse.json(
        {
          message: "Input tidak valid. Silakan periksa kembali data Anda.",
          // `flatten().fieldErrors` akan membuat objek di mana setiap key adalah
          // nama field yang gagal validasi, dan value-nya adalah array pesan error.
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 } // 400 Bad Request
      );
    }

    const { fullname, username, email, password } = validation.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = neon(process.env.DATABASE_URL!);

    await sql`
      INSERT INTO USERS (fullname, username, email, password) 
      VALUES (${fullname}, ${username}, ${email}, ${hashedPassword})
    `;

    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error) {
    // Lakukan pengecekan tipe sebelum mengakses properti dari 'error'
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      // '23505' adalah kode error PostgreSQL untuk pelanggaran unique constraint
      return NextResponse.json(
        { message: "Email atau username sudah terdaftar." },
        { status: 409 } // 409 Conflict
      );
    }
    
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}