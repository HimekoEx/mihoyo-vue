<template>
  <div class="login_container">
    <span class="title">超限工坊管理系统</span>
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="user_name">
          <el-input
            placeholder="请输入用户名"
            v-model="loginForm.user_name"
            prefix-icon="iconfont icon-user-fill"
            @keyup.enter.native="toLogin"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-lock"
            show-password
            @keyup.enter.native="toLogin"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="success" @click="toLogin">登录</el-button>
          <el-button type="warning" @click="toRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    var _this = this
    document.onkeydown = function (e) {
      let key = window.event.keyCode
      if (key === 13) {
        _this.keyUpEnter()
      }
    }
  },
  data() {
    return {
      // 登录表单绑定对象
      loginForm: {
        user_name: 'Himeko',
        password: '123456'
      },
      // 表单验证规则对象
      loginFormRules: {
        // 用户名验证规则
        user_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 32,
            message: '用户名长度在 3 到 32 个字符内',
            trigger: 'blur'
          }
        ],
        // 密码验证规则
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 35,
            message: '密码长度在 6 到 35 个字符内',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 登录
    keyUpEnter() {
      this.toLogin()
    },
    toLogin() {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return

        this.$API
          .userLogin(this.loginForm)
          .then((res) => {
            // 登录失败
            if (res.status !== 200) {
              return this.$notify.error({
                title: `登录失败(${res.status})`,
                message: `错误信息: ${res.msg}`,
                duration: 2000
              })
            }

            // 登录成功
            this.$message.success({
              message: '登录成功',
              duration: 1500
            })

            // 保存状态
            this.$store.dispatch('setUser', res.data)

            // 跳转主页
            this.$router.push('/home')
          })
          .catch(this.$API.error)
      })
    },
    // 跳转注册页面
    toRegister() {
      this.$router.push('/register')
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b2b2b;
  height: 100%;
}

.title {
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -50%);

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
