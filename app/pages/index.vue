<script setup lang="ts">
const page = useTemplateRef<HTMLElement>('page')

useRevealAnimation(page)
useRevealOnScroll(page)

useSeoMeta({
  title: 'Créer un compte — validation de formulaire',
  ogTitle: 'Créer un compte — validation de formulaire',
  description:
    'Formulaire d\'inscription validé par un schéma déclaratif, avec Nuxt 4, Pinia et GSAP.',
})
</script>

<template>
  <main ref="page" class="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:py-28">
    <div class="grid items-center gap-12 lg:grid-cols-[1fr_27rem] lg:gap-20">
      <BrandPanel />

      <div data-reveal class="reveal-hidden">
        <RegistrationForm />
      </div>
    </div>

    <footer
      data-reveal-on-scroll
      class="reveal-hidden mt-16 border-t border-line pt-6 text-[0.75rem] text-ink-faint sm:mt-20"
    >
      Reconstruit d'après
      <a
        href="https://github.com/CodeurCopieur/best-validation-form-js"
        target="_blank"
        rel="noreferrer"
        class="font-medium text-ink-soft underline decoration-line underline-offset-4 transition hover:decoration-ink-faint"
      >
        best-validation-form-js
      </a>.
    </footer>
  </main>
</template>
