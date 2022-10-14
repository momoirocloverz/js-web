<template>
  <div class="communicatePageCon">
    <div class="centerCon">
      <el-form label-position="top" label-width="80px" :rules="rules" :model="formData" ref="form">
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="formData.mobile" maxLength="11" :controls="false" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="反馈内容：" prop="content">
          <el-input v-model="formData.content" :rows="5" type="textarea" placeholder="亲爱的用户，您的声音是我们前行的动力！" />
        </el-form-item>
<!--        <el-form-item label="验证码：" prop="code">-->
<!--          <div class="code_box">-->
<!--            <el-input v-model="formData.code" placeholder="请输入验证码" />-->
<!--            <img @click="getCode" :src="codeInfo.img" alt="" />-->
<!--            <span @click="getCode">点击切换</span>-->
<!--          </div>-->
<!--        </el-form-item>-->
        <el-form-item :style="{ marginTop: '80px' }">
          <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  layout: "main",
  data() {
    return {
      formData: {
        mobile: '',
        content: '',
        // code: '',
        // key: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入正确的手机号', pattern: /^1[3-9]\d{9}$/, trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入反馈内容', trigger: 'blur' },
        ],
        // code: [
        //   { required: true, message: '请输入验证码', trigger: 'blur' },
        // ]
      },
      codeInfo: {}
    }
  },
  mounted() {
    this.initAction()
    // this.getCode()
  },
  methods: {
    initAction() {
      this.$store.commit("changeMenuActive", "4");
    },
    getCode() {
      this.ApiLists.feedbackCode().then(res => {
        if (res && res.code === 0) {
          this.codeInfo = res.data
          this.formData.key = res.data.key
        } else {
          this.$message.error('验证码获取失败')
        }
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.feedback()
        } else {
          return false
        }
      });
    },

    feedback() {
      this.ApiLists.addFeedback(this.formData).then(res => {
        if (res && res.code === 0) {
          this.$refs.form.resetFields()
          // this.getCode()
          this.$notify({
            title: '提交成功',
            message: '感谢您的宝贵意见',
            duration: 2000
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.communicatePageCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
  .centerCon {
    width: 1200px;
    margin: 0 auto;
    padding: 30px 260px;
    background: #fff;
    box-sizing: border-box;
  }
  .code_box {
    display: flex;
    align-items: center;
    img {
      margin: 0 20px;
      cursor: pointer;
      height: 40px;
    }
    span {
     white-space: nowrap;
     cursor: pointer;
    }
  }
}
</style>
