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

      <!-- 说明文本 -->
      <div class="text">
        <h2>UIF说明:</h2>
        <h4>
          1. 新账号初始有
          <span>3次</span>
          生成次数,
          请
          <span>妥善保存</span>
          生成的UIF
        </h4>
        <h4>
          2. 除非进行
          <span>改用户名</span>,
          <span>改密码</span>,
          <span>改QQ</span>,
          <span>改邮箱</span>
          的操作, 否则生成的UIF
          <span>一直可用</span>
        </h4>
        <h4>
          3. UIF是识别身份的令牌, 用于客户端登录连接到服务器(无需密码), 所以请
          <span>不要泄露UIF</span>
          给TA人
        </h4>
      </div>
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
          }

          this.uif = res.data
          return this.$msgbox.alert('生成次数有限! 请妥善保管!', '获取成功', {
            type: 'success',
            confirmButtonText: '确定',
            center: true,
            showClose: false
          })
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

.text {
  margin-top: 15px;

  h2 {
    margin-bottom: 15px;
  }

  h4 {
    margin-bottom: 10px;
    span {
      margin-left: 5px;
      margin-right: 5px;
      font-size: 20px;
      font-weight: bolder;
      color: #f00;
    }
  }
}
</style>
