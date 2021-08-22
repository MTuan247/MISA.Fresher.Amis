import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'
import VTooltip from 'v-tooltip'
import EventBus from './plugins/eventbus'

Vue.config.productionTip = false

Vue.prototype.$eventBus = EventBus

Vue.use(VTooltip)

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
