import {
  emptyRegistrationValues,
  registrationSchema,
  type RegistrationValues,
} from '#shared/registration'
import { validateForm } from '#shared/validation'

/** Tient lieu de base de données pour la démo. */
const TAKEN_EMAILS = new Set(['deja@exemple.fr', 'test@exemple.fr'])

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<RegistrationValues>>(event)

  // Le client a déjà validé, mais on ne fait jamais confiance à l'entrée.
  const values: RegistrationValues = { ...emptyRegistrationValues() }
  for (const key of Object.keys(values) as (keyof RegistrationValues)[]) {
    values[key] = typeof body?.[key] === 'string' ? body[key] : ''
  }

  const errors = validateForm(values, registrationSchema)

  if (Object.keys(errors).length > 0) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Unprocessable Entity',
      message: 'Certains champs sont invalides.',
      data: { fields: errors },
    })
  }

  const email = values.email.trim().toLowerCase()

  if (TAKEN_EMAILS.has(email)) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Conflict',
      message: 'Cette adresse email est déjà utilisée.',
      data: { fields: { email: 'Cette adresse email est déjà utilisée.' } },
    })
  }

  // Latence simulée pour rendre l'état de chargement visible.
  await new Promise(resolve => setTimeout(resolve, 700))

  return {
    email,
    firstName: values.firstName.trim(),
  }
})
