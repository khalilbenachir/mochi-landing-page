"use client";

import { useId, useState } from "react";

type NewsletterFormProps = {
  action?: string;
  recipient: string;
  subject: string;
  requestBody: string;
  emailLabel: string;
  submitLabel: string;
  note: string;
  emailNote: string;
  requestMessage: string;
  openEmailLabel: string;
};

export function NewsletterForm({
  action,
  recipient,
  subject,
  requestBody,
  emailLabel,
  submitLabel,
  note,
  emailNote,
  requestMessage,
  openEmailLabel,
}: NewsletterFormProps) {
  const id = useId();
  const [requestHref, setRequestHref] = useState<string>();

  return (
    <form
      action={action || `mailto:${recipient}?subject=${encodeURIComponent(subject)}`}
      method="post"
      encType={action ? undefined : "text/plain"}
      aria-label={submitLabel}
      className="relative z-10 w-full min-w-0"
      onSubmit={(event) => {
        if (!action) {
          event.preventDefault();
          const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
          const href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestBody.replace("{email}", email))}`;
          setRequestHref(href);
          window.open(href, "_self");
        }
      }}
    >
      <label htmlFor={id} className="sr-only">
        {emailLabel}
      </label>
      <div className="flex min-h-[54px] rounded-full bg-white p-[3px] [box-shadow:inset_0_2px_5px_var(--color-blog-border)] focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-white max-phone:min-h-[50px]">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={emailLabel}
          aria-describedby={`${id}-note`}
          className="min-w-0 flex-1 rounded-full bg-transparent px-[20px] text-[18px] font-medium text-ink-navy placeholder:text-blog-muted focus:outline-none max-phone:px-[14px] max-phone:text-[16px]"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-sun px-[26px] text-[22px] font-max text-ink-navy transition-transform hover:scale-103 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-navy active:scale-97 motion-reduce:transform-none max-phone:px-[17px] max-phone:text-[18px]"
        >
          {submitLabel}
        </button>
      </div>
      <p id={`${id}-note`} className="mt-[9px] pl-[20px] text-[15px] font-medium leading-[1.4] max-phone:pl-[14px]">
        {note}
        {!action ? <span className="block">{emailNote}</span> : null}
      </p>
      {requestHref ? (
        <div className="mt-[8px] pl-[20px] text-[15px] font-bold leading-[1.4] max-phone:pl-[14px]">
          <p role="status">{requestMessage}</p>
          <a href={requestHref} className="mt-[5px] inline-block underline underline-offset-4">
            {openEmailLabel}
          </a>
        </div>
      ) : null}
    </form>
  );
}
