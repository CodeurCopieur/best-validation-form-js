export interface RevealOptions {
  /** Éléments à révéler, relatifs au scope. */
  selector?: string
  stagger?: number
  delay?: number
  distance?: number
}

/**
 * Révèle en cascade les éléments marqués dans un conteneur, au montage.
 * Les éléments portent `.reveal-hidden` pour éviter tout flash avant l'animation.
 */
export function useRevealAnimation(
  scope: Ref<HTMLElement | null | undefined>,
  options: RevealOptions = {},
) {
  const {
    selector = '[data-reveal]',
    stagger = 0.07,
    delay = 0.05,
    distance = 16,
  } = options

  useGsapContext((context) => {
    const targets = gsapTargets(context, selector)
    if (!targets.length) return

    useGsap().fromTo(
      targets,
      { opacity: 0, y: distance },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        stagger,
        clearProps: 'transform',
      },
    )
  }, { scope })
}

/**
 * Même effet, mais déclenché quand l'élément entre dans le viewport : utile sur
 * mobile où le contenu passe sous la ligne de flottaison.
 */
export function useRevealOnScroll(
  scope: Ref<HTMLElement | null | undefined>,
  options: RevealOptions = {},
) {
  const { selector = '[data-reveal-on-scroll]', distance = 20 } = options

  useGsapContext((context) => {
    const targets = gsapTargets(context, selector)

    for (const target of targets) {
      useGsap().fromTo(
        target,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          clearProps: 'transform',
          scrollTrigger: {
            trigger: target,
            start: 'top 88%',
            once: true,
          },
        },
      )
    }
  }, { scope })
}
