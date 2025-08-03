'use client'

import { BookOpenCheckIcon } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SectionUserLogged from "./SectionUserLogged";
import SectionUserNotLogin from "./SectionUserNotLogin";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();

  const path = usePathname();

  // jika ada di halaman login atau register, maka navbar tidak akan di tampilkan
  if(path === "/login" || path === "/register") return;

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <BookOpenCheckIcon className="h-6 w-6" />
        <span className="sr-only">EduQuiz</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 w-2/12 justify-end">
        {
          status === "unauthenticated" 
          ? 
            <SectionUserNotLogin />
          :
          (
            session?.user && (
              <SectionUserLogged user={session.user} role={session.user.role} />
            )
          )
        
        }
      </nav>
    </header>
  );
}