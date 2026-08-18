import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)

  gsap.defaults({ ease: 'power3.out', duration: 0.55 })

  return {
    provide: { gsap, ScrollTrigger },
  }
})
