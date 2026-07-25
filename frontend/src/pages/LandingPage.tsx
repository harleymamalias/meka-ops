import {
  CapabilitiesSection,
  LandingCta,
  LandingFooter,
  LandingHeader,
  LandingHero,
  OperatingSignals,
  WorkflowSection,
} from '@/features/landing';

export function LandingPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <LandingHeader />
      <main>
        <LandingHero />
        <OperatingSignals />
        <WorkflowSection />
        <CapabilitiesSection />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}

export { LandingPage as Component };
