import Vue from 'vue'
import Router from 'vue-router'
import Utils from './plugins/utils'
import Nofind from './views/404'
import Login from './views/Login'
import Register from './views/Register'
import Home from './views/Home'
import Welcome from './views/Welcome.vue'
import UserInfo from './components/user/Info.vue'
import Activate from './components/user/Activate.vue'
import GenUIF from './components/user/GenUIF.vue'
import UsersManage from './components/managea/UsersManage.vue'
import CardsManage from './components/managea/CardsManage.vue'
import BaseCache from './components/super/BaseCache.vue'

Vue.use(Router)

// 配置路由
const router = new Router({
  // mode: 'history',
  routes: [
    { path: '*', name: '/404', component: Nofind },
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        // 用户操作区
        { path: '/user', redirect: '/welcome' },
        { path: '/user_info', component: UserInfo },
        { path: '/user_activate', component: Activate },
        { path: '/user_uif', component: GenUIF },
        // 管理区
        { path: '/managea_users', component: UsersManage },
        { path: '/managea_cards', component: CardsManage },
        // 超管区
        { path: '/super_base', component: BaseCache }
      ]
    }
  ]
})

// 配置路由守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // frome 来的路径
  // next 跳转函数
  const isEmpty = Utils.isEmpty(sessionStorage.user)
  if (isEmpty && to.path === '/login') return next()
  else if (isEmpty && to.path === '/register') return next()
  else if (isEmpty) return next('/login')

  if (to.path === '/login') return next('/home')
  next()
})

export default router
