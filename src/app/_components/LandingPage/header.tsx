

import Link from "next/link"
import { Logo } from "@/components/Logo"
import { RefObject } from "react";

interface LandingPageHeaderProps {
  contactRef: RefObject<HTMLDivElement>;
  aboutRef: RefObject<HTMLDivElement>;
}

export function LandingPageHeader({ contactRef, aboutRef }: LandingPageHeaderProps) {

  const handleScrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleScrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  
  return (
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-border">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Logo />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer" onClick={handleScrollToAbout} >
            Sobre
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer" onClick={handleScrollToContact} >
            Contato
          </a>
          <Link href={'/auth/login'} className="text-sm font-bold hover:underline underline-offset-4 cursor-pointer" >
            Login
          </Link>
          <Link href={'/auth/register'} className="text-sm font-bold hover:underline underline-offset-4 cursor-pointer" >
            Registro
          </Link>
        </nav>
      </header>
  )
}
