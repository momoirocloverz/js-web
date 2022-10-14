<template>
  <div class="consult">
    <div class="breadcrumbCon">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="routerGo('/')">首页</el-breadcrumb-item>
        <el-breadcrumb-item>咨询建议</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="center">
      <div class="form-con">
        <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm">
          <el-form-item label="标题" prop="title">
            <el-input type="textarea" v-model="formData.title" placeholder="请输入标题，字数不超过50字" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" v-model="formData.content" placeholder="请输入内容，字数不超过200字" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="submitForm('formData')">提交</el-button>
            <el-button size="small" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'main',
    head() {
      return {
        title: '线上咨询',
      }
    },
    data() {
      return {
        formData: {
          title: '',
          content: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入标题，字数不超过50字', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入内容，字数不超过200字', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            console.log(valid, 'valid')
            const result = await this.ApiLists.submitConsultAdvise(this.formData);
            if(result.code === 0) {
              this.$message.success('提交成功');
              this.formData.title = '';
              this.formData.content = '';
            } else {
              this.$message.error(result.msg);
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancel() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .consult {
    background-color: #f7f8fa;
    box-sizing: border-box;
    padding-bottom: 40px;
    width: 1200px;
    margin: 0 auto;
    min-height: calc(100vh - 370px);
  }
  .breadcrumbCon {
    margin: 30px 0 20px;
  }
  .center {
    width: 100%;
    padding-top: 30px;
    box-sizing: border-box;
    background: #fff;
    overflow: hidden;
  }
  .form-con {
    padding: 0 100px;
  }
</style>