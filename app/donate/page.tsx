import type { Metadata } from "next";
import Image from "next/image";

import Nav from "@/components/Nav";
import ChicagoStars from "@/components/ChicagoStars";
import Footer from "@/components/Footer";
import DonateCard from "@/components/DonateCard";

const TITLE = "Donate | Samuel Sparks for 7th Ward Alderman";
const DESCRIPTION =
  "Invest in the future of the 7th Ward. Every contribution helps power this campaign.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
  },
};

export default function Donate() {
  return (
    <main id="top" className="flex flex-col">
      {/* HERO / DONATE CARD. Skyline backdrop, same treatment as the
          homepage's voter registration + donate block */}
      <section className="relative isolate">
        <Nav />

        <Image
          src="/images/chicago-skyline.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover object-center -z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-white/70"
        />

        <div className="mx-auto max-w-4xl w-full px-6 pt-32 md:pt-44 pb-8 md:pb-10 text-center">
          <ChicagoStars className="justify-center mb-4" starClassName="w-3.5 h-3.5 md:w-4 md:h-4" />
          <h1 className="font-display font-bold text-navy text-4xl sm:text-5xl md:text-6xl leading-tight">
            Support the
            <br />
            Movement.
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-sm md:text-base text-neutral-600 leading-relaxed">
            Change begins with people who believe. Every contribution helps
            power this campaign and bring real leadership to the 7th Ward.
          </p>
        </div>

        <div className="relative z-10 mx-auto max-w-3xl w-full px-6 pb-16 md:pb-24">
          <DonateCard />
        </div>
      </section>

      <Footer />
    </main>
  );
}
