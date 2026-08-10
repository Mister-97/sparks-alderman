export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PolicyContent from "@/components/PolicyContent";
import { getSiteContent } from "@/lib/site-content";

const TITLE = "Terms of Use | Samuel Sparks for 7th Ward Alderman";

export const metadata: Metadata = {
  title: TITLE,
  description: "Terms of use for sparksforchicago.org.",
};

export default async function TermsPage() {
  const content = await getSiteContent(
    "terms_of_use",
    "Terms of use content coming soon."
  );

  return (
    <main id="top" className="flex flex-col">
      <section className="relative isolate bg-white">
        <Nav />

        <div className="mx-auto max-w-2xl w-full px-6 pt-32 md:pt-40 pb-16 md:pb-24">
          <h1 className="font-display font-bold text-navy text-3xl sm:text-4xl leading-tight">
            Terms of Use
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Last updated August 2026</p>

          <PolicyContent
            text={content}
            className="mt-8 space-y-6 text-base text-neutral-700 leading-relaxed"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
