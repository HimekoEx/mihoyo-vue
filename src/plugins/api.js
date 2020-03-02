import Vue from 'vue'
import axios from 'axios'
import { Loading } from 'element-ui'

// 加载动画对象
let loading = null
// 开始加载动画
const startLoading = () => {
  if (loading === null) {
    loading = Loading.service({
      lock: true,
      fullscreen: true,
      text: '拼命加载中...',
      background: 'rgba(0,0,0,0.7)'
    })
  }
}

// 停止加载动画
const stopLoading = () => {
  if (loading !== null) {
    loading.close()
    loading = null
  }
}

// 请求拦截
axios.interceptors.request.use(config => {
  startLoading()
  return config
}, error => {
  stopLoading()
  return Promise.reject(error)
})

// 响应拦截
axios.interceptors.response.use(function (response) {
  stopLoading()
  return response
}, error => {
  stopLoading()
  return Promise.reject(error)
})

// 设置基础api接口url
axios.defaults.baseURL = 'http://192.168.0.2:7000/api/v1/'
// 设置自动保存cookies
axios.defaults.withCredentials = true

// 导出的API集
const API = {
  // 错误弹窗
  error: error => Vue.prototype.$notify.error({ title: '发送异常', message: error, duration: 0 }),

  // 用户登录
  userLogin: form => axios.post('/user/login', form).then(res => res.data),
  // 用户注册
  userRegister: form => axios.post('/user/register', form).then(res => res.data),
  // 用户退出
  userLogout: () => axios.post('/user/logout').then(res => res.data),
  // 获取用户信息
  userInfo: () => axios.post('/user/info').then(res => res.data),
  // 获取卡密信息
  userCardInfo: form => axios.post('/user/card', form).then(res => res.data),
  // 卡密激活
  userActivate: form => axios.post('/user/activate', form).then(res => res.data),
  // 获取UIF
  userGenUIF: () => axios.post('/user/uif').then(res => res.data),

  // 用户列表查询
  usersList: form => axios.post('/users/list', form).then(res => res.data),
  // 更改用户状态
  usersChangeStatus: form => axios.post('/users/status', form).then(res => res.data),
  // 用户详细信息
  usersInfoEx: id => axios.post('/users/infoEx', { id: id }).then(res => res.data),
  // 清除用户UUID
  usersCleanUUID: id => axios.post('/users/clean', { id: id }).then(res => res.data),
  // 更改用户生成UIF次数
  usersChangeTimes: form => axios.post('/users/times', form).then(res => res.data),
  // 查看用户卡密信息
  usersCardInfo: form => axios.post('/users/card', form).then(res => res.data),
  // 更改用户子项目时效
  usersChangeTime: form => axios.post('/users/time', form).then(res => res.data),
  // 更改用户权限
  usersChangelevel: form => axios.post('/users/level', form).then(res => res.data),

  // 卡密列表查询
  cardsList: form => axios.post('/cards/list', form).then(res => res.data),
  // 更改卡密状态
  cardsChangeStatus: form => axios.post('/cards/status', form).then(res => res.data),
  // 创建卡密
  cardsCreate: form => axios.post('/cards/create', form).then(res => res.data),

  // 获取侧栏数据
  leftMenu: () => axios.post('/cache/left-menu').then(res => res.data),
  // Base缓存列表
  cacheBaselist: form => axios.post('/cache/base/list', form).then(res => res.data),
  // Base缓存设置
  cacheBaseSet: form => axios.post('/cache/base/set', form).then(res => res.data),
  // Base缓存删除
  cacheBaseDel: form => axios.post('/cache/base/del', form).then(res => res.data),
  // 崩坏3缓存列表
  cacheHK3list: form => axios.post('/cache/hk3/list', form).then(res => res.data),
  // 崩坏3缓存设置
  cacheHK3Set: form => axios.post('/cache/hk3/set', form).then(res => res.data),
  // 崩坏3缓存删除
  cacheHK3Del: form => axios.post('/cache/hk3/del', form).then(res => res.data)
}

Vue.prototype.$API = API
