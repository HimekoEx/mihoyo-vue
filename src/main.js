import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'
import './plugins/element'
// import './assets/fontello/css/fontello.css'
import './assets/ali-fonts/iconfont.css'
import './assets/css/global.css'
import './plugins/api'
import './plugins/utils'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
