import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Quote, Sparkles } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SiteHeader } from '@/components/landing/site-header';
import { HeroPreview } from '@/components/landing/hero-preview';
import {
  FEATURES,
  FINAL_CTA,
  HERO,
  PRODUCT,
  STATS,
  STEPS,
  TESTIMONIAL,
} from '@/lib/landing/content';

export const metadata: Metadata = {
  title: `${PRODUCT.name} · ${PRODUCT.tagline}`,
  description: HERO.subtitle,
};

export default function Home() {
  const authorInitials = TESTIMONIAL.author
    .split(' ')
    .map((name) => name[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary" className="gap-1.5 py-1">
              <Sparkles className="size-3.5" />
              {HERO.badge}
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {HERO.title}{' '}
              <span className="text-primary">{HERO.highlight}</span>
            </h1>
            <p className="max-w-prose text-pretty text-lg text-muted-foreground">
              {HERO.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/analizar">
                  {HERO.primaryCta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#how">{HERO.secondaryCta}</a>
              </Button>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
              {HERO.trust.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <HeroPreview />
        </section>

        {/* Stats */}
        <section className="border-y border-border/60 bg-muted/30">
          <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {stat.value}
                </dt>
                <dd className="text-sm text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              De la planilla a la acción
            </h2>
            <p className="mt-3 text-muted-foreground">
              Todo lo que necesita una PyME para encontrar y aprovechar
              oportunidades de mejora, sin equipo de datos.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="gap-3">
                <CardHeader className="gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </span>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-border/60 bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Tres pasos. Cero fricción.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Sin instalaciones ni migraciones. Funciona con los archivos que
                ya usás todos los días.
              </p>
            </div>
            <ol className="grid gap-6 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="relative flex flex-col gap-3 rounded-xl border bg-card p-6"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <step.icon className="size-6 text-primary" />
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Testimonial */}
        <section className="px-4 py-20 sm:px-6">
          <figure className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
            <Quote
              aria-hidden
              className="size-8 text-primary/30"
              strokeWidth={1.5}
            />
            <blockquote className="mt-6 text-pretty text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
              {TESTIMONIAL.quote}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback className="bg-primary/10 font-medium text-primary">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left text-sm leading-tight">
                <div className="font-medium text-foreground">
                  {TESTIMONIAL.author}
                </div>
                <div className="text-muted-foreground">
                  {TESTIMONIAL.role}, {TESTIMONIAL.company}
                </div>
              </div>
            </figcaption>
          </figure>
        </section>

        {/* Final CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/10 via-card to-emerald-500/10 px-6 py-14 text-center sm:px-12">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {FINAL_CTA.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {FINAL_CTA.subtitle}
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/analizar">
                {FINAL_CTA.cta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <span>
            © {PRODUCT.name} · {PRODUCT.tagline}
          </span>
          <span>Datos de demostración · producto de ejemplo</span>
        </div>
      </footer>
    </div>
  );
}
