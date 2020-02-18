<template>
  <header class="head-nav">
    <div @click="toHome" class="logo">
      <img src="../assets/faji.png" />
      <span>超限工坊后台管理</span>
    </div>

    <div class="user">
      <img src="../assets/default_avatar.png" class="avatar" @click="toUserInfo" />
      <el-button type="danger" @click="toLogout">退出登录</el-button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'head-nav',
  methods: {
    // 去首页
    toHome() {
      // 跳转首页
      if (this.$router.currentRoute.path === '/home') return
      this.$router.push('/home')
    },
    // 退出登录
    toLogout() {
      this.$API
        .userLogout()
        .then(res => {
          // 清空Vuex
          this.$store.dispatch('setUser', null)
          // 跳转登录页
          this.$router.push('/login')
        })
        .catch(this.$API.error)
    },
    // 去用户信息页
    toUserInfo() {
      this.$router.push('/user_info')
    }
  }
}
</script>

<style lang="less" scoped>
.head-nav {
  background: #333;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  align-items: center;
  color: #fff;

  .logo {
    display: flex;
    align-items: center;
    cursor: pointer;

    > img {
      margin-left: 10px;
    }

    > span {
      font-size: 20px;
      margin-left: 15px;
    }
  }

  .user {
    display: flex;
    align-items: center;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      vertical-align: middle;
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
    }

    .el-button {
      margin-right: 5px;
    }
  }
}
</style>
