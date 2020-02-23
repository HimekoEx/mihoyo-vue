<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <!-- 菜单主体 -->
    <el-menu
      background-color="#333"
      text-color="#fff"
      active-text-color="#f8f"
      unique-opened
      router
      :collapse-transition="false"
      :collapse="isCollapse"
      :default-active="$route.path"
    >
      <!-- 一级菜单 -->
      <el-submenu v-for="item in items" :index="item.path" :key="item.path">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.name}}</span>
        </template>

        <!-- 二级菜单 -->
        <el-menu-item v-for="subItem in item.children" :index="subItem.path" :key="subItem.path">
          <template slot="title">
            <i :class="subItem.icon"></i>
            <span>{{subItem.name}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'left-menu',
  created() {
    this.getLiftMenu()

    // 加载侧栏折叠
    if (document.body.clientWidth <= 900) this.isCollapse = true
    else if (localStorage.lm_is === 'true') this.isCollapse = true
  },
  data() {
    return {
      // 是否折叠
      isCollapse: false,
      items: []
    }
  },
  methods: {
    // 获取侧栏数据
    getLiftMenu() {
      this.$API
        .leftMenu()
        .then(res => {
          if (res.status !== 200 || res.data === null) {
            return this.$notify.error({
              title: `获取失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          this.items = JSON.parse(res.data)
        })
        .catch(this.$API.error)
    },
    // 设置侧栏折叠
    toggleCollapse() {
      this.isCollapse = localStorage.lm_is = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-aside {
  height: 100%;
}

.el-menu {
  border-right: none;
  height: calc(100% - 22px);
}

.iconfont {
  margin-left: 2px;
  margin-right: 8px;
}

.toggle-button {
  background-color: #555;
  font-size: 10px;
  line-height: 22px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
