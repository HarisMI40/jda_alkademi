import { Button } from "@/components/ui/button";
import { BookOpenCheckIcon } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <a className="flex items-center justify-center" href="#">
        <BookOpenCheckIcon className="h-6 w-6" />
        <span className="sr-only">EduQuiz</span>
      </a>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant="ghost">
          <Link href={"/login"}>Masuk</Link>
        </Button>
        <Button>Daftar</Button>
      </nav>
    </header>
  );
}