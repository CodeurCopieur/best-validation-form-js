<script setup lang="ts">
import { PASSWORD_MIN_LENGTH, type RegistrationValues } from '#shared/registration'

interface FocusableField {
  focus: () => void
}

const store = useRegistrationStore()

const formRef = useTemplateRef<HTMLFormElement>('form')
const firstNameField = useTemplateRef<FocusableField>('firstNameField')
const emailField = useTemplateRef<FocusableField>('emailField')
const passwordField = useTemplateRef<FocusableField>('passwordField')
const confirmField = useTemplateRef<FocusableField>('confirmField')

const shake = useShake()
const collapse = useCollapseTransition()

const firstNameState = store.fieldState('firstName')
const emailState = store.fieldState('email')
const passwordState = store.fieldState('password')
const confirmState = store.fieldState('confirmPassword')

function focusableFor(name: keyof RegistrationValues) {
  const map: Record<keyof RegistrationValues, FocusableField | null | undefined> = {
    firstName: firstNameField.value,
    email: emailField.value,
    password: passwordField.value,
    confirmPassword: confirmField.value,
  }
  return map[name]
}

async function onSubmit() {
  const succeeded = await store.submit()
  if (succeeded) return

  shake(formRef.value, 5)

  const firstInvalid = store.invalidFields[0]
  if (firstInvalid) focusableFor(firstInvalid)?.focus()
}
</script>

<template>
  <section
    class="rounded-2xl border border-line bg-surface p-6 shadow-ambient sm:rounded-3xl sm:p-9"
  >
    <Transition
      mode="out-in"
      enter-active-class="transition duration-400 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="-translate-y-1 opacity-0"
    >
      <RegistrationSuccess
        v-if="store.isSuccess"
        key="success"
        :first-name="store.registeredFirstName"
        :email="store.registeredEmail"
        @restart="store.reset()"
      />

      <div v-else key="form" class="grid gap-7">
        <header class="grid gap-2">
          <h1 class="text-[1.75rem] leading-tight font-semibold tracking-tight sm:text-3xl">
            Créer un compte
          </h1>
          <p class="text-[0.9375rem] text-ink-soft">
            Déjà inscrit ?
            <a
              href="#"
              class="rounded-sm font-medium text-accent underline decoration-accent/30 underline-offset-4 transition hover:decoration-accent"
            >
              Connectez-vous
            </a>
          </p>
        </header>

        <form ref="form" novalidate class="grid gap-5" @submit.prevent="onSubmit">
          <FormField
            ref="firstNameField"
            :model-value="store.values.firstName"
            name="firstName"
            label="Prénom"
            icon="user"
            autocomplete="given-name"
            placeholder="Camille"
            :maxlength="40"
            :error="firstNameState.error"
            :valid="firstNameState.isValid"
            @blur="store.handleBlur('firstName')"
            @update:model-value="store.setValue('firstName', $event)"
          />

          <FormField
            ref="emailField"
            :model-value="store.values.email"
            name="email"
            type="email"
            label="Adresse email"
            icon="mail"
            autocomplete="email"
            placeholder="camille@exemple.fr"
            :error="emailState.error"
            :valid="emailState.isValid"
            @blur="store.handleBlur('email')"
            @update:model-value="store.setValue('email', $event)"
          />

          <FormField
            ref="passwordField"
            :model-value="store.values.password"
            name="password"
            type="password"
            label="Mot de passe"
            icon="lock"
            autocomplete="new-password"
            :hint="`${PASSWORD_MIN_LENGTH} caractères minimum, dont une majuscule et un chiffre.`"
            :error="passwordState.error"
            :valid="passwordState.isValid"
            @blur="store.handleBlur('password')"
            @update:model-value="store.setValue('password', $event)"
          >
            <template #meter>
              <PasswordStrengthMeter
                :score="store.strength.score"
                :label="store.strength.label"
                :active="store.values.password.length > 0"
              />
            </template>
          </FormField>

          <FormField
            ref="confirmField"
            :model-value="store.values.confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirmer le mot de passe"
            icon="lock"
            autocomplete="new-password"
            :error="confirmState.error"
            :valid="confirmState.isValid"
            @blur="store.handleBlur('confirmPassword')"
            @update:model-value="store.setValue('confirmPassword', $event)"
          />

          <Transition :css="false" @enter="collapse.onEnter" @leave="collapse.onLeave">
            <p
              v-if="store.serverMessage"
              class="flex items-start gap-2.5 overflow-hidden rounded-xl bg-negative/8 px-3.5 py-3 text-[0.8125rem] leading-snug text-negative"
              role="alert"
            >
              <AppIcon name="alert" :size="16" class="mt-px shrink-0" />
              <span>{{ store.serverMessage }}</span>
            </p>
          </Transition>

          <div class="grid gap-4 pt-1">
            <SubmitButton
              label="Créer mon compte"
              loading-label="Création du compte…"
              :loading="store.isSubmitting"
            />

            <p class="text-center text-[0.75rem] leading-relaxed text-ink-faint">
              En continuant, vous acceptez nos conditions d'utilisation
              et notre politique de confidentialité.
            </p>
          </div>
        </form>
      </div>
    </Transition>
  </section>
</template>
