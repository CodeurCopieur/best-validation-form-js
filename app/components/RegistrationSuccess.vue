<script setup lang="ts">
const { firstName, email } = defineProps<{
  firstName: string
  email: string
}>()

const emit = defineEmits<{ restart: [] }>()

const root = useTemplateRef<HTMLElement>('root')

useGsapContext((context) => {
  const gsap = useGsap()
  const [circle] = gsapTargets(context, '[data-draw-circle]')
  const [check] = gsapTargets(context, '[data-draw-check]')
  const content = gsapTargets(context, '[data-success-item]')

  const timeline = gsap.timeline()

  for (const shape of [circle, check]) {
    if (!(shape instanceof SVGGeometryElement)) continue

    const length = shape.getTotalLength()
    gsap.set(shape, { strokeDasharray: length, strokeDashoffset: length })
    timeline.to(shape, { strokeDashoffset: 0, duration: 0.45 }, '>-0.2')
  }

  timeline
    .fromTo(
      '[data-success-badge]',
      { scale: 0.86 },
      { scale: 1, duration: 0.5, ease: 'back.out(2.4)', clearProps: 'transform' },
      '-=0.15',
    )
    .fromTo(
      content,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, clearProps: 'transform' },
      '-=0.3',
    )
}, { scope: root })
</script>

<template>
  <div ref="root" class="grid gap-6 text-center sm:gap-7">
    <div
      data-success-badge
      class="mx-auto grid size-16 place-items-center rounded-2xl bg-positive/10 text-positive"
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle data-draw-circle cx="24" cy="24" r="19" />
        <path data-draw-check d="m15 24.8 6.2 6.2L33.4 18.8" />
      </svg>
    </div>

    <div class="grid gap-2.5">
      <h2 data-success-item class="reveal-hidden text-2xl font-semibold tracking-tight">
        Bienvenue{{ firstName ? `, ${firstName}` : '' }}.
      </h2>
      <p data-success-item class="reveal-hidden text-[0.9375rem] leading-relaxed text-ink-soft">
        Votre compte est créé. Un lien de confirmation vient d'être envoyé à
        <span class="font-medium text-ink">{{ email }}</span>.
      </p>
    </div>

    <button
      data-success-item
      type="button"
      class="reveal-hidden mx-auto inline-flex h-11 items-center gap-2 rounded-xl border border-line px-5 text-[0.875rem] font-medium text-ink-soft transition hover:border-line-strong hover:text-ink"
      @click="emit('restart')"
    >
      Créer un autre compte
    </button>
  </div>
</template>
