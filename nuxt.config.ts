import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Inscription — validation de formulaire',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Formulaire d\'inscription avec validation déclarative, Nuxt 4, Pinia et animations GSAP.',
        },
        { name: 'color-scheme', content: 'light dark' },
      ],
      script: [
        {
          // Posé avant le premier paint : le CSS ne masque les éléments à
          // révéler que si JS peut réellement les animer ensuite.
          innerHTML: 'document.documentElement.classList.add("js")',
          tagPosition: 'head',
        },
      ],
    },
  },
})
