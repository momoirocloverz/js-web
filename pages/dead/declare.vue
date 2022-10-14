<template>
  <div class="deadDeclareCon">
    <div class="main-container">
      <div class="stepCon" v-if="status > 0">
        <div class="stepTitleCon">项目申报进度</div>
        <threeNewStep :currentActive="currentActive" />
      </div>
      <div class="form-container">
        <div class="flexBetween">
          <div class="select-area">
            <span>地址：</span>
            <el-cascader
              :style="{ width: '200px' }"
              v-model="areaId"
              :disabled="$route.query.project_id > 0"
              size="small"
              :options="areaList"
              @change="onAddressChange"
              :props="{
                label: 'name',
                value: 'id'
              }"
            />
            <span style="color: #f56c6c; font-weight: normal" v-if="!$route.query.project_id || !areaId.length">*请先选择地址</span>
          </div>
          <el-button class="checkSource" plain @click="checkPolicy">查看相关政策</el-button>
        </div>
        <el-form :model="formData" :rules="rules" ref="form" label-width="140px" :disabled="!areaId.length || (status > 0 && is_draft == 0)" label-position="left">
          <div class="sub-title">基本信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="月份" prop="month">
                <el-date-picker v-model="formData.month" type="month" placeholder="选择月"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="责任公司" prop="duty_company">
                <el-input maxlength="50" v-model.trim="formData.duty_company" placeholder="请输入责任公司"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系电话" prop="link_mobile">
                <el-input maxlength="11" v-model.trim="formData.link_mobile" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否有保险" prop="is_insurance">
                <el-radio-group v-model="formData.is_insurance">
                  <el-radio-button label="1">是</el-radio-button>
                  <el-radio-button label="2">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="sub-title">汇总清单</div>
          <div class="tableCon">
            <el-table class="basic-table" :data="formData.dynamicTable" border show-summary :summary-method="getSummaries">
              <el-table-column label="序号" align="center" width="80">
                <template slot-scope="scope">
                  <div>{{ scope.$index + 1 }}</div>
                </template>
              </el-table-column>
              <el-table-column label="类型" align="center" prop="type">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ commonMatchOptions[scope.row.type] }}</span>
                  <el-form-item v-else class="removeMarginItem" :prop="'dynamicTable.' + scope.$index + '.type'" :rules="[{ required: true, message: '类型不能为空' }]" :key="scope.$index">
                    <el-select v-model="scope.row.type" placeholder="请选择" @change="typeChange(scope)">
                      <el-option v-for="item in commonOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="数量(头)" align="center" prop="number">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.number }}</span>
                  <el-form-item
                    v-else
                    class="removeMarginItem"
                    :prop="'dynamicTable.' + scope.$index + '.number'"
                    :rules="[{ required: !scope.row.number_disabled, message: '数量不能为空' }]"
                    :key="scope.$index"
                  >
                    <el-input maxlength="50" v-model.trim="scope.row.number" placeholder="请输入" :disabled="scope.row.number_disabled"></el-input>
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
                    :rules="[{ required: !scope.row.weight_disabled, message: '重量不能为空' }]"
                    :key="scope.$index"
                  >
                    <el-input maxlength="50" v-model.trim="scope.row.weight" placeholder="请输入" :disabled="scope.row.weight_disabled"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="其中无保险数量" align="center" prop="number_no_ins">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.number_no_ins }}</span>
                  <el-form-item v-else class="removeMarginItem" :prop="'dynamicTable.' + scope.$index + '.number_no_ins'" :rules="[{ required: true, message: '数量不能为空' }]" :key="scope.$index">
                    <el-input maxlength="50" v-model.trim="scope.row.number_no_ins" placeholder="请输入"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center" prop="remark">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.remark }}</span>
                  <el-form-item v-else class="removeMarginItem" :prop="'dynamicTable.' + scope.$index + '.remark'" :rules="[{ required: true, message: '备注不能为空' }]" :key="scope.$index">
                    <el-input maxlength="50" v-model.trim="scope.row.remark" placeholder="请输入"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <div><el-button type="text" class="redColor" v-if="scope.$index && status == 0" @click="deleteCurrent(scope.$index)">删除</el-button></div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="add-btn" @click="addDist(index)" style="width: 100px" v-if="!(!areaId.length || (status > 0 && is_draft == 0))">
            <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" alt="新增" class="icon" />
            <div class="add-text">新增批次</div>
          </div>
          <div class="sub-title">材料上传</div>
          <div style="padding-left: 20px; margin-bottom: 20px" v-for="item in fileMap" :key="item.which_type">
            <el-form-item
              :label="item.label"
              :rules="{
                required: true
              }"
              label-width="100%"
              class="left-label"
            />
            <div class="file-container">
              <imgUpload
                :size="50"
                :originList="fileList[item.which_type]"
                :limit="10"
                :whichType="item.which_type"
                @handleAddFile="handleAddFile"
                @handleRemoveFile="handleRemoveFile"
                accept=".doc,.docx,.jpg,.jpeg,.png,.pdf,.XLS,.XLSX,.csv,.wps,.zip,.rar"
                :status="status"
              />
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px" v-if="!(!areaId.length || (status > 0 && is_draft == 0))">
            <el-button type="primary" class="submitBtn" @click="onSubmit('form')" size="small" :disabled="disableBtn">提交</el-button>
            <el-button type="primary" class="submitBtn" plain @click="saveDraft" size="small" :disabled="disableBtn">保存草稿</el-button>
          </div>
        </el-form>
      </div>
      <div>
        <recordCon type="10" :basicTable="basicTable" v-show="status > 0" />
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
      commonMatchOptions: {
        1: '猪',
        2: '牛',
        3: '羊',
        4: '家禽',
        5: '死胎',
        6: '胎衣',
        7: '其他'
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
      rules: {
        month: [{ required: true, message: '请输入', trigger: 'blur' }],
        link_mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            required: true,
            message: '请输入正确的手机号',
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur'
          }
        ],
        duty_company: [{ required: true, message: '请输入', trigger: 'blur' }],
        area_ids: [{ required: true, message: '请输入', trigger: 'blur' }],
        is_insurance: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      basicTable: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      formData: {
        is_insurance: '1',
        month: '',
        dynamicTable: [
          {
            type: '',
            number: '',
            weight: '',
            number_no_ins: '',
            remark: ''
          }
        ],
        area_ids: '',
        city: '',
        link_mobile: '',
        duty_company: ''
      },
      areaList: [],
      areaId: [],
      fileList: {
        61: []
      },
      staticImgsIndex: [61],
      fileMap: [
        {
          label: '台账明细清单',
          which_type: 61
        }
      ],
      disableBtn: false,
      disableTimer: null
    }
  },
  mounted() {
    this.getAreaList()
  },
  methods: {
    checkPolicy() {
      this.$router.push({
        path: '/policy/detail',
        query: {
          id: this.$route.query.policy_document_id
        }
      })
    },
    typeChange(scope) {
      if (scope.row.type == 7) {
        scope.row.number_disabled = false
        scope.row.weight_disabled = false
      } else if (scope.row.type <= 3) {
        scope.row.number_disabled = false
        scope.row.weight_disabled = true
      } else {
        scope.row.number_disabled = true
        scope.row.weight_disabled = false
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
        if (column.label == '其中无保险数量') {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' '
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
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
    exportStatus(value) {
      if (String(value).startsWith('0')) {
        return 1
      } else if (String(value).startsWith('1')) {
        return 2
      } else if (String(value).startsWith('2')) {
        return 3
      } else if (String(value).startsWith('3')) {
        return 3
      } else if (String(value).startsWith('4')) {
        return 3
      }
    },
    getData(project_id) {
      this.ApiLists.getWhhSubsidy({ project_id }).then((res) => {
        this.status = res.data.status
        this.$emit('fetchStatus', res.data.status)
        this.is_draft = res.data.is_draft
        this.fileList = res.data.materials_list
        this.formData = res.data
        this.areaId = [res.data.city_id, res.data.town_id, res.data.village_id]
        this.formData.is_insurance = res.data.is_insurance || '1'
        this.formData.dynamicTable = res.data.collect_list || [
          {
            type: '',
            number: '',
            weight: '',
            number_no_ins: '',
            remark: ''
          }
        ]
        let active = this.exportStatus(this.status)
        this.currentActive = active
        if (this.status > 0) {
          this.initRequest()
        }
      })
    },
    updateImage(whichType, id) {
      this.ApiLists.getWhhSubsidy({ project_id: this.$route.query.project_id }).then((res) => {
        const { materials_list } = res.data
        const updateImageCollect = materials_list[whichType]
        // 最后一项 新增的push进去
        if (updateImageCollect) {
          if (!this.fileList[whichType]) this.$set(this.fileList, whichType, [])
          if (updateImageCollect.length > this.fileList[whichType].length) {
            // 新增
            const newFileList = this.fileList[whichType].concat([updateImageCollect[0]])
            this.$set(this.fileList, whichType, newFileList)
            // this.fileList[whichType].push(updateImageCollect[0])
          } else {
            // 删除
            const idx = this.fileList[whichType].findIndex((v) => v.id == id)
            this.fileList[whichType].splice(idx, 1)
          }
        } else {
          this.fileList[whichType] = []
        }
      })
    },
    finalData() {
      let data = {
        project_id: this.$route.query.project_id,
        duty_company: this.formData.duty_company,
        month: this.formData.month ? this.Dayjs(this.formData.month).format('YYYY/MM') : '',
        is_insurance: this.formData.is_insurance,
        form_status: this.is_draft ? 0 : 1,
        link_mobile: this.formData.link_mobile
      }
      if (this.formData.dynamicTable.length) {
        this.formData.dynamicTable.forEach((ele) => {
          ele.number = ele.number ? ele.number : 0
          ele.weight = ele.weight ? ele.weight : 0
        })
        data.collect_list = JSON.stringify(this.formData.dynamicTable)
      } else {
        data.collect_list = ''
      }
      return data
    },
    saveDraft() {
      this.disableBtn = true
      let data = this.finalData()
      this.ApiLists.applyWhhSubsidy(data)
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
    onSubmit(formName) {
      this.disableBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formData.dynamicTable && this.formData.dynamicTable.length) {
            let imgsVlidate = this.staticImgsIndex.some((key) => {
              return !this.fileList[key] || !this.fileList[key].length
            })
            if (imgsVlidate) {
              this.disableBtn = false
              return this.$message.error('缺少材料，每类材料都需上传')
            } else {
              let data = this.finalData()
              data.form_status = 1
              this.ApiLists.applyWhhSubsidy(data)
                .then((res) => {
                  if (res && res.code == 0) {
                    this.$message.success('提交成功')
                    this.getData(this.$route.query.project_id)
                    //   this.$router.push({
                    //     path: '/project',
                    //     query: {
                    //       currentActiveIndex: 1
                    //     }
                    //   })
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
          } else {
            this.disableBtn = false
            return this.$message.error('扶持内容不能为空')
          }
        } else {
          this.disableBtn = false
          return false
        }
      })
    },
    handleAddFile(whichType) {
      // 每次添加图片 重新获取信息
      // console.log('添加图片whichType', whichType)
      this.updateImage(whichType)
      // this.formData['image'] = e.join(',')
    },
    handleRemoveFile(whichType, id) {
      // 每次删除图片 重新获取信息
      // console.log('删除图片whichType', whichType, id)
      this.updateImage(whichType, id)
    },
    onAddressChange(e) {
      if (!e || e.length === 0) {
        this.$message.error('请选择承包地址')
        return
      }
      const params = {
        project_id: this.$route.query.project_id || null,
        policy_document_id: this.$route.query.policy_document_id || null,
        city_id: e[0],
        town_id: e[1],
        village_id: e[2]
      }
      this.ApiLists.getWhhSubsidyId(params).then((res) => {
        if (res && res.code === 0) {
          this.$router.replace({
            path: '/dead',
            query: {
              project_id: res.data,
              policy_document_id: this.$route.query.policy_document_id
            }
          })
          this.getData(res.data, true)
        } else {
          this.$message.error(res.msg)
        }
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
      this.formData.dynamicTable.push({
        type: '',
        number: '',
        weight: '',
        number_no_ins: '',
        remark: ''
      })
    },
    getAreaList() {
      this.ApiLists.getAreaList().then((res) => {
        if (res && res.code === 0) {
          this.areaList = res.data.list
          if (this.$route.query.project_id) {
            this.getData(this.$route.query.project_id)
          }
        }
      })
    },
    num2Char
  }
}
</script>

<style lang="less" scoped>
.deadDeclareCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
  .checkSource {
    color: #0270c3;
    border-color: #0270c3;
  }
  .flexBetween {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
  .main-container {
    width: 1200px;
    margin: 0 auto;
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
        margin-top: 20px;
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
      font-weight: bold;
      font-size: 16px;
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
.deadDeclareCon {
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
