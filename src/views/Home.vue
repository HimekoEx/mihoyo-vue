<template>
  <el-container class="home-container">
    <!-- 顶部导航栏 -->
    <el-header height="50px">
      <HeadNav />
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <LeftMenu />

      <!-- 内容主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HeadNav from '../components/HeadNav'
import LeftMenu from '../components/LeftMenu'
export default {
  components: {
    HeadNav,
    LeftMenu
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  padding: 0;
}
</style>
