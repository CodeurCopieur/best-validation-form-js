/**
 * Moteur de validation déclaratif, isomorphe (client + serveur).
 *
 * Reprend l'idée du projet original — décrire les contraintes à côté du champ
 * et laisser un jeu de règles générique produire les messages — mais les
 * contraintes vivent dans un schéma typé au lieu d'attributs DOM.
 */

export type FormValues = Record<string, string>

export interface FieldSchema {
  /** Utilisé tel quel dans les messages d'erreur, article compris. */
  label: string
  /** Accorde les messages générés : « est requis » / « est requise ». */
  feminine?: boolean
  required?: boolean
  minLength?: number
  maxLength?: number
  email?: boolean
  pattern?: { regex: RegExp, message: string }
  /** Nom du champ dont la valeur doit être identique (confirmation). */
  match?: string
  /** Règle spécifique au champ. Retourne un message, ou null si valide. */
  validate?: (value: string, values: FormValues) => string | null
}

export type FormSchema<TValues extends FormValues> = {
  [K in keyof TValues]: FieldSchema
}

export type FormErrors<TValues extends FormValues> = {
  [K in keyof TValues]?: string
}

interface RuleContext {
  field: FieldSchema
  values: FormValues
  schema: FormSchema<FormValues>
}

interface Rule {
  applies: (field: FieldSchema) => boolean
  isValid: (value: string, ctx: RuleContext) => boolean
  message: (value: string, ctx: RuleContext) => string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

/** Premier message produit gagne : l'ordre va du plus général au plus précis. */
const rules: Rule[] = [
  {
    applies: field => field.required === true,
    isValid: value => value.trim() !== '',
    message: (_value, { field }) =>
      `${field.label} est requis${field.feminine ? 'e' : ''}.`,
  },
  {
    applies: field => field.email === true,
    isValid: value => EMAIL_REGEX.test(value.trim()),
    message: () => 'Cette adresse email n\'est pas valide.',
  },
  {
    applies: field => field.pattern !== undefined,
    isValid: (value, { field }) => field.pattern!.regex.test(value),
    message: (_value, { field }) => field.pattern!.message,
  },
  {
    applies: field => field.minLength !== undefined,
    isValid: (value, { field }) => value.trim().length >= field.minLength!,
    message: (_value, { field }) =>
      `${field.label} doit contenir au moins ${field.minLength} caractères.`,
  },
  {
    applies: field => field.maxLength !== undefined,
    isValid: (value, { field }) => value.trim().length <= field.maxLength!,
    message: (_value, { field }) =>
      `${field.label} ne peut pas dépasser ${field.maxLength} caractères.`,
  },
  {
    applies: field => field.match !== undefined,
    isValid: (value, { field, values }) =>
      values[field.match!]?.trim() === value.trim(),
    message: (_value, { field, schema }) => {
      const target = schema[field.match!]?.label ?? field.match
      return `${field.label} ne correspond pas à « ${target} ».`
    },
  },
  {
    applies: field => field.validate !== undefined,
    isValid: (value, { field, values }) => field.validate!(value, values) === null,
    message: (value, { field, values }) => field.validate!(value, values)!,
  },
]

/** Retourne le message d'erreur du champ, ou null s'il est valide. */
export function validateField<TValues extends FormValues>(
  name: keyof TValues & string,
  values: TValues,
  schema: FormSchema<TValues>,
): string | null {
  const field = schema[name]
  if (!field) return null

  const value = values[name] ?? ''
  const ctx: RuleContext = {
    field,
    values,
    schema: schema as FormSchema<FormValues>,
  }

  // Un champ optionnel laissé vide est valide : les autres contraintes ne
  // s'appliquent qu'à partir du moment où l'utilisateur a saisi quelque chose.
  if (value.trim() === '' && !field.required) return null

  for (const rule of rules) {
    if (rule.applies(field) && !rule.isValid(value, ctx)) {
      return rule.message(value, ctx)
    }
  }

  return null
}

/** Valide tous les champs du schéma d'un coup. */
export function validateForm<TValues extends FormValues>(
  values: TValues,
  schema: FormSchema<TValues>,
): FormErrors<TValues> {
  const errors: FormErrors<TValues> = {}

  for (const name of Object.keys(schema) as (keyof TValues & string)[]) {
    const error = validateField(name, values, schema)
    if (error) errors[name] = error
  }

  return errors
}

/** Champs qui doivent être revalidés quand `name` change (confirmations). */
export function dependentFields<TValues extends FormValues>(
  name: keyof TValues & string,
  schema: FormSchema<TValues>,
): (keyof TValues & string)[] {
  return (Object.keys(schema) as (keyof TValues & string)[]).filter(
    key => schema[key]?.match === name,
  )
}
