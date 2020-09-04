import Router from 'vue-router'
import Vue from 'vue'
import iView from 'iview'
import routes from './routes'

Vue.use(Router)

let router = new Router({
  base: 'im',
  routes
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // 如果不存在token 则跳转到登录页
  /** if (!sessionStorage.token && to.path !== '/auth' && to.path !== '/app-download') {
    iView.Message.error('请先登录')
    next({
      path: '/auth'
    })
  } else { */
  next()
  // }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
