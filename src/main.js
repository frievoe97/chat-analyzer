import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

const VueResizeObserver = require("vue-resize-observer");

Vue.use(BootstrapVue);
Vue.use(VueResizeObserver); // use is a static method

Vue.component('v-icon', Icon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')