<script setup lang="ts">
const { score, label, active = true } = defineProps<{
  /** 0 à 4. */
  score: number
  label: string
  active?: boolean
}>()

const SEGMENTS = 4

const toneClass = computed(() => {
  if (score <= 1) return 'bg-negative'
  if (score === 2) return 'bg-warning'
  return 'bg-positive'
})

const labelClass = computed(() => {
  if (score <= 1) return 'text-negative'
  if (score === 2) return 'text-warning'
  return 'text-positive'
})
</script>

<template>
  <div
    class="flex items-center gap-3 transition-opacity duration-300"
    :class="active ? 'opacity-100' : 'opacity-0'"
  >
    <div class="flex flex-1 gap-1" aria-hidden="true">
      <span
        v-for="segment in SEGMENTS"
        :key="segment"
        class="h-1 flex-1 overflow-hidden rounded-full bg-line"
      >
        <span
          class="block h-full origin-left rounded-full transition-transform duration-500 ease-out"
          :class="[toneClass, segment <= score ? 'scale-x-100' : 'scale-x-0']"
        />
      </span>
    </div>

    <output
      class="w-20 text-right text-[0.75rem] font-medium tabular-nums transition-colors duration-300"
      :class="labelClass"
    >
      {{ label }}
    </output>
  </div>
</template>
