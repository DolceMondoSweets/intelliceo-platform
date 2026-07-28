import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Button } from "@/components/marketing/ui/Button";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { ContentStudioSample } from "@/components/marketing/product/ContentStudioSample";
import { contentStudioSection } from "@/content/product";

// Content Studio — deeper than the homepage's single-example teaser: three
// real content types (Social Media Post, Email Campaign, Promotional
// Announcement) across three different example businesses.
export function ProductContentStudio() {
  return (
    <section id="content-studio" className="py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {contentStudioSection.headline}
            </h2>
            <p className="mt-5 max-w-[680px] text-xl leading-relaxed text-mkt-text-secondary">
              {contentStudioSection.copy}
            </p>
            <div className="mt-8">
              <Button href="/signup" variant="secondary" showArrow>
                {contentStudioSection.ctaLabel}
              </Button>
            </div>
          </ProseWidth>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {contentStudioSection.examples.map((example, index) => (
            <Reveal key={example.topic} delay={index * 0.1} className="flex justify-center">
              <ContentStudioSample {...example} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
