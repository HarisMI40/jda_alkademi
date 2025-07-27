import NextAuth, { AuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcrypt"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const sql = neon(process.env.DATABASE_URL!)

        const userResult = await sql`SELECT * FROM users WHERE email = ${credentials.email}`

        if (userResult.length === 0) {
          console.log("No user found")
          return null // Pengguna tidak ditemukan
        }

        const user = userResult[0]

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password as string
        )

        if (!passwordsMatch) {
          console.log("Password mismatch")
          return null // Password tidak cocok
        }

        return {
          id: user.id as string,
          email: user.email as string,
          name: user.fullname as string,
          role: user.role as string
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
    
    // Atur masa berlaku sesi di sini (dalam detik)
    maxAge: 30 * 24 * 60 * 60,
  },


  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      // Saat sign-in, 'user' object akan ada
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Tambahkan properti 'role' dari token ke session
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }