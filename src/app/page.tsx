"use client"

import { useRef } from "react";
import { LandingPageAbout } from "./_components/LandingPage/about";
import { LandingPageContact } from "./_components/LandingPage/contact";
import { LandingPageHeader } from "./_components/LandingPage/header";
import { LandingPageIntroduction } from "./_components/LandingPage/introduction";

export default function Home() {
  const contactRef = useRef(null);
  const aboutRef = useRef(null);
  const initialRef = useRef(null);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <LandingPageHeader contactRef={contactRef} aboutRef={aboutRef} />

      <div ref={initialRef}>
      <LandingPageIntroduction />
      </div>

      <div ref={aboutRef}>
        <LandingPageAbout />
      </div>

      <div ref={contactRef}>
        <LandingPageContact initialRef={initialRef}/>
      </div>

    </div>
  )
}
