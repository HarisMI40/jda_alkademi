import withAuth from "next-auth/middleware"

// export { default } from "next-auth/middleware"

export default withAuth({
  pages: {
    // Tentukan halaman sign-in. Middleware akan mengarahkan ke sini jika otorisasi gagal.
    signIn: '/login',
  },
})

export const config = {
  matcher: ['/dashboard/:path*'],
}