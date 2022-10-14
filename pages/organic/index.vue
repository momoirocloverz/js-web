<template>
  <div class="organicDeclareCon">
    <div class="main-container">
      <helpCom class="setHelpPosition" :name="currentInfo.linkman && currentInfo.linkman.real_name" :phone="currentInfo.linkman && currentInfo.linkman.mobile" />
      <div class="breadcrumb-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toPolicy">惠农政策申报</el-breadcrumb-item>
          <el-breadcrumb-item>有机肥经营补贴</el-breadcrumb-item>
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
        <el-form :model="formData" :rules="rules" ref="form" label-width="140px" :disabled="!areaId.length || (status > 0 && is_draft == 0)" label-position="left">
          <div class="sub-title">基本信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="粮食生产经营主体" prop="subject_name">
                <el-input maxlength="20" v-model.trim="formData.subject_name" placeholder="请输入粮食生产经营主体"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="肥料来源" prop="manure_from">
                <el-input maxlength="20" v-model.trim="formData.manure_from" placeholder="请输入肥料来源"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="地址" prop="area_ids">
                <el-cascader
                  :style="{ width: '100%' }"
                  v-model="formData.area_ids"
                  disabled
                  :options="areaList"
                  :props="{
                    label: 'name',
                    value: 'id'
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用数量(吨)" prop="use_num">
                <el-input-number
                  class="inputNumberSet"
                  controls-position="right"
                  :min="0"
                  :max="9999999999"
                  :precision="2"
                  v-model="formData.use_num"
                  :step="1"
                  placeholder="请输入数量"
                ></el-input-number>
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
              <el-form-item label="应用作物" prop="use_crop">
                <el-input maxlength="50" v-model.trim="formData.use_crop" placeholder="请输入详细办公地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="申报人姓名" prop="apply_name">
                <el-input maxlength="50" v-model.trim="formData.apply_name" placeholder="请输入申报人姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应用面积(亩)" prop="use_area">
                <el-input-number
                  class="inputNumberSet"
                  controls-position="right"
                  :min="0"
                  :max="9999999999"
                  :precision="2"
                  v-model="formData.use_area"
                  :step="1"
                  placeholder="请输入应用面积"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="申报人联系电话" prop="apply_mobile">
                <el-input maxlength="11" v-model.trim="formData.apply_mobile" placeholder="请输入申报人联系电话"></el-input>
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
          <div class="sub-title">使用情况</div>
          <template v-for="(item, index) in batchList">
            <el-form-item :key="index" :label="`批次${num2Char(index)}使用日期`" required>
              <el-date-picker v-model="item.value" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              <span @click="removeCurrent(index)" class="deleteBtn" v-if="index && status == 0">删除</span>
            </el-form-item>
          </template>
          <el-form-item>
            <div class="add-btn" @click="addDist(index)" style="width: 100px" v-if="status == 0">
              <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" alt="新增" class="icon" />
              <div class="add-text">新增批次</div>
            </div>
          </el-form-item>
          <div class="sub-title">补贴信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="申请补贴资金(元)" prop="subsidy_amount">
                <el-input-number
                  class="inputNumberSet"
                  controls-position="right"
                  :min="0"
                  :max="9999999999"
                  :precision="2"
                  v-model="formData.subsidy_amount"
                  :step="1"
                  placeholder="请输入金额"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购价格(元)" prop="purchas_amount">
                <el-input-number
                  class="inputNumberSet"
                  controls-position="right"
                  :min="0"
                  :max="9999999999"
                  :precision="2"
                  v-model="formData.purchas_amount"
                  :step="1"
                  placeholder="请输入价格"
                ></el-input-number>
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
                :key="item.which_type"
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
        <recordCon type="5" :basicTable="basicTable" v-if="status > 0" />
      </div>
    </div>
  </div>
</template>
<script>
import { num2Char } from '@/plugins/util'
import recordCon from '../../components/recordCon.vue'
export default {
  components: { recordCon },
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
      batchList: [{ value: [] }],
      status: 0,
      is_draft: 0,
      rules: {
        subject_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        manure_from: [{ required: true, message: '请输入', trigger: 'blur' }],
        address: [{ required: true, message: '请输入', trigger: 'blur' }],
        use_num: [{ required: true, message: '请输入', trigger: 'blur' }],
        use_crop: [{ required: true, message: '请输入', trigger: 'blur' }],
        apply_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        use_area: [{ required: true, message: '请输入', trigger: 'blur' }],
        apply_mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            required: true,
            message: '请输入正确的手机号',
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur'
          }
        ],
        subject_promise: [{ required: true, message: '请输入', trigger: 'blur' }],
        subsidy_amount: [{ required: true, message: '请输入', trigger: 'blur' }],
        purchas_amount: [{ required: true, message: '请输入', trigger: 'blur' }],
        area_ids: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      basicTable: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      formData: {
        area_ids: '',
        city: '',
        subject_name: '',
        manure_from: '',
        address: '',
        use_num: '',
        use_crop: '',
        apply_name: '',
        use_area: '',
        apply_mobile: '',
        subject_promise: '',
        subsidy_amount: '',
        purchas_amount: ''
      },
      areaList: [],
      areaId: [],
      fileList: {
        11: [],
        12: [],
        13: [],
        14: [],
        15: [],
        16: []
      },
      staticImgsIndex: [11, 12, 13, 14, 15, 16],
      fileMap: [
        {
          label: '1.采购合同',
          which_type: 11
        },
        {
          label: '2.发票',
          which_type: 12
        },
        {
          label: '3.采购凭据（销售方的销货票客户联、销货方出库单客户联',
          which_type: 13
        },
        {
          label: '4.货款支付凭证（不得现金支付）',
          which_type: 14
        },
        {
          label: '5.土地流转合同',
          which_type: 15
        },
        {
          label: '6.有关标有地址时间水印照片（一车一照及不同批次肥料使用过程照片若干张',
          which_type: 16
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
    removeCurrent(index) {
      this.batchList.splice(index, 1)
    },
    checkPolicy() {
      this.$router.push({
        path: '/policy/detail',
        query: {
          id: this.$route.query.policy_document_id
        }
      })
    },
    initRequest() {
      const params = {
        project_id: this.$route.query.project_id,
        record_type: 5
      }
      this.ApiLists.fetchDeclarationRecordList(params).then((res) => {
        this.basicTable = res.data.list
      })
    },
    getData(project_id) {
      this.ApiLists.getYjfSubsidy({ project_id }).then((res) => {
        if (res && res.code == 0) {
          this.status = res.data.status
          this.is_draft = res.data.is_draft
          this.areaId = [res.data.city_id, res.data.town_id, res.data.village_id]
          this.formData = res.data
          this.formData.area_ids = [res.data.city_id, res.data.town_id, res.data.village_id]
          this.fileList = res.data.materials_list
          if (Array.isArray(res.data.use_condition)) {
            this.batchList = res.data.use_condition.map((ele) => {
              return {
                value: [ele.start_at, ele.end_at]
              }
            })
          }
          let active = this.exportStatus(this.status)
          this.currentActive = active
          if (this.status > 0) {
            this.initRequest()
          }
        }
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
    updateImage(whichType, id) {
      this.ApiLists.getYjfSubsidy({ project_id: this.$route.query.project_id }).then((res) => {
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
      let format = this.batchList.map((ele) => {
        return {
          start_at: ele.value[0] ? this.Dayjs(ele.value[0]).format('YYYY-MM-DD') : '',
          end_at: ele.value[1] ? this.Dayjs(ele.value[1]).format('YYYY-MM-DD') : ''
        }
      })
      return {
        project_id: this.$route.query.project_id,
        subject_name: this.formData.subject_name,
        address: this.formData.address,
        apply_name: this.formData.apply_name,
        apply_mobile: this.formData.apply_mobile,
        manure_from: this.formData.manure_from,
        use_num: this.formData.use_num,
        use_area: this.formData.use_area,
        use_crop: this.formData.use_crop,
        subject_promise: this.formData.subject_promise,
        subsidy_amount: this.formData.subsidy_amount,
        purchas_amount: this.formData.purchas_amount,
        city_id: this.formData.area_ids[0],
        town_id: this.formData.area_ids[1],
        village_id: this.formData.area_ids[2],
        form_status: this.is_draft ? 0 : 1,
        use_condition: JSON.stringify(format)
      }
    },
    saveDraft() {
      this.disableBtn = true
      let data = this.finalData()
      this.ApiLists.applyYjfSubsidy(data)
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
          if (this.batchList.length) {
            let dataValidate = this.batchList.every((ele) => {
              return ele.value[0]
            })
            if (dataValidate) {
              let imgsVlidate = this.staticImgsIndex.some((key) => {
                return !this.fileList[key] || !this.fileList[key].length
              })
              if (imgsVlidate) {
                this.disableBtn = false
                return this.$message.error('缺少材料，每类材料都需上传')
              } else {
                let data = this.finalData()
                data.form_status = 1
                this.ApiLists.applyYjfSubsidy(data)
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
              this.$message.error('使用情况不能为空')
            }
          } else {
            this.disableBtn = false
            this.$message.error('使用情况不能为空')
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
      this.ApiLists.getYjfSubsidyId(params).then((res) => {
        if (res && res.code === 0) {
          this.$router.replace({
            path: '/organic',
            query: {
              project_id: res.data,
              policy_document_id: this.$route.query.policy_document_id
            }
          })
          this.getData(res.data)
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
    // 新增分布地
    addDist(index) {
      if (this.status > 0) {
        return this.$message.error('申请已提交，不可修改')
      }
      this.batchList.push({ value: [] })
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
.organicDeclareCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
  .deleteBtn {
    color: #f56c6c;
    cursor: pointer;
  }
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
  .setHelpPosition {
    position: fixed;
    right: 290px;
    bottom: 300px;
    //   right: -70px;
    //   top: 50px;
  }
  .main-container {
    width: 1200px;
    margin: 0 auto;
    padding-top: 30px;
    box-sizing: border-box;
    position: relative;

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
        margin-bottom: 20px;
        font-weight: bold;
        font-size: 16px;
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
      font-size: 16px;
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
.organicDeclareCon {
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
