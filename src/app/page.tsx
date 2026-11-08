import { MaquetteLanding } from "@/components/maquette/MaquetteLanding";

/**
 * The landing page. A server component: only the pieces that move with the shared pad change timer
 * (Home screen, sheet, Dynamic Island, Lock Screen) are client components, under one provider.
 */
export default function HomePage() {
  return <MaquetteLanding />;
}
