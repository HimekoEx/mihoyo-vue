<template>
  <div class="root">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-tabs type="border-card" @tab-click="tabClick">
      <el-tab-pane label="基础信息" class="info">
        <!-- 头像区 -->
        <div class="user-avatar">
          <img src="../../assets/default_avatar.png" class="avatar" alt="ko no 头像 da" />
        </div>

        <!-- 信息主体区 -->
        <el-row type="flex" justify="center" v-for="item in userItems" :key="item.name">
          <el-col :xs="0" :sm="5" :lg="6"></el-col>
          <el-col :xs="8" :sm="4" class="key">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </el-col>
          <el-col :xs="12" :sm="8" class="value">
            <span v-if="item.field != 'level'">{{userInfo[item.field]}}</span>
            <template v-else>
              <el-tag type="danger" v-if="userInfo.level >= 300" effect="dark">
                <b>{{$utils.formatUserLevel(userInfo.level)}}</b>
              </el-tag>
              <el-tag type="warning" v-else-if="userInfo.level >= 100" effect="dark" size="small">
                <b>{{$utils.formatUserLevel(userInfo.level)}}</b>
              </el-tag>
              <el-tag type="success" v-else-if="userInfo.level >= 20" effect="dark" size="small">
                <b>{{$utils.formatUserLevel(userInfo.level)}}</b>
              </el-tag>
              <el-tag v-else-if="userInfo.level >= 10" effect="dark" size="small">
                <b>{{$utils.formatUserLevel(userInfo.level)}}</b>
              </el-tag>
              <el-tag type="info" v-else-if="userInfo.level < 10" effect="dark" size="small">
                <b>{{$utils.formatUserLevel(userInfo.level)}}</b>
              </el-tag>
            </template>
          </el-col>
          <el-col :xs="2" :sm="0"></el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="卡密信息" class="card">
        <!-- 选择框 -->
        <div>
          <el-select
            v-model="cardInfoFirm.project_name"
            placeholder="请选择项目"
            @change="selectChange"
            clearable
            @clear="selectClean"
          >
            <el-option label="崩坏3" value="Honkai3RD"></el-option>
            <el-option label="明日方舟" value="aks" disabled></el-option>
          </el-select>
          <el-button icon="el-icon-refresh" type="primary" @click="getCardInfo"></el-button>
        </div>

        <!-- 卡密信息 -->
        <el-row>
          <el-col :xs="8" :sm="5" :md="4" :xl="2">
            <i class="iconfont icon-clock"></i>
            <span>到期时间:</span>
          </el-col>
          <el-col :span="8" class="card-info">{{$utils.formatDate(cardInfo.expire_time)}}</el-col>
        </el-row>

        <div class="title">
          <i class="iconfont icon-gongdan"></i>
          <span>当前卡密:</span>
        </div>

        <el-input
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 5}"
          :maxlength="4096"
          show-word-limit
          :value="this.$utils.isEmpty(cardInfo.current_card) ? 'null' : cardInfo.current_card"
        ></el-input>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  created() {
    this.$API
      .userInfo()
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

        // 保存状态
        this.$store.dispatch('setUser', res.data)
        this.userInfo = res.data
      })
      .catch(this.$API.error)
  },
  data() {
    return {
      // 当前用户信息
      userInfo: {
        id: 0,
        user_name: '',
        qq_number: '',
        e_mail: '',
        status: false,
        level: 0,
        gen_times: 0,
        avatar: '',
        created_at: 0
      },
      // 查询表单
      cardInfoFirm: {
        project_name: ''
      },
      // 用户卡密信息
      cardInfo: {
        user_name: '',
        expire_time: 0,
        current_card: 'null',
        cards_record: []
      },
      userItems: [
        { name: 'ID:', icon: 'iconfont icon-anquan', field: 'id' },
        {
          name: '用户名:',
          icon: 'iconfont icon-icon_zhanghao',
          field: 'user_name'
        },
        { name: 'QQ:', icon: 'iconfont icon-share', field: 'qq_number' },
        { name: '邮箱:', icon: 'iconfont icon-application', field: 'e_mail' },
        { name: '级别:', icon: 'iconfont icon-guanfangbanben', field: 'level' },
        {
          name: '创建日期:',
          icon: 'iconfont icon-renwujincheng',
          field: 'created_at'
        }
      ]
    }
  },
  methods: {
    // 获取用户卡密信息
    getCardInfo() {
      if (this.$utils.isEmpty(this.cardInfoFirm.project_name)) return

      this.$API
        .userCardInfo(this.cardInfoFirm)
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

          // 保存卡密信息
          this.cardInfo = res.data
        })
        .catch(this.$API.error)
    },
    // 选择框改变事件
    selectChange() {
      this.getCardInfo()
    },
    // 选择框清空事件
    selectClean() {
      this.cardInfoFirm.project_name = ''
      this.cardInfo = {
        user_name: '',
        expire_time: 0,
        current_card: 'null',
        cards_record: []
      }
    },
    // 标签改变事件
    tabClick(obj) {
      if (obj.label === '基础信息') this.selectClean()
    }
  }
}
</script>

<style lang="less" scoped>
.user-avatar {
  text-align: center;
  position: relative;

  .avatar {
    width: 150px;
    border-radius: 50%;
    margin-bottom: 20px;
  }
}

.info {
  .el-row {
    line-height: 35px;
    margin: 0 auto;

    .key {
      font-size: 18px;
      font-weight: bold;

      span {
        margin-left: 2px;
      }
    }

    .value {
      font-size: 18px;
      font-weight: bold;
      color: #f08;
    }
  }
}

.card {
  font-size: 18px;
  font-weight: bold;

  .el-select {
    width: 170px;
    margin-right: 15px;
  }

  .card-info {
    color: #f08;
  }

  .el-row,
  .title {
    margin-top: 10px;
    margin-bottom: 10px;

    span {
      margin-left: 2px;
      margin-right: 5px;
    }
  }
}
</style>
