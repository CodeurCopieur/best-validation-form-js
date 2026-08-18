import type gsap from 'gsap'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** Suit la préférence système « réduire les animations » et ses changements. */
export function usePrefersReducedMotion() {
  const prefersReducedMotion = ref(false)

  let query: MediaQueryList | null = null

  function onChange(event: MediaQueryListEvent) {
    prefersReducedMotion.value = event.matches
  }

  onMounted(() => {
    query = window.matchMedia(REDUCED_MOTION_QUERY)
    prefersReducedMotion.value = query.matches
    query.addEventListener('change', onChange)
  })

  // Enregistré pendant le setup : à ce moment le scope du composant est actif.
  onScopeDispose(() => query?.removeEventListener('change', onChange))

  return prefersReducedMotion
}

export interface GsapContextOptions {
  /** Racine des sélecteurs utilisés dans le contexte. */
  scope?: Ref<HTMLElement | null | undefined>
  /** Ne rien animer si l'utilisateur préfère les animations réduites. */
  skipWhenReducedMotion?: boolean
}

/**
 * Exécute une construction d'animations dans un `gsap.context`, nettoyé
 * automatiquement quand le composant disparaît.
 */
export function useGsapContext(
  build: (context: gsap.Context) => void,
  options: GsapContextOptions = {},
) {
  const { scope, skipWhenReducedMotion = true } = options

  let context: gsap.Context | null = null

  onMounted(() => {
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches
    if (reduced && skipWhenReducedMotion) return

    const { $gsap } = useNuxtApp()
    context = $gsap.context(build, scope?.value ?? undefined)
  })

  onScopeDispose(() => context?.revert())
}

/** Accès direct à GSAP, à n'utiliser qu'après le montage (client uniquement). */
export function useGsap() {
  return useNuxtApp().$gsap
}

/** Sélection typée à l'intérieur d'un `gsap.context`, limitée à son scope. */
export function gsapTargets(context: gsap.Context, selector: string): Element[] {
  return context.selector?.(selector) ?? []
}
