<template>
  <div class="organicDeclareCon">
    <div class="main-container">
      <helpCom class="setHelpPosition" :name="currentInfo.linkman && currentInfo.linkman.real_name" :phone="currentInfo.linkman && currentInfo.linkman.mobile" />
      <div class="breadcrumb-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toPolicy">惠农政策申报</el-breadcrumb-item>
          <el-breadcrumb-item>湖羊产业扶持</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="stepCon" v-if="status > 0">
        <div class="stepTitleCon">项目申报进度</div>
        <sheepNewStep :currentActive="currentActive" />
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
              <el-form-item label="负责人" prop="principal">
                <el-input maxlength="50" v-model.trim="formData.principal" placeholder="请输入负责人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话" prop="mobile">
                <el-input maxlength="11" v-model.trim="formData.mobile" placeholder="请输入电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="地址" prop="area_ids">
                <el-cascader
                  :style="{ width: '100%' }"
                  v-model="formData.area_ids"
                  :disabled="$route.query.project_id > 0"
                  :options="areaList"
                  :props="{
                    label: 'name',
                    value: 'id'
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请单位开户银行" prop="bank">
                <el-input maxlength="50" v-model.trim="formData.bank" placeholder="请输入申请单位开户银行"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="详细办公地址" prop="address">
                <el-input maxlength="50" v-model.trim="formData.address" placeholder="请输入详细办公地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号" prop="bank_account">
                <el-input maxlength="50" v-model.trim="formData.bank_account" placeholder="请输入银行账号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系人" prop="link_person">
                <el-input maxlength="50" v-model.trim="formData.link_person" placeholder="请输入联系人姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>
          <div class="sub-title">扶持内容</div>
          <div class="tableCon">
            <el-table class="basic-table" :data="formData.dynamicTable" border show-summary :summary-method="getSummaries">
              <el-table-column label="内容" align="center" prop="content">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.content }}</span>
                  <el-form-item
                    v-else
                    class="removeMarginItem"
                    :prop="'dynamicTable.' + scope.$index + '.content'"
                    :rules="[{ required: true, message: '内容不能为空', trigger: 'blur' }]"
                    :key="scope.$index"
                  >
                    <el-input maxlength="50" v-model.trim="scope.row.content" placeholder="请输入"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="数量" align="center" prop="number">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.number }}</span>
                  <el-form-item
                    v-else
                    class="removeMarginItem"
                    :prop="'dynamicTable.' + scope.$index + '.number'"
                    :rules="[{ required: true, message: '数量不能为空', trigger: 'blur' }]"
                    :key="scope.$index"
                  >
                    <el-input maxlength="50" v-model.trim="scope.row.number" placeholder="请输入"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="单价" align="center" prop="price">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.price }}</span>
                  <el-form-item
                    v-else
                    class="removeMarginItem"
                    :prop="'dynamicTable.' + scope.$index + '.price'"
                    :rules="[{ required: true, message: '单价不能为空', trigger: 'blur' }]"
                    :key="scope.$index"
                  >
                    <el-input maxlength="50" v-model.trim="scope.row.price" placeholder="请输入"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="面积（平方米）" align="center" prop="area">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.area }}</span>
                  <el-form-item
                    v-else
                    class="removeMarginItem"
                    :prop="'dynamicTable.' + scope.$index + '.area'"
                    :rules="[{ required: true, message: '面积不能为空', trigger: 'blur' }]"
                    :key="scope.$index"
                  >
                    <el-input maxlength="50" v-model.trim="scope.row.area" placeholder="请输入"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="要求补助资金（万元）" prop="help_price" align="center">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.help_price }}</span>
                  <el-form-item
                    v-else
                    class="removeMarginItem"
                    :prop="'dynamicTable.' + scope.$index + '.help_price'"
                    :rules="[{ required: true, message: '要求补助资金不能为空', trigger: 'blur' }]"
                    :key="scope.$index"
                  >
                    <el-input maxlength="50" v-model.trim="scope.row.help_price" placeholder="请输入"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center" prop="remark">
                <template slot-scope="scope">
                  <span v-if="editStatus">{{ scope.row.remark }}</span>
                  <el-form-item
                    v-else
                    class="removeMarginItem"
                    :prop="'dynamicTable.' + scope.$index + '.remark'"
                    :rules="[{ required: true, message: '备注不能为空', trigger: 'blur' }]"
                    :key="scope.$index"
                  >
                    <el-input maxlength="50" v-model.trim="scope.row.remark" placeholder="请输入"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <div><el-button type="text" class="redColor" @click="deleteCurrent(scope.row)" v-if="status == 0 && scope.$index">删除</el-button></div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="add-btn" @click="addDist" style="width: 100px" v-if="!(!areaId.length || (status > 0 && is_draft == 0))">
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
        <recordCon type="9" :basicTable="basicTable" v-if="status > 0" />
      </div>
    </div>
  </div>
</template>

<script>
import { num2Char } from '@/plugins/util'
export default {
  layout: 'main',
  head() {
    return {
      title: '惠农政策申报详情',
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: '江山农业项目投资一件事'
        },
        {
          hid: 'description',
          name: 'description',
          content: '江山农业项目投资一件事'
        }
      ]
    }
  },
  data() {
    return {
      currentActive: 1,
      editStatus: false,
      status: 0,
      is_draft: 0,
      rules: {
        principal: [{ required: true, message: '请输入', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            required: true,
            message: '请输入正确的手机号',
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur'
          }
        ],
        address: [{ required: true, message: '请输入', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入', trigger: 'blur' }],
        bank_account: [{ required: true, message: '请输入', trigger: 'blur' }],
        link_person: [{ required: true, message: '请输入', trigger: 'blur' }],
        area_ids: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      basicTable: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      formData: {
        dynamicTable: [
          {
            content: '',
            number: '',
            price: '',
            area: '',
            help_price: '',
            remark: ''
          }
        ],
        principal: '',
        area_ids: '',
        city: '',
        city_str: '',
        mobile: '',
        address: '',
        bank: '',
        bank_account: '',
        link_person: '',
        mobile: ''
      },
      areaList: [],
      areaId: [],
      fileList: {
        51: [],
        52: [],
        53: [],
        54: [],
        55: [],
        56: []
      },
      staticImgsIndex: [51, 52, 53, 54, 55, 56],
      fileMap: [
        {
          label: '1.设施农业用地备案',
          which_type: 51
        },
        {
          label: '2.环评证明',
          which_type: 52
        },
        {
          label: '3.营业执照',
          which_type: 53
        },
        {
          label: '4.引种证明材料（发票、运输证明、系谱）',
          which_type: 54
        },
        {
          label: '5.养殖档案',
          which_type: 55
        },
        {
          label: '6.其他证明材料',
          which_type: 56
        }
      ],
      disableBtn: false,
      disableTimer: null,
      currentInfo: {}
    }
  },
  mounted() {
    this.getAreaList()
    this.initHelp()
  },
  methods: {
    initHelp() {
      let data = {
        id: this.$route.query.policy_document_id
      }
      this.ApiLists.fetchPolicyDocumentInfo(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.currentInfo = res.data
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    checkPolicy() {
      this.$router.push({
        path: '/policy/detail',
        query: {
          id: this.$route.query.policy_document_id
        }
      })
    },
    deleteCurrent(item) {
      var index = this.formData.dynamicTable.indexOf(item)
      if (index !== -1) {
        this.formData.dynamicTable.splice(index, 1)
      }
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
        if (column.label == '数量') {
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
        if (column.label == '要求补助资金（万元）') {
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
      if (String(value).startsWith('0')) {
        return 1
      } else if (String(value).startsWith('1')) {
        return 2
      } else if (String(value).startsWith('2')) {
        return 3
      } else if (String(value).startsWith('3')) {
        return 4
      } else if (String(value).startsWith('4')) {
        return 5
      } else if (String(value).startsWith('5')) {
        return 6
      } else if (String(value).startsWith('6')) {
        return 7
      }
    },
    getData(project_id) {
      this.ApiLists.getHySubsidy({ project_id }).then((res) => {
        this.status = res.data.status
        this.is_draft = res.data.is_draft
        this.formData = res.data
        this.areaId = [res.data.city_id, res.data.town_id, res.data.village_id]
        this.formData.area_ids = [res.data.city_id, res.data.town_id, res.data.village_id]
        this.fileList = res.data.materials_list
        this.formData.dynamicTable = res.data.support_content || [
          {
            content: '',
            number: '',
            price: '',
            area: '',
            help_price: '',
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
    initRequest() {
      const params = {
        project_id: this.$route.query.project_id,
        record_type: 9
      }
      this.ApiLists.fetchDeclarationRecordList(params).then((res) => {
        this.basicTable = res.data.list
      })
    },
    updateImage(whichType, id) {
      this.ApiLists.getHySubsidy({ project_id: this.$route.query.project_id }).then((res) => {
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
        principal: this.formData.principal,
        address: this.formData.address,
        link_person: this.formData.link_person,
        form_status: this.is_draft ? 0 : 1,
        bank_account: this.formData.bank_account,
        mobile: this.formData.mobile,
        bank: this.formData.bank,
        city_id: this.areaId[0],
        town_id: this.areaId[1],
        village_id: this.areaId[2]
      }
      if (this.formData.dynamicTable.length) {
        data.support_content = JSON.stringify(this.formData.dynamicTable)
      } else {
        data.support_content = ''
      }
      return data
    },
    saveDraft() {
      this.disableBtn = true
      let data = this.finalData()
      this.ApiLists.applyHySubsidy(data)
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
              this.ApiLists.applyHySubsidy(data)
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
      this.ApiLists.getHySubsidyId(params).then((res) => {
        if (res && res.code === 0) {
          this.$router.replace({
            path: '/sheep',
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
    addDist() {
      if (this.status > 0) {
        return this.$message.error('申请已提交，不可修改')
      }
      this.formData.dynamicTable.push({
        content: '',
        number: '',
        price: '',
        area: '',
        help_price: '',
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
.setHelpPosition {
  position: fixed;
  right: 290px;
  bottom: 300px;
  //   right: -70px;
  //   top: 50px;
}
.organicDeclareCon {
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
    padding-top: 30px;
    box-sizing: border-box;

    .stepCon {
      margin-top: 20px;
      padding: 40px;
      box-sizing: border-box;
      background-color: #fff;
    }
    .stepTitleCon {
      margin-bottom: 20px;
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
.organicDeclareCon {
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
