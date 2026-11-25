"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { normalizeEmail } from "../content/waitlist";

export type WaitlistCopy = {
  eyebrow: string;
  title: string;
  body: string;
  emailLabel: string;
  placeholder: string;
  submit: string;
  sending: string;
  consent: string;
  privacyLink: string;
  successTitle: string;
  successBody: string;
  invalid: string;
  failed: string;
  close: string;
  imageAlt: string;
};

type Status = "idle" | "sending" | "done" | "invalid" | "failed";

/** Marks an App Store link that opens this dialog while Mochi isn't on the App Store yet. */
export const WAITLIST_TRIGGER = "data-waitlist";

/**
 * One dialog for every App Store button on the page: clicks on `a[data-waitlist]` open it instead
 * of following the link (which still reaches the home download section without JavaScript).
 */
export function WaitlistDialog({ copy, locale, privacyHref, image }: { copy: WaitlistCopy; locale: string; privacyHref: string; image: { src: string; width: number; height: number } }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    function open(event: MouseEvent) {
      const trigger = (event.target as Element | null)?.closest?.(`a[${WAITLIST_TRIGGER}]`);
      if (!trigger || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      setStatus((current) => (current === "done" ? current : "idle"));
      dialog.current?.showModal();
      requestAnimationFrame(() => input.current?.focus());
    }
    document.addEventListener("click", open);
    return () => document.removeEventListener("click", open);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!normalizeEmail(form.get("email"))) {
      setStatus("invalid");
      input.current?.focus();
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), company: form.get("company"), locale }),
      });
      setStatus(response.ok ? "done" : response.status === 400 ? "invalid" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${id}-title`}
      // Clicking the backdrop (the dialog element itself, outside the card) closes it.
      onClick={(event) => event.target === event.currentTarget && dialog.current?.close()}
      className="m-auto w-[min(440px,calc(100vw-32px))] overflow-visible rounded-[28px] bg-transparent p-0 text-ink-navy backdrop:bg-ink-black/55 open:animate-pop-in"
    >
      <div className="relative rounded-[28px] bg-white px-[28px] pb-[26px] pt-[22px] text-center max-phone:px-[20px]">
        <button
          type="button"
          aria-label={copy.close}
          onClick={() => dialog.current?.close()}
          className="absolute right-[14px] top-[14px] grid size-[36px] cursor-pointer place-items-center rounded-full bg-blog-pink text-[20px] font-max leading-none text-cycle-period-ink"
        >
          ×
        </button>
        <Image src={image.src} width={image.width} height={image.height} alt={copy.imageAlt} sizes="150px" className="mx-auto h-auto w-[150px]" />
        {status === "done" ? (
          <div role="status" className="mt-[10px]">
            <h2 id={`${id}-title`} className="text-[26px] font-max leading-[1.1]">
              {copy.successTitle}
            </h2>
            <p className="mt-[10px] text-[16px] font-semibold leading-[1.45]">{copy.successBody}</p>
          </div>
        ) : (
          <>
            <p className="mt-[6px] inline-flex -rotate-2 rounded-full bg-sun px-[14px] py-[4px] text-[12px] font-ultra uppercase tracking-[0.12em] text-ink-black">{copy.eyebrow}</p>
            <h2 id={`${id}-title`} className="mt-[10px] text-[26px] font-max leading-[1.1] max-phone:text-[23px]">
              {copy.title}
            </h2>
            <p className="mt-[8px] text-[16px] font-semibold leading-[1.45]">{copy.body}</p>
            <form onSubmit={submit} noValidate className="mt-[18px] grid gap-[10px] text-left">
              <label htmlFor={`${id}-email`} className="text-[14px] font-heavy">
                {copy.emailLabel}
              </label>
              <input
                ref={input}
                id={`${id}-email`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder={copy.placeholder}
                aria-invalid={status === "invalid" || undefined}
                aria-describedby={`${id}-message`}
                className={cn(
                  "h-[52px] w-full rounded-[16px] border-2 bg-white px-[16px] text-[17px] font-bold outline-none placeholder:text-blog-muted focus:border-closing-band",
                  status === "invalid" ? "border-cycle-period-ink" : "border-blog-border",
                )}
              />
              {/* Honeypot for bots: hidden from people and assistive technology. */}
              <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <p id={`${id}-message`} role="alert" className="min-h-[18px] text-[13px] font-bold text-cycle-period-ink">
                {status === "invalid" ? copy.invalid : status === "failed" ? copy.failed : null}
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="h-[52px] cursor-pointer rounded-full bg-closing-band text-[17px] font-heavy text-white transition-transform hover:-translate-y-[1px] disabled:cursor-wait disabled:opacity-70"
              >
                {status === "sending" ? copy.sending : copy.submit}
              </button>
              <p className="text-center text-[12.5px] font-semibold leading-[1.45] text-ink-navy/65">
                {copy.consent}{" "}
                <a href={privacyHref} className="underline underline-offset-2 hover:text-closing-band">
                  {copy.privacyLink}
                </a>
              </p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
