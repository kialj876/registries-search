// External
import { mount, VueWrapper } from '@vue/test-utils'
import { Router, useRoute } from 'vue-router'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
// Local
import App from '@/App.vue'
import { BcrsBreadcrumb } from '@/bcrs-common-components'
import { SbcHeader, SbcFooter, SbcSystemBanner } from '@/sbc-common-components'
import { BusinessInfoView, DashboardView } from '@/views'
// import vuetify from '@/plugins/vuetify'
import { RouteNames } from '@/enums'
import { createVueRouter } from '@/router'
import store from '@/store'


// FUTURE: replace this with actual tests on App.vue
describe('App tests', () => {
  let wrapper: VueWrapper<any>
  let router: Router

  beforeEach(async () => {
    // set keycloak token so it doesn't redirect
    sessionStorage.setItem(SessionStorageKeys.KeyCloakToken, 'token')
    router = createVueRouter()
    router.push(RouteNames.DASHBOARD)
    await router.isReady()

    wrapper = mount(App, {
      global: {
        // plugins: [vuetify],
        plugins: [router],
        provide: {
          store: store
        },
      },
      shallow: true  // stubs out children components
    })
  })
  it('mounts App with expected child components', async () => {
    expect(wrapper.findComponent(SbcHeader).exists()).toBe(true)
    // breadcrumb will only exist with correct router meta data - should be on dashboard + showing
    expect(wrapper.findComponent(BcrsBreadcrumb).exists()).toBe(true)
    // banner will only exist when systemMessage is not null
    expect(sessionStorage.getItem('SYSTEM_MESSAGE')).toBe(null)
    expect(wrapper.vm.systemMessage).toBe(null)
    expect(wrapper.findComponent(SbcSystemBanner).exists()).toBe(false)
    expect(wrapper.findComponent(SbcFooter).exists()).toBe(true)
  })
  it('registers jest running', () => {
    expect(wrapper.vm.isJestRunning).toBe(true)
  })
})
