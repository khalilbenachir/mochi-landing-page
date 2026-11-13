import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Rays } from "@/features/landing/components/shared/decor";
import { cn } from "@/lib/utils";
import { NEWSLETTER_FORM_ACTION, NEWSLETTER_RECIPIENT } from "../content/newsletter";
import { NewsletterForm } from "./NewsletterForm";

function Root({ className, ...props }: ComponentProps<"section">) {
  return <section aria-labelledby="newsletter-title" className={cn("overflow-hidden bg-island-band text-white", className)} {...props} />;
}

function Content({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative mx-auto grid min-h-[180px] max-w-[1200px] grid-cols-[330px_minmax(0,1fr)] items-center gap-[32px] py-[30px] pl-[48px] pr-[265px] max-poster:grid-cols-[280px_minmax(0,1fr)] max-poster:gap-[22px] max-poster:pl-[32px] max-poster:pr-[205px] max-nav:grid-cols-1 max-nav:gap-[22px] max-nav:pl-[24px] max-nav:pr-[220px] max-phone:gap-[20px] max-phone:px-[20px] max-phone:pb-[155px] max-phone:pt-[28px]",
        className,
      )}
      {...props}
    />
  );
}

function Title({ className, children, ...props }: ComponentProps<"h2">) {
  return (
    <div className="relative w-fit">
      <h2
        id="newsletter-title"
        className={cn("whitespace-pre-line text-[42px] font-max leading-[1.05] tracking-[-0.02em] max-poster:text-[36px] max-phone:text-[34px]", className)}
        {...props}
      >
        {children}
      </h2>
      <Rays shape="privacy" className="absolute -right-[30px] -top-[20px] w-[45px] text-sun max-phone:-right-[36px]" />
    </div>
  );
}

function Artwork() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-[10px] w-[235px] max-poster:w-[190px] max-nav:right-[14px] max-phone:right-[24px] max-phone:w-[190px]"
    >
      <Rays shape="burst" className="absolute left-[4px] top-[24px] w-[40px] text-sun" />
      <Image src="/blog-art/newsletter-sleepy.webp" width={1200} height={800} alt="" sizes="(max-width: 1100px) 190px, 235px" className="h-auto w-full" />
    </div>
  );
}

export const NewsletterBanner = { Root, Content, Title, Form: NewsletterForm, Artwork };

export function BlogNewsletter() {
  const t = useTranslations("Blog.newsletter");
  return (
    <NewsletterBanner.Root>
      <NewsletterBanner.Content>
        <NewsletterBanner.Title>{t("title")}</NewsletterBanner.Title>
        <NewsletterBanner.Form
          action={NEWSLETTER_FORM_ACTION}
          recipient={NEWSLETTER_RECIPIENT}
          subject={t("subject")}
          requestBody={t.raw("requestBody")}
          emailLabel={t("emailLabel")}
          submitLabel={t("submitLabel")}
          note={t("note")}
          emailNote={t("emailNote")}
          requestMessage={t("requestMessage")}
          openEmailLabel={t("openEmailLabel")}
        />
        <NewsletterBanner.Artwork />
      </NewsletterBanner.Content>
    </NewsletterBanner.Root>
  );
}
