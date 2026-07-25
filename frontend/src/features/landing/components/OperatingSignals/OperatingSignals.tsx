import { PageContainer } from '@/components/common/PageContainer/PageContainer';
import { operatingSignals } from '../../data';

export function OperatingSignals() {
  return (
    <PageContainer>
      <section
        className="grid border-b md:grid-cols-[1.35fr_repeat(3,1fr)]"
        aria-label="MekaOps operating signals"
      >
        <div className="flex min-h-20 items-center gap-3 border-b py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:border-b-0 md:border-r md:pr-6">
          <span className="text-primary">01</span>
          What changes on the floor
        </div>
        {operatingSignals.map((signal) => (
          <div
            key={signal.value}
            className="flex min-h-24 flex-col justify-center border-b py-4 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:last:border-r-0"
          >
            <p className="text-sm font-semibold text-foreground">
              {signal.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {signal.detail}
            </p>
          </div>
        ))}
      </section>
    </PageContainer>
  );
}
