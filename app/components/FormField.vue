<script setup lang="ts">
import type { IconName } from './AppIcon.vue'

const {
  name,
  label,
  type = 'text',
  error = null,
  valid = false,
  hint,
  icon,
  autocomplete,
  placeholder,
  maxlength,
} = defineProps<{
  name: string
  label: string
  type?: 'text' | 'email' | 'password'
  error?: string | null
  valid?: boolean
  hint?: string
  icon?: IconName
  autocomplete?: string
  placeholder?: string
  maxlength?: number
}>()

const emit = defineEmits<{ blur: [] }>()

const model = defineModel<string>({ required: true })

const inputRef = useTemplateRef<HTMLInputElement>('input')
const fieldRef = useTemplateRef<HTMLElement>('field')

const revealPassword = ref(false)
const isPassword = computed(() => type === 'password')
const resolvedType = computed(() =>
  isPassword.value && revealPassword.value ? 'text' : type,
)

const fieldId = `field-${name}`
const errorId = `${fieldId}-error`
const hintId = `${fieldId}-hint`

const describedBy = computed(() => {
  const ids: string[] = []
  if (error) ids.push(errorId)
  else if (hint) ids.push(hintId)
  return ids.length ? ids.join(' ') : undefined
})

const collapse = useCollapseTransition()
const shake = useShake()

// Chaque nouveau message déclenche la secousse, y compris deux erreurs de suite.
watch(
  () => error,
  (next, previous) => {
    if (next && next !== previous) shake(fieldRef.value)
  },
)

function toggleReveal() {
  revealPassword.value = !revealPassword.value
  // Le focus reste dans le champ pour ne pas interrompre la saisie.
  inputRef.value?.focus()
}

defineExpose({
  focus: () => inputRef.value?.focus(),
})
</script>

<template>
  <div ref="field" class="grid gap-2">
    <label
      :for="fieldId"
      class="text-[0.8125rem] font-medium tracking-tight text-ink-soft"
    >
      {{ label }}
    </label>

    <div class="relative">
      <AppIcon
        v-if="icon"
        :name="icon"
        :size="18"
        class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-faint transition-colors duration-200"
        :class="{ 'text-negative': error, 'text-positive': valid }"
      />

      <input
        :id="fieldId"
        ref="input"
        v-model="model"
        :name="name"
        :type="resolvedType"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :aria-invalid="Boolean(error)"
        :aria-describedby="describedBy"
        class="h-12 w-full rounded-xl border bg-surface text-[0.9375rem] text-ink transition-[border-color,box-shadow,background-color] duration-200 outline-none placeholder:text-ink-faint/70 focus:border-line-strong focus:ring-4 focus:ring-accent/12"
        :class="[
          icon ? 'pl-11' : 'pl-3.5',
          isPassword ? 'pr-20' : 'pr-11',
          error
            ? 'border-negative/60 focus:border-negative focus:ring-negative/12'
            : valid
              ? 'border-positive/55'
              : 'border-line',
        ]"
        @blur="emit('blur')"
      >

      <div
        class="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-0.5"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-75 opacity-0"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="scale-75 opacity-0"
        >
          <span
            v-if="error"
            key="error"
            class="grid size-7 place-items-center text-negative"
          >
            <AppIcon name="alert" :size="18" />
          </span>
          <span
            v-else-if="valid"
            key="valid"
            class="grid size-7 place-items-center text-positive"
          >
            <AppIcon name="check" :size="18" />
          </span>
        </Transition>

        <button
          v-if="isPassword"
          type="button"
          class="grid size-9 place-items-center rounded-lg text-ink-faint transition hover:bg-sunken hover:text-ink-soft"
          :aria-label="revealPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          :aria-pressed="revealPassword"
          @click="toggleReveal"
        >
          <AppIcon :name="revealPassword ? 'eyeOff' : 'eye'" :size="18" />
        </button>
      </div>
    </div>

    <slot name="meter" />

    <Transition
      :css="false"
      @enter="collapse.onEnter"
      @leave="collapse.onLeave"
    >
      <p
        v-if="error"
        :id="errorId"
        class="overflow-hidden text-[0.8125rem] leading-snug text-negative"
        role="alert"
      >
        {{ error }}
      </p>
      <p
        v-else-if="hint"
        :id="hintId"
        class="overflow-hidden text-[0.8125rem] leading-snug text-ink-faint"
      >
        {{ hint }}
      </p>
    </Transition>
  </div>
</template>
