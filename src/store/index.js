import Vue from 'vue'
import Vuex from 'vuex'
import Utils from '../plugins/utils'

Vue.use(Vuex)

// 类型
const types = {
  SET_USER: 'SET_USER'
}

// 状态
const state = {
  user: {}
}

// 获取
const getters = {
  user: state => state.user
}

// 更改
const mutations = {
  [types.SET_USER](state, user) {
    if (!Utils.isEmpty(user)) {
      state.user = user
      sessionStorage.setItem('user', JSON.stringify(user))
    } else {
      state.user = {}
      sessionStorage.removeItem('user')
    }
  }
}

// 异步操作
const actions = {
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: true
})
