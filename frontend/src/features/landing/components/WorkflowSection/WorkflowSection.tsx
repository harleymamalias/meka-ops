import { PageContainer } from '@/components/common/PageContainer/PageContainer';
import { cn } from '@/lib/utils';
import { workflowSteps } from '../../data';

export function WorkflowSection() {
  return (
    <section id="workflow">
      <PageContainer className="py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              One shop. One operating picture.
            </p>
            <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-tight text-foreground">
              Less chasing. More useful motion.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground lg:self-end">
            From intake to release, MekaOps gives the people behind the work a
            shared rhythm. The service floor becomes easier to read, easier to
            act on, and easier to trust.
          </p>
        </div>

        <div className="mt-14 border-y py-6">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Service rhythm
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">
              A better handoff at every step.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step) => (
              <div
                key={step.index}
                className={cn(
                  'border-l-2 border-border pl-4',
                  step.state === 'active' && 'border-primary',
                  step.state === 'complete' && 'border-success',
                )}
              >
                <span
                  className={cn(
                    'text-xs text-muted-foreground',
                    step.state === 'active' && 'text-primary',
                    step.state === 'complete' && 'text-success',
                  )}
                >
                  {step.index}
                </span>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {step.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
