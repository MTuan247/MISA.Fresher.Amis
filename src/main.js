import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'
import VTooltip from 'v-tooltip'
import EventBus from './plugins/eventbus'
import Enums from './enums/enums'
import Resources from './resources'

Vue.config.productionTip = false;

Vue.prototype.$eventBus = EventBus;

Vue.prototype.$enums = Enums;

Vue.prototype.$resources = Resources;

const tooltipOptions = {
  defaultDelay: {
    show: 300
  },
  defaultPlacement: 'bottom',
  defaultClass: 'tooltip-base'
}

Vue.use(VTooltip, tooltipOptions)

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
