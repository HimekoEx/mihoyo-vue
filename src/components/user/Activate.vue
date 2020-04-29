<template>
  <div class="root">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item>卡密激活</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 选择框 -->
      <div>
        <el-select v-model="activateForm.project" placeholder="请选择项目">
          <el-option label="崩坏3" value="Honkai3RD"></el-option>
          <el-option label="明日方舟" value="Arknights"></el-option>
        </el-select>
        <el-tooltip effect="dark" content="激活" placement="top" :enterable="false">
          <el-button icon="iconfont icon-APIshuchu" type="primary" @click="activateCDK"></el-button>
        </el-tooltip>
        <el-button icon="iconfont icon-shanchusekuai" type="warning" @click="celanCDK"></el-button>
      </div>

      <!-- 卡密输入框 -->
      <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 5}"
        :maxlength="4096"
        placeholder="请输入CDK"
        show-word-limit
        v-model="activateForm.cdk"
      ></el-input>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 激活表单
      activateForm: {
        project: '',
        cdk: ''
      }
    }
  },
  methods: {
    // 激活CDK
    activateCDK() {
      if (this.$utils.isEmpty(this.activateForm.project)) return
      if (this.$utils.isEmpty(this.activateForm.cdk)) return

      this.$API
        .userActivate(this.activateForm)
        .then(res => {
          // 激活失败
          if (res.status !== 200) {
            return this.$notify.error({
              title: `激活失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          } else {
            return this.$msgbox.alert(
              '到期时间: ' + this.$utils.formatDate(res.data.expire_time),
              '激活成功',
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
    // 清空输入框
    celanCDK() {
      this.activateForm = {
        project: '',
        cdk: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  div {
    margin-bottom: 10px;
  }

  .el-tooltip {
    margin-left: 15px;
  }

  .el-select {
    width: 170px;
  }
}
</style>
