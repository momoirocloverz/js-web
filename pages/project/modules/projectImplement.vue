<template>
  <div class="project_implement">
    <div class="form_box">
      <div class="title">
        <p>进度汇报</p>
        <el-button class="cover_btn" @click="changeForm">项目变更申请</el-button>
      </div>
      <el-form label-width="220px" :model="formData" ref="form">
        <el-form-item label="工程形象进度：" prop="progress_of_works" :rules="rules.progress_of_works">
          <el-input v-model="formData.progress_of_works" :rows="5" :maxlength="1000" show-word-limit type="textarea" placeholder="请输入，1000字以内" />
        </el-form-item>
        <el-form-item label="当月投资金额（万元）" prop="this_month_amount" :rules="rules.this_month_amount">
          <el-input-number :precision="2" v-model="formData.this_month_amount" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="本年计划投资（万元）" prop="this_year_amount" :rules="rules.this_year_amount">
          <el-input-number :precision="2" v-model="formData.this_year_amount" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="本年形象进度计划" prop="this_year_progress_of_works" :rules="rules.this_year_progress_of_works">
          <el-input v-model="formData.this_year_progress_of_works" :rows="5" :maxlength="2000" show-word-limit type="textarea" placeholder="请输入，2000字以内" :readonly="haveList ? true : false" />
        </el-form-item>
        <el-form-item label="累计完成投资金额（万元）" prop="total_amount" :rules="rules.total_amount" readonly>
          <!-- <el-input-number :precision="2" v-model="formData.total_amount" placeholder="请输入"/> -->
          <el-input v-model="formData.total_amount" placeholder="自动计算" readonly />
        </el-form-item>
        <el-form-item label="是否存在问题" prop="is_problem">
          <el-switch v-model="formData.is_problem" active-color="#13ce66" />
        </el-form-item>
        <el-form-item v-if="formData.is_problem" label="问题描述：" prop="content" :rules="formData.is_problem ? rules.content : ''">
          <el-input v-model="formData.content" :rows="5" :maxlength="1000" show-word-limit type="textarea" placeholder="请输入，1000字以内" />
        </el-form-item>
        <el-form-item label="上传照片：" prop="image" :rules="rules.image">
          <imgUpload ref="upload" :size="50" :limit="20" @handleChange="handleChange" />
        </el-form-item>
        <el-form-item label="是否滞后" prop="is_lag">
          <el-switch v-model="formData.is_lag" active-color="#13ce66" />
        </el-form-item>
        <el-form-item v-if="formData.is_lag" label="滞后原因" prop="lag_reason" :rules="formData.is_lag ? rules.lag_reason : ''">
          <el-input v-model="formData.lag_reason" :rows="5" :maxlength="2000" show-word-limit type="textarea" placeholder="请输入，2000字以内" />
        </el-form-item>
        <el-form-item label="协调情况" prop="coordination_condition" :rules="rules.coordination_condition">
          <el-input v-model="formData.coordination_condition" :rows="5" :maxlength="2000" show-word-limit type="textarea" placeholder="请输入，2000字以内" />
        </el-form-item>
        <el-form-item label="工作建议" prop="work_suggest">
          <el-input v-model="formData.work_suggest" :rows="5" :maxlength="1000" show-word-limit type="textarea" placeholder="请输入，1000字以内" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" :rows="5" :maxlength="1000" show-word-limit type="textarea" placeholder="请输入，1000字以内" />
        </el-form-item>
        <el-form-item :style="{ display: 'flex', justifyContent: 'center' }">
          <el-button type="primary" @click="onSubmit('form')" :disabled="disableBtn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="el_table_box">
      <p class="title">进度汇报记录</p>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="created_at" label="时间" width="180"></el-table-column>
        <el-table-column prop="progress_of_works" label="工程形象进度"></el-table-column>
        <el-table-column prop="this_month_amount" label="当月投资金额（万元）"></el-table-column>
        <el-table-column prop="this_year_amount" label="本年计划投资（万元）"></el-table-column>
        <el-table-column prop="this_year_progress_of_works" label="本年形象进度计划"></el-table-column>
        <el-table-column prop="total_amount" label="累计完成投资金额（万元）"></el-table-column>
        <el-table-column prop="content" label="问题描述"></el-table-column>
        <el-table-column prop="lag_reason" label="滞后原因"></el-table-column>
        <el-table-column prop="coordination_condition" label="协调情况"></el-table-column>
        <el-table-column prop="work_suggest" label="工作建议"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="image" label="图片">
          <template slot-scope="scope">
            <div class="table_img">
              <preview-image :src="scope.row.image ? scope.row.image[0] : ''" :src-list="scope.row.image ? scope.row.image : []" />
              <span>{{ '共' + scope.row.image.length + '张' }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      disableBtn: false,
      disableTimer: null,
      formData: {
        progress_of_works: '',
        this_month_amount: '',
        total_amount: '',
        is_problem: true,
        content: '',
        image: '',
        this_year_amount: '',
        this_year_progress_of_works: '',
        is_lag: true,
        lag_reason: '',
        coordination_condition: '',
        work_suggest: '',
        remark: ''
      },
      rules: {
        progress_of_works: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        this_month_amount: [{ required: true, message: '请输入', trigger: 'blur' }],
        total_amount: [{ required: true, message: '请输入', trigger: 'blur' }],
        content: [{ required: true, message: '请输入', trigger: 'blur' }],
        image: [{ required: true, message: '请上传照片', trigger: 'blur' }],
        this_year_amount: [{ required: true, message: '请输入', trigger: 'blur' }],
        // this_year_progress_of_works: [{ required: true, message: '请输入', trigger: 'blur' }],
        lag_reason: [{ required: true, message: '请输入', trigger: 'blur' }],
        coordination_condition: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      tableData: [],
      haveList: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.ApiLists.progressList({ project_id: this.$route.query.project_id }).then((res) => {
        res.data.forEach((item) => {
          item.image = item.image.split(',')
        })
        if (res.data.length) {
          this.haveList = true
          this.$set(this.formData, 'total_amount', res.data[0].total_amount)
          this.$set(this.formData, 'this_year_progress_of_works', res.data[0].this_year_progress_of_works)
        } else {
          this.$set(this.formData, 'total_amount', '0')
          this.haveList = false
        }
        this.tableData = res.data
      })
    },
    onSubmit(formName) {
      this.disableBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitProgress()
        } else {
          this.disableBtn = false
          return false
        }
      })
    },
    handleChange(e) {
      this.formData['image'] = e.join(',')
      this.$refs.form.validateField('image')
    },
    changeForm() {
      this.$router.push({
        path: '/project/projectChange/changeFormList',
        query: {
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id,
          active: this.$route.query.active
        }
      })
    },
    submitProgress() {
      this.formData.project_id = this.$route.query.project_id
      this.formData.content = this.formData.is_problem ? this.formData.content : ''
      this.formData.is_problem = this.formData.is_problem ? 1 : 0
      this.formData.is_lag = this.formData.is_lag ? 1 : 0
      const submitData = JSON.parse(JSON.stringify(this.formData))
      console.log('submitData', submitData)
      this.ApiLists.addProgressList(submitData)
        .then((res) => {
          if (res && res.code === 0) {
            this.getList()
            this.$refs.form.resetFields()
            this.$refs.upload.$refs.upload.clearFiles()
            this.$notify({
              title: '提交成功',
              message: '您的项目实施进度已更新',
              duration: 2000
            })
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
  }
}
</script>

<style scoped lang="less">
.project_implement {
  .title {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    justify-content: space-between;
    padding: 0 0 20px;
  }
  .form_box {
    padding: 20px 200px;
  }
  .table_img {
    display: flex;
    align-items: center;
    gap: 20px;
    .preview-image {
      width: 75px;
      height: 75px;
    }
  }
  .el_table_box {
    margin-top: 40px;
  }
}
</style>
