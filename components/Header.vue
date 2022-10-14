<template>
  <div class="headerCon">
    <div class="headerInnerCon">
      <div class="leftCon">
        <div class="title" @click="toHome">江山农业项目投资一件事</div>
        <div class="menuCon">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">惠农政策申报</el-menu-item>
            <el-menu-item index="3">项目办事</el-menu-item>
            <el-menu-item index="4">意见反馈</el-menu-item>
            <el-menu-item index="5">草稿箱</el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="userInfoCon">
        <div v-if="loginStatus">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link flexCon">
              <span class="nameHide">{{ userInfo.username }}</span
              ><i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="manage">账户管理</el-dropdown-item>
              <el-dropdown-item command="video">操作视频</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-else class="remindLogin" @click="toLogin">登录/注册</div>
      </div>
    </div>
    <el-dialog :visible.sync="manageVisible" width="600px" append-to-body :show-close="false">
      <div class="manage_info">
        <p class="title">账户管理</p>
        <div>
          <p>用户名：</p>
          <p>{{ userInfo.username }}</p>
        </div>
        <div>
          <p>绑定手机：</p>
          <p>{{ userInfo.mobile }}</p>
          <el-button type="primary" @click="mobileVisible = true">更改手机</el-button>
          <!--          sendSms-->
        </div>
        <div>
          <p>登录密码：</p>
          <p>********</p>
          <el-button type="primary" @click="passwordVisible = true">修改密码</el-button>
        </div>
        <div>
          <p>真实姓名：</p>
          <p>{{ userInfo.real_name }}</p>
          <el-button type="primary" @click="userNameVisible = true">修改姓名</el-button>
        </div>
        <div>
          <p>上次登录时间：</p>
          <p>{{ userInfo.last_login_at }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-popconfirm title="账号注销后，您将无法再次使用该账号登录本网站，账号内所有历史记录信息将被清除。是否确认注销该账号？" @confirm="deleteVisible = true">
          <el-button type="danger" slot="reference">注销账户</el-button>
        </el-popconfirm>
        <el-button @click="manageVisible = false">取 消</el-button>
        <el-button type="primary" @click="manageVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="userNameVisible" width="400px" append-to-body :show-close="false">
      <div class="change_box">
        <div>
          <p>请输入姓名：</p>
          <el-input type="text" v-model="formData.userName" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="changeUserName">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="passwordVisible" width="400px" append-to-body :show-close="false">
      <div class="change_box">
        <div>
          <p>原始密码：</p>
          <el-input type="password" v-model="formData.oldPassword" show-password />
        </div>
        <div>
          <p>新密码：</p>
          <el-input type="password" v-model="formData.newPassword" show-password />
        </div>
        <div>
          <p>新密码：</p>
          <el-input type="password" v-model="formData.newPassword2" show-password />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="mobileVisible" width="400px" append-to-body :show-close="false">
      <div class="change_box">
        <div>
          <p>新手机号：</p>
          <el-input type="text" v-model="formData.mobile" />
        </div>
        <div>
          <p>验证码：</p>
          <el-input type="text" v-model="formData.verify_code"> </el-input>
          <div class="get_code" :class="{ get_code_disabled: timerCount }" @click="getCode">{{ timerCount === 0 ? '获取验证码' : timerCount + '秒后重新获取' }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="changeMobile">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="deleteVisible" width="400px" append-to-body :show-close="false">
      <div class="change_box">
        <div>
          <p>验证码：</p>
          <el-input type="text" v-model="formData.verify_code"> </el-input>
          <div class="get_code" :class="{ get_code_disabled: timerCount }" @click="getCode">{{ timerCount === 0 ? '获取验证码' : timerCount + '秒后重新获取' }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="deleteAacount">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="videoVisible" width="1000px" append-to-body>
      <div class="change_box">
        <video controls v-if="videoVisible">
          <source src="https://jiangshan-tzyjs.oss-cn-hangzhou.aliyuncs.com/live/jiangshan_tzyjs/Web%E7%AB%AF.mp4" />
        </video>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutVideo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({ activeIndex: 'currentMenuActive' })
  },
  data() {
    return {
      loginStatus: false,
      routeMap: {
        1: '/',
        2: '/policy',
        3: '/project',
        4: '/communicate',
        5: '/drafts'
      },
      userInfo: {},
      formData: {
        userName: '',
        oldPassword: '',
        newPassword: '',
        newPassword2: '',
        mobile: '',
        verify_code: ''
      },
      manageVisible: false,
      userNameVisible: false,
      passwordVisible: false,
      mobileVisible: false,
      deleteVisible: false,
      timer: null,
      timerCount: 0,
      videoVisible: false
    }
  },
  mounted() {
    this.initAction()
  },
  methods: {
    toHome() {
      this.$router.push('/')
    },
    toLogin() {
      localStorage.clear()
      sessionStorage.clear()
      this.$router.push('/login')
    },
    getCode() {
      if (this.deleteVisible === true) {
        this.formData.mobile = this.userInfo.mobile
      }
      const phoneReg = /^1[3-9]\d{9}$/
      if (!phoneReg.test(this.formData.mobile)) {
        this.$message.error('请输入正确的手机号')
        return
      } else if (this.timerCount !== 0) {
        this.$message.error('发送验证码过于频繁，请1分钟后在试')
      }
      this.ApiLists.sendSms({ mobile: this.formData.mobile }).then((res) => {
        if (res.code === 0) {
          this.$message.success('短信验证码发送成功')
          this.timerCount = 60
          this.timer = setInterval(() => {
            this.timerCount--
            if (this.timerCount === 0) clearInterval(this.timer)
          }, 1000)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    deleteAacount() {
      this.ApiLists.deleteAccount({ verify_code: this.formData.verify_code }).then((res) => {
        if (res.code === 0) {
          this.handleCommand('logout')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    changeMobile() {
      if (!this.formData.mobile || !this.formData.verify_code) {
        this.$message.error('请输入手机号和验证码')
        return
      }
      let params = {
        mobile: this.formData.mobile,
        verify_code: this.formData.verify_code
      }
      this.ApiLists.changeMobile(params).then((res) => {
        if (res && res.code === 0) {
          this.$message.success('修改手机号成功')
          this.resetForm()
          this.getUserInfo()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    changeUserName() {
      if (!this.formData.userName) {
        this.$message.error('请输入姓名')
        return
      }
      this.ApiLists.changeUserName({ real_name: this.formData.userName }).then((res) => {
        if (res && res.code === 0) {
          this.$message.success('用户名修改成功')
          this.resetForm()
          this.getUserInfo()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    changePassword() {
      if (!this.formData.oldPassword || !this.formData.newPassword || !this.formData.newPassword2) {
        this.$message.error('请全部输入旧密码、新密码、确认密码')
        return
      }
      let params = {
        origin_password: this.formData.oldPassword,
        password: this.formData.newPassword,
        password2: this.formData.newPassword2
      }
      this.ApiLists.changePassword(params).then((res) => {
        if (res && res.code === 0) {
          this.$message.success('密码修改成功')
          this.resetForm()
          this.getUserInfo()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getUserInfo() {
      this.ApiLists.getUserInfo().then((res) => {
        this.userInfo = res.data.userinfo
        localStorage.setItem('loginInfo', JSON.stringify(res.data))
      })
    },
    resetForm() {
      this.deleteVisible = false
      this.userNameVisible = false
      this.mobileVisible = false
      this.passwordVisible = false
      this.formData = {
        userName: '',
        oldPassword: '',
        newPassword: '',
        newPassword2: '',
        mobile: '',
        verify_code: ''
      }
    },
    handleCommand(key) {
      if (key == 'logout') {
        this.ApiLists.logout()
          .then((res) => {
            if (res && res.code == 0) {
              localStorage.clear()
              sessionStorage.clear()
              this.$router.push('/login')
            } else {
              localStorage.clear()
              sessionStorage.clear()
              this.$router.push('/login')
            }
          })
          .catch((err) => {
            console.log('er', err)
          })
      } else if (key === 'manage') {
        this.manageVisible = true
      } else {
        this.videoVisible = true
      }
    },
    shutVideo() {
      console.log('ashdajs')
      this.videoVisible = false
    },
    initAction() {
      let loginInfo = localStorage.getItem('loginInfo') ? JSON.parse(localStorage.getItem('loginInfo')) : ''
      if (loginInfo) {
        this.userInfo = loginInfo.userinfo
        this.loginStatus = true
      } else {
        this.loginStatus = false
      }
    },
    handleSelect(key, keyPath) {
      this.$store.commit('changeMenuActive', key)
      let res = this.routeMap[key]
      if (this.loginStatus) {
        if (res) {
          this.$router.push(res)
        }
      } else {
        if (key == 3 || key == 5) {
          this.$router.push('/login')
        } else {
          if (res) {
            this.$router.push(res)
          }
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.headerInnerCon {
  width: 1200px;
  margin: 0 auto;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.headerCon {
  z-index: 30;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
}
.title {
  font-family: 'huxiaobo';
  letter-spacing: 3px;
  font-size: 24px;
  color: #333;
  margin-right: 67px;
  cursor: pointer;
}
.leftCon {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
}
.userInfoCon {
}
.menuCon {
}
.remindLogin {
  font-size: 18px;
  cursor: pointer;
}
.flexCon {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
}
.nameHide {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80px;
}
</style>
<style lang="less">
.headerCon {
  .el-menu.el-menu--horizontal {
    border: none;
  }
  .el-menu--horizontal > .el-menu-item.is-active {
    border: none;
  }
  .el-menu-item.is-active {
    color: #0270c3 !important;
    background-color: #f0f0f0 !important;
  }
  .el-menu-item {
    transition: none;
    width: 140px;
    text-align: center;
    height: 70px !important;
    line-height: 70px !important;
    font-size: 16px !important;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #0270c3;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
.manage_info {
  margin: 0 50px;
  .title {
    text-align: center;
    margin-bottom: 50px;
  }
  div {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    p {
      font-size: 18px;
      &:nth-of-type(1) {
        width: 140px;
        color: #333;
        text-align: right;
      }
      &:nth-of-type(2) {
        color: #666;
        width: 200px;
      }
    }
  }
}
.change_box {
  video {
    width: 95%;
    display: block;
    margin: 0 auto;
  }
  div {
    display: flex;
    align-items: center;
    p {
      color: #666;
      width: 140px;
      margin-right: 10px;
      text-align: right;
      padding: 20px 0;
    }
    .get_code {
      white-space: nowrap;
      padding-left: 10px;
      color: #2d6fbd;
      cursor: pointer;
    }
    .get_code_disabled {
      color: #999;
    }
  }
}
</style>
