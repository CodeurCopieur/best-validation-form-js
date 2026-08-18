<script setup lang="ts">
const { loading = false, label, loadingLabel = 'Un instant…' } = defineProps<{
  label: string
  loadingLabel?: string
  loading?: boolean
}>()
</script>

<template>
  <button
    type="submit"
    :disabled="loading"
    :aria-busy="loading"
    class="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-ink text-[0.9375rem] font-medium text-canvas transition-[transform,opacity] duration-200 hover:-translate-y-px active:translate-y-0 disabled:cursor-progress disabled:opacity-70 disabled:hover:translate-y-0"
  >
    <!-- Lueur qui traverse le bouton au survol : le seul effet décoratif de l'écran. -->
    <span
      class="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-canvas/18 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      aria-hidden="true"
    />

    <template v-if="loading">
      <span
        class="size-4 animate-spin rounded-full border-2 border-canvas/30 border-t-canvas"
        aria-hidden="true"
      />
      <span>{{ loadingLabel }}</span>
    </template>

    <template v-else>
      <span>{{ label }}</span>
      <AppIcon
        name="arrowRight"
        :size="18"
        class="transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </template>
  </button>
</template>
