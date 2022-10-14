<template>
  <div class="change_form box_wrap">
    <div class="center_box">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item @click.native="toProjectManage">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item @click.native="toProjectProgress">项目进度</el-breadcrumb-item>
          <el-breadcrumb-item>项目变更申请表填写</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <p class="title">项目变更申请表填写</p>
        <el-form label-width="120px" :rules="rules" :model="formData" ref="form">
          <el-form-item label="项目名称" prop="project_name">
            <el-input v-model="formData.project_name" disabled placeholder="无法修改" />
          </el-form-item>
          <el-form-item label="文件名称" prop="file_name">
            <el-input v-model="formData.file_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="文号" prop="file_number">
            <el-input v-model="formData.file_number" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="申请单位" prop="apply_unit">
            <el-input v-model="formData.apply_unit" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系人" prop="link_person">
            <el-input v-model="formData.link_person" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话" prop="link_mobile">
            <el-input v-model="formData.link_mobile" maxLength="11" placeholder="请输入" />
          </el-form-item>
          <el-form-item
            label="建设期限"
            prop="build_at"
            :rules="{
              required: true,
              message: '期限不能为空',
              trigger: 'blur'
            }"
          >
            <el-date-picker
              class="setDate2Picker"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM"
              v-model="formData.build_at"
              type="monthrange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="from_rows" label="文件下达建设内容" prop="construction_content">
            <el-input v-model="formData.construction_content" type="textarea" :rows="5" :maxlength="1000" show-word-limit placeholder="请填写，1000字以内" disabled />
          </el-form-item>
          <el-form-item class="from_rows" label="申请变更内容" prop="change_apply_content">
            <el-input v-model="formData.change_apply_content" type="textarea" :rows="5" :maxlength="500" show-word-limit placeholder="请填写，500字以内" />
          </el-form-item>
          <el-form-item class="from_rows" label="申请变更原因" prop="apply_reason">
            <el-input v-model="formData.apply_reason" type="textarea" :rows="5" :maxlength="1000" show-word-limit placeholder="请填写，1000字以内" />
          </el-form-item>
          <el-form-item class="from_rows" label="变更后项目建设计划" prop="after_build_plan">
            <el-input v-model="formData.after_build_plan" type="textarea" :rows="5" :maxlength="1000" show-word-limit placeholder="请填写，1000字以内" />
          </el-form-item>
          <el-form-item label="是否滞后" prop="is_delay">
            <el-switch v-model="formData.is_delay" active-color="#13ce66" />
          </el-form-item>
          <el-form-item v-if="formData.is_delay" label="延期开始时间" prop="delay_start_date" :rules="formData.is_delay ? rules.delay_start_date : ''">
            <el-date-picker v-model="formData.delay_start_date" align="right" type="date" placeholder="延期开始时间" :picker-options="picker1Options"> </el-date-picker>
          </el-form-item>
          <el-form-item :style="{ display: 'flex', justifyContent: 'center', marginRight: '80px' }" prop="mobile">
            <el-button class="cover_btn" @click="$router.back()">取 消</el-button>
            <el-button type="primary" @click="onSubmit('form')" :disabled="disableBtn">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  layout: 'main',
  data() {
    return {
      picker1Options: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()])
            }
          },
          {
            text: '今年至今',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date().getFullYear(), 0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 6)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      formData: {
        project_name: '',
        file_name: '',
        file_number: '',
        apply_unit: '',
        link_person: '',
        link_mobile: '',
        construction_content: '',
        change_apply_content: '',
        apply_reason: '',
        build_at: [],
        after_build_plan: '',
        is_delay: true,
        delay_start_date: ''
      },
      rules: {
        project_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        file_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        file_number: [{ required: true, message: '请输入', trigger: 'blur' }],
        apply_unit: [{ required: true, message: '请输入', trigger: 'blur' }],
        link_person: [{ required: true, message: '请输入', trigger: 'blur' }],
        link_mobile: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3-9]\d{9}$/, trigger: 'blur' }],
        construction_content: [{ required: true, message: '请输入', trigger: 'blur' }],
        change_apply_content: [{ required: true, message: '请输入', trigger: 'blur' }],
        apply_reason: [{ required: true, message: '请输入', trigger: 'blur' }],
        after_build_plan: [{ required: true, message: '请输入', trigger: 'blur' }],
        delay_start_date: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      changeInfo: {},
      fetchStart: '',
      fetchEnd: '',
      disableBtn: false,
      disableTimer: null
    }
  },
  created() {
    this.getProjectInfo()
    if (this.$route.query.change_id) {
      this.getChangeInfo()
    }
  },
  methods: {
    fetchImplement() {
      this.ApiLists.fetchProjectImplementPlanDetail({
        project_id: this.$route.query.project_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            this.formData.construction_content = res.data.info.build_main_content
            this.fetchStart = res.data.info.build_start_at
            this.fetchEnd = res.data.info.build_end_at
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    getChangeInfo() {
      this.ApiLists.projectChangeDetail({ id: this.$route.query.project_id }).then((res) => {
        this.changeInfo = res.data
        Object.keys(res.data).forEach((key) => {
          Object.keys(this.formData).forEach((keys) => {
            if (key === keys) this.formData[key] = res.data[key]
          })
        })
        let track = this.formData.change_apply_content.split('<br/>')[1]
        if (track) {
          this.formData.change_apply_content = track
        }
        this.formData.id = res.data.id
        this.formData.project_id = res.data.project_id
        this.formData.build_at = [dayjs(res.data.build_start_month).format('YYYY-MM-DD HH:mm:ss'), dayjs(res.data.build_end_month).format('YYYY-MM-DD HH:mm:ss')]
      })
    },
    getProjectInfo() {
      this.ApiLists.fetchProjectSchedule({ project_id: this.$route.query.project_id }).then((res) => {
        this.projectInfo = res.data.info
        if (!this.$route.query.change_id) {
          this.formData.project_id = this.$route.query.project_id
          this.formData.project_name = res.data.info.project_name
          this.formData.apply_unit = res.data.info.declare_unit
          this.formData.link_person = res.data.info.unit_charge_name
          this.formData.link_mobile = res.data.info.unit_charge_mobile
        }
        this.fetchImplement()
      })
    },
    onSubmit(formName) {
      this.disableBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitForm()
        } else {
          this.disableBtn = false
          return false
        }
      })
    },
    async submitForm() {
      const data = {
        ...this.formData,
        build_start_month: dayjs(this.formData.build_at[0]).format('YYYY-MM'),
        build_end_month: dayjs(this.formData.build_at[1]).format('YYYY-MM'),
        change_apply_content:
          '建设期限由' +
          dayjs(this.fetchStart).format('YYYY年MM月') +
          '至' +
          dayjs(this.fetchEnd).format('YYYY年MM月') +
          '更改为' +
          dayjs(this.formData.build_at[0]).format('YYYY年MM月') +
          '至' +
          dayjs(this.formData.build_at[1]).format('YYYY年MM月') +
          '<br/>' +
          this.formData.change_apply_content
      }
      data.delay_start_date = this.formData.delay_start_date ? dayjs(this.formData.delay_start_date).format('YYYY-MM-DD HH:mm:ss') : ''
      data.is_delay = this.formData.is_delay ? 1 : 0
      delete data.build_at
      console.log(data)
      const result = this.$route.query.change_id ? await this.ApiLists.editProjectChange(data) : await this.ApiLists.addProjectChange(data)
      if (result.code === 0) {
        this.$message.success('提交成功')
        this.$router.back()
        this.disableTimer = setTimeout(() => {
          this.disableBtn = false
          clearTimeout(this.disableTimer)
        }, 5000)
      } else {
        this.disableTimer = setTimeout(() => {
          this.disableBtn = false
          clearTimeout(this.disableTimer)
        }, 5000)
        this.$message.error(result.msg)
      }
    },
    toProjectManage() {
      this.$router.push({
        path: '/project'
      })
    },
    toProjectProgress() {
      this.$router.push({
        path: '/project/progress',
        query: {
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id,
          active: this.$route.query.active
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.setDate2Picker {
  width: 400px;
}
.change_form {
  .content_box {
    padding: 20px 260px;
    .title {
      font-size: 18px;
      font-weight: 600;
      padding-bottom: 20px;
    }
  }
}
</style>
