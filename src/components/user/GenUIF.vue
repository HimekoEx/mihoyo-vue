<template>
  <div class="root">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item>生成UIF</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 按钮 -->
      <el-button type="danger" @click="genUIF">生成UIF</el-button>
      <el-button
        type="info"
        v-clipboard:copy="uif"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
      >复制UIF</el-button>

      <!-- UIF文本框 -->
      <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 5}"
        :value="uif"
        :maxlength="4096"
        show-word-limit
      ></el-input>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户UIF
      uif: ''
    }
  },
  methods: {
    // 生成UIF
    genUIF() {
      if (!this.$utils.isEmpty(this.uif)) return

      this.$API
        .userGenUIF()
        .then(res => {
          // 获取失败
          if (res.status !== 200) {
            return this.$notify.error({
              title: `获取失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          } else {
            this.uif = res.data
            return this.$msgbox.alert(
              '生成次数有限! UIF请妥善保管!',
              '生成成功',
              {
                type: 'success',
                confirmButtonText: '确定',
                center: true,
                showClose: false
              }
            )
          }
        })
        .catch(this.$API.error)
    },
    // 复制成功事件
    onCopy() {
      this.$message.success({
        message: '复制成功',
        duration: 1000
      })
    },
    // 复制失败事件
    onError() {
      this.$message.success({
        message: '复制失败',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 10px;
}
</style>
