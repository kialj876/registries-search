// External
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import { createApp } from 'vue'
// Local
import App from '@/App.vue'
import { createVueRouter } from '@/router'
import store from '@/store'
import { fetchConfig, initLdClient } from '@/utils'
import vuetify from './plugins/vuetify'
 
// Styles
import '@mdi/font/css/materialdesignicons.min.css' // ensure you are using css-loader
import '@/assets/styles/base.scss'
import '@/assets/styles/layout.scss'
import '@/assets/styles/overrides.scss'

import KeycloakService from '@/sbc-common-components/services/keycloak.services'

declare const window: any

// main code
async function start() {
  // fetch config from environment and API
  // must come first as inits below depend on config
  await fetchConfig()

  const router = createVueRouter()
  const app = createApp(App)

  // configure Keycloak Service
  console.info('Starting Keycloak service...') // eslint-disable-line no-console
  const keycloakConfigPath = sessionStorage.getItem('KEYCLOAK_CONFIG_PATH')
  await KeycloakService.setKeycloakConfigUrl(keycloakConfigPath)

  // init sentry if applicable
  if (window.sentryEnable === 'true') {
    console.info('Initializing Sentry...') // eslint-disable-line no-console
    Sentry.init({
      app,
      dsn: window.sentryDsn,
      environment: sessionStorage.getItem('POD_NAMESPACE'),
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: [window.location.hostname, window.location.origin, /^\//],
        }),
      ],
      logErrors: true,
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: window.sentryTSR,
    })
  }

  // initialize Launch Darkly
  if (window.ldClientId) {
    await initLdClient()
  }

  // start Vue application
  console.info('Starting app...') // eslint-disable-line no-console
  app.use(router).use(store).use(vuetify).mount('#app')
}

start().catch(error => {
  console.error(error) // eslint-disable-line no-console
  alert(
    'There was an error starting this page. (See console for details.)\n' +
      'Please try again later.'
  )
})
