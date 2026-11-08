import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import { StructuredData } from "@/components/seo/StructuredData";
import { PUBLIC_SITE_URL, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/content/landing";
import "./globals.css";

export const metadata: Metadata = {
  ...(PUBLIC_SITE_URL ? { metadataBase: new URL(PUBLIC_SITE_URL), alternates: { canonical: "/" } } : {}),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "period tracker for iPhone",
    "private period tracker",
    "offline period tracker",
    "pad change reminder",
    "menstrual cycle tracker",
  ],
  authors: [{ name: "Mochi" }],
  creator: "Mochi",
  publisher: "Mochi",
  category: "health",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: { card: "summary", title: SITE_TITLE, description: SITE_DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#FDE3EA",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
