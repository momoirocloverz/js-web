<template>
  <div class="loginCon">
    <div class="loginPartCon">
      <div class="centerCon">
        <div class="logoCon"><span class="logoSelf">江山农业项目投资一件事</span></div>
        <div class="subTitle">手机号找回密码</div>
        <el-form ref="forgetForm" class="forgetForm" :model="forgetForm" :rules="rules" label-position="left">
          <el-form-item label="手机号" prop="mobile" :class="[phoneError ? 'is-error' : '']">
            <el-input v-model="forgetForm.mobile" maxlength="11" placeholder="请输入手机号" autocomplete="new-password"> </el-input>
            <!-- <div class="el-form-item__error" v-if="phoneError">请输入正确格式的手机号</div> -->
          </el-form-item>
          <el-form-item label="验证码" prop="verify_code">
            <div class="smsMasterCon">
              <el-input v-model="forgetForm.verify_code" maxlength="6" placeholder="请输入验证码" autocomplete="new-password"> </el-input>
              <button class="normalSms" @click="smsBtnClick" :disabled="smsCounter < 60">
                {{ smsText }}
              </button>
            </div>
          </el-form-item>
          <el-form-item label="新密码" prop="password" :class="[passwordError ? 'is-error' : '']">
            <el-input v-model="forgetForm.password" maxlength="16" type="password" placeholder="请输入新密码" show-password auto-complete="new-password"> </el-input>
            <!-- <div class="el-form-item__error" v-if="passwordError">请输入8-16位密码，至少包含字母、数字两种组合</div> -->
          </el-form-item>
          <el-form-item label="确认密码" prop="password2" :class="[password2Error ? 'is-error' : '']">
            <el-input v-model="forgetForm.password2" maxlength="16" type="password" placeholder="再次输入新密码" show-password auto-complete="new-password"> </el-input>
            <!-- <div class="el-form-item__error" v-if="password2Error">与新密码不一致</div> -->
          </el-form-item>
          <el-form-item class="btnItem">
            <el-button type="primary" @click="onSubmit()">确定</el-button>
            <el-button @click="$router.back()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'empty',
  head() {
    console.log('head')
    return {
      title: '忘记密码',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'My custom description'
        }
      ]
    }
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'))
      } else if (value !== this.forgetForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      forgetForm: {
        mobile: '',
        verify_code: '',
        password: '',
        password2: ''
      },
      smsText: '获取短信验证码',
      smsCounter: 60,
      counterTimer: null,
      smsDisabled: false,
      password2Error: false,
      passwordError: false,
      phoneError: false,
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        verify_code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^.*(?=.{8,})(?=.*\d)(?=.*[A-Za-z]).*$/, message: '请输入8-16位密码，至少包含字母、数字两种组合', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },

  beforeDestroy() {
    this.counterTimer && clearInterval(this.counterTimer)
  },
  mounted() {},
  methods: {
    // 手机号登录-获取验证码
    smsBtnClick(e) {
      e.preventDefault()
      const phoneReg = /^1[3-9]\d{9}$/
      const result = phoneReg.test(this.forgetForm.mobile)
      if (result) {
        let data = {
          mobile: this.forgetForm.mobile,
          scene: 'recover_password'
        }
        this.ApiLists.sendSms(data)
          .then((res) => {
            if (res && res.code == 0) {
              this.initLoginCounterTimer()
              this.$message.success('短信发送成功')
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch((err) => {
            console.log('er', err)
          })
      } else {
        this.$message.error('请输入正确手机号')
      }
    },

    // 手机登录验证码计时器初始化
    initLoginCounterTimer() {
      this.counterTimer && clearInterval(this.counterTimer)
      this.counterTimer = setInterval(() => {
        if (this.smsCounter == 0) {
          this.smsText = '获取短信验证码'
          this.smsCounter = 60
          this.counterTimer && clearInterval(this.counterTimer)
        } else {
          this.smsCounter = --this.smsCounter
          this.smsText = `${this.smsCounter}s`
        }
      }, 1000)
    },

    onSubmit() {
      this.$refs['forgetForm'].validate((valid, object) => {
        // console.log(JSON.stringify(this.forgetForm))
        if (valid) {
          // 校验通过 开始提交
          this.ApiLists.forgetPassword({ ...this.forgetForm })
            .then((res) => {
              if (res && res.code == 0) {
                this.$message.success('修改成功')
                this.$router.replace('/login')
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch((e) => {
              console.log(e)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.smsMasterCon {
  position: relative;
}
.normalSms {
  position: absolute;
  right: 20px;
  height: 100%;
  border: none;
  background-color: transparent;
  font-size: 20px;
  color: #0270c3;
  cursor: pointer;
  &[disabled] {
    color: #dcdfe6;
    cursor: not-allowed;
  }
}
.loginCon {
  background-color: #fff;
  .loginPartCon {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    height: 100vh;
    background-image: url('https://img.hzanchu.com/acimg/25f02c2c7cd81146fadc12d11cb59375.png');
    min-height: 800px;
  }

  .logoCon {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }
  .subTitle {
    line-height: 42px;
    font-size: 24px;
    color: #333;
    font-family: 'huxiaobo';
    letter-spacing: 3px;
    text-align: center;
    margin-bottom: 15px;
  }
  .logoSelf {
    line-height: 42px;
    font-size: 42px;
    color: #333;
    font-family: 'huxiaobo';
    letter-spacing: 3px;
  }

  .centerCon {
    height: 804px;
    width: 842px;
    padding: 80px 80px 0;
    box-sizing: border-box;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    background-image: url('https://img.hzanchu.com/acimg/63078cea7b6408e1d120e52403fd57e8.png');
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
<style lang="less">
.forgetForm {
  .el-form-item {
    height: 68px;
    margin-bottom: 40px;

    .el-form-item__label {
      height: 100%;
      line-height: 68px;
      width: 120px;
    }

    .el-form-item__content {
      margin-left: 120px;
      .el-input__inner {
        height: 68px;
      }
    }

    &.btnItem {
      .el-form-item__content {
        margin-left: 0 !important;
        text-align: center;
      }

      .el-button {
        width: 120px;
        & + .el-button {
          margin-left: 50px;
        }
      }
    }
  }
}
</style>
