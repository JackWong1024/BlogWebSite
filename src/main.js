// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import config from './config/index'
import iView from 'iview'
import router from './router/index'
import store from './store/index'
import 'iview/dist/styles/iview.css'
import './filter/index'
import './common/common.less'
import './directives/index'
// 这里的SaveVuex 一定要在 new Vue 前面，因为需要先初始化数据，在加载。
import SaveVuex from './libs/SaveVuex'
SaveVuex(store)
Vue.config.productionTip = false
Vue.prototype.$config = config
Vue.use(iView) // iview UI 库

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
