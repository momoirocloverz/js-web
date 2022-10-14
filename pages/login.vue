<template>
  <div class="loginCon">
    <div class="loginPartCon" v-show="showLogin">
      <div class="centerCon">
        <div class="logoCon"><span class="logoSelf">江山农业项目投资一件事</span></div>
        <div class="firstTitle">
          <span class="firstTitleStyle" :class="[activeType == 1 ? 'firstTitleActive' : '']" @click="activeAction(1)">手机号登录</span>
          <span class="firstTitleStyle ml20" :class="[activeType == 2 ? 'firstTitleActive' : '']" @click="activeAction(2)">账号登录</span>
        </div>
        <el-form ref="loginForm" :model="loginForm" label-width="0" :rules="loginRuleWay1" v-if="activeType == 1">
          <el-form-item label="" prop="mobile" class="firstUserName">
            <el-input v-model.trim="loginForm.mobile" maxlength="20" placeholder="请输入手机号" clearable>
              <img class="firstLineImg" slot="prefix" src="https://img.hzanchu.com/acimg/ac32e8d9571ee029fbe6faa4076de989.png" />
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="verify_code" class="sms-form-item">
            <el-input v-model.trim="loginForm.verify_code" maxlength="15" placeholder="请输入验证码">
              <div class="smsBtn" slot="append">
                <el-button type="text" :disabled="loginSmsCounter < 60" @click.stop="smsBtnClick">{{ loginSmsText }}</el-button>
              </div>
              <img class="firstLineImg" slot="prefix" src="https://img.hzanchu.com/acimg/63e98d65dc30255be5af4c4d633afd87.png" />
            </el-input>
          </el-form-item>
        </el-form>
        <el-form ref="loginForm" :model="loginForm" label-width="0" :rules="loginRuleWay2" v-if="activeType == 2">
          <el-form-item label="" prop="userName" class="firstUserName">
            <el-input v-model.trim="loginForm.userName" maxlength="20" placeholder="请输入用户名" clearable>
              <img class="firstLineImg" slot="prefix" src="https://img.hzanchu.com/acimg/d905d1cc8807f5efa0646829752ccdbd.png" />
            </el-input>
            <!-- <div class="el-form-item__error" v-if="firstCusError">自定义</div> -->
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model.trim="loginForm.password" maxlength="15" type="password" placeholder="请输入密码" show-password>
              <img class="firstLineImg" slot="prefix" src="https://img.hzanchu.com/acimg/63e98d65dc30255be5af4c4d633afd87.png" />
            </el-input>
          </el-form-item>
        </el-form>
        <div class="forgetPwd" @click="jump2Forget" v-if="activeType == 2">忘记密码</div>
        <div class="registerBridgeCon">没有账号？<span class="registerTrigger" @click="toRegister">立即注册</span></div>
      </div>
      <div class="firstBottomCon">
        <div class="loginBtnOuter">
          <el-button type="primary" class="firstLoginBtn" @click="toLogin('loginForm')">登 录</el-button>
        </div>
        <!-- <div class="otherWaysCon">
          <div class="greyLine"></div>
          <div class="otherWays">其他登录方式</div>
          <div class="greyLine"></div>
        </div> -->
      </div>
    </div>
    <div class="registerCon" v-show="!showLogin">
      <div class="registerTitle">帐号注册</div>
      <el-form ref="registerForm" :model="registerForm" label-width="120px" :rules="registerRule" label-position="left">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model.trim="registerForm.userName" maxlength="20" placeholder="请输入用户名" clearable> </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname" :class="[realnameError ? 'is-error' : '']">
          <el-input v-model.trim="registerForm.realname" maxlength="4" placeholder="请输入真实姓名" @change="realNameChange"> </el-input>
          <div class="el-form-item__error" v-if="realnameError">请输入正确的姓名</div>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" :class="[phoneError ? 'is-error' : '']">
          <el-input v-model.trim="registerForm.phone" maxlength="11" placeholder="请输入手机号" @change="phoneChange"> </el-input>
          <div class="el-form-item__error" v-if="phoneError">请输入正确格式的手机号</div>
        </el-form-item>
        <el-form-item label="验证码" prop="sms">
          <div class="smsMasterCon">
            <el-input v-model.trim="registerForm.sms" maxlength="6" placeholder="请输入验证码"> </el-input>
            <button class="normalSms" @click="sendSmsTrigger" :disabled="smsDisabled">
              {{ smsText }}
            </button>
          </div>
        </el-form-item>
        <el-form-item label="密码" prop="password" :class="[passwordError ? 'is-error' : '']">
          <el-input v-model.trim="registerForm.password" maxlength="16" type="password" @change="passwordChange" placeholder="请输入8-16位密码，至少包含字母、数字两种组合" show-password> </el-input>
          <div class="el-form-item__error" v-if="passwordError">请输入8-16位密码，至少包含字母、数字两种组合</div>
        </el-form-item>
        <el-form-item label="确认密码" prop="repeatPassword" :class="[password2Error ? 'is-error' : '']">
          <el-input v-model.trim="registerForm.repeatPassword" maxlength="16" type="password" placeholder="请输入确认密码" show-password @change="password2Change" @blur="password2Change"> </el-input>
          <div class="el-form-item__error" v-if="password2Error">与密码不一致</div>
        </el-form-item>
        <div class="loginGuide">已有账号？<span class="loginTrigger" @click="toLoginFrame">立即登录</span></div>
        <div class="registerMasterCon">
          <el-button class="secondLoginBtn" @click="registerAction('registerForm')">注 册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'empty',
  head() {
    return {
      title: '登录',
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
    return {
      smsDisabled: false,
      counter: 60,
      smsText: '获取验证码',
      password2Error: false,
      passwordError: false,
      phoneError: false,
      realnameError: false,
      firstCusError: false,
      showLogin: true,
      loginForm: {
        userName: '',
        password: '',
        mobile: '',
        verify_code: ''
      },
      loginRuleWay1: {
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        verify_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      loginRuleWay2: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      registerForm: {
        userName: '',
        realname: '',
        phone: '',
        sms: '',
        password: '',
        repeatPassword: ''
      },
      registerRule: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        sms: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        repeatPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      activeType: 1,
      loginSmsText: '获取短信验证码',
      loginSmsCounter: 60,
      loginCounterTimer: null
    }
  },
  async fetch() {
    //   console.log("asyncData",this);
  },
  beforeDestroy() {
    clearInterval(window.timer)
  },
  mounted() {
    localStorage.clear()
    sessionStorage.clear()
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
  },
  methods: {
    password2Change() {
      let result = this.registerForm.repeatPassword === this.registerForm.password
      // console.log(this.registerForm.password)
      // console.log(this.registerForm.repeatPassword)
      if (this.registerForm.repeatPassword) {
        if (!result) {
          this.password2Error = true
        } else {
          this.password2Error = false
        }
      } else {
        this.password2Error = false
      }
    },
    passwordChange() {
      var passReg = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Za-z]).*$/
      let result = passReg.test(this.registerForm.password)
      if (this.registerForm.password) {
        if (!result) {
          this.passwordError = true
        } else {
          this.passwordError = false
        }
      } else {
        this.passwordError = false
      }
    },
    phoneChange() {
      const phoneReg = /^1[3-9]\d{9}$/
      const result = phoneReg.test(this.registerForm.phone)
      if (this.registerForm.phone) {
        if (!result) {
          this.phoneError = true
        } else {
          this.phoneError = false
        }
      } else {
        this.phoneError = false
      }
    },
    realNameChange() {
      let chineseReg = /\p{Unified_Ideograph}{1,4}$/gu
      const result = chineseReg.test(this.registerForm.realname)
      if (this.registerForm.realname) {
        if (!result) {
          this.realnameError = true
        } else {
          this.realnameError = false
        }
      } else {
        this.realnameError = false
      }
    },

    // 账号注册-获取验证码
    sendSmsTrigger(e) {
      e.preventDefault()
      if (!this.smsDisabled) {
        const phoneReg = /^1[3-9]\d{9}$/
        const result = phoneReg.test(this.registerForm.phone)
        if (result) {
          this.smsDisabled = true
          let data = {
            mobile: this.registerForm.phone,
            scene: 'register',
          }
          this.ApiLists.sendSms(data)
            .then((res) => {
              if (res && res.code == 0) {
                this.$message.success('短信发送成功')
                window.timer = setInterval(() => {
                  this.counter--
                  this.smsText = `${this.counter}s后重新发送`
                  if (this.counter == 0) {
                    this.smsDisabled = false
                    this.counter = 60
                    this.smsText = '获取验证码'
                    clearInterval(window.timer)
                  }
                }, 1000)
              } else {
                this.$message.error(res.msg)
                this.smsDisabled = false
              }
            })
            .catch((err) => {
              console.log('er', err)
              this.smsDisabled = false
            })
        } else {
          this.$message.error('请输入正确手机号')
        }
      }
    },
    toRegister() {
      clearInterval(window.timer)
      this.showLogin = false
    },
    toLoginFrame() {
      clearInterval(window.timer)
      this.showLogin = true
    },
    activeAction(val) {
      this.activeType = val
      this.$refs['loginForm'].resetFields()
    },
    toLogin(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.activeType == 1) {
            // 验证码登录
            let data = {
              mobile: this.loginForm.mobile,
              verify_code: this.loginForm.verify_code
            }
            this.ApiLists.userLoginSms(data)
              .then((res) => {
                if (res && res.code == 0) {
                  localStorage.setItem('loginToken', res.data.token)
                  this.ApiLists.getUserInfo(data)
                    .then((res) => {
                      if (res && res.code == 0) {
                        localStorage.setItem('loginInfo', JSON.stringify(res.data))
                        this.$router.push('/') // TODO
                      } else {
                        this.$message.error(res.msg)
                      }
                    })
                    .catch((err) => {
                      console.log('er', err)
                    })
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch((err) => {
                console.log('er', err)
              })
          } else {
            // 用户名登陆
            let data = {
              username: this.loginForm.userName,
              password: this.loginForm.password
            }
            this.ApiLists.userLogin(data)
              .then((res) => {
                if (res && res.code == 0) {
                  localStorage.setItem('loginToken', res.data.token)
                  this.ApiLists.getUserInfo(data)
                    .then((res) => {
                      if (res && res.code == 0) {
                        localStorage.setItem('loginInfo', JSON.stringify(res.data))
                        this.$router.push('/') // TODO
                      } else {
                        this.$message.error(res.msg)
                      }
                    })
                    .catch((err) => {
                      console.log('er', err)
                    })
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch((err) => {
                console.log('er', err)
              })
          }
        } else {
          console.log('error')
        }
      })
    },
    registerAction(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.firstCusError || this.password2Error || this.passwordError || this.phoneError || this.realnameError) {
            console.log('stop')
          } else {
            let data = {
              username: this.registerForm.userName,
              real_name: this.registerForm.realname,
              mobile: this.registerForm.phone,
              verify_code: this.registerForm.sms,
              password: this.registerForm.password,
              password2: this.registerForm.repeatPassword
            }
            this.ApiLists.register(data)
              .then((res) => {
                if (res && res.code == 0) {
                  this.$message.success('注册成功')
                  clearInterval(window.timer)
                  this.showLogin = true
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch((err) => {
                console.log('er', err)
              })
          }
        } else {
          console.log('erooooor')
        }
      })
    },

    // 手机号登录-获取验证码
    smsBtnClick(e) {
      e.preventDefault()
      const phoneReg = /^1[3-9]\d{9}$/
      const result = phoneReg.test(this.loginForm.mobile)
      if (result) {
        let data = {
          mobile: this.loginForm.mobile,
          scene: 'login_mobile',
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
      this.loginCounterTimer && clearInterval(this.loginCounterTimer)
      this.loginCounterTimer = setInterval(() => {
        if (this.loginSmsCounter == 0) {
          this.loginSmsText = '获取短信验证码'
          this.loginSmsCounter = 60
          this.loginCounterTimer && clearInterval(this.loginCounterTimer)
        } else {
          this.loginSmsCounter = --this.loginSmsCounter
          this.loginSmsText = `${this.loginSmsCounter}s`
        }
      }, 1000)
    },

    // 跳转忘记密码
    jump2Forget() {
      this.$router.push('/forget')
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
  right: 10px;
  height: 56px;
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
  .loginBtnOuter {
    display: flex;
    justify-content: center;
  }
  .otherWaysCon {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    align-content: center;
    align-items: center;
  }
  .greyLine {
    width: 176px;
    height: 1px;
    background-color: #e6e6e6;
  }
  .otherWays {
    line-height: 22px;
    font-size: 22px;
    color: #999;
    margin-left: 24px;
    margin-right: 24px;
  }
  .secondLoginBtn {
    width: 542px;
    height: 56px;
    background-color: #0270c3;
    border-color: #0270c3;
    font-size: 26px;
    color: #fff;
    font-weight: normal;
  }
  .firstLoginBtn {
    width: 542px;
    height: 68px;
    background-color: #0270c3;
    border-color: #0270c3;
    font-size: 26px;
    font-weight: normal;
  }
  .firstBottomCon {
    position: absolute;
    left: 0;
    right: 0;
    top: 80%;
  }
  .firstUserName {
    margin-bottom: 47px;
  }
  .logoCon {
    display: flex;
    justify-content: center;
    margin-bottom: 46px;
  }
  .logoSelf {
    line-height: 42px;
    font-size: 42px;
    color: #333;
    font-family: 'huxiaobo';
    letter-spacing: 3px;
  }
  .firstTitle {
    display: flex;
    justify-content: center;
    margin-bottom: 60px;
  }
  .firstTitleStyle {
    line-height: 26px;
    font-size: 26px;
    cursor: pointer;
  }
  .firstTitleActive {
    color: #0270c3;
  }
  .forgetPwd {
    text-align: right;
    color: #0270c3;
    cursor: pointer;
  }
  .registerBridgeCon {
    text-align: right;
    position: absolute;
    right: 100px;
    bottom: 70px;
    line-height: 20px;
    font-size: 20px;
    color: #999;
  }
  .ml20 {
    margin-left: 20px;
  }
  .registerTrigger {
    color: #0270c3;
    cursor: pointer;
  }
  .loginGuide {
    text-align: right;
    line-height: 20px;
    font-size: 20px;
    color: #999;
    margin-bottom: 40px;
  }
  .loginTrigger {
    color: #0270c3;
    cursor: pointer;
  }
  .centerCon {
    height: 614px;
    width: 842px;
    padding-left: 160px;
    padding-right: 160px;
    padding-top: 83px;
    box-sizing: border-box;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('https://img.hzanchu.com/acimg/63078cea7b6408e1d120e52403fd57e8.png');
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .registerCon {
    margin: 0 auto;
    margin-top: 100px;
    width: 630px;
    height: 600px;
  }
  .registerTitle {
    line-height: 26px;
    font-size: 26px;
    color: #0270c3;
    text-align: center;
    margin-bottom: 56px;
  }
}
.btnsCon {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.registerMasterCon {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
.fakeRequired {
  &::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}

.smsBtn {
}
</style>
<style lang="less">
.loginCon {
  .centerCon {
    .el-input__inner {
      height: 68px;
      line-height: 68px;
      padding-left: 50px;
    }
    .el-input {
      font-size: 22px;
    }
  }
  .el-input__prefix {
    display: flex;
    align-items: center;
    justify-content: center;
    .firstLineImg {
      width: 20px;
      margin: 0 20px;
    }
  }
  .sms-form-item {
    .el-form-item__content {
      .el-input-group__append {
        width: auto;
        border: none;
        background: transparent;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);

        .smsBtn {
          .el-button {
            color: #0270c3;
            &:hover {
              opacity: 0.8;
            }
            &.is-disabled {
              color: #999;
              &:hover {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}
.registerCon {
  .el-input__inner {
    height: 56px;
    line-height: 56px;
  }
  .el-form-item__label {
    line-height: 56px;
    font-size: 22px;
  }
  .el-input {
    font-size: 20px;
  }
}
</style>
