<script setup lang="ts">
/** Jeu d'icônes inline : pas de dépendance externe, pas de FOUT, couleur héritée. */
const paths = {
  user: [
    'M12 11.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z',
    'M4.4 20.6c1.4-3.3 4.2-5 7.6-5s6.2 1.7 7.6 5',
  ],
  mail: [
    'M4.2 5.5h15.6c.8 0 1.4.6 1.4 1.4v10.2c0 .8-.6 1.4-1.4 1.4H4.2a1.4 1.4 0 0 1-1.4-1.4V6.9c0-.8.6-1.4 1.4-1.4Z',
    'm3.4 7.2 8.6 5.8 8.6-5.8',
  ],
  lock: [
    'M7.6 10.4V7.9a4.4 4.4 0 0 1 8.8 0v2.5',
    'M6.3 10.4h11.4c.7 0 1.3.6 1.3 1.3v7.1c0 .7-.6 1.3-1.3 1.3H6.3c-.7 0-1.3-.6-1.3-1.3v-7.1c0-.7.6-1.3 1.3-1.3Z',
  ],
  check: ['m4.8 12.6 4.8 4.8L19.2 7'],
  alert: [
    'M12 3.1a8.9 8.9 0 1 0 0 17.8 8.9 8.9 0 0 0 0-17.8Z',
    'M12 8.2v4.4',
    'M12 15.9h.01',
  ],
  eye: [
    'M2.8 12.3a1 1 0 0 1 0-.6C4.2 7.6 7.8 5 12 5s7.8 2.6 9.2 6.7a1 1 0 0 1 0 .6C19.8 16.4 16.2 19 12 19s-7.8-2.6-9.2-6.7Z',
    'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  ],
  eyeOff: [
    'M3.4 3.4l17.2 17.2',
    'M10.4 5.2A9.9 9.9 0 0 1 12 5c4.2 0 7.8 2.6 9.2 6.7a1 1 0 0 1 0 .6 13 13 0 0 1-2 3.2',
    'M6.4 6.7A12.6 12.6 0 0 0 2.8 11.7a1 1 0 0 0 0 .6C4.2 16.4 7.8 19 12 19c1.5 0 2.9-.3 4.2-.9',
    'M9.9 9.9a3 3 0 0 0 4.2 4.2',
  ],
  arrowRight: ['M4.5 12h14.2', 'm12.8 6.1 5.9 5.9-5.9 5.9'],
  shield: ['M12 3.2 19.3 6v5.4c0 4.2-2.9 7.7-7.3 9.4-4.4-1.7-7.3-5.2-7.3-9.4V6L12 3.2Z'],
  spark: ['M13.4 2.8 5.6 13.9h4.9l-1 7.3 7.9-11.1h-5l1-7.3Z'],
  keyboard: [
    'M3.4 6.4h17.2c.7 0 1.2.5 1.2 1.2v8.8c0 .7-.5 1.2-1.2 1.2H3.4c-.7 0-1.2-.5-1.2-1.2V7.6c0-.7.5-1.2 1.2-1.2Z',
    'M7 10h.01', 'M11 10h.01', 'M15 10h.01', 'M8.5 13.6h7',
  ],
} satisfies Record<string, string[]>

export type IconName = keyof typeof paths

const { name, size = 20 } = defineProps<{
  name: IconName
  size?: number | string
}>()
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="d in paths[name]" :key="d" :d="d" />
  </svg>
</template>
