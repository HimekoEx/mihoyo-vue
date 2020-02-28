<template>
  <div class="root">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营中心</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索栏区 -->
      <div class="query">
        <el-input
          placeholder="请输入内容"
          v-model="usersListForm.user_name"
          clearable
          @clear="inputClear"
        >
          <template slot="prepend">
            <b>用户名</b>
          </template>
        </el-input>

        <el-input
          placeholder="请输入内容"
          v-model="usersListForm.qq_number"
          clearable
          @clear="inputClear"
        >
          <template slot="prepend">
            <b>QQ</b>
          </template>
        </el-input>

        <el-input placeholder="请输入内容" v-model="usersListForm.e_mail" clearable @clear="inputClear">
          <template slot="prepend">
            <b>邮箱</b>
          </template>
        </el-input>
        <el-button icon="el-icon-search" type="primary" @click="listUsers"></el-button>
      </div>

      <!-- 列表区 -->
      <el-table :data="users" stripe border>
        <el-table-column label="ID" prop="id" width="45" :resizable="false"></el-table-column>
        <el-table-column
          label="创建日期"
          prop="created_at"
          width="160"
          :resizable="false"
          header-align="center"
        ></el-table-column>
        <el-table-column label="用户名" prop="user_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="QQ号" width="150" prop="qq_number" show-overflow-tooltip></el-table-column>
        <el-table-column label="邮箱" width="250" prop="e_mail" show-overflow-tooltip></el-table-column>
        <el-table-column label="级别/状态" header-align="center" width="130" :resizable="false">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.level >= 300" effect="dark">
              <b>{{$utils.formatUserLevel(scope.row.level)}}</b>
            </el-tag>
            <el-tag type="warning" v-else-if="scope.row.level >= 100" effect="dark">
              <b>{{$utils.formatUserLevel(scope.row.level)}}</b>
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.level >= 20" effect="dark">
              <b>{{$utils.formatUserLevel(scope.row.level)}}</b>
            </el-tag>
            <el-tag v-else-if="scope.row.level >= 10" effect="dark">
              <b>{{$utils.formatUserLevel(scope.row.level)}}</b>
            </el-tag>
            <el-tag type="info" v-else-if="scope.row.level < 10" effect="dark">
              <b>{{$utils.formatUserLevel(scope.row.level)}}</b>
            </el-tag>

            <el-switch
              v-model="scope.row.status"
              active-color="#2D5"
              inactive-color="#d21"
              @change="changeStatus(scope.row)"
              :disabled="scope.row.sd"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="195" :resizable="false">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="属性"
              placement="top"
              :enterable="false"
              :disabled="scope.$index > 0"
            >
              <el-button
                icon="iconfont icon-ceshishenqing"
                type="primary"
                size="mini"
                :disabled="scope.row.od"
                @click="attrEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="时效"
              placement="top"
              :enterable="false"
              :disabled="scope.$index > 0"
            >
              <el-button
                icon="iconfont icon-icon_renwujincheng"
                type="warning"
                size="mini"
                :disabled="scope.row.od"
                @click="timeEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="权限"
              placement="top"
              :enterable="false"
              :disabled="scope.$index > 0"
            >
              <el-button
                icon="iconfont icon-tianshenpi"
                type="danger"
                size="mini"
                :disabled="scope.row.sd"
                @click="powerEdit(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersListForm.page_num"
        :page-sizes="[5, 8, 15, 20, 50, 100]"
        :page-size="usersListForm.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 属性编辑对话框 -->
    <el-dialog
      :title="curOperUser.user_name + ' - 属性编辑'"
      :visible.sync="attrEditVisible"
      center
      class="atteEdit"
      :width="$utils.windowWidth() > 800 ? '50%' : '100%'"
      @close="closeDialog"
    >
      <!-- 内容主体区 -->
      <div class="uuid">
        <span>
          <b>UUID:</b>
        </span>
        <el-input :value="curOperUser.uuid"></el-input>
        <el-button icon="iconfont icon-delete-fill" type="danger" size="small" @click="cleanUUID"></el-button>
      </div>

      <div>
        <span>
          <b>UIF可用生成次数:</b>
        </span>
        <el-slider
          v-model="curOperUser.gen_times"
          :max="3"
          show-stops
          :show-tooltip="false"
          @change="changeTimes"
        ></el-slider>
      </div>
    </el-dialog>

    <!-- 时效编辑对话框 -->
    <el-dialog
      :title="curOperUser.user_name + ' - 时效编辑'"
      :visible.sync="timeEditVisible"
      center
      :width="$utils.windowWidth() > 800 ? '50%' : '100%'"
      @close="closeDialog"
    >
      <el-select
        v-model="changeTimeForm.project_name"
        placeholder="请选择项目"
        @change="selectChange"
        clearable
        @clear="selectClean"
      >
        <el-option label="崩坏3" value="Honkai3RD"></el-option>
        <el-option label="明日方舟" value="aks" disabled></el-option>
      </el-select>
      <el-date-picker v-model="date" type="datetime" placeholder="选择日期时间"></el-date-picker>
      <el-tooltip effect="dark" content="更改" placement="top" :enterable="false">
        <el-button icon="iconfont icon-fabu" type="success" @click="changeTime"></el-button>
      </el-tooltip>
    </el-dialog>

    <!-- 权限编辑对话框 -->
    <el-dialog
      :title="curOperUser.user_name + ' - 权限编辑'"
      :visible.sync="powerEditVisible"
      center
      :width="$utils.windowWidth() > 800 ? '50%' : '100%'"
      @close="closeDialog"
    >
      <div class="power">
        <el-radio-group v-model="curOperUser.level" @change="changeLevel">
          <el-radio-button :label="200">超管理</el-radio-button>
          <el-radio-button :label="100">管理员</el-radio-button>
          <el-radio-button :label="0">白嫖党</el-radio-button>
        </el-radio-group>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    if (!this.$utils.isEmpty(localStorage.ul_ps)) {
      this.usersListForm.page_size = parseInt(localStorage.ul_ps)
    }
    this.listUsers()
  },
  data() {
    return {
      // 用户列表查询表单
      usersListForm: {
        user_name: '',
        qq_number: '',
        e_mail: '',
        page_num: 1,
        page_size: 5
      },
      // 更改用户状态表单
      changeStatusForm: {
        id: 0,
        status: false
      },
      // 更改用户UIF生成次数表单
      changeTimesForm: {
        id: 0,
        times: 0
      },
      // 更改用户子项目时效表单
      changeTimeForm: {
        id: 0,
        project_name: '',
        time: 0
      },
      // 更改用户权限表单
      changeLevelForm: {
        id: 0,
        level: 0
      },
      // 查询总数
      total: 0,
      // 用户列表
      users: [],
      // 当前操作用户详细数据
      curOperUser: {
        id: 0,
        user_name: '',
        qq_number: '',
        e_mail: '',
        status: false,
        level: 0,
        avatar: '',
        created_at: '',
        gen_times: 0,
        uuid: ''
      },
      // 时间选择器数据绑定
      date: null,
      // 控制用户属性编辑对话框的显示
      attrEditVisible: false,
      // 控制用户时效编辑对话框的显示
      timeEditVisible: false,
      // 控制用户权限编辑对话框的显示
      powerEditVisible: false
    }
  },
  methods: {
    // 获取用户列表
    listUsers() {
      this.$API
        .usersList(this.usersListForm)
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

          // 保存数据
          this.total = res.data.total
          this.users = res.data.items

          // 判断是否需要渲染操作控件
          let me = this.$store.state.user
          if (this.users != null) {
            this.users.forEach(user => {
              if (user.id === me.id) {
                user.sd = true
                user.od = false
              } else if (user.level >= me.level) {
                user.sd = true
                user.od = true
              } else {
                user.sd = false
                user.od = false
              }
            })
          }
        })
        .catch(this.$API.error)
    },
    // 搜索框清空事件
    inputClear() {
      this.listUsers()
    },
    // 监听状态更改
    changeStatus(user) {
      this.changeStatusForm.id = user.id
      this.changeStatusForm.status = user.status

      this.$API
        .usersChangeStatus(this.changeStatusForm)
        .then(res => {
          // 操作失败
          if (res.status !== 200) {
            user.status = !user.status
            return this.$notify.error({
              title: `操作失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          // 成功更改
          this.$message.success({
            message: res.msg,
            duration: 1500
          })
        })
        .catch(this.$API.error)
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.usersListForm.page_size = localStorage.ul_ps = newSize
      this.listUsers()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.usersListForm.page_num = newPage
      this.listUsers()
    },
    // 属性编辑按钮事件
    attrEdit(user) {
      this.$API
        .usersInfoEx(user.id)
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

          // 保存数据
          this.curOperUser = res.data
          this.attrEditVisible = true
        })
        .catch(this.$API.error)
    },
    // 清空UUID
    cleanUUID() {
      if (this.$utils.isEmpty(this.curOperUser.uuid)) return

      this.$msgbox
        .confirm(`清除 ${this.curOperUser.user_name} 的UUID`, '红豆泥?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
        .then(() => {
          this.$API
            .usersCleanUUID(this.curOperUser.id)
            .then(res => {
              // 清除失败
              if (res.status !== 200) {
                return this.$notify.error({
                  title: `操作失败(${res.status})`,
                  message: `错误信息: ${res.msg}`,
                  duration: 2000,
                  offset: 40
                })
              }
              // 成功更改
              this.$message.success({
                message: '清除成功',
                duration: 1500
              })
              // 保存数据
              this.curOperUser = res.data
            })
            .catch(this.$API.error)
        })
        .catch(() => {})
    },
    // 改变UIF生成次数
    changeTimes(newTimes) {
      this.changeTimesForm.id = this.curOperUser.id
      this.changeTimesForm.times = newTimes

      this.$API
        .usersChangeTimes(this.changeTimesForm)
        .then(res => {
          // 操作失败
          if (res.status !== 200) {
            return this.$notify.error({
              title: `操作失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          // 成功更改
          this.$message.success({
            message: res.msg,
            duration: 1500
          })
        })
        .catch(this.$API.error)
    },
    // 时效编辑按钮事件
    timeEdit(user) {
      this.curOperUser = user
      this.timeEditVisible = true
    },
    // 更爱时效
    changeTime() {
      if (this.$utils.isEmpty(this.changeTimeForm.project_name)) return
      if (this.changeTimeForm.id === 0) return
      this.changeTimeForm.time = Date.parse(this.date) / 1000

      this.$API
        .usersChangeTime(this.changeTimeForm)
        .then(res => {
          // 操作失败
          if (res.status !== 200) {
            this.date = null
            return this.$notify.error({
              title: `操作失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          this.date = new Date(res.data.expire_time * 1000)
          this.$message.success({
            message: res.msg,
            duration: 1500
          })
        })
        .catch(this.$API.error)
    },
    // 选择框更改事件
    selectChange() {
      if (this.$utils.isEmpty(this.changeTimeForm.project_name)) return
      this.changeTimeForm.id = this.curOperUser.id

      this.$API
        .usersCardInfo(this.changeTimeForm)
        .then(res => {
          // 操作失败
          if (res.status !== 200) {
            return this.$notify.error({
              title: `操作失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          this.date = new Date(res.data.expire_time * 1000)
        })
        .catch(this.$API.error)
    },
    // 选择框内容清空
    selectClean() {
      this.date = null
    },
    // 权限编辑按钮事件
    powerEdit(user) {
      this.curOperUser = user
      this.powerEditVisible = true
    },
    // 更改用户权限
    changeLevel() {
      this.changeLevelForm.id = this.curOperUser.id
      this.changeLevelForm.level = this.curOperUser.level

      this.$API
        .usersChangelevel(this.changeLevelForm)
        .then(res => {
          this.listUsers()

          // 操作失败
          if (res.status !== 200) {
            return this.$notify.error({
              title: `操作失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          // 刷新用户
          this.curOperUser = res.data
          this.$message.success({
            message: res.msg,
            duration: 1500
          })
        })
        .catch(this.$API.error)
    },
    // 关闭弹窗时清空缓存
    closeDialog() {
      this.curOperUser = {
        id: 0,
        user_name: '',
        qq_number: '',
        e_mail: '',
        status: false,
        level: 0,
        avatar: '',
        created_at: '',
        gen_times: 0,
        uuid: ''
      }
      this.changeTimeForm = {
        id: 0,
        project_name: '',
        time: 0
      }
      this.date = null
    }
  }
}
</script>

<style lang="less" scoped>
.query {
  .el-input {
    width: 270px;
    margin-right: 10px;
  }
}

.el-input {
  width: 300px;
  margin-right: 15px;
}

.el-switch {
  margin-left: 10px;
}

.atteEdit {
  div {
    display: flex; /*Flex布局*/
    display: -webkit-flex; /* Safari */
    align-items: center; /*指定垂直居中*/
  }

  .uuid {
    margin-top: 15px;
    margin-bottom: 25px;
  }

  span {
    font-size: 18px;
    margin-right: 15px;
  }

  .el-input {
    width: 200px;
    font-size: 18px;
    margin-right: 15px;
  }

  .el-slider {
    width: 300px;
    margin-left: 10px;
  }
}

.el-date-editor {
  margin-left: 15px;
}

.power {
  text-align: center;
}
</style>
