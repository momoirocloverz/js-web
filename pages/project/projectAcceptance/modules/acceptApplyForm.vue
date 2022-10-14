<template>
  <div class="accept_apply_form">
    <p class="title">局财政支农项目验收申请书</p>
    <el-form label-width="120px" :rules="rules" :model="formData" ref="form">
      <el-form-item label="项目名称" prop="project_name">
        <el-input v-model="formData.project_name" disabled placeholder="无法修改" />
      </el-form-item>
      <el-form-item label="项目地点" prop="full_area">
        <el-input v-model="formData.full_area" disabled placeholder="无法修改" />
      </el-form-item>
      <el-form-item label="申请验收单位" prop="declare_unit">
        <el-input v-model="formData.declare_unit" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="申请单位负责人" prop="unit_charge_name">
        <el-input maxlength="10" v-model="formData.unit_charge_name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="联系人" prop="unit_linker_name">
        <el-input maxlength="10" v-model="formData.unit_linker_name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="联系电话" prop="unit_charge_mobile">
        <el-input v-model="formData.unit_charge_mobile" placeholder="请输入" maxlength="11" />
      </el-form-item>
      <el-form-item class="from_rows" label="项目计划建设内容" prop="build_plan_content">
        <el-input v-model="formData.build_plan_content" type="textarea" :rows="5" :placeholder="build_plan_content_placeholder" disabled />
      </el-form-item>
      <el-form-item class="from_rows" label="建设内容完成情况" prop="build_complete_content">
        <el-input v-model="formData.build_complete_content" type="textarea" :rows="5" :placeholder="build_complete_content_placeholder" />
      </el-form-item>
      <el-form-item class="from_rows" label="财务（资金）执行情况" prop="fund_exec_content">
        <el-input v-model="formData.fund_exec_content" type="textarea" :rows="5" :placeholder="fund_exec_content_placeholder" />
      </el-form-item>
      <el-form-item class="from_rows" label="申请单位声明" prop="applicant_content">
        <el-input v-model="formData.applicant_content" type="textarea" :rows="5" :placeholder="applicant_content_placeholder" />
      </el-form-item>
      <el-form-item :style="{ display: 'flex', justifyContent: 'center', marginRight: '80px' }" prop="mobile">
        <el-button class="cover_btn" @click="$router.back()">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')" :disabled="disableBtn">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    projectInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      disableBtn: false,
      disableTimer: null,
      formData: {
        project_name: '',
        full_area: '',
        declare_unit: '',
        unit_charge_name: '',
        unit_linker_name: '',
        unit_charge_mobile: '',
        build_plan_content: '',
        build_complete_content: '',
        fund_exec_content: '',
        applicant_content: ''
      },
      rules: {
        project_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        full_area: [{ required: true, message: '请输入', trigger: 'blur' }],
        declare_unit: [{ required: true, message: '请输入', trigger: 'blur' }],
        unit_charge_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        unit_linker_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        unit_charge_mobile: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3-9]\d{9}$/, trigger: 'blur' }],
        build_plan_content: [{ required: true, message: '请输入', trigger: 'blur' }],
        build_complete_content: [{ required: true, message: '请输入', trigger: 'blur' }],
        fund_exec_content: [{ required: true, message: '请输入', trigger: 'blur' }],
        applicant_content: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      build_plan_content_placeholder: '建设计划根据计划文件填写 例：' + '\n' + '1、基础设施建设：新建菇棚500平方米，硬化道路800米；' + '\n' + '2、设备购置：购置冷藏车一辆',
      build_complete_content_placeholder:
        '对照计划建设内容，逐项填写，有数据的填写真实测量数据；机器设备请填写型号。 例： ' +
        '\n' +
        '1、基础设施建设：新建菇棚512平方米，硬化道路806米； ' +
        '\n' +
        '2、设备购置：购置冷藏车一辆，型号东风FS980',
      fund_exec_content_placeholder:
        '先填写计划投资金额，后填写完成情况。 例： ' +
        '\n' +
        '计划投资80万，其中财政补助40万元。实际完成投资81.2万元，其中：基础设施建设68.2万元，设备购置13 万元。截止X月X日，共收到财政补助20万元，其余部分皆为自筹。',
      applicant_content_placeholder: '请填写责任声明。 例：' + '\n' + '本单位已经按要求完成项目建设任务，提供的项目验收资料真实有效，如有虚假愿承担一切责任。'
    }
  },
  created() {
    if (this.$route.query.id) this.getData()
    this.fetchImplement()
  },
  methods: {
    fetchImplement() {
      this.ApiLists.fetchProjectImplementPlanDetail({
        project_id: this.$route.query.project_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            this.formData.build_plan_content = res.data.info.build_main_content
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    getData() {
      this.ApiLists.acceptDetailInfo({ project_id: this.$route.query.project_id }).then((res) => {
        Object.keys(res.data.info).forEach((key) => {
          Object.keys(this.formData).forEach((keys) => {
            if (key === keys) {
              this.formData[key] = res.data.info[key]
            }
          })
        })
      })
    },
    onSubmit(formName) {
      this.disableBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitApply()
        } else {
          this.disableBtn = false
          return false
        }
      })
    },
    submitApply() {
      const params = {
        save_type: 'submit',
        project_id: this.$route.query.project_id,
        ...this.formData
      }
      this.ApiLists.editAcceptDetail(params)
        .then((res) => {
          if (res && res.code === 0) {
            this.$message.success('提交成功')
            this.$router.back()
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => {
          this.disableTimer = setTimeout(() => {
            this.disableBtn = false
            clearTimeout(this.disableTimer)
          }, 5000)
        })
    }
  },
  watch: {
    projectInfo: {
      handler(val) {
        if (!this.$route.query.id) {
          this.formData.project_name = val.project_name
          this.formData.full_area = val.full_area
          this.formData.declare_unit = val.declare_unit
          this.formData.unit_charge_name = val.unit_charge_name
          this.formData.unit_linker_name = val.unit_charge_name
          this.formData.unit_charge_mobile = val.unit_charge_mobile
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
.accept_apply_form {
  padding: 20px 220px;
  .title {
    font-size: 20px;
    font-weight: 500;
    margin: 0 0 30px;
  }
}
</style>
