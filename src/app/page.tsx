import { Cycle } from "@/components/sections/Cycle";
import { DynamicIsland } from "@/components/sections/DynamicIsland";
import { FlavorMarquee } from "@/components/sections/FlavorMarquee";
import { Flavors } from "@/components/sections/Flavors";
import { Hero } from "@/components/sections/Hero";
import { LockScreen } from "@/components/sections/LockScreen";
import { Moods } from "@/components/sections/Moods";
import { PadChange } from "@/components/sections/PadChange";
import { Pricing } from "@/components/sections/Pricing";
import { Privacy } from "@/components/sections/Privacy";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { ChangeReminderProvider } from "@/features/change-reminder/ChangeReminderProvider";

/**
 * The landing page. A server component: only the pieces that move with the shared pad change timer
 * (Home screen, sheet, Dynamic Island, Lock Screen) are client components, under one provider.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ChangeReminderProvider>
          <Hero />
          <FlavorMarquee />
          <PadChange />
          <DynamicIsland />
          <LockScreen />
        </ChangeReminderProvider>
        <Moods />
        <Flavors />
        <Cycle />
        <Privacy />
        <Pricing />
      </main>
      <SiteFooter />
    </>
  );
}
