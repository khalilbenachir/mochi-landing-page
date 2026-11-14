"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_OPEN_EVENT, clearAnalyticsCookies, readConsent, writeConsent, type ConsentChoice } from "./consent";

type AnalyticsConsentProps = {
  gtmId: string;
  privacyHref: string;
  copy: { title: string; message: string; privacyLink: string; accept: string; decline: string };
};

/**
 * Google Tag Manager (which loads GA4) in Consent Mode "basic": GTM is not loaded at all until the visitor
 * accepts, so nothing reaches Google before consent. Ad storage stays denied either way.
 * Withdrawing consent clears the GA cookies and reloads so the tag is gone.
 */
export function AnalyticsConsent({ gtmId, privacyHref, copy }: AnalyticsConsentProps) {
  const [choice, setChoice] = useState<ConsentChoice | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setChoice(stored);
    setOpen(stored === undefined);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  function decide(next: ConsentChoice) {
    const wasGranted = choice === "granted";
    writeConsent(next);
    setChoice(next);
    setOpen(false);
    if (next === "denied" && wasGranted) {
      clearAnalyticsCookies();
      window.location.reload();
    }
  }

  return (
    <>
      {choice === "granted" && (
        <>
          <Script id="gtm-consent-defaults" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});`}
          </Script>
          <GoogleTagManager gtmId={gtmId} />
        </>
      )}
      {open && (
        <section
          role="dialog"
          aria-labelledby="consent-title"
          className="fixed inset-x-[12px] bottom-[12px] z-50 mx-auto flex max-w-[560px] flex-col gap-[12px] rounded-[20px] bg-white p-[18px] text-ink-navy [box-shadow:0_8px_32px_var(--color-hero-mobile-menu-nav-shadow)]"
        >
          <h2 id="consent-title" className="text-[16px] font-extrabold text-ink-black">
            {copy.title}
          </h2>
          <p className="text-[14px] font-bold leading-[1.4]">
            {copy.message}{" "}
            <a href={privacyHref} className="underline underline-offset-4">
              {copy.privacyLink}
            </a>
          </p>
          <div className="flex flex-wrap justify-end gap-[8px]">
            <button
              type="button"
              onClick={() => decide("denied")}
              className="rounded-full border-2 border-ink-navy/20 px-[18px] py-[8px] text-[14px] font-extrabold hover:border-ink-navy/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copy.decline}
            </button>
            <button
              type="button"
              onClick={() => decide("granted")}
              className="rounded-full bg-hero-band px-[18px] py-[8px] text-[14px] font-extrabold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copy.accept}
            </button>
          </div>
        </section>
      )}
    </>
  );
}
