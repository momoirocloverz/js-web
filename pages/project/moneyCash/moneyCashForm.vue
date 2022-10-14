<template>
  <div class="monry_cash_form box_wrap">
    <div class="center_box">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item @click.native="toProjectManage">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item @click.native="toProjectProgress">项目进度</el-breadcrumb-item>
          <el-breadcrumb-item>材料填写</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <p class="title">财政专项资金拨款申请表</p>
        <el-form label-width="100px" :rules="rules" :model="formData" ref="form" :disabled="is_check && is_check != 3">
          <el-form-item label="项目名称" prop="project_name">
            <el-input v-model="formData.project_name" disabled placeholder="无法修改" />
          </el-form-item>
          <el-form-item label="申请单位" prop="apply_unit">
            <el-input v-model="formData.apply_unit" disabled placeholder="无法修改" />
          </el-form-item>
          <el-form-item label="负责人" prop="principal">
            <el-input v-model="formData.principal" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="经手人" prop="pass_person">
            <el-input v-model="formData.pass_person" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话" prop="link_mobile">
            <el-input v-model="formData.link_mobile" placeholder="请输入" maxlength="11" />
          </el-form-item>
          <el-form-item label="申请日期" prop="apply_at">
            <el-date-picker :picker-options="pickerOptions" style="width: 100%" v-model="formData.apply_at" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item class="from_rows" label="项目主要建设内容" prop="construction_content">
            <el-input v-model="formData.construction_content" type="textarea" :rows="5" :maxlength="1000" show-word-limit :placeholder="placeholder" disabled />
            <!-- readonly -->
          </el-form-item>
          <el-form-item class="from_rows" label="项目实施情况及进度" prop="progress">
            <el-input
              v-model="formData.progress"
              type="textarea"
              :rows="5"
              :maxlength="1000"
              show-word-limit
              placeholder="对照计划建设内容，逐项填写，有数据的填写真实测量数据；机器设备请填写型号。（1000字以内）"
            />
          </el-form-item>
          <p class="title">申请拨款</p>
          <el-form-item label="依据" prop="allotment_according">
            <el-input v-model="formData.allotment_according" placeholder="100字以内" type="textarea" rows="3" :maxLength="100" />
          </el-form-item>
          <el-form-item label="计划补助金额" prop="plan_subsidy">
            <el-input v-model="formData.plan_subsidy" placeholder="请输入" disabled>
              <!-- readonly -->
              <template #prepend>¥</template>
              <template #append>万元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="已补助金额" prop="already_subsidy">
            <el-input v-model="formData.already_subsidy" placeholder="请输入" disabled>
              <!-- readonly -->
              <template #prepend>¥</template>
              <template #append>万元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="本次申报金额" prop="apply_amount">
            <!-- <el-input v-model="formData.apply_amount" placeholder="请输入" >
              <template #prepend>¥</template>
              <template #append>万元</template>
            </el-input> -->
            <div class="el-input el-input-group el-input-group--append el-input-group--prepend">
              <div class="el-input-group__prepend">¥</div>
              <el-input-number
                @change="applyAmountChange"
                class="el-input__inner borderNone"
                controls-position="right"
                :min="0"
                :max="9999999999"
                :precision="2"
                v-model="formData.apply_amount"
                :step="1"
                placeholder="请输入本次申报金额"
              ></el-input-number>
              <div class="el-input-group__append">万元</div>
            </div>
          </el-form-item>
          <el-form-item label="累计补助金额" prop="total_subsidy">
            <el-input v-model="formData.total_subsidy" placeholder="请输入" disabled>
              <!-- readonly -->
              <template #prepend>¥</template>
              <template #append>万元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="开户银行" prop="bank">
            <el-input v-model="formData.bank" placeholder="请输入" maxlength="20" />
          </el-form-item>
          <el-form-item label="账号" prop="bank_account">
            <el-input v-model="formData.bank_account" maxlength="29" placeholder="29字以内" />
          </el-form-item>
          <el-form-item :style="{ display: 'flex', justifyContent: 'center', marginRight: '80px' }" prop="mobile">
            <el-button class="cover_btn" @click="$router.back()">取 消</el-button>
            <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="500px">
      <div class="confirm_box">
        <p class="title">请确认以下填写内容：</p>
        <div>
          <p>计划补助金额（万元）:</p>
          <p>{{ formData.plan_subsidy }}</p>
        </div>
        <div>
          <p>已补助金额（万元）:</p>
          <p>{{ formData.already_subsidy }}</p>
        </div>
        <div>
          <p>本次申报金额（万元）:</p>
          <p>{{ formData.apply_amount }}</p>
        </div>
        <div>
          <p>累计补助金额（万元）</p>
          <p>{{ formData.total_subsidy }}</p>
        </div>
        <div>
          <p>开户银行：</p>
          <p>{{ formData.bank }}</p>
        </div>
        <div>
          <p>账号：</p>
          <p>{{ formData.bank_account }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitApply" :disabled="submitDisable">信息无误，确认提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'monryCashForm',
  layout: 'main',
  data() {
    return {
      pickerOptions: {
        disabledDate: this.disableDate
      },
      formData: {
        project_id: '',
        project_name: '',
        apply_unit: '',
        principal: '',
        pass_person: '',
        link_mobile: '',
        apply_at: '',
        construction_content: '',
        progress: '',
        allotment_according: '',
        plan_subsidy: '',
        already_subsidy: '',
        apply_amount: '',
        total_subsidy: '',
        bank: '',
        bank_account: ''
      },
      rules: {
        project_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        apply_unit: [{ required: true, message: '请输入', trigger: 'blur' }],
        principal: [{ required: true, message: '请输入', trigger: 'blur' }],
        pass_person: [{ required: true, message: '请输入', trigger: 'blur' }],
        link_mobile: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3-9]\d{9}$/, trigger: 'blur' }],
        apply_at: [{ required: true, message: '请选择', trigger: 'blur' }],
        construction_content: [{ required: true, message: '请输入', trigger: 'blur' }],
        progress: [{ required: true, message: '请输入', trigger: 'blur' }],
        allotment_according: [{ required: true, message: '请输入', trigger: 'blur' }],
        plan_subsidy: [{ required: true, message: '请输入', trigger: 'blur' }],
        already_subsidy: [{ required: true, message: '请输入', trigger: 'blur' }],
        apply_amount: [{ required: true, message: '请输入', trigger: 'blur' }],
        total_subsidy: [{ required: true, message: '请输入', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入', trigger: 'blur' }],
        bank_account: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      placeholder: '建设计划根据计划文件填写（1000字以内)' + '\n' + '例：' + '\n' + '1.基础设施建设：新建菇棚500平方米，硬化道路800米;' + '\n' + '2.设备购置：购置冷藏车一辆',
      dialogVisible: false,
      projectInfo: {},
      is_check: null,
      newTotal2: 0,
      stableAmount: 0,
      newArray2: [],
      newArray: [],
      newArray3: [],
      submitDisable: false,
      disableTimer: null
    }
  },
  created() {
    if (this.$route.query.apply_id) {
      this.getDetail()
    }
    this.getProjectInfo()
    this.fetchImplement()
    this.getSummarInfo()
  },
  methods: {
    moneyFormat(value) {
      if (value || value == 0) {
        if (value === 0) {
          return 0
        } else {
          let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2)
          return fix
        }
      }
    },
    applyAmountChange() {
      this.formData.total_subsidy = this.moneyFormat(+this.stableAmount + +this.formData.apply_amount)
    },
    getSummarInfo() {
      this.ApiLists.amountApplySummarInfo({ project_id: this.$route.query.project_id })
        .then((res) => {
          if (res.code === 0) {
            this.formData.already_subsidy = res.data.has_total_apply_amount
            this.formData.total_subsidy = res.data.has_total_apply_amount
            this.stableAmount = res.data.has_total_apply_amount
          } else {
            Toast(res.msg)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    fetchImplement() {
      this.ApiLists.fetchProjectImplementPlanDetail({
        project_id: this.$route.query.project_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            this.formData.construction_content = res.data.info.build_main_content
            let shorter = res.data.info
            /*         let array3 = shorter.part_options.find((ele) => {
              return ele.option_name == '基础设施建设'
            })
            let array4 = shorter.part_options.find((ele) => {
              return ele.option_name == '设施设备'
            })
            let array5 = shorter.part_options.find((ele) => {
              return ele.option_name == '其他'
            })
            if (array3 && array3.list && array3.list.length) {
              this.newArray = array3.list
            }
            if (array4 && array4.list && array4.list.length) {
              this.newArray2 = array4.list
            }
            if (array5 && array5.list && array5.list.length) {
              this.newArray3 = array5.list
            }
            let count7 = 0
            let temp7 = this.newArray.map((ele) => {
              if (!ele.subsidy_money) {
                return {
                  ...ele,
                  subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                }
              } else {
                return {
                  ...ele
                }
              }
            })
            if (temp7) {
              let res1 = temp7.reduce((acc, current) => {
                return acc + current.subsidy_money
              }, 0)
              count7 = res1
            }
            let count8 = 0
            let temp8 = this.newArray2.map((ele) => {
              if (!ele.subsidy_money) {
                return {
                  ...ele,
                  subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                }
              } else {
                return {
                  ...ele
                }
              }
            })
            if (temp8) {
              let res1 = temp8.reduce((acc, current) => {
                return acc + current.subsidy_money
              }, 0)
              count8 = res1
            }
            let count9 = 0
            let temp9 = this.newArray3.map((ele) => {
              if (!ele.subsidy_money) {
                return {
                  ...ele,
                  subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                }
              } else {
                return {
                  ...ele
                }
              }
            })
            if (temp9) {
              let res1 = temp9.reduce((acc, current) => {
                return acc + current.subsidy_money
              }, 0)
              count9 = res1
            }
            this.newTotal2 = this.moneyFormat(count7 + count8 + count9) */
            // this.formData.plan_subsidy = shorter.plan_all_order_amount || 0
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    getProjectInfo() {
      this.ApiLists.fetchProjectSchedule({ project_id: this.$route.query.project_id }).then((res) => {
        this.projectInfo = res.data.info
        this.formData.plan_subsidy = res.data.info.plan_all_order_amount || 0
        if (!this.$route.query.apply_id) {
          this.formData.project_id = this.$route.query.project_id
          this.formData.project_name = res.data.info.project_name
          this.formData.apply_unit = res.data.info.declare_unit
          this.formData.principal = res.data.info.unit_charge_name
          this.formData.link_mobile = res.data.info.unit_charge_mobile
        }
      })
    },
    disableDate(time) {
      return time.getTime() > new Date('2050-12-31').getTime() || time.getTime() + 3600 * 24000 < new Date(this.projectInfo.start_declare_at).getTime()
    },
    getDetail() {
      this.ApiLists.projectApplyDetail({ id: this.$route.query.id }).then((res) => {
        Object.keys(res.data).forEach((key) => {
          Object.keys(this.formData).forEach((keys) => {
            if (key === keys) this.formData[key] = res.data[key]
          })
        })
        this.is_check = res.data.is_check
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (typeof this.formData.apply_at !== 'string') {
            this.formData.apply_at = this.Dayjs(this.formData.apply_at).format('YYYY-MM-DD')
          }
          this.dialogVisible = true
        } else {
          return false
        }
      })
    },
    async submitApply() {
      this.submitDisable = true
      const result = this.$route.query.apply_id ? await this.ApiLists.editPayApply(this.formData) : await this.ApiLists.addPayApply(this.formData)
      if (result.code === 0) {
        this.disableTimer = setTimeout(() => {
          this.submitDisable = false
          clearTimeout(this.disableTimer)
        }, 5000)
        this.$message.success('提交成功')
        this.dialogVisible = false
        this.$router.back()
      } else {
        this.$message.error(result.msg)
        this.disableTimer = setTimeout(() => {
          this.submitDisable = false
          clearTimeout(this.disableTimer)
        }, 5000)
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
::v-deep .borderNone {
  .el-input {
    border: none;
  }
  input {
    border: none;
  }
}
.monry_cash_form {
  .content_box {
    padding: 20px 260px;
    .title {
      font-size: 18px;
      font-weight: 600;
      padding-bottom: 20px;
    }
  }
  .confirm_box {
    .title {
      font-weight: 600;
      margin-bottom: 20px;
    }
    div {
      display: flex;
      line-height: 40px;
      height: 40px;
      margin-bottom: 10px;
      p {
        &:nth-of-type(1) {
          width: 200px;
          text-align: right;
        }
      }
    }
  }
}
</style>
