<template>
  <div class="crops-declare">
    <div class="main-container">
      <helpCom class="setHelpPosition" :name="currentInfo.linkman && currentInfo.linkman.real_name" :phone="currentInfo.linkman && currentInfo.linkman.mobile" />
      <div class="breadcrumb-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toPolicy">惠农政策申报</el-breadcrumb-item>
          <el-breadcrumb-item>粮油适度规模经营补贴</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="stepCon" v-if="status > 0">
        <div class="stepTitleCon">项目申报进度</div>
        <foodNewStep :currentActive="currentActive" />
      </div>
      <div class="form-container">
        <div class="select-area">
          <span>承包地址：</span>
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
          <span style="color: #f56c6c; font-weight: normal" v-if="!$route.query.project_id || !areaId.length">*请先选择承包地址</span>
        </div>
        <el-form :model="formData" ref="formRef" label-width="140px" :disabled="!areaId.length || (status > 0 && is_draft == 0)" label-position="left">
          <div class="sub-title">基本信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="粮食生产经营主体"
                prop="main_name"
                :rules="{
                  required: true,
                  message: '粮食生产经营主体不能为空',
                  trigger: 'blur'
                }"
              >
                <el-input maxlength="50" v-model.trim="formData.main_name" placeholder="请输入粮食生产经营主体"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="负责人"
                prop="principal"
                :rules="{
                  required: true,
                  message: '负责人不能为空',
                  trigger: 'blur'
                }"
              >
                <el-input maxlength="50" v-model.trim="formData.principal" placeholder="请输入负责人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-form-item
            label="粮食生产经营主体"
            prop="main_name"
            :rules="{
              required: true,
              message: '粮食生产经营主体不能为空',
              trigger: 'blur'
            }"
          >
            <el-input maxlength="50" v-model.trim="formData.main_name" placeholder="请输入粮食生产经营主体"></el-input>
          </el-form-item>
          <el-form-item
            label="负责人"
            prop="principal"
            :rules="{
              required: true,
              message: '负责人不能为空',
              trigger: 'blur'
            }"
          >
            <el-input maxlength="50" v-model.trim="formData.principal" placeholder="请输入负责人"></el-input>
          </el-form-item> -->

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="身份证"
                prop="idcard"
                :rules="{
                  required: true,
                  message: '身份证不能为空',
                  trigger: 'blur'
                }"
              >
                <el-input maxlength="50" v-model.trim="formData.idcard" placeholder="请输入身份证"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业信用代码" prop="company_credit_code">
                <el-input maxlength="50" v-model.trim="formData.company_credit_code" placeholder="请输入企业信用代码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-form-item
            label="身份证"
            prop="idcard"
            :rules="{
              required: true,
              message: '身份证不能为空',
              trigger: 'blur'
            }"
          >
            <el-input maxlength="50" v-model.trim="formData.idcard" placeholder="请输入身份证"></el-input>
          </el-form-item>
          <el-form-item label="企业信用代码" prop="company_credit_code">
            <el-input maxlength="50" v-model.trim="formData.company_credit_code" placeholder="请输入企业信用代码"></el-input>
          </el-form-item> -->

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="办公地址"
                prop="city_str"
                :rules="{
                  required: true,
                  message: '办公地址不能为空',
                  trigger: 'blur'
                }"
              >
                <el-cascader
                  :style="{ width: '100%' }"
                  v-model="formData.city"
                  :options="areaList"
                  @change="onBgAddressChange"
                  placeholder="请选择办公地址"
                  :props="{
                    label: 'name',
                    value: 'id'
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="电话"
                prop="mobile"
                :rules="{
                  required: true,
                  message: '电话不能为空',
                  trigger: 'blur'
                }"
              >
                <el-input maxlength="11" v-model.trim="formData.mobile" placeholder="请填写电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="详细办公地址" prop="bg_address">
                <el-input maxlength="50" v-model.trim="formData.bg_address" placeholder="请填写详细办公地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="承包地址"
                prop="cb_address"
                :rules="{
                  message: '自动填充',
                  trigger: 'blur'
                }"
              >
                <el-input maxlength="50" v-model.trim="formData.cb_address" placeholder="请填写承包地址" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="承包面积"
                prop="cb_area"
                :rules="{
                  required: true,
                  message: '承包面积不能为空',
                  trigger: 'blur'
                }"
              >
                <el-input maxlength="50" v-model.trim="formData.cb_area" placeholder="请填写承包面积"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>
          <!-- <el-form-item
            label="办公地址"
            prop="city_str"
            :rules="{
              required: true,
              message: '办公地址不能为空',
              trigger: 'blur'
            }"
          >
            <el-cascader
              :style="{ width: '100%' }"
              v-model="formData.city"
              :options="areaList"
              @change="onBgAddressChange"
              placeholder="请选择办公地址"
              :props="{
                label: 'name',
                value: 'id'
              }"
            />
          </el-form-item>
          <el-form-item label="详细办公地址" prop="bg_address">
            <el-input maxlength="50" v-model.trim="formData.bg_address" placeholder="请填写详细办公地址"></el-input>
          </el-form-item> -->
          <!-- <el-form-item
            label="电话"
            prop="mobile"
            :rules="{
              required: true,
              message: '电话不能为空',
              trigger: 'blur'
            }"
          >
            <el-input maxlength="50" v-model.trim="formData.mobile" placeholder="请填写电话"></el-input>
          </el-form-item> -->
          <!-- <el-form-item
            label="承包地址"
            prop="cb_address"
            :rules="{
              message: '自动填充',
              trigger: 'blur'
            }"
          >
            <el-input maxlength="50" v-model.trim="formData.cb_address" placeholder="请填写承包地址" readonly></el-input>
          </el-form-item> -->
          <!-- <el-form-item
            label="承包面积"
            prop="cb_area"
            :rules="{
              required: true,
              message: '承包面积不能为空',
              trigger: 'blur'
            }"
          >
            <el-input maxlength="50" v-model.trim="formData.cb_area" placeholder="请填写承包面积"></el-input>
          </el-form-item> -->

          <div class="sub-title">农作物种植情况</div>
          <div class="crops-content">
            <el-card class="crops-item" v-for="(item, index) in formData.crop_list" :key="index">
              <div class="del-btn out" v-if="index && status == 0" @click="deleteCrops">删除</div>
              <div class="item-fields">
                <el-form-item
                  :label="`作物类型${num2Char(index)}`"
                  :prop="`crop_list.${index}.crop_type`"
                  :rules="{
                    required: true,
                    message: '请选择作物类型',
                    trigger: 'blur'
                  }"
                  readonly
                  label-width="126px"
                >
                  <el-select v-model="item.crop_type" placeholder="请选择作物类型" @change="(val) => changeCropType(val, index)">
                    <el-option v-for="cropType in PLANT_TYPE" :key="cropType.value" :label="cropType.label" :value="cropType.value" :disabled="cropType.disabled"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="`种粮面积（亩）`"
                  :prop="`crop_list.${index}.total_area`"
                  :rules="{
                    required: true,
                    message: '请输入面积（亩）',
                    trigger: 'submit'
                  }"
                  label-width="126px"
                >
                  <el-input maxlength="50" v-model="item.total_area" placeholder="根据每个分布地面积自动计算" readonly></el-input>
                </el-form-item>
                <div class="dist-item" v-for="(crop, i) in item.list" :key="i">
                  <el-form-item
                    :label="`分布地${num2Char(i)}`"
                    :prop="`crop_list.${index}.list.${i}.dist_name`"
                    :rules="{
                      required: true,
                      message: '请输入分布地',
                      trigger: 'blur'
                    }"
                    label-width="126px"
                  >
                    <el-input maxlength="50" v-model="crop.dist_name" placeholder="请输入分布地"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="`面积（亩）`"
                    :prop="`crop_list.${index}.list.${i}.area`"
                    :rules="{
                      required: true,
                      message: '请输入面积',
                      trigger: 'blur'
                    }"
                    label-width="126px"
                  >
                    <el-input maxlength="50" v-model="crop.area" placeholder="请输入面积" @change="(val) => onChangeArea(val, index)"></el-input>
                  </el-form-item>

                  <div class="del-btn inner" v-if="i && status == 0" @click="deleteDist(index)">删除分布地</div>
                </div>
                <div class="add-btn" @click="addDist(index)" style="width: 100px" v-if="status == 0">
                  <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" alt="新增" class="icon" />
                  <div class="add-text">新增分布地</div>
                </div>
              </div>
            </el-card>
            <div class="add-btn out" @click="addCrops" style="width: 120px" v-if="status == 0">
              <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" alt="新增" class="icon" />
              <div class="add-text">新增农作物类型</div>
            </div>
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
              :class="{ mb0: item.which_type == 71 && hasSignature == 0 }"
            />
            <template v-if="item.which_type == 71 && hasSignature == 0">
              <div class="has-no-signature">
                <div class="tip">&emsp;请通过微信扫码签名，承诺书将自动生成</div>
                <div class="file-container">
                  <vue-qr :text="signatureUrl" :size="128" :margin="0"></vue-qr>
                </div>
              </div>
            </template>
            <div class="file-container" v-else>
              <imgUpload
                :key="item.which_type"
                :size="50"
                :originList="fileList[item.which_type]"
                :limit="10"
                accept=".doc,.docx,.jpg,.jpeg,.png,.pdf,.XLS,.XLSX,.csv,.wps,.zip,.rar"
                :whichType="item.which_type"
                @handleAddFile="handleAddFile"
                @handleRemoveFile="handleRemoveFile"
                :status="status"
                :disabled="item.which_type == 71 || status > 0"
              />
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px" v-if="!(!areaId.length || (status > 0 && is_draft == 0))">
            <el-button type="primary" class="submitBtn" @click="beforeSubmit()" size="small" :disabled="disableBtn">提交</el-button>
            <el-button type="primary" class="submitBtn" plain @click="beforeSubmit(true)" size="small" :disabled="disableBtn">保存草稿</el-button>
          </div>
        </el-form>
        <el-button class="history-btn" type="primary" @click="useHistory" v-if="areaId.length && status == 0 && is_draft == 1">自动填充</el-button>
      </div>
      <div>
        <recordCon type="11" v-if="status > 0" :basicTable="basicTable" />
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
      basicTable: [],
      currentActive: 1,
      status: 0,
      is_draft: 0,
      formData: {
        main_name: '',
        city: '',
        city_str: '',
        bg_address: '',
        principal: '',
        idcard: '',
        company_credit_code: '',
        mobile: '',
        bg_city_id: '',
        bg_town_id: '',
        bg_village_id: '',
        cb_city_id: '',
        cb_town_id: '',
        cb_village_id: '',
        cb_area: '',
        cb_address: '',
        image: [],
        crop_list: [{ crop_type: '', type_text: '', list: [{ dist_name: '', area: '' }] }]
      },
      areaList: [],
      areaId: [],
      fileList: {
        71: [],
        72: [],
        73: [],
        74: [],
        75: []
      },
      fileMap: [
        {
          label: '1.粮油生产经营主体承诺书',
          which_type: 71
        },
        {
          label: '2.种植区域农村土地承包经营权委托流转合同',
          which_type: 72
        },
        {
          label: '3.种植区域耕地承包流转清册',
          which_type: 73
        },
        {
          label: '4.种植区域分布示意图（现状图）',
          which_type: 74
        },
        {
          label: '5.大田租金支付凭证或分户支付清册',
          which_type: 75
        }
      ],
      PLANT_TYPE: [
        {
          label: '油菜',
          value: 'you_cai'
        },
        {
          label: '大小麦',
          value: 'da_xiao_mai'
        },
        {
          label: '早稻',
          value: 'zao_dao'
        },
        {
          label: '单季稻',
          value: 'dan_ji_dao'
        },
        {
          label: '连作晚稻',
          value: 'lian_zuo_wan_dao'
        }
      ],
      signatureUrl: '',
      timer: null,
      hasSignature: 1,
      disableBtn: false,
      disableTimer: null,
      currentInfo: {}
    }
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  },
  mounted() {
    this.getAreaList()
    this.initHelp()
    this.$route.query.project_id && this.getData(this.$route.query.project_id)
    const _this = this
    if (this.$route.query.project_id) {
      Promise.all([this.getAreaList(), this.getData(this.$route.query.project_id)]).then(function (res) {
        _this.createAddressStr(res[0], res[1])
      })
    } else {
      this.getAreaList()
    }
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
    getData(project_id = this.$route.query.project_id, initArea) {
      return new Promise((resolve, reject) => {
        this.ApiLists.getLySubsidy({ project_id }).then((res) => {
          this.status = res.data.status
          this.is_draft = res.data.is_draft
          const sub_ly_info = res.data.sub_ly_info
          this.formData = { ...this.formData, ...sub_ly_info }
          if (!this.formData.crop_list.length) {
            this.formData.crop_list.push({ crop_type: '', type_text: '', list: [{ dist_name: '', area: '' }] })
          }
          // 承包地址默认值
          this.areaId = [sub_ly_info.cb_city_id, sub_ly_info.cb_town_id, sub_ly_info.cb_village_id]
          // 办公地址默认值
          this.formData.city = [sub_ly_info.bg_city_id, sub_ly_info.bg_town_id, sub_ly_info.bg_village_id]
          // 图片材料初始化
          if (Object.prototype.toString.call(res.data.materials_list) == '[object Object]') {
            const materials_list = res.data.materials_list
            // 倒序所有类型的材料
            Object.keys(materials_list).forEach((key) => {
              materials_list[key].reverse()
            })
            this.fileList = materials_list
          }

          const { id, policy_document_id } = sub_ly_info
          // https://jiangshan-tzyjs-h5.zjsszxc.com 上线前替换成线上域名
          const host = window.location.host
          let domain = 'https://jiangshan-tzyjs-h5.zjsszxc.com'
          //   let domain = 'https://dev-jiangshan-tzyjs-h5.hzanchu.com'
          if (host == 'dev-jiangshan-tzyjs-web.hzanchu.com') {
            domain = 'https://dev-jiangshan-tzyjs-h5.hzanchu.com'
          } else if (host == 'pre-jiangshan-tzyjs-web.hzanchu.com') {
            domain = 'https://pre-jiangshan-tzyjs-h5.hzanchu.com'
          }
          console.log('domain', domain)
          this.signatureUrl = `${domain}/#/signature?project_id=${project_id}&policy_document_id=${policy_document_id}&from=web&tk=${window.localStorage.getItem('loginToken')}`

          if (!this.fileList || !this.fileList[71] || !this.fileList[71].length) {
            this.hasSignature = 0
            this.initTimer()
          } else {
            this.hasSignature = 1
          }
          if (initArea) {
            this.createAddressStr(this.areaList, sub_ly_info)
          }
          let active = this.exportStatus(this.status)
          this.currentActive = active
          this.initRequest()
          resolve(sub_ly_info)
        })
      })
    },
    initRequest() {
      const params = {
        project_id: this.$route.query.project_id,
        record_type: 11
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
        // return 3
      } else if (String(value).startsWith('3')) {
        return 3
      } else if (String(value).startsWith('4')) {
        // return 5
      } else if (String(value).startsWith('5')) {
        return 4
      } else if (String(value).startsWith('6')) {
        // return 7
      } else if (String(value).startsWith('7')) {
        return 5
      } else if (String(value).startsWith('8')) {
        return 6
      }
    },
    updateImage(whichType, id) {
      this.ApiLists.getLySubsidy({ project_id: this.$route.query.project_id }).then((res) => {
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

    // 提交前
    beforeSubmit(isDraft) {
      if (isDraft) {
        // 保存草稿
        this.disableBtn = true
        const params = { ...this.formData, project_id: this.$route.query.project_id || null, form_status: isDraft ? 0 : 1 }
        this.submit(params)
      } else {
        try {
          const _this = this
          ;[71, 72, 73, 74, 75].forEach((key) => {
            if (!_this.fileList[key] || !_this.fileList[key].length) {
              throw '缺少材料，每类材料都需上传'
            }
          })
          this.$refs['formRef'].validate((isValid) => {
            if (isValid) {
              this.disableBtn = true
              const params = { ...this.formData, project_id: this.$route.query.project_id || null, form_status: isDraft ? 0 : 1 }
              this.submit(params)
            } else {
              this.$message.warning('请检查填写内容')
            }
          })
        } catch (error) {
          return this.$message.warning(error)
        }
      }
    },

    // 提交
    submit(params) {
      // return console.log('params', params)
      this.ApiLists.applyLySubsidy(params)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success(`${params.form_status == 0 ? '保存成功' : '提交成功'}`)
            this.getData()
            if (params.form_status == 1) {
              // 提交成功 跳转项目办事页面
              this.getData(this.$route.query.project_id)
              //   this.$router.push({
              //     path: '/project',
              //     query: {
              //       currentActiveIndex: 1
              //     }
              //   })
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((e) => {})
        .finally(() => {
          this.disableTimer = setTimeout(() => {
            this.disableBtn = false
            clearTimeout(this.disableTimer)
          }, 5000)
        })
    },

    // 修改作物类型
    changeCropType(val, index) {
      // console.log('changeCropType', val, index)
      const newObj = Object.assign({}, this.formData.crop_list[index])
      newObj.type_text = this.PLANT_TYPE.find((v) => v.value == val)?.label
      this.$set(this.formData.crop_list, index, newObj)
      this.$nextTick(() => {
        this.updateCropTypeOptions()
      })
    },

    // 更新作物类型option信息
    updateCropTypeOptions() {
      const crop_list = this.formData.crop_list
      const selectedTypes = crop_list.map((v) => v.crop_type)
      // 已选项禁止选择
      const newPlantType = this.PLANT_TYPE.map((v) => {
        v.disabled = selectedTypes.includes(v.value)
        return v
      })
      this.PLANT_TYPE = newPlantType
    },

    // 分布地面积改变 自动计算总种粮面积
    onChangeArea(val, index) {
      let list = this.formData.crop_list[index].list
      let total_area = 0
      list.forEach((v) => {
        if (!isNaN(Number(v.area))) {
          total_area += Number(v.area)
        }
      })
      this.$set(this.formData.crop_list[index], 'total_area', total_area.toFixed(2))
      // this.formData.crop_list[index].total_area = total_area.toFixed(1)
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
      if (whichType == 71) {
        this.hasSignature = 0
        this.initTimer()
      }
    },

    onBgAddressChange(e) {
      if (!e || e.length === 0) {
        this.$message.error('请选择办公地址')
        return
      }
      this.formData.bg_city_id = e[0]
      this.formData.bg_town_id = e[1]
      this.formData.bg_village_id = e[2]
      const { areaList } = this
      if (e[1] && e[2]) {
        let bg_townItem = areaList[0].children.find((town) => town.id == e[1])
        let bg_villageItem = bg_townItem.children.find((village) => village.id == e[2])
        this.$set(this.formData, 'city', [e[0], e[1], e[2]])
        this.$set(this.formData, 'city_str', `江山市/${bg_townItem.name}/${bg_villageItem.name}`) // 办公地址回显
      }
    },

    onAddressChange(e) {
      if (!e || e.length === 0) {
        this.$message.error('请选择承包地址')
        return
      }
      const params = {
        project_id: this.$route.query.project_id || null,
        policy_document_id: this.$route.query.policy_document_id || null,
        cb_city_id: e[0],
        cb_town_id: e[1],
        cb_village_id: e[2]
      }
      this.ApiLists.getLySubsidyId(params).then((res) => {
        if (res && res.code === 0) {
          this.$router.replace({
            path: '/project/crops',
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

    // 生成地址字符串 根据 city_id town_id etc.
    createAddressStr(areaList = this.areaList, sub_ly_info) {
      const { bg_city_id, bg_town_id, bg_village_id, cb_city_id, cb_town_id, cb_village_id } = sub_ly_info
      if (!areaList) return
      let city = areaList[0].name
      let townItem = areaList[0].children.find((town) => town.id == cb_town_id)
      let villageItem = townItem ? townItem.children.find((village) => village.id == cb_village_id) : null
      if (townItem && villageItem) {
        this.$set(this.formData, 'cb_address', `${townItem.name}/${villageItem.name}`) // 承包地址回显
      }
      if (bg_town_id && bg_village_id) {
        let bg_townItem = areaList[0].children.find((town) => town.id == bg_town_id)
        let bg_villageItem = bg_townItem.children.find((village) => village.id == bg_village_id)
        this.$set(this.formData, 'city', [bg_city_id, bg_town_id, bg_village_id])
        this.$set(this.formData, 'city_str', `${city}/${bg_townItem.name}/${bg_villageItem.name}`) // 办公地址回显
      }
    },

    toPolicy() {
      this.$router.push({
        path: '/policy'
      })
    },

    // 新增农作物种植情况
    addCrops() {
      if (this.status > 0) {
        return this.$message.error('申请已提交，不可修改')
      }
      this.formData.crop_list.push({ crop_type: '', type_text: '', list: [{ dist_name: '', area: '' }] })
    },

    // 删除农作物种植情况
    deleteCrops() {
      if (this.status > 0) {
        return this.$message.error('申请已提交，不可修改')
      }
      this.formData.crop_list.pop()
    },

    // 新增分布地
    addDist(index) {
      if (this.status > 0) {
        return this.$message.error('申请已提交，不可修改')
      }
      this.formData.crop_list[index].list.push({ dist_name: '', area: '' })
    },

    // 删除分布地
    deleteDist(index) {
      if (this.status > 0) {
        return this.$message.error('申请已提交，不可修改')
      }
      this.formData.crop_list[index].list.pop()
    },

    getAreaList() {
      return new Promise((resolve, reject) => {
        this.ApiLists.getAreaList().then((res) => {
          if (res && res.code === 0) {
            this.areaList = res.data.list
            resolve(res.data.list)
          }
        })
      })
    },

    // 初始化轮询承诺书
    initTimer() {
      const _this = this
      if (!_this.timer) {
        _this.timer = setInterval(() => {
          _this.updateSignature()
        }, 5000)
      }
    },

    // 更新签名承诺书
    updateSignature() {
      this.ApiLists.getLySubsidy({ project_id: this.$route.query.project_id })
        .then((res) => {
          if (res.code == 0) {
            const { materials_list } = res.data
            if (Object.prototype.toString.call(materials_list) == '[object Object]' && materials_list.hasOwnProperty(71)) {
              this.hasSignature = 1
              // this.fileList[71] = materials_list[71]
              clearInterval(this.timer)
              this.timer = null
              this.updateImage(71)
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    // 使用最新数据填充
    useHistory() {
      this.$confirm('此操作将覆盖已填写数据，确定使用最近一次申报信息填充吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const result = await this.ApiLists.getLySubsidy()
          console.log('result', result)
          if (result.code === 0) {
            if (result.data.sub_ly_info) {
              const sub_ly_info = result.data.sub_ly_info
              this.formData = { ...this.formData, ...sub_ly_info }
              if (!this.formData.crop_list.length) {
                this.formData.crop_list = []
                this.formData.crop_list.push({ crop_type: '', type_text: '', list: [{ dist_name: '', area: '' }] })
              }
              // 承包地址不变
              // this.areaId = [sub_ly_info.cb_city_id, sub_ly_info.cb_town_id, sub_ly_info.cb_village_id]
              // 办公地址默认值
              this.formData.city = [sub_ly_info.bg_city_id, sub_ly_info.bg_town_id, sub_ly_info.bg_village_id]
              let bg_townItem = this.areaList[0].children.find((town) => town.id == sub_ly_info.bg_town_id)
              let bg_villageItem = bg_townItem.children.find((village) => village.id == sub_ly_info.bg_village_id)
              this.$set(this.formData, 'city_str', `江山市/${bg_townItem.name}/${bg_villageItem.name}`) // 办公地址回显
            } else {
              this.$message.warning('未获取到最近一次申报数据')
            }
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch((e) => {
          console.log(e)
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
.crops-declare {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
  .stepCon {
    margin-top: 20px;
    padding: 20px;
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
  .main-container {
    width: 1200px;
    margin: 0 auto;
    padding-top: 30px;
    box-sizing: border-box;

    .form-container {
      margin-top: 20px;
      padding: 40px;
      box-sizing: border-box;
      background-color: #fff;
      margin-bottom: 20px;
      position: relative;

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
          right: -80px;
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
          margin-left: 60px;
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

      .history-btn {
        position: absolute;
        top: 30px;
        right: 40px;
      }
    }

    .select-area {
      color: #606266;
      margin-bottom: 20px;
      font-weight: bold;
      font-size: 16px;
    }
  }
}
.item-fields {
  //   width: 90%;
  padding-left: 60px;
  padding-right: 80px;
  box-sizing: border-box;
}

.has-no-signature {
  .tip {
    color: #666;
    margin-bottom: 10px;
  }
}
.has-signature {
  // padding: 0 40px;
  // img {
  //   width: 0.520833rem;
  //   height: 0.520833rem;
  // }
}
</style>

<style lang="less">
.crops-declare {
  .left-label {
    .el-form-item__label {
      text-align: left;
    }

    &.mb0 {
      margin-bottom: 0;
    }
  }

  .crops-item {
    // margin-left: 80px;
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
