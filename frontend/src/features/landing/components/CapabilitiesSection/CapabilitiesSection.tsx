import { PageContainer } from '@/components/common/PageContainer/PageContainer';
import { capabilities } from '../../data';

export function CapabilitiesSection() {
  return (
    <section id="signals">
      <PageContainer>
        <div className="grid border-y md:grid-cols-3">
          {capabilities.map(({ detail, icon: Icon, index, signal, title }) => (
            <article
              key={title}
              className="border-b py-8 last:border-b-0 md:min-h-72 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{index}</span>
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-12 text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                {detail}
              </p>
              <p className="mt-6 font-mono text-[11px] text-primary">
                {signal}
              </p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
