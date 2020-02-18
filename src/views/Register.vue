<template>
  <div class="register_container">
    <span class="title">超限工坊管理系统</span>
    <div class="register_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerFormRules"
        label-width="auto"
        class="register_form"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名: " prop="user_name">
          <el-input placeholder="请输入用户名" v-model="registerForm.user_name"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码: " prop="password">
          <el-input placeholder="请输入密码" v-model="registerForm.password"></el-input>
        </el-form-item>

        <!-- QQ号 -->
        <el-form-item label="QQ号: " prop="qq_number">
          <el-input placeholder="请输入QQ" v-model="registerForm.qq_number"></el-input>
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱: " prop="e_mail">
          <el-input placeholder="请输入邮箱" v-model="registerForm.e_mail"></el-input>
        </el-form-item>

        <el-form-item>
          <!-- 登录按钮区域 -->
          <div class="login_btns">
            <el-button type="success" @click="toLogin">前往登录</el-button>
          </div>

          <!-- 注册按钮区域 -->
          <div class="register_btns">
            <el-button type="info" @click="toClean">清空</el-button>
            <el-button type="primary" @click="toRegister">注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
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
      // 登录表单绑定对象
      registerForm: {
        user_name: '',
        password: '',
        qq_number: '',
        e_mail: ''
      },
      // 表单验证规则对象
      registerFormRules: {
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
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 35,
            message: '密码长度在 6 到 35 个字符内',
            trigger: 'blur'
          },
          { validator: checkRules, trigger: 'blur' }
        ],
        qq_number: [{ validator: checkRules, trigger: 'blur' }],
        e_mail: [{ validator: checkRules, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 前往登录
    toLogin() {
      this.$router.push('/login')
    },
    // 重置表单
    toClean() {
      this.$refs.registerFormRef.resetFields()
    },
    // 注册用户
    toRegister() {
      this.$refs.registerFormRef.validate(valid => {
        if (!valid) return

        this.$API
          .userRegister(this.registerForm)
          .then(res => {
            // 注册失败
            if (res.status !== 200) {
              return this.$notify.error({
                title: `注册失败(${res.status})`,
                message: `错误信息: ${res.msg}`,
                duration: 2000
              })
            }

            // 注册成功
            this.$notify.success({
              title: '注册成功',
              message: `用户名: ${res.data.user_name} 用户ID: ${res.data.id}`,
              duration: 2000
            })

            // 跳转登录页面
            this.$router.push('/login')
          })
          .catch(this.$API.error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.register_container {
  background-color: #2b2b2b;
  height: 100%;
}

.title {
  position: absolute;
  left: 50%;
  top: 10%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}

.register_box {
  width: 450px;
  height: 400px;
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

.register_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px 0 10px;
  box-sizing: border-box;
}

.login_btns {
  transform: translate(-30%);
  float: left;
}

.register_btns {
  float: right;
}
</style>
