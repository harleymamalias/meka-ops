import { Link } from 'react-router';
import { BrandMark } from '@/components/common/BrandMark/BrandMark';
import { PageContainer } from '@/components/common/PageContainer/PageContainer';

export function LandingFooter() {
  return (
    <footer id="footer" className="border-t">
      <PageContainer className="flex flex-col items-start gap-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-3 font-semibold text-foreground"
        >
          <BrandMark />
          MekaOps
        </Link>
        <span>Operations software for vehicle service teams.</span>
        <span>© 2026 MekaOps</span>
      </PageContainer>
    </footer>
  );
}
