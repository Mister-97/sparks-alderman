import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Nav from "@/components/Nav";
import ChicagoStars, { ChicagoStar } from "@/components/ChicagoStars";
import Footer from "@/components/Footer";
import ParallaxWordmark from "@/components/ParallaxWordmark";

const TITLE = "Meet Sam | Samuel Sparks for 7th Ward Alderman";
const DESCRIPTION =
  "A New Voice For the 7th Ward. Samuel C. Sparks was born and raised in South Shore, and that foundation has never left him.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "profile",
  },
};

const stats = [
  "15+ Years in Service",
  "Founder, The Brew Coffee House",
  "4 National Partner Institutions",
  "Presidential Lifetime Achievement Award",
];

export default function MeetSamBio() {
  return (
    <main id="top" className="flex flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <Nav />

        <ParallaxWordmark word="SAM" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 md:pt-40 pb-16 md:pb-24 grid md:grid-cols-[1.15fr_0.85fr] gap-14 md:gap-10 items-center">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="font-mask uppercase text-brand-red text-xs tracking-[0.3em]">
                Meet Samuel C. Sparks
              </span>
            </div>
            <h1 className="mt-6 font-display font-bold text-navy text-5xl sm:text-6xl md:text-7xl leading-[0.95]">
              A New
              <br />
              Voice For The
              <br />
              7th Ward.
            </h1>
            <p className="mt-7 max-w-md mx-auto md:mx-0 text-sm md:text-base text-neutral-600 leading-relaxed tracking-wide">
              Philanthropist.&ensp;Entrepreneur.&ensp;Mentor.
            </p>
            <ChicagoStars
              className="mt-7 justify-center md:justify-start"
              starClassName="w-3.5 h-3.5 md:w-4 md:h-4"
            />
          </div>

          {/* Poster portrait, shown in full, no crop */}
          <div className="relative mx-auto md:mx-0 w-full max-w-[280px] md:max-w-sm">
            <div className="absolute -inset-3 md:-inset-4 border border-navy/15 rounded-sm" />
            <div className="relative aspect-[508/765] w-full rounded-sm overflow-hidden shadow-2xl shadow-navy/20">
              <Image
                src="/images/portrait-poster.jpg"
                alt="Samuel C. Sparks. Leadership. Service. Community. For the 7th Ward."
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="relative overflow-hidden bg-white py-16 md:py-24">
        <ParallaxWordmark
          word="SPARKS"
          align="right"
          position="bottom-0 -right-6 md:-right-10"
        />

        <div className="relative mx-auto max-w-2xl px-6">
          <div className="flex items-center gap-3">
            <span className="font-mask uppercase text-brand-red text-xs tracking-[0.3em]">
              The Story
            </span>
          </div>

          <p className="mt-8 text-sm md:text-base text-neutral-600 leading-loose first-letter:font-display first-letter:font-bold first-letter:text-navy first-letter:text-6xl md:first-letter:text-7xl first-letter:mr-3 first-letter:float-left first-letter:leading-[0.85]">
            Samuel C. Sparks was born and raised in South Shore, and that
            foundation has never left him. For more than 15 years, he has
            built his life around service to others. The values that guide
            him today were instilled in him by his family, his career, and
            his lived experiences. For Samuel, service means showing up,
            listening, and taking action where it matters most.
          </p>
          <p className="mt-6 text-sm md:text-base text-neutral-600 leading-loose">
            Spending more than a decade under Steve Harvey&rsquo;s tutelage,
            and his stylist, gave Samuel rare insight into what it takes to
            turn vision into reality through discipline, perseverance, and
            efficient execution. He brought those lessons back to the
            communities that shaped him, opening doors for the next
            generation. His impact extends across the nation through
            partnerships with the Steve Harvey Foundation, Chicago Public
            Schools, the Cook County Juvenile Justice System, and Florida
            youth detention centers. For their future and ours, Samuel is
            done with excuses, done with disinvestment, and committed to
            fight for the opportunities every neighborhood deserves.
          </p>

          <blockquote className="mt-10 pl-6 border-l-4 border-brand-red">
            <p className="font-display font-bold text-navy text-xl md:text-2xl leading-snug">
              This campaign is not about opposition. It&rsquo;s about
              defiance. This campaign is about the people of the 7th Ward.
            </p>
          </blockquote>

          <p className="mt-10 text-sm md:text-base text-neutral-600 leading-loose">
            As a founder of a coffee house operating globally and a
            recipient of the Presidential Lifetime Achievement Award,
            recognition has never been the goal. Samuel is running for
            Alderman because he&rsquo;s seen firsthand the consequences of
            community concerns going unheard.
          </p>

        </div>

        <div className="mt-14 pt-8 border-t border-navy/12 mx-auto max-w-4xl px-6 flex flex-wrap justify-center items-center gap-x-3 gap-y-3">
          {stats.map((s, i) => (
            <span key={s} className="flex items-center gap-3">
              <span className="text-[11px] md:text-xs uppercase tracking-[0.1em] text-neutral-500 whitespace-nowrap">
                {s}
              </span>
              {i < stats.length - 1 && <ChicagoStar className="w-2.5 h-2.5 shrink-0" />}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-red">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <h2 className="font-display font-bold text-white text-2xl md:text-4xl leading-tight">
            Join the movement for
            <br className="hidden md:block" /> the 7th Ward.
          </h2>
          <div className="flex gap-4 shrink-0">
            <Link
              href="/donate"
              className="px-7 py-3.5 bg-navy text-white text-xs font-bold tracking-wide rounded-sm hover:bg-navy-dark transition-colors"
            >
              DONATE
            </Link>
            <Link
              href="/#join"
              className="px-7 py-3.5 border border-white text-white text-xs font-bold tracking-wide rounded-sm hover:bg-white hover:text-brand-red transition-colors"
            >
              JOIN THE MOVEMENT
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
