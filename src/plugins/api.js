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
axios.interceptors.response.use(response => {
  stopLoading()
  return response
}, error => {
  stopLoading()
  return Promise.reject(error)
})

// 设置基础api接口url
axios.defaults.baseURL = 'http://127.0.0.1:7000/api/v1/'
// 设置自动保存cookies
axios.defaults.withCredentials = true

// 导出的API集
const API = {
  // 错误弹窗
  error: error => Vue.prototype.$notify.error({ title: '发送异常', message: error, duration: 0 }),

  // 用户注册
  userRegister: form => axios.post('/register', form).then(res => res.data),
  // 用户登录
  userLogin: form => axios.post('/login', form).then(res => res.data),
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
  // 获取侧栏数据
  leftMenu: () => axios.post('/user/menu').then(res => res.data),

  // 用户列表查询
  usersList: form => axios.post('/users/list', form).then(res => res.data),
  // 更改用户生成UIF次数
  usersChangeTimes: form => axios.post('/users/times', form).then(res => res.data),
  // 更改用户状态
  usersChangeStatus: form => axios.post('/users/status', form).then(res => res.data),
  // 更改用户信息
  usersChangeInfos: form => axios.post('/users/infos', form).then(res => res.data),
  // 更改用户权限
  usersChangePower: form => axios.post('/users/power', form).then(res => res.data),

  // 查看用户卡密信息
  usersCardsInfo: form => axios.post('/users/cards', form).then(res => res.data),
  // 更改用户卡密时效
  usersChangeTime: form => axios.post('/users/time', form).then(res => res.data),
  // 清除用户UID
  usersCleanUID: form => axios.post('/users/clean', form).then(res => res.data),
  // 更改用户卡密级别
  usersChangeLevel: form => axios.post('/users/level', form).then(res => res.data),

  // 卡密列表查询
  cardsList: form => axios.post('/cards/list', form).then(res => res.data),
  // 更改卡密状态
  cardsChangeStatus: form => axios.post('/cards/status', form).then(res => res.data),
  // 创建卡密
  cardsCreate: form => axios.post('/cards/create', form).then(res => res.data),

  // 基础 缓存列表
  cacheBaselist: form => axios.post('/cache/base/list', form).then(res => res.data),
  // 基础 缓存设置
  cacheBaseSet: form => axios.post('/cache/base/set', form).then(res => res.data),
  // 基础 缓存删除
  cacheBaseDel: form => axios.post('/cache/base/del', form).then(res => res.data),

  // 第三方项目 缓存列表
  cacheOtherlist: form => axios.post('/cache/other/list', form).then(res => res.data),
  // 第三方项目 缓存设置
  cacheOtherSet: form => axios.post('/cache/other/set', form).then(res => res.data),
  // 第三方项目 缓存删除
  cacheOtherDel: form => axios.post('/cache/other/del', form).then(res => res.data)
}

Vue.prototype.$API = API
