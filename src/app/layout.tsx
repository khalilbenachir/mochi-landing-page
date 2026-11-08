import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mochi – period tracking with a little friend",
  description:
    "Mochi learns your rhythm, tells you when to change your pad, and cheers every day you show up. Private by design. Works fully offline. For iPhone.",
  applicationName: "Mochi",
  openGraph: {
    title: "Mochi – period tracking with a little friend",
    description: "A gamified, private period tracker for iPhone with a pad change reminder in the Dynamic Island.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FDE3EA",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
