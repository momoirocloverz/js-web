<template>
  <div class="deadApplyCon">
    <div class="main-container">
      <div class="stepCon" v-if="status > 30">
        <div class="stepTitleCon">项目申报进度</div>
        <threeNewStep :currentActive="currentActive" />
      </div>
      <div class="form-container">
        <el-form :model="formData" :rules="rules" ref="form" label-width="140px" label-position="left" :disabled="status > 30 && status != 33">
          <div class="sub-title">基本信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="时间区间" prop="section">
                <el-date-picker v-model="formData.section" type="daterange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请单位" prop="apply_company">
                <el-input maxlength="50" v-model.trim="formData.apply_company" placeholder="请输入申请单位"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="经手人" prop="js_person">
                <el-input maxlength="10" v-model.trim="formData.js_person" placeholder="请输入经手人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经手人联系方式" prop="js_person_mobile">
                <el-input maxlength="11" v-model.trim="formData.js_person_mobile" placeholder="请输入经手人联系方式"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="负责人" prop="link_principal">
                <el-input maxlength="10" v-model.trim="formData.link_principal" placeholder="请输入负责人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人联系电话" prop="link_principal_mobile">
                <el-input maxlength="11" v-model.trim="formData.link_principal_mobile" placeholder="请输入负责人联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="审核人" prop="check_person">
                <el-input maxlength="50" v-model.trim="formData.check_person" placeholder="请输入审核人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核人联系电话" prop="check_person_mobile">
                <el-input maxlength="11" v-model.trim="formData.check_person_mobile" placeholder="请输入审核人联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="sub-title">汇总清单</div>
          <div class="describe">单位：头、元/头、吨、元/吨</div>
          <div class="tableCon">
            <el-table class="basic-table" :data="formData.dynamicTable" border show-summary :summary-method="getSummaries">
              <el-table-column label="序号" align="center" width="80">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="类型" align="center" prop="type">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.type }}</span>
                  <el-form-item v-else class="removeMarginItem" :prop="'dynamicTable.' + scope.$index + '.type'" :rules="[{ required: true, message: '类型不能为空' }]" :key="scope.$index">
                    <el-select v-model="scope.row.type" placeholder="请选择" disabled>
                      <el-option v-for="item in commonOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="数量(头)" align="center" prop="number">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.number }}</span>
                  <el-form-item v-else class="removeMarginItem" :prop="'dynamicTable.' + scope.$index + '.number'" :rules="[{ required: true, message: '数量不能为空' }]" :key="scope.$index">
                    <el-input maxlength="50" v-model.trim="scope.row.number" placeholder="请输入" disabled></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="重量(kg)" align="center" prop="weight">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.weight }}</span>
                  <el-form-item
                    v-else
                    class="removeMarginItem"
                    :prop="'dynamicTable.' + scope.$index + '.weight'"
                    :rules="[{ required: !scope.row.filed_writable, message: '重量不能为空' }]"
                    :key="scope.$index"
                  >
                    <el-input maxlength="50" v-model.trim="scope.row.weight" placeholder="请输入" :disabled="!scope.row.filed_writable"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="补贴标准" align="center" prop="subsidy_standard">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.subsidy_standard }}</span>
                  <el-form-item
                    v-else
                    class="removeMarginItem"
                    :prop="'dynamicTable.' + scope.$index + '.subsidy_standard'"
                    :rules="[{ required: true, message: '补贴标准不能为空' }]"
                    :key="scope.$index"
                  >
                    <el-input maxlength="50" v-model.trim="scope.row.subsidy_standard" placeholder="请输入" :disabled="!scope.row.filed_writable"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="补贴金额(元)" prop="subsidy_amount" align="center">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.subsidy_amount }}</span>
                  <el-form-item
                    v-else
                    class="removeMarginItem"
                    :prop="'dynamicTable.' + scope.$index + '.subsidy_amount'"
                    :rules="[{ required: true, message: '补贴金额不能为空' }]"
                    :key="scope.$index"
                  >
                    <el-input-number
                      class="inputNumberSet"
                      @change="changePrePay(scope.row)"
                      controls-position="right"
                      :min="0"
                      :disabled="!scope.row.filed_writable"
                      :max="9999999999"
                      :precision="2"
                      v-model="scope.row.subsidy_amount"
                      :step="1"
                      placeholder="请输入数量"
                    ></el-input-number>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="预拨付70%" align="center" prop="pre_pay">
                <template slot-scope="scope">
                  <span>{{ scope.row.pre_pay }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <div><el-button type="text" class="redColor" @click="deleteCurrent(scope.$index)" v-if="scope.$index && status > 30 && status != 33">删除</el-button></div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="add-btn" v-if="false" @click="addDist(index)" style="width: 100px">
            <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" alt="新增" class="icon" />
            <div class="add-text">新增批次</div>
          </div>
          <div style="text-align: center; margin-top: 20px" v-if="!(status > 30 && status != 33)">
            <el-button type="primary" class="submitBtn" @click="onSubmit('form')" size="small" :disabled="disableBtn">提交</el-button>
            <el-button type="primary" class="submitBtn" plain @click="saveDraft" size="small" :disabled="disableBtn">保存草稿</el-button>
          </div>
        </el-form>
      </div>
      <div>
        <recordCon type="10" :basicTable="basicTable" v-if="status > 0" />
      </div>
    </div>
  </div>
</template>

<script>
import { num2Char } from '@/plugins/util'
export default {
  data() {
    return {
      currentActive: 0,
      editStatus: false,
      status: 0,
      is_draft: 0,
      rules: {
        section: [{ required: true, message: '请输入', trigger: 'blur' }],
        js_person: [{ required: true, message: '请输入', trigger: 'blur' }],
        js_person_mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            required: true,
            message: '请输入正确的手机号',
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur'
          }
        ],
        link_principal: [{ required: true, message: '请输入', trigger: 'blur' }],
        apply_company: [{ required: true, message: '请输入', trigger: 'blur' }],
        link_principal_mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            required: true,
            message: '请输入正确的手机号',
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur'
          }
        ],
        check_person: [{ required: true, message: '请输入', trigger: 'blur' }],
        check_person_mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            required: true,
            message: '请输入正确的手机号',
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur'
          }
        ]
      },
      basicTable: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      formData: {
        js_person: '',
        js_person_mobile: '',
        section: '',
        link_principal: '',
        dynamicTable: [],
        apply_company: '',
        link_principal_mobile: '',
        check_person: '',
        check_person_mobile: '',
        mobile: ''
      },
      commonOptions: [
        {
          label: '猪',
          value: 1
        },
        {
          label: '牛',
          value: 2
        },
        {
          label: '羊',
          value: 3
        },
        {
          label: '家禽',
          value: 4
        },
        {
          label: '死胎',
          value: 5
        },
        {
          label: '胎衣',
          value: 6
        },
        {
          label: '其他',
          value: 7
        }
      ],
      disableBtn: false,
      disableTimer: null
    }
  },
  mounted() {
    this.getData(this.$route.query.project_id)
  },
  methods: {
    changePrePay(item) {
      if (item.subsidy_amount) {
        let amount = Number(item.subsidy_amount)
        item.pre_pay = parseFloat(amount * 0.7).toFixed(1)
      } else {
        item.pre_pay = ''
      }
    },
    deleteCurrent(index) {
      this.formData.dynamicTable.splice(index, 1)
      this.$forceUpdate()
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (column.label == '数量(头)') {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' 头'
          } else {
            sums[index] = ''
          }
        }
        if (column.label == '重量(kg)') {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' kg'
          } else {
            sums[index] = ''
          }
        }
        if (column.label == '补贴金额(元)') {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' 元'
          } else {
            sums[index] = ''
          }
        }
        if (column.label == '预拨付70%') {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' 元'
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
    },
    exportStatus(value) {
      if (String(value).startsWith('3')) {
        if (+value == 30 || +value == 33) {
          return 1
        } else {
          return 2
        }
      } else if (String(value).startsWith('4')) {
        return 3
      }
    },
    getDetail() {
      this.ApiLists.getWhhFinalSubsidyDetail({
        project_id: this.$route.query.project_id
      })
        .then((res) => {
          if (res.data && res.data.length) {
            res.data.forEach((item) => {
              if (item.type == 7) {
                // 其他 类型
                item.filed_writable = true
              }
            })
            this.formData.dynamicTable = res.data
            this.$forceUpdate()
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    getData(project_id) {
      this.ApiLists.getWhhFinalSubsidy({ project_id }).then((res) => {
        this.status = res.data.status
        this.is_draft = res.data.is_draft
        this.formData = res.data
        if (res.data.start_section) {
          this.formData.section = [res.data.start_section, res.data.end_section]
        }
        let active = this.exportStatus(this.status)
        this.currentActive = active
        this.initRequest()
        if (this.status == 30) {
          this.getDetail()
        }
        if (this.status > 30) {
          const { apply_collect_list } = res.data
          if (apply_collect_list) {
            let list = JSON.parse(apply_collect_list)
            list.forEach((item) => {
              if (item.type == 7) {
                // 其他 类型
                item.filed_writable = true
              }
            })
            this.formData.dynamicTable = list
          }
        }
      })
    },
    initRequest() {
      const params = {
        project_id: this.$route.query.project_id,
        record_type: 10
      }
      this.ApiLists.fetchDeclarationRecordList(params).then((res) => {
        this.basicTable = res.data.list
      })
    },
    onSubmit(formName) {
      this.disableBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formData.dynamicTable && this.formData.dynamicTable.length) {
            let data = this.finalData()
            data.form_status = 1
            this.ApiLists.applyWhhFinalSubsidy(data)
              .then((res) => {
                if (res && res.code == 0) {
                  this.$message.success('提交成功')
                  this.getData(this.$route.query.project_id)
                  // this.$router.push({
                  //   path: '/project',
                  //   query: {
                  //     currentActiveIndex: 1
                  //   }
                  // })
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
          } else {
            this.disableBtn = false
            return this.$message.error('汇总清单不能为空')
          }
        } else {
          this.disableBtn = false
          return false
        }
      })
    },
    finalData() {
      let data = {
        project_id: this.$route.query.project_id,
        link_principal: this.formData.link_principal,
        link_principal_mobile: this.formData.link_principal_mobile,
        js_person_mobile: this.formData.js_person_mobile,
        check_person: this.formData.check_person,
        check_person_mobile: this.formData.check_person_mobile,
        js_person: this.formData.js_person,
        form_status: this.is_draft ? 0 : 1,
        apply_company: this.formData.apply_company,
        start_section: '',
        end_section: ''
      }
      if (this.formData.section && this.formData.section.length) {
        data.start_section = this.Dayjs(this.formData.section[0]).format('YYYY/MM/DD')
        data.end_section = this.Dayjs(this.formData.section[1]).format('YYYY/MM/DD')
      }
      if (this.formData.dynamicTable.length) {
        data.apply_collect_list = JSON.stringify(this.formData.dynamicTable)
      } else {
        data.apply_collect_list = ''
      }
      return data
    },
    saveDraft() {
      this.disableBtn = true
      let data = this.finalData()
      data.form_status = 0
      this.ApiLists.applyWhhFinalSubsidy(data)
        .then((res) => {
          if (res && res.code == 0) {
            this.$message.success('保存成功')
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
    },
    toPolicy() {
      this.$router.push({
        path: '/policy'
      })
    },
    addDist(index) {
      if (this.status > 0) {
        return this.$message.error('申请已提交，不可修改')
      }
      this.formData.dynamicTable.push({ value: 1 })
    },
    num2Char
  }
}
</script>

<style lang="less" scoped>
.deadApplyCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);

  .main-container {
    width: 1200px;
    margin: 0 auto;
    // padding-top: 30px;
    box-sizing: border-box;

    .stepCon {
      padding: 40px;
      box-sizing: border-box;
      background-color: #fff;
    }
    .stepTitleCon {
      margin-bottom: 10px;
      font-size: 16px;
    }
    .recordCon {
      margin-top: 20px;
      padding: 40px;
      box-sizing: border-box;
      background-color: #fff;
    }
    .recordTitleCon {
      margin-bottom: 10px;
      font-size: 16px;
    }
    .describe {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    .form-container {
      margin-top: 20px;
      padding: 40px;
      box-sizing: border-box;
      background-color: #fff;
      margin-bottom: 20px;

      .sub-title {
        color: #606266;
        font-size: 16px;
        margin-bottom: 20px;
        font-weight: bold;
        // margin-top: 20px;
      }

      .dist-item {
        position: relative;
      }

      .del-btn {
        color: #f56c6c;
        cursor: pointer;

        &.inner {
          position: absolute;
          left: 0;
          top: 6px;
        }

        &.out {
          position: absolute;
          right: 20px;
          top: 20px;
          z-index: 1;
        }
      }

      .add-btn {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-top: 20px;
        margin-bottom: 20px;

        &.out {
          padding: 15px 15px 15px 22px;
          margin-left: 80px;
        }

        .icon {
          width: 16px;
          height: 16px;
          margin-right: 10px;
        }

        .add-text {
          font-weight: bold;
          color: #1b82ec;
        }
      }

      .file-container {
        padding: 0 40px;
      }
    }

    .select-area {
      color: #606266;
      margin-bottom: 20px;
      font-weight: bold;
    }
  }
}
.pagination-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  margin-top: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
</style>

<style lang="less">
.deadApplyCon {
  .inputNumberSet {
    width: 100%;
    input {
      text-align: left;
    }
  }
  .removeMarginItem {
    margin-top: 10px;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .left-label {
    .el-form-item__label {
      text-align: left;
    }
  }
  .redColor {
    color: #f56c6c;
  }
  .crops-item {
    margin-left: 80px;
    margin-bottom: 20px;
    position: relative;
  }

  .el-button--primary {
    background-color: #2d6fbd;
    border-color: #2d6fbd;

    &:hover {
      opacity: 0.8;
    }

    &.is-plain {
      background-color: #fff;
      border-color: #2d6fbd;
      color: #2d6fbd;

      &:hover {
        color: #2d6fbd;
      }
    }
  }
}
</style>
