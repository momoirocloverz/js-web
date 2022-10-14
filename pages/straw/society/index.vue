<template>
  <div class="societyDeclareCon">
    <div class="main-container">
      <helpCom class="setHelpPosition" :name="currentInfo.linkman && currentInfo.linkman.real_name" :phone="currentInfo.linkman && currentInfo.linkman.mobile" />
      <div class="breadcrumb-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toPolicy">惠农政策申报</el-breadcrumb-item>
          <el-breadcrumb-item>社会化服务补助申请</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="stepCon" v-if="status > 0">
        <div class="stepTitleCon">项目申报进度</div>
        <newStep :currentActive="currentActive" />
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
        <el-form :model="formData" :rules="rules" ref="form" label-width="160px" :disabled="!areaId.length || (status > 0 && is_draft == 0)" label-position="left">
          <div class="sub-title">基本信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="主体名称" prop="subject_name">
                <el-input maxlength="50" v-model.trim="formData.subject_name" placeholder="请输入主体名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人" prop="principal">
                <el-input maxlength="50" v-model.trim="formData.principal" placeholder="请输入负责人"></el-input>
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
              <el-form-item label="联系电话" prop="mobile">
                <el-input maxlength="11" v-model.trim="formData.mobile" placeholder="请输入联系电话"></el-input>
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
              <el-form-item label="使用主体承诺" prop="subject_promise">
                <el-input
                  maxlength="50"
                  type="textarea"
                  rows="5"
                  v-model.trim="formData.subject_promise"
                  placeholder="本人承诺该申报补贴的有机肥没有用于水产养殖和粮食功能区内非粮食作物种植等项目，并没有享受过其他财政补助的情况"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="sub-title">秸秆利用农机社会化服务补助资金申请</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开展服务农机类型" prop="agricultural_type">
                <el-input maxlength="50" v-model.trim="formData.agricultural_type" placeholder="请输入开展服务农机类型"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务方式" prop="serve_way">
                <el-input maxlength="50" v-model.trim="formData.serve_way" placeholder="请输入服务方式"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="服务面积(亩)" prop="serve_area">
                <el-input-number
                  class="inputNumberSet"
                  controls-position="right"
                  :min="0"
                  :max="9999999999"
                  :precision="2"
                  v-model="formData.serve_area"
                  :step="1"
                  placeholder="请输入服务面积"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务时间" prop="serve_at">
                <el-date-picker v-model="formData.serve_at" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :style="{ width: '100%' }"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="申请补助资金(万元)" prop="apply_price">
                <el-input-number
                  class="inputNumberSet"
                  controls-position="right"
                  :min="0"
                  :max="9999999999"
                  :precision="2"
                  v-model="formData.apply_price"
                  :step="1"
                  placeholder="请输入申请补助资金"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务地点" prop="serve_address">
                <el-input maxlength="50" v-model.trim="formData.serve_address" placeholder="请输入服务地点"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
        <recordCon type="8" :basicTable="basicTable" v-if="status > 0" />
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
      status: 0,
      is_draft: 0,
      rules: {
        subject_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        principal: [{ required: true, message: '请输入', trigger: 'blur' }],
        agricultural_type: [{ required: true, message: '请输入', trigger: 'blur' }],
        serve_way: [{ required: true, message: '请输入', trigger: 'blur' }],
        serve_area: [{ required: true, message: '请输入', trigger: 'blur' }],
        address: [{ required: true, message: '请输入', trigger: 'blur' }],
        apply_price: [{ required: true, message: '请输入', trigger: 'blur' }],
        serve_at: [{ required: true, message: '请输入', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            required: true,
            message: '请输入正确的手机号',
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur'
          }
        ],
        subject_promise: [{ required: true, message: '请输入', trigger: 'blur' }],
        area_ids: [{ required: true, message: '请输入', trigger: 'blur' }],
        serve_address: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      basicTable: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,

      formData: {
        serve_address: '',
        serve_area: '',
        apply_price: '',
        area_ids: '',
        principal: '',
        subject_name: '',
        address: '',
        serve_at: '',
        serve_way: '',
        mobile: '',
        agricultural_type: '',
        subject_promise: ''
      },
      areaList: [],
      areaId: [],
      fileList: {
        41: [],
        42: []
      },
      staticImgsIndex: [41, 42],
      fileMap: [
        {
          label: '1.作业服务清单',
          which_type: 41
        },
        {
          label: '2.水印照片（社会化服务补助）',
          which_type: 42
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
    checkPolicy() {
      this.$router.push({
        path: '/policy/detail',
        query: {
          id: this.$route.query.policy_document_id
        }
      })
    },
    getData(project_id) {
      this.ApiLists.getShhSubsidy({ project_id }).then((res) => {
        this.status = res.data.status
        this.is_draft = res.data.is_draft
        this.formData = res.data
        this.areaId = [res.data.city_id, res.data.town_id, res.data.village_id]
        this.formData.area_ids = [res.data.city_id, res.data.town_id, res.data.village_id]
        if (res.data.serve_at) {
          let after = res.data.serve_at.split('-')
          this.formData.serve_at = [after[0], after[1]]
        } else {
          this.formData.serve_at = ''
        }
        this.fileList = res.data.materials_list
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
        record_type: 8
      }
      this.ApiLists.fetchDeclarationRecordList(params).then((res) => {
        this.basicTable = res.data.list
      })
    },
    updateImage(whichType, id) {
      this.ApiLists.getShhSubsidy({ project_id: this.$route.query.project_id }).then((res) => {
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
    onSubmit(formName) {
      this.disableBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let imgsVlidate = this.staticImgsIndex.some((key) => {
            return !this.fileList[key] || !this.fileList[key].length
          })
          if (imgsVlidate) {
            this.disableBtn = false
            return this.$message.error('缺少材料，每类材料都需上传')
          } else {
            let data = this.finalData()
            data.form_status = 1
            this.ApiLists.applyShhSubsidy(data)
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
        principal: this.formData.principal,
        subject_name: this.formData.subject_name,
        address: this.formData.address,
        agricultural_type: this.formData.agricultural_type,
        serve_way: this.formData.serve_way,
        form_status: this.is_draft ? 0 : 1,
        apply_price: this.formData.apply_price,
        serve_area: this.formData.serve_area,
        serve_at: this.formData.serve_at,
        mobile: this.formData.mobile,
        serve_address: this.formData.serve_address,
        subject_promise: this.formData.subject_promise,
        city_id: this.areaId[0],
        town_id: this.areaId[1],
        village_id: this.areaId[2]
      }
      if (this.formData.serve_at.length) {
        data.serve_at = this.Dayjs(this.formData.serve_at[0]).format('YYYY/MM/DD') + '-' + this.Dayjs(this.formData.serve_at[1]).format('YYYY/MM/DD')
      } else {
        data.serve_at = ''
      }
      return data
    },
    saveDraft() {
      this.disableBtn = true
      let data = this.finalData()
      this.ApiLists.applyShhSubsidy(data)
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
    handleAddFile(whichType) {
      this.updateImage(whichType)
    },
    handleRemoveFile(whichType, id) {
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
      this.ApiLists.getShhSubsidyId(params).then((res) => {
        if (res && res.code === 0) {
          this.$router.replace({
            path: '/straw/society',
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
.societyDeclareCon {
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
.societyDeclareCon {
  .inputNumberSet {
    width: 100%;
    input {
      text-align: left;
    }
  }
  .left-label {
    .el-form-item__label {
      text-align: left;
    }
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
