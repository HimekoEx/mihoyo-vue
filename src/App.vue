<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (!this.$utils.isEmpty(sessionStorage.user)) {
      this.$store.dispatch('setUser', JSON.parse(sessionStorage.user))
    }

    // 获取屏幕宽度
    this.$utils.windowWidth = () => document.body.clientWidth
  }
}
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
