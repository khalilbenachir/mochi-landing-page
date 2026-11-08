import { AccountSection } from "./sections/AccountSection";
import { ClosingSection } from "./sections/ClosingSection";
import { ComparisonSection } from "./sections/ComparisonSection";
import { FaqSection } from "./sections/FaqSection";
import { FlavorsSection } from "./sections/FlavorsSection";
import { HeroSection } from "./sections/HeroSection";
import { IslandSection } from "./sections/IslandSection";
import { MoodSection } from "./sections/MoodSection";
import { PlansSection } from "./sections/PlansSection";
import { PredictionSection } from "./sections/PredictionSection";
import { PrivacySection } from "./sections/PrivacySection";

/** The landing page composition, section by section. */
export function LandingPage() {
  return (
    <main className="isolate bg-landing-canvas text-foreground">
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
      <ClosingSection />
    </main>
  );
}
