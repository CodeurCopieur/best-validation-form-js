import type { FormSchema } from '#shared/validation'

export interface RegistrationValues extends Record<string, string> {
  firstName: string
  email: string
  password: string
  confirmPassword: string
}

export const PASSWORD_MIN_LENGTH = 8

/**
 * Contraintes du formulaire d'inscription. Partagées entre le formulaire et la
 * route API : le serveur revalide exactement les mêmes règles.
 */
export const registrationSchema: FormSchema<RegistrationValues> = {
  firstName: {
    label: 'Le prénom',
    required: true,
    minLength: 2,
    maxLength: 40,
    pattern: {
      regex: /^[\p{L}][\p{L}\s'-]*$/u,
      message: 'Le prénom ne peut contenir que des lettres, espaces, - et \'.',
    },
  },
  email: {
    label: 'L\'adresse email',
    feminine: true,
    required: true,
    email: true,
    maxLength: 254,
  },
  password: {
    label: 'Le mot de passe',
    required: true,
    minLength: PASSWORD_MIN_LENGTH,
    maxLength: 72,
    validate: (value) => {
      if (!/[a-z]/.test(value)) return 'Ajoutez au moins une lettre minuscule.'
      if (!/[A-Z]/.test(value)) return 'Ajoutez au moins une lettre majuscule.'
      if (!/\d/.test(value)) return 'Ajoutez au moins un chiffre.'
      return null
    },
  },
  confirmPassword: {
    label: 'La confirmation',
    feminine: true,
    required: true,
    match: 'password',
  },
}

export function emptyRegistrationValues(): RegistrationValues {
  return { firstName: '', email: '', password: '', confirmPassword: '' }
}

export interface PasswordStrength {
  /** 0 à 4. */
  score: number
  label: string
}

const STRENGTH_LABELS = ['Très faible', 'Faible', 'Correct', 'Solide', 'Excellent']

export function passwordStrength(value: string): PasswordStrength {
  if (!value) return { score: 0, label: STRENGTH_LABELS[0]! }

  let score = 0
  if (value.length >= PASSWORD_MIN_LENGTH) score++
  if (value.length >= 12) score++
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++
  if (/\d/.test(value)) score++
  if (/[^\w\s]/.test(value)) score++

  score = Math.min(score, 4)

  return { score, label: STRENGTH_LABELS[score]! }
}
