import type { FetchError } from 'ofetch'
import {
  emptyRegistrationValues,
  passwordStrength,
  registrationSchema,
  type RegistrationValues,
} from '#shared/registration'
import type { FormErrors } from '#shared/validation'

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

interface RegisterResponse {
  email: string
  firstName: string
}

interface RegisterErrorPayload {
  fields?: FormErrors<RegistrationValues>
}

export const useRegistrationStore = defineStore('registration', () => {
  const form = useFormValidation<RegistrationValues>({
    schema: registrationSchema,
    initialValues: emptyRegistrationValues(),
  })

  const status = ref<SubmitStatus>('idle')
  /** Message global (panne réseau, refus serveur) affiché au-dessus du bouton. */
  const serverMessage = ref<string | null>(null)
  const registeredFirstName = ref('')
  const registeredEmail = ref('')

  const isSubmitting = computed(() => status.value === 'submitting')
  const isSuccess = computed(() => status.value === 'success')
  const strength = computed(() => passwordStrength(form.values.value.password))

  async function submit(): Promise<boolean> {
    if (status.value === 'submitting') return false

    serverMessage.value = null

    if (!form.validateAll()) {
      status.value = 'error'
      return false
    }

    status.value = 'submitting'

    try {
      const response = await $fetch<RegisterResponse>('/api/register', {
        method: 'POST',
        body: { ...form.values.value },
      })

      registeredFirstName.value = response.firstName
      registeredEmail.value = response.email
      status.value = 'success'
      return true
    }
    catch (error) {
      const payload = (error as FetchError<{
        message?: string
        data?: RegisterErrorPayload
      }>).data

      const fields = payload?.data?.fields
      if (fields && Object.keys(fields).length > 0) {
        form.setErrors(fields)
      }
      else {
        serverMessage.value = payload?.message
          ?? 'Impossible de finaliser l\'inscription pour le moment.'
      }

      status.value = 'error'
      return false
    }
  }

  function reset() {
    form.reset()
    status.value = 'idle'
    serverMessage.value = null
    registeredFirstName.value = ''
    registeredEmail.value = ''
  }

  return {
    values: form.values,
    errors: form.errors,
    touched: form.touched,
    submitAttempted: form.submitAttempted,
    isValid: form.isValid,
    isDirty: form.isDirty,
    invalidFields: form.invalidFields,
    fieldState: form.fieldState,
    handleBlur: form.handleBlur,
    handleInput: form.handleInput,
    setValue: form.setValue,
    status,
    serverMessage,
    registeredFirstName,
    registeredEmail,
    isSubmitting,
    isSuccess,
    strength,
    submit,
    reset,
  }
})
