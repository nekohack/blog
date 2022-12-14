import svgLoader from 'vite-svg-loader'
import 'dotenv/config'
import { adsenseList } from './app/utils/adsense.constants'
import { gtagList } from './app/utils/gtag.constants'
import { generalOg, twitterOg } from './app/utils/og.constants'
import { icons, manifest } from './app/utils/pwa.constants'
import { USE_CONTENT } from './app/utils/feature.constants'
import { initContent } from './app/services/content'

export default {
  srcDir: 'app/',
  app: {
    buildAssetsDir: '/_nuxt/',
  },
  mode: 'universal',
  target: 'static',
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...adsenseList(),
      ...gtagList(),
      ...generalOg(),
      ...twitterOg(),
    ],
    link: [...icons(), ...manifest()],
    __dangerouslyDisableSanitizersByTagID: {
      ADsrc: ['innerHTML'],
      ADcode: ['innerHTML'],
      GAsrc: ['innerHTML'],
      GAcode: ['innerHTML'],
    },
    htmlAttrs: {
      lang: 'ja',
    },
  },
  css: ['~/assets/main.scss'],
  serverMiddleware: [{ path: '/api/hello', handler: '~/server/api/hello.ts' }],
  modules: [...(USE_CONTENT ? ['@nuxt/content', '@nuxtjs/color-mode'] : [])],
  ...(USE_CONTENT ? initContent() : {}),
  vite: {
    plugins: [svgLoader()],
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['adsbygoogle'].includes(tag),
    },
  },
  publicRuntimeConfig: {
    space: process.env.CTF_SPACE_ID,
    accessToken: process.env.CTF_CDA_ACCESS_TOKEN,
    gtagId: process.env.GTAG_ID,
  },
  build: {
    extractCSS: true,
    transpile: [USE_CONTENT ? 'shiki' : ''],
  },
}
