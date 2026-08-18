<script setup lang="ts">
const root = useTemplateRef<HTMLElement>('root')

useGsapContext((context) => {
  const gsap = useGsap()
  const halos = gsapTargets(context, '[data-halo]')

  // Dérive très lente : la page respire sans attirer l'œil.
  halos.forEach((halo, index) => {
    gsap.to(halo, {
      xPercent: index === 0 ? 6 : -8,
      yPercent: index === 0 ? -5 : 7,
      duration: 18 + index * 6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
  })
}, { scope: root })
</script>

<template>
  <div
    ref="root"
    class="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    aria-hidden="true"
  >
    <div
      data-halo
      class="absolute -top-40 -left-32 size-[34rem] rounded-full bg-accent/8 blur-[110px] sm:size-[42rem]"
    />
    <div
      data-halo
      class="absolute -right-40 -bottom-48 size-[32rem] rounded-full bg-positive/8 blur-[120px] sm:size-[40rem]"
    />

    <!-- Grille discrète, atténuée vers les bords pour ne pas cerner la page. -->
    <div
      class="absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
      style="
        background-image:
          linear-gradient(to right, var(--line) 1px, transparent 1px),
          linear-gradient(to bottom, var(--line) 1px, transparent 1px);
        background-size: 72px 72px;
      "
    />
  </div>
</template>
