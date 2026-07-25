import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { BrandMark } from '@/components/common/BrandMark/BrandMark';
import { PageContainer } from '@/components/common/PageContainer/PageContainer';
import { Button } from '@/components/ui/button';

export function LandingHeader() {
  return (
    <header className="border-b bg-background">
      <PageContainer className="flex h-16 items-center gap-6">
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-3 font-semibold text-foreground"
          aria-label="MekaOps home"
        >
          <BrandMark />
          MekaOps
        </Link>

        <nav
          className="ml-auto hidden items-center gap-6 text-sm text-muted-foreground lg:flex"
          aria-label="Main navigation"
        >
          <a href="#workflow" className="hover:text-foreground">
            Workflow
          </a>
          <a href="#signals" className="hover:text-foreground">
            Signals
          </a>
          <a href="#footer" className="hover:text-foreground">
            Contact
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link to="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">
              Open workspace
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </PageContainer>
    </header>
  );
}
