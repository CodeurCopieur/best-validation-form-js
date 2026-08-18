/** Petite secousse latérale, pour signaler un champ ou un formulaire refusé. */
export function useShake() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return function shake(element: HTMLElement | null | undefined, amplitude = 6) {
    if (!element || prefersReducedMotion.value) return

    useGsap().fromTo(
      element,
      { x: -amplitude },
      {
        x: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.32)',
        clearProps: 'transform',
      },
    )
  }
}

/**
 * Hooks à brancher sur `<Transition>` pour déplier/replier un bloc à hauteur
 * inconnue (message d'erreur, panneau conditionnel) avec GSAP.
 */
export function useCollapseTransition(duration = 0.28) {
  const prefersReducedMotion = usePrefersReducedMotion()

  function onEnter(element: Element, done: () => void) {
    if (prefersReducedMotion.value) return done()

    useGsap().fromTo(
      element,
      { height: 0, opacity: 0, y: -4 },
      {
        height: 'auto',
        opacity: 1,
        y: 0,
        duration,
        clearProps: 'height,transform',
        onComplete: done,
      },
    )
  }

  function onLeave(element: Element, done: () => void) {
    if (prefersReducedMotion.value) return done()

    useGsap().to(element, {
      height: 0,
      opacity: 0,
      duration: duration * 0.7,
      ease: 'power2.in',
      onComplete: done,
    })
  }

  return { onEnter, onLeave }
}
