<script setup lang="ts">
import type { IconName } from './AppIcon.vue'

const highlights: { icon: IconName, title: string, text: string }[] = [
  {
    icon: 'shield',
    title: 'Validation en double',
    text: 'Les mêmes règles s\'appliquent dans le navigateur et sur le serveur.',
  },
  {
    icon: 'keyboard',
    title: 'Retour au bon moment',
    text: 'Rien ne s\'affiche avant que vous ayez quitté le champ.',
  },
  {
    icon: 'spark',
    title: 'Animations discrètes',
    text: 'Des transitions courtes, désactivées si vous les avez réduites.',
  },
]
</script>

<template>
  <aside class="grid gap-8 lg:gap-10">
    <div class="grid gap-5">
      <span
        data-reveal
        class="reveal-hidden inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 text-[0.75rem] font-medium tracking-wide text-ink-soft uppercase"
      >
        Nuxt 4 · Pinia · GSAP
      </span>

      <h2
        data-reveal
        class="reveal-hidden max-w-[16ch] text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem]"
      >
        Un formulaire qui vous répond.
      </h2>

      <p
        data-reveal
        class="reveal-hidden max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-soft sm:text-base"
      >
        La validation de formulaire du tutoriel original, reconstruite autour d'un
        schéma déclaratif : chaque contrainte est décrite une seule fois, puis
        réutilisée partout.
      </p>
    </div>

    <ul class="grid gap-5 sm:gap-6">
      <li
        v-for="item in highlights"
        :key="item.title"
        data-reveal-on-scroll
        class="reveal-hidden flex gap-3.5"
      >
        <span
          class="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink-soft"
        >
          <AppIcon :name="item.icon" :size="17" />
        </span>
        <div class="grid gap-1">
          <p class="text-[0.9375rem] font-medium tracking-tight">
            {{ item.title }}
          </p>
          <p class="max-w-[38ch] text-[0.875rem] leading-relaxed text-ink-faint">
            {{ item.text }}
          </p>
        </div>
      </li>
    </ul>
  </aside>
</template>
