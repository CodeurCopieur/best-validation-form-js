import {
  dependentFields,
  validateField,
  validateForm,
  type FormErrors,
  type FormSchema,
  type FormValues,
} from '#shared/validation'

export interface FieldState {
  error: string | null
  touched: boolean
  /** Le champ a été renseigné et passe toutes ses règles. */
  isValid: boolean
  isInvalid: boolean
}

export interface UseFormValidationOptions<TValues extends FormValues> {
  schema: FormSchema<TValues>
  initialValues: TValues
}

/**
 * Pilote l'état de validation d'un formulaire décrit par un schéma.
 *
 * Stratégie de feedback : on ne montre rien avant que l'utilisateur ait quitté
 * le champ, puis on valide à chaque frappe pour que l'erreur disparaisse dès
 * qu'elle est corrigée.
 */
export function useFormValidation<TValues extends FormValues>(
  options: UseFormValidationOptions<TValues>,
) {
  const { schema, initialValues } = options
  type Name = keyof TValues & string

  const fieldNames = Object.keys(schema) as Name[]

  const values = ref<TValues>({ ...initialValues }) as Ref<TValues>
  const errors = ref<FormErrors<TValues>>({}) as Ref<FormErrors<TValues>>
  const touched = ref<Partial<Record<Name, boolean>>>({})
  const submitAttempted = ref(false)

  /** Erreurs réelles, indépendamment de ce qui est affiché à l'écran. */
  const silentErrors = computed(() => validateForm(values.value, schema))
  const isValid = computed(() => Object.keys(silentErrors.value).length === 0)

  const isDirty = computed(() =>
    fieldNames.some(name => values.value[name] !== initialValues[name]),
  )

  function revalidate(name: Name) {
    const error = validateField(name, values.value, schema)
    if (error) errors.value[name] = error
    else delete errors.value[name]
  }

  function handleBlur(name: Name) {
    touched.value[name] = true
    revalidate(name)
  }

  function handleInput(name: Name) {
    if (touched.value[name] || submitAttempted.value) revalidate(name)
    else delete errors.value[name]

    // « Confirmer le mot de passe » doit suivre le champ source.
    for (const dependent of dependentFields(name, schema)) {
      if (touched.value[dependent] || submitAttempted.value) revalidate(dependent)
    }
  }

  function setValue(name: Name, value: string) {
    values.value[name] = value as TValues[Name]
    handleInput(name)
  }

  /** Valide tout et révèle les messages. Retourne true si le formulaire passe. */
  function validateAll(): boolean {
    submitAttempted.value = true
    errors.value = validateForm(values.value, schema)
    for (const name of fieldNames) touched.value[name] = true
    return Object.keys(errors.value).length === 0
  }

  const invalidFields = computed(() =>
    fieldNames.filter(name => Boolean(errors.value[name])),
  )

  function fieldState(name: Name): ComputedRef<FieldState> {
    return computed(() => {
      const error = errors.value[name] ?? null
      const isTouched = Boolean(touched.value[name])

      return {
        error,
        touched: isTouched,
        isValid: isTouched && !error && values.value[name]!.trim() !== '',
        isInvalid: Boolean(error),
      }
    })
  }

  function setErrors(next: FormErrors<TValues>) {
    errors.value = { ...errors.value, ...next }
    for (const name of Object.keys(next) as Name[]) touched.value[name] = true
  }

  function reset() {
    values.value = { ...initialValues }
    errors.value = {}
    touched.value = {}
    submitAttempted.value = false
  }

  return {
    fieldNames,
    values,
    errors,
    touched,
    submitAttempted,
    isValid,
    isDirty,
    invalidFields,
    fieldState,
    handleBlur,
    handleInput,
    setValue,
    setErrors,
    validateAll,
    reset,
  }
}
