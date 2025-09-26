// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],
  css: ['~/styles/tailwind.css'],
  runtimeConfig: {
    public: {
      githubToken: process.env.GITHUB_TOKEN || '',
    },
  },
})
