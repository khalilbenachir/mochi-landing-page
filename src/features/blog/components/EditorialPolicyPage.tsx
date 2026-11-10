import Link from "next/link";
import { useTranslations } from "next-intl";
import { PRIVACY_CONTACT_EMAIL } from "@/features/privacy/content/contact-email";
import { localeRoutePath } from "@/i18n/routing";
import { useBlogLocale, useBlogRoutes } from "../i18n";
import { BLOG_SEGMENT, EDITORIAL_SLUG } from "../locales";
import { BlogArticle } from "./BlogArticle";
import { BlogShell } from "./BlogShell";
import { BlogNewsletter } from "./NewsletterBanner";

/** Rendered in this order; each id has a `Blog.editorial.sections.<id>` title and body. */
const SECTIONS = ["publisher", "sources", "editing", "limits", "dates", "corrections"] as const;

export function EditorialPolicyPage() {
  const t = useTranslations("Blog");
  const locale = useBlogLocale();
  const routes = useBlogRoutes();
  return (
    <BlogShell.Root className="bg-white">
      <BlogShell.Header route={`/${BLOG_SEGMENT}/${EDITORIAL_SLUG}`} />
      <section className="bg-blog-mint">
        <BlogShell.Container className="py-[34px]">
          <div className="mx-auto max-w-[800px]">
            <Link href={routes.index} className="text-[14px] font-heavy underline underline-offset-4">
              {t("navigation")}
            </Link>
            <h1 className="mt-[16px] text-pretty text-[48px] font-max leading-[1.05] tracking-[-0.03em] max-phone:text-[36px]">{t("editorial.title")}</h1>
            <p className="mt-[16px] text-[19px] font-medium leading-[1.5]">{t("editorial.intro")}</p>
          </div>
        </BlogShell.Container>
      </section>
      <BlogShell.Container>
        <BlogArticle.Root className="mx-auto max-w-[800px] pb-[42px] pt-[10px]">
          <BlogArticle.Content>
            {SECTIONS.map((id) => (
              <section key={id} id={id}>
                <BlogArticle.Heading>{t(`editorial.sections.${id}.title`)}</BlogArticle.Heading>
                <p>{t(`editorial.sections.${id}.body`)}</p>
              </section>
            ))}
            <div className="mt-[26px] grid gap-[14px] text-[16px] font-heavy">
              <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`} className="text-blog-link underline underline-offset-4">
                {t("editorial.contact")}
              </a>
              <Link href={localeRoutePath(locale, "privacy")} className="text-blog-link underline underline-offset-4">
                {t("editorial.privacy")}
              </Link>
            </div>
          </BlogArticle.Content>
        </BlogArticle.Root>
      </BlogShell.Container>
      <BlogNewsletter />
    </BlogShell.Root>
  );
}
