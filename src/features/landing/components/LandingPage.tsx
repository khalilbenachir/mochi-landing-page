import { AccountSection } from "./sections/AccountSection";
import { ComparisonSection } from "./sections/ComparisonSection";
import { FaqSection } from "./sections/FaqSection";
import { FlavorsSection } from "./sections/FlavorsSection";
import { HeroSection } from "./sections/HeroSection";
import { IslandSection } from "./sections/IslandSection";
import { MoodSection } from "./sections/MoodSection";
import { PlansSection } from "./sections/PlansSection";
import { PredictionSection } from "./sections/PredictionSection";
import { PrivacySection } from "./sections/PrivacySection";
import { SiteHeader } from "./shared/SiteHeader";

/** The landing page composition, section by section. */
export function LandingPage() {
  return (
    <main id="top" className="isolate flex-1 bg-landing-canvas text-foreground">
      <SiteHeader />
      <HeroSection />
      <IslandSection />
      <MoodSection />
      <FlavorsSection />
      <PredictionSection />
      <PrivacySection />
      <ComparisonSection />
      <PlansSection />
      <AccountSection />
      <FaqSection />
    </main>
  );
}
