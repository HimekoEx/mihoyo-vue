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
        <el-table-column label="QQ号" prop="qq_number" show-overflow-tooltip></el-table-column>
        <el-table-column label="邮箱" prop="e_mail" show-overflow-tooltip></el-table-column>
        <el-table-column label="UIF生成次数" align="center" width="300" :resizable="false">
          <template slot-scope="scope">
            <el-slider
              v-model="scope.row.gen_times"
              :max="3"
              show-stops
              :show-tooltip="false"
              @change="changeTimes(scope.row)"
            ></el-slider>
          </template>
        </el-table-column>
        <el-table-column label="级别/状态" header-align="center" width="120" :resizable="false">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.power === 3" effect="dark">
              <b>{{$utils.formatPowerLevel(scope.row.power)}}</b>
            </el-tag>
            <el-tag type="warning" v-else-if="scope.row.power === 2" effect="dark">
              <b>{{$utils.formatPowerLevel(scope.row.power)}}</b>
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.power === 1" effect="dark">
              <b>{{$utils.formatPowerLevel(scope.row.power)}}</b>
            </el-tag>
            <el-tag type="info" v-else-if="scope.row.power === 0" effect="dark">
              <b>{{$utils.formatPowerLevel(scope.row.power)}}</b>
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
        <el-table-column label="操作" header-align="center" width="135" :resizable="false">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="信息"
              placement="top"
              :enterable="false"
              :disabled="scope.$index > 0"
            >
              <el-button
                icon="iconfont icon-ceshishenqing"
                type="primary"
                size="mini"
                :disabled="scope.row.od"
                @click="infoEdit(scope.row)"
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
                :disabled="scope.row.pd"
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

    <!-- 信息编辑对话框 -->
    <el-dialog
      :title="curOperUser.user_name + ' - 信息编辑'"
      :visible.sync="infoEditVisible"
      :close-on-click-modal="false"
      center
      :width="$utils.windowWidth() > 800 ? '50%' : '100%'"
      @close="closeDialog"
    >
      <el-form
        ref="infoFormRef"
        :model="infoForm"
        :rules="infoFormRules"
        label-width="auto"
        class="info_form"
      >
        <el-form-item label="ID: ">
          <el-input :value="infoForm.id" disabled></el-input>
        </el-form-item>

        <el-form-item label="用户名: " prop="user_name">
          <el-input v-model="infoForm.user_name" clearable></el-input>
        </el-form-item>

        <el-form-item label="QQ号: " prop="qq_number">
          <el-input v-model="infoForm.qq_number" clearable></el-input>
        </el-form-item>

        <el-form-item label="邮箱: " prop="e_mail">
          <el-input v-model="infoForm.e_mail" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="changeInfos">更改</el-button>
        </el-form-item>
      </el-form>
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
        <el-radio-group v-model="curOperUser.power" @change="changePower">
          <el-radio-button :label="2">超管</el-radio-button>
          <el-radio-button :label="1">管理</el-radio-button>
          <el-radio-button :label="0">用户</el-radio-button>
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
    // 验证字符串是否有特殊字符
    const checkSpecialKey = str => {
      var specialKey =
        "[+`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) !== -1) return false
      }
      return true
    }
    // 自定义表单验证函数
    const checkRules = (rule, value, callback) => {
      if (!value) return callback()
      setTimeout(() => {
        switch (rule.fullField) {
          case 'qq_number':
            const qqErr = new Error('请输入正确的QQ号')
            if (isNaN(value)) return callback(qqErr)
            if (value.length < 5 || value.length > 15) return callback(qqErr)
            return callback()
          case 'e_mail':
            const emErr = new Error('请输入正确的邮箱')
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
            if (value.length < 8 || value.length > 128) return callback(emErr)
            if (!mailReg.test(value)) return callback(emErr)
            return callback()
          default:
            const err = new Error('请不要输入奇奇怪怪的符号')
            if (!checkSpecialKey(value)) return callback(err)
            return callback()
        }
      }, 100)
    }
    return {
      // 用户列表查询表单
      usersListForm: {
        user_name: '',
        qq_number: '',
        e_mail: '',
        page_num: 1,
        page_size: 5
      },
      // 更改用户UIF生成次数表单
      changeTimesForm: {
        id: 0,
        times: 0
      },
      // 更改信息表单绑定对象
      infoForm: {
        id: 0,
        user_name: '',
        qq_number: '',
        e_mail: ''
      },
      // 表单验证规则对象
      infoFormRules: {
        user_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 32,
            message: '用户名长度在 3 到 32 个字符内',
            trigger: 'blur'
          },
          { validator: checkRules, trigger: 'blur' }
        ],
        qq_number: [{ validator: checkRules, trigger: 'blur' }],
        e_mail: [{ validator: checkRules, trigger: 'blur' }]
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
        power: 0,
        gen_times: 0,
        avatar: '',
        created_at: ''
      },
      // 控制用户信息编辑对话框的显示
      infoEditVisible: false,
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
                user.sd = user.pd = true
                user.od = false
              } else if (user.power >= me.power) {
                user.sd = user.od = user.pd = true
              } else {
                user.sd = user.od = user.pd = false
              }
            })
          }
        })
        .catch(this.$API.error)
    },
    // 更改UIF生成次数
    changeTimes(user) {
      this.changeTimesForm.id = user.id
      this.changeTimesForm.times = user.gen_times

      this.$API
        .usersChangeTimes(this.changeTimesForm)
        .then(res => {
          if (res.status !== 200) {
            return this.$notify.error({
              title: `操作失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          this.$message.success({
            message: res.msg,
            duration: 1500
          })
        })
        .catch(this.$API.error)
    },
    // 更改状态
    changeStatus(user) {
      this.$API
        .usersChangeStatus({
          id: user.id,
          status: user.status
        })
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
    // 更改信息
    changeInfos(user) {
      this.$refs.infoFormRef.validate(valid => {
        if (!valid) return

        this.$API
          .usersChangeInfos(this.infoForm)
          .then(res => {
            if (res.status !== 200) {
              return this.$notify.error({
                title: `操作失败(${res.status})`,
                message: `错误信息: ${res.msg}`,
                duration: 2000
              })
            }

            this.listUsers()
            this.$message.success({
              message: res.msg,
              duration: 1500
            })
          })
          .catch(this.$API.error)
      })
    },
    // 更改用户权限
    changePower() {
      this.$API
        .usersChangePower({
          id: this.curOperUser.id,
          power: this.curOperUser.power
        })
        .then(res => {
          if (res.status !== 200) {
            this.listUsers()
            this.powerEditVisible = false
            return this.$notify.error({
              title: `操作失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          this.$message.success({
            message: res.msg,
            duration: 1500
          })
        })
        .catch(this.$API.error)
    },
    // 信息编辑按钮事件
    infoEdit(user) {
      this.curOperUser = user

      this.infoForm = {
        id: user.id,
        user_name: user.user_name,
        qq_number: user.qq_number,
        e_mail: user.e_mail
      }

      this.infoEditVisible = true
    },
    // 权限编辑按钮事件
    powerEdit(user) {
      this.curOperUser = user
      this.powerEditVisible = true
    },
    // 搜索框清空事件
    inputClear() {
      this.listUsers()
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
    // 关闭弹窗时清空缓存
    closeDialog() {
      this.curOperUser = {
        id: 0,
        user_name: '',
        qq_number: '',
        e_mail: '',
        status: false,
        power: 0,
        gen_times: 0,
        avatar: '',
        created_at: ''
      }
      this.infoForm = { id: 0, user_name: '', qq_number: '', e_mail: '' }
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

.el-switch {
  margin-left: 10px;
}

.el-slider {
  margin-left: 5px;
  margin-right: 5px;
}

.power {
  text-align: center;
}
</style>
