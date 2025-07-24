export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-muted-foreground">&copy; 2024 EduQuiz. Semua Hak Cipta Dilindungi.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <a className="text-xs hover:underline underline-offset-4" href="#">Ketentuan Layanan</a>
        <a className="text-xs hover:underline underline-offset-4" href="#">Kebijakan Privasi</a>
      </nav>
    </footer>
  );
}