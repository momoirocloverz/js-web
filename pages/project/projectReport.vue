<template>
  <div class="projectReportCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toProject">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item class="withCursor" @click.native="toProject">我的申报</el-breadcrumb-item>
          <el-breadcrumb-item class="withCursor" @click.native="toMaterial">申报材料</el-breadcrumb-item>
          <el-breadcrumb-item>材料填写</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon">
        <helpCom class="setHelpPosition" :name="currentInfo.linkman && currentInfo.linkman.real_name" :phone="currentInfo.linkman && currentInfo.linkman.mobile" />
        <div class="contentTitle">项目申报书</div>
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="140px" class="demo-dynamic">
          <el-form-item
            label="项目名称"
            prop="project_name"
            :rules="{
              required: true,
              message: '项目名称不能为空',
              trigger: 'blur'
            }"
          >
            <el-input maxlength="50" v-model.trim="dynamicValidateForm.project_name" placeholder="请输入项目名称"></el-input>
          </el-form-item>
          <el-form-item label="项目地点">
            <div class="flexDate">
              <span v-for="(item, index) in dynamicValidateForm.area_ids">{{ item }}</span>
            </div>
            <!--            <div class="flexDate">-->
            <!--              <el-cascader-->
            <!--                class="resetDateWidth"-->
            <!--                v-model="dynamicValidateForm.province"-->
            <!--                @change="provinceChange"-->
            <!--                :options="options"-->
            <!--              ></el-cascader>-->
            <!--              <el-cascader-->
            <!--                class="resetDateWidth"-->
            <!--                v-model="dynamicValidateForm.city"-->
            <!--                :options="options2"-->
            <!--                @change="cityChange"-->
            <!--              ></el-cascader>-->
            <!--              <el-cascader-->
            <!--                class="resetDateWidth"-->
            <!--                v-model="dynamicValidateForm.area"-->
            <!--                :options="options3"-->
            <!--                @change="areaChange"-->
            <!--              ></el-cascader>-->
            <!--            </div>-->
          </el-form-item>
          <el-form-item
            label="详细地址"
            prop="area_detail"
            :rules="{
              required: true,
              message: '详细地址不能为空',
              trigger: 'blur'
            }"
          >
            <el-input maxlength="50" v-model.trim="dynamicValidateForm.area_detail" placeholder="请输入详细地址"></el-input>
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
              class="setDatePicker"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM"
              v-model="dynamicValidateForm.build_at"
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
          <el-form-item
            label="建设单位"
            prop="declare_unit"
            :rules="{
              required: true,
              message: '建设单位不能为空',
              trigger: 'blur'
            }"
          >
            <el-input maxlength="50" v-model.trim="dynamicValidateForm.declare_unit" placeholder="请输入建设单位名称"></el-input>
          </el-form-item>
          <el-form-item
            label="负责人"
            prop="unit_charge_name"
            :rules="{
              required: true,
              message: '负责人不能为空',
              trigger: 'blur'
            }"
          >
            <el-input maxlength="10" v-model.trim="dynamicValidateForm.unit_charge_name" placeholder="请输入负责人姓名"></el-input>
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="unit_charge_mobile"
            :rules="{
              required: true,
              message: '联系电话不能为空',
              trigger: 'blur'
            }"
          >
            <el-input maxlength="11" v-model.trim="dynamicValidateForm.unit_charge_mobile" placeholder="请输入负责人联系电话"></el-input>
          </el-form-item>
          <el-form-item
            label="申报时间"
            prop="start_declare_at"
            :rules="{
              required: true,
              message: '申报时间不能为空',
              trigger: 'blur'
            }"
          >
            <!-- HH:mm:ss -->
            <el-date-picker
              v-model="dynamicValidateForm.start_declare_at"
              align="right"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions2"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="项目建设条件"
            prop="build_condition"
            :rules="{
              required: true,
              message: '项目建设条件不能为空',
              trigger: 'blur'
            }"
          >
            <el-input type="textarea" maxlength="1000" rows="16" placeholder="请填写项目建设条件，1000字以内" v-model.trim="dynamicValidateForm.build_condition"></el-input>
          </el-form-item>
          <el-form-item
            label="项目资金筹措"
            prop="fund_raise"
            :rules="{
              required: true,
              message: '项目资金筹措不能为空',
              trigger: 'blur'
            }"
          >
            <el-input type="textarea" maxlength="300" placeholder="请填写项目资金筹措，300字以内" v-model.trim="dynamicValidateForm.fund_raise"></el-input>
          </el-form-item>
          <div class="hrLine"></div>
          <el-form-item class="fakeRequired" label="项目建设内容"></el-form-item>
          <template v-for="(domain, index) in dynamicValidateForm.domains">
            <div :key="index" class="flexBetween">
              <div class="resetWidth">
                <el-form-item
                  :label="'内容' + (index + 1)"
                  :prop="'domains.' + index + '.content'"
                  :rules="{
                    required: true,
                    message: '内容不能为空',
                    trigger: 'blur'
                  }"
                >
                  <el-input type="textarea" placeholder="请输入" maxlength="50" v-model.trim="domain.content"></el-input>
                </el-form-item>
              </div>
              <div class="formItemAnotherSpecial">
                <el-form-item
                  :label="'投资额（万元）'"
                  :prop="'domains.' + index + '.invest_money'"
                  :rules="{
                    required: true,
                    message: '单价不能为空',
                    trigger: 'blur'
                  }"
                >
                  <el-input-number size="small" :min="0" :precision="2" v-model="domain.invest_money" :step="1"></el-input-number>
                </el-form-item>
                <div class="deleteBtnCon" v-if="index">
                  <div class="deleteResetBtn" @click="removeDomain(domain)">
                    <i class="el-icon-delete"></i>
                  </div>
                </div>
                <div v-else class="seventyHolder deleteResetBtn"></div>
              </div>
            </div>
          </template>
          <div class="padLeft30 marginItem">
            <div @click="addDomain" class="addColors">
              <i class="el-icon-circle-plus-outline"></i>
              <span>新增项目建设内容</span>
            </div>
            <!-- <el-button @click="addDomain" class="deleteResetBtn resetBlue" icon="el-icon-plus" type="primary" size="small">新增</el-button> -->
          </div>
          <div class="hrLine"></div>
          <el-form-item label="建设进度安排" class="fakeRequired"></el-form-item>
          <template v-for="(domin, index) in dynamicValidateForm.domins">
            <div :key="index + 's'" class="formItemSpecial marginItem">
              <el-form-item
                :label="'进度' + (index + 1)"
                :prop="'domins.' + index + '.content'"
                :rules="{
                  required: true,
                  message: '进度不能为空',
                  trigger: 'blur'
                }"
              >
                <el-input type="textarea" maxlength="300" placeholder="请输入" v-model.trim="domin.content"></el-input>
                <div class="deleteResetBtn" @click="remove2Domain(domin)" v-if="index">
                  <i class="el-icon-delete"></i>
                </div>
                <div v-else class="seventyHolder deleteResetBtn"></div>
              </el-form-item>
            </div>
          </template>
          <div class="padLeft30 marginItem">
            <div @click="add2Domain" class="addColors">
              <i class="el-icon-circle-plus-outline"></i>
              <span>新增建设进度安排</span>
            </div>
            <!-- <el-button @click="add2Domain" class="deleteResetBtn resetBlue" icon="el-icon-plus" type="primary" size="small">新增</el-button> -->
          </div>
          <div class="hrLine mb20"></div>
          <el-form-item
            label="项目效益分析"
            prop="efficiency_analysis"
            :rules="{
              required: true,
              message: '项目效益分析不能为空',
              trigger: 'blur'
            }"
          >
            <el-input type="textarea" maxlength="1000" rows="10" placeholder="1000字以内" v-model.trim="dynamicValidateForm.efficiency_analysis"></el-input>
          </el-form-item>
          <div class="alignCenter">
            <el-button type="primary" class="submitBtn resetBlue" @click="submitForm('dynamicValidateForm')" :disabled="submitDisable" size="small">提交</el-button>
            <!-- <el-button @click="resetForm('dynamicValidateForm')"
                >重置</el-button
              > -->
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog class="uploadDialog" title="上传" width="630px" :before-close="handleCloseForNew" :visible.sync="addVisible" :close-on-click-modal="false">
      <div class="uploadCon"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shutDialog">取 消</el-button>
        <el-button type="primary" @click="startUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import provinceData from '/static/city-data/province.js'
import cityData from '/static/city-data/city.js'
import areaData from '/static/city-data/area.js'
import dayjs from 'dayjs'
export default {
  layout: 'main',
  head() {
    return {
      title: '项目申报书',
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
      // options: provinceData,
      // options2: [],
      // options3: [],
      track1Index: 0,
      track2Index: 0,
      track1Item: {},
      track2Item: {},
      track3Item: {},
      basicTable: [],
      activeName: 'first',
      currentInfo: {},
      addVisible: false,
      pickerOptions2: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
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
      project_id: '',
      areaList: [],
      submitDisable: false,
      disableTimer: null,
      dynamicValidateForm: {
        project_name: '',
        area_detail: '',
        area_ids: [],
        area_ids_store: [],
        build_start_at: '',
        build_end_at: '',
        declare_unit: '',
        unit_charge_name: '',
        unit_charge_mobile: '',
        build_at: '',
        start_declare_at: '',
        build_condition: '',
        fund_raise: '',
        efficiency_analysis: '',
        province: '',
        city: '',
        area: '',
        domains: [
          {
            content: '',
            invest_money: 0
          }
        ],
        domins: [
          {
            content: ''
          }
        ]
      }
    }
  },
  mounted() {
    this.getAreaList()
    this.initAction()
    this.initHistory()
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
    getAreaList() {
      this.ApiLists.getAreaList().then((res) => {
        if (res && res.code === 0) this.areaList = res.data.list
      })
    },
    toProject() {
      this.$router.push({
        path: '/project'
      })
    },
    toMaterial() {
      this.$router.push({
        path: '/project/material',
        query: {
          policy_document_id: this.$route.query.policy_document_id,
          project_id: this.$route.query.project_id
        }
      })
    },
    fetchPreserveData(res) {
      if (this.$route.query.project_reserve_id > 0) {
        this.ApiLists.projectReserveDetail({ id: this.$route.query.project_reserve_id })
          .then((res) => {
            let shorter = res.data.info
            this.dynamicValidateForm.project_name = shorter.project_name
            this.dynamicValidateForm.domains = shorter.build_contents || [
              {
                content: '',
                invest_money: 0
              }
            ]
            this.dynamicValidateForm.build_start_at = shorter.build_start_at
            this.dynamicValidateForm.build_end_at = shorter.build_end_at
            if (shorter.build_start_at && shorter.build_end_at) {
              this.dynamicValidateForm.build_at = [shorter.build_start_at, shorter.build_end_at]
            }
            this.dynamicValidateForm.declare_unit = shorter.declare_unit
            this.dynamicValidateForm.start_declare_at = shorter.declare_at
            this.dynamicValidateForm.unit_charge_name = shorter.unit_charge_name
            this.dynamicValidateForm.unit_charge_mobile = shorter.unit_charge_mobile
            this.dynamicValidateForm.build_condition = shorter.build_condition
            // this.dynamicValidateForm.area_ids_store = [shorter.city_id, shorter.town_id, shorter.village_id]
            // let h2i = this.areaList[0].children.find((ele) => {
            //   return shorter.town_id == ele.id
            // })
            // if (h2i) {
            //   let h3i = h2i.children.find((ele) => {
            //     return shorter.village_id == ele.id
            //   })
            //   this.dynamicValidateForm.area_ids = ['江山市', h2i.name, h3i.name]
            // }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        console.log('没有选择储备')
        this.normalSet(res)
      }
    },
    fetchAnother() {
      this.ApiLists.fetchProjectImplementPlanDetail({
        project_id: this.$route.query.project_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            console.log(res.data)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    normalSet(res) {
      this.dynamicValidateForm.domains =
        res.data.info.build_contents && res.data.info.build_contents.length
          ? res.data.info.build_contents
          : [
              {
                content: '',
                invest_money: 0
              }
            ]
      this.dynamicValidateForm.domins =
        res.data.info.schedule_contents && res.data.info.schedule_contents.length
          ? res.data.info.schedule_contents
          : [
              {
                content: ''
              }
            ]
      this.dynamicValidateForm.project_name = res.data.info.project_name
      this.dynamicValidateForm.area_detail = res.data.info.area_detail
      this.dynamicValidateForm.area_ids = res.data.info.area_ids
      this.dynamicValidateForm.area_ids_store = res.data.info.area_ids_store
      this.dynamicValidateForm.build_start_at = res.data.info.build_start_at
      this.dynamicValidateForm.build_end_at = res.data.info.build_end_at
      this.dynamicValidateForm.declare_unit = res.data.info.declare_unit
      this.dynamicValidateForm.unit_charge_name = res.data.info.unit_charge_name
      this.dynamicValidateForm.unit_charge_mobile = res.data.info.unit_charge_mobile
      this.dynamicValidateForm.start_declare_at = res.data.info.start_declare_at
      this.dynamicValidateForm.build_condition = res.data.info.build_condition
      this.dynamicValidateForm.fund_raise = res.data.info.fund_raise
      this.dynamicValidateForm.efficiency_analysis = res.data.info.efficiency_analysis
      if (res.data.info.build_start_at && res.data.info.build_end_at) {
        this.dynamicValidateForm.build_at = [res.data.info.build_start_at, res.data.info.build_end_at]
      }
      //   this.fetchAnother()
    },
    initHistory() {
      if (this.$route.query.project_id) {
        let data = {
          project_id: this.$route.query.project_id
        }
        this.ApiLists.fetchProjectDeclarationDetail(data)
          .then((res) => {
            if (res && res.code == 0) {
              if (res.data.info) {
                if (this.$route.query.is_declaration_reserve_change == 1) {
                  this.normalSet(res)
                } else {
                  this.dynamicValidateForm.area_ids = res.data.info.area_ids
                  this.dynamicValidateForm.area_ids_store = res.data.info.area_ids_store
                  this.fetchPreserveData(res)
                }
              }
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    },
    /* provinceChange(value) {
      this.options3 = [];
      //   this.province = "";
      this.city = "";
      this.area = "";
      let hi = this.options.findIndex(ele => {
        return value[0] == ele.value;
      });
      this.track1Item = this.options[hi];
      this.track1Index = hi;
      this.options2 = cityData[hi];
    },
    cityChange(value) {
      this.area = "";
      let hi = this.options2.findIndex(ele => {
        return value[0] == ele.value;
      });
      this.track2Item = this.options2[hi];
      this.track2Index = hi;
      this.options3 = areaData[this.track1Index][hi];
    },
    areaChange(value) {
      console.log(value);
      let hi = this.options3.find(ele => {
        return value[0] == ele.value;
      });
      this.track3Item = hi;
    },*/
    submitForm(formName) {
      this.submitDisable = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let array = this.dynamicValidateForm.domains
          // console.log('array', array)
          let array2 = this.dynamicValidateForm.domins
          // console.log(array2)
          let data = {
            save_type: 'submit',
            policy_document_id: this.$route.query.policy_document_id,
            build_contents: array,
            schedule_contents: array2,
            efficiency_analysis: this.dynamicValidateForm.efficiency_analysis,
            fund_raise: this.dynamicValidateForm.fund_raise,
            build_condition: this.dynamicValidateForm.build_condition,
            unit_charge_mobile: this.dynamicValidateForm.unit_charge_mobile,
            unit_charge_name: this.dynamicValidateForm.unit_charge_name,
            declare_unit: this.dynamicValidateForm.declare_unit,
            area_detail: this.dynamicValidateForm.area_detail,
            build_end_at: dayjs(this.dynamicValidateForm.build_at[1]).endOf('month').format('YYYY-MM-DD') + ' 23:59:59',
            build_start_at: this.dynamicValidateForm.build_at[0],
            // area_ids: [
            //   this.track1Item.label,
            //   this.track2Item.label,
            //   this.track3Item.label
            // ],
            // area_ids_store: [
            //   this.track1Item.value,
            //   this.track2Item.value,
            //   this.track3Item.value
            // ],
            start_declare_at: this.dynamicValidateForm.start_declare_at,
            project_name: this.dynamicValidateForm.project_name
          }
          if (this.$route.query.project_id) {
            data.project_id = this.$route.query.project_id
          }
          if (this.$route.query.project_reserve_id > 0) {
            data.project_reserve_id = this.$route.query.project_reserve_id
          }
          console.log('data', data)
          this.ApiLists.actionProjectDeclaration(data)
            .then((res) => {
              if (res && res.code === 0) {
                this.$message.success('保存成功')
                this.$router.replace({
                  path: '/project/material',
                  query: {
                    project_id: res.data.project_id,
                    policy_document_id: this.$route.query.policy_document_id
                  }
                })
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch((err) => {
              console.log('err', err)
            })
            .finally(() => {
              this.disableTimer = setTimeout(() => {
                this.submitDisable = false
                clearTimeout(this.disableTimer)
              }, 5000)
            })
        } else {
          this.submitDisable = false
          return false
        }
      })
    },
    remove2Domain(item) {
      var index = this.dynamicValidateForm.domins.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domins.splice(index, 1)
        this.$forceUpdate()
      }
    },
    add2Domain() {
      this.dynamicValidateForm.domins.push({
        content: ''
      })
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
        this.$forceUpdate()
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        content: '',
        invest_money: 0
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    shutDialog() {
      this.addVisible = false
    },
    startUpload() {
      this.addVisible = false
    },
    handleCloseForNew(done) {
      done()
    },
    initAction() {
      this.$store.commit('changeMenuActive', '3')
    }
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
.mb20 {
  margin-bottom: 20px;
}
.withCursor {
  cursor: pointer;
}
.flexDate {
  span {
    margin-right: 10px;
    color: #666;
  }
}
.resetDateWidth {
  width: 31%;
}
.deleteResetBtn {
  margin-left: 10px;
  .el-icon-delete {
    font-size: 18px;
    color: #f56c6c;
    cursor: pointer;
  }
}
.submitBtn {
  background-color: #0270c3;
  border-color: #0270c3;
}
.alignCenter {
  text-align: center;
}
.marginItem {
  margin-bottom: 20px;
}
.flexBetween {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: center;
}
.resetWidth {
  width: 70%;
}
.deleteBtnCon {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.seventyHolder {
  width: 20px;
}
.projectReportCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
}
.statusDoneImg {
  width: 23px;
  height: 24px;
  vertical-align: bottom;
}
.centerCon {
  width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  box-sizing: border-box;
}
.contentCon {
  margin-top: 20px;
  padding: 40px 140px 30px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 20px;
}
.contentTitle {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  line-height: 32px;
  margin-bottom: 30px;
}
.submitMaster {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-top: 20px;
}
.answerTrigger {
  font-size: 16px;
  color: #0270c3;
  line-height: 32px;
  margin-right: 30px;
  cursor: pointer;
}
.operateCon {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
.fakeBtn {
  background-color: #0270c3;
  color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
}
.coverBtn {
  background-color: #0270c3;
  color: #fff;
}
.tableCon {
}
.tableFirstCon {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.checkSource {
  color: #0270c3;
  border-color: #0270c3;
}
.operateBtn {
  color: #0270c3;
  cursor: pointer;
}
.uploadCon {
  height: 320px;
  overflow-y: auto;
}
.width140 {
  width: 140px;
  text-align: right;
  height: 40px;
  box-sizing: border-box;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 10px 12px 0 0;
  margin-bottom: 30px;
}
.resetBlue {
  background-color: #0270c3 !important;
  color: #fff !important;
}
.addColors {
  color: #1a7ee9;
  font-size: 14px;
  cursor: pointer;
}
.padLeft30 {
  padding-left: 130px;
}
.fakeRequired {
  position: relative;
  &::before {
    content: '*';
    color: #f56c6c;
    left: 33px;
    top: 10px;
    position: absolute;
  }
}
.hrLine {
  border: 0.5px dashed #dcdfe6;
}
</style>
<style lang="less">
.projectReportCon {
  .formItemSpecial {
    .el-form-item__content {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
  .formItemAnotherSpecial {
    display: flex;
    justify-content: flex-start;
  }
  .resetLabel {
    .el-form-item__label {
      width: 80px !important;
    }
    .el-form-item__content {
      margin-left: 80px !important;
    }
  }
  .uploadDialog {
    .el-dialog {
      height: 500px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto !important;
    }
  }
}
</style>
