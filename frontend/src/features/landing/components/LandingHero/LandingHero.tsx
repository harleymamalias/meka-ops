import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Link } from 'react-router';
import { PageContainer } from '@/components/common/PageContainer/PageContainer';
import { Button } from '@/components/ui/button';
import { FloorSnapshot } from '@/features/landing/components/FloorSnapshot/FloorSnapshot';

const productProof = ['Role-aware', 'Live service flow', 'Inventory signals'];

export function LandingHero() {
  return (
    <section className="bg-sidebar text-sidebar-foreground">
      <PageContainer className="grid min-h-[640px] items-center gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sidebar-primary">
            <span className="size-2 rounded-full bg-sidebar-primary" />
            Built for the service floor
          </p>
          <h1 className="text-5xl font-semibold leading-none tracking-tight sm:text-6xl">
            MekaOps.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-sidebar-foreground/65 sm:text-lg">
            Keep every bay, part, and promise moving with one calm operating
            picture for your shop.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/signup">
                Start your workspace
                <ArrowRight />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Link to="/login">
                View the console
                <ArrowUpRight />
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-sidebar-foreground/50">
            {productProof.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-sidebar-primary" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <FloorSnapshot />
      </PageContainer>
    </section>
  );
}
