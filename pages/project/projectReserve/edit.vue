<template>
  <div class="change_form box_wrap projectReserveEditCon">
    <div class="center_box">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>项目储备</el-breadcrumb-item>
          <el-breadcrumb-item @click.native="toProjectProgress">我的申报</el-breadcrumb-item>
          <el-breadcrumb-item>材料填写</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <p class="title">材料填写</p>
        <el-form label-width="170px" :rules="rules" :model="formData" ref="form">
          <el-form-item label="项目名称" prop="project_name">
            <el-input maxlength="40" v-model="formData.project_name" placeholder="请输入" :disabled="$route.query.editAble == 2" />
          </el-form-item>
          <el-form-item label="项目类型" prop="project_type">
            <el-select v-model="formData.project_type" placeholder="请选择" :disabled="$route.query.editAble == 2" @change="onChangeProjectType">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目地点" required prop="area_ids">
            <el-cascader
              :style="{ width: '200px' }"
              v-model="formData.area_ids"
              :disabled="$route.query.editAble == 2"
              :options="areaList"
              @change="addressChange"
              :props="{
                label: 'name',
                value: 'id'
              }"
            />
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
            <el-input maxlength="50" :disabled="$route.query.editAble == 2" v-model.trim="formData.area_detail" placeholder="请输入详细地址" @change="areaDetailChange"></el-input>
          </el-form-item>

          <el-form-item label="项目建设地点" prop="project_build_area">
            <el-input maxlength="100" :disabled="$route.query.editAble == 2" v-model.trim="formData.project_build_area" placeholder="请输入项目建设地点"></el-input>
          </el-form-item>

          <el-form-item
            key="u32"
            label="建设期限"
            prop="build_at"
            :rules="{
              required: true,
              message: '期限不能为空',
              trigger: 'blur'
            }"
          >
            <el-date-picker
              :disabled="$route.query.editAble == 2"
              key="1"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM"
              class="setDatePicker"
              type="monthrange"
              align="right"
              @input="$forceUpdate()"
              v-model="formData.build_at"
              unlink-panels
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="申报单位" prop="declare_unit">
            <el-input maxlength="30" v-model="formData.declare_unit" :disabled="$route.query.editAble == 2" placeholder="请输入" @change="declareUnitChange" />
          </el-form-item>

          <el-form-item label="项目实施单位" prop="project_ss_unit">
            <el-input maxlength="30" v-model="formData.project_ss_unit" @input="companyChange" :disabled="$route.query.editAble == 2" placeholder="请输入项目实施单位" />
          </el-form-item>

          <el-form-item label="负责人" prop="unit_charge_name">
            <el-input maxlength="20" :disabled="$route.query.editAble == 2" v-model="formData.unit_charge_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话" prop="unit_charge_mobile">
            <el-input :disabled="$route.query.editAble == 2" v-model="formData.unit_charge_mobile" maxlength="11" placeholder="请输入" />
          </el-form-item>
          <el-form-item
            label="申报时间"
            key="hsdfj"
            prop="declare_at"
            :rules="{
              required: true,
              message: '申报时间不能为空',
              trigger: 'blur'
            }"
          >
            <el-date-picker
              :disabled="$route.query.editAble == 2"
              v-model="formData.declare_at"
              align="right"
              key="2"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions2"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="项目建设内容" class="fakeRequired"></el-form-item>
          <template v-for="(domain, index) in formData.build_contents">
            <div :key="index">
              <el-form-item
                class="marginItem"
                :label="'项目内容'"
                :prop="'build_contents.' + index + '.content'"
                :rules="{
                  required: true,
                  message: '内容不能为空',
                  trigger: 'blur'
                }"
              >
                <el-input type="textarea" :disabled="$route.query.editAble == 2" placeholder="请输入" maxlength="100" v-model.trim="domain.content" :autosize="{ minRows: 3 }"></el-input>
              </el-form-item>
              <div class="formItemSpecial">
                <!-- <el-form-item
                  :label="'投资额（万元）'"
                  :prop="'build_contents.' + index + '.invest_money'"
                  :rules="{
                    required: true,
                    message: '单价不能为空',
                    trigger: 'blur'
                  }"
                >
                  <el-input-number :min="0" :disabled="$route.query.editAble == 2" :precision="2" v-model="domain.invest_money" :step="1"></el-input-number>
                </el-form-item> -->
                <div class="deleteBtnCon" v-if="$route.query.editAble != 2">
                  <el-button @click.prevent="removeDomain(domain)" class="deleteResetBtn" size="small" type="danger" v-if="index">删除</el-button>
                </div>
              </div>
            </div>
          </template>
          <!-- <div class="alignCenter" v-if="$route.query.editAble != 2">
            <el-button @click="addDomain" class="deleteResetBtn resetBlue" icon="el-icon-plus" size="small" type="primary">新增</el-button>
          </div> -->
          <el-form-item
            :label="'新生产能力和效益分析'"
            prop="product_benefit"
            :rules="{
              required: true,
              message: '内容不能为空',
              trigger: 'blur'
            }"
          >
            <el-input type="textarea" :disabled="$route.query.editAble == 2" placeholder="请输入" maxlength="1000" v-model.trim="formData.product_benefit" :autosize="{ minRows: 8 }"></el-input>
          </el-form-item>
          <el-form-item
            :label="'土地性质或来源'"
            prop="land_nature_source"
            :rules="{
              required: true,
              message: '土地性质或来源不能为空',
              trigger: 'blur'
            }"
          >
            <el-input type="textarea" :disabled="$route.query.editAble == 2" placeholder="请输入" maxlength="1000" v-model.trim="formData.land_nature_source" :autosize="{ minRows: 8 }"></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <div class="flexItemCon">
              <p>合计：</p>
              <p>{{ calcFunction(formData.build_contents) }}万元</p>
            </div>
          </el-form-item> -->
          <el-form-item
            :style="{
              display: 'flex',
              justifyContent: 'center',
              marginRight: '80px'
            }"
            prop="mobile"
          >
            <el-button class="cover_btn" @click="goback">{{ $route.query.editAble != 2 ? '取 消' : '返 回' }}</el-button>
            <el-button class="cover_btn" @click="nextPage" v-if="$route.query.editAble == 2">下一页</el-button>
            <el-button class="cover_btn" v-if="$route.query.editAble != 2" @click="saveCurrent()">保 存</el-button>
            <el-button type="primary" class="resetBlue" v-if="$route.query.editAble != 2" @click="onSubmit('form')">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { accAdd } from '@/plugins/util'
export default {
  layout: 'main',
  head() {
    return {
      title: '项目储备',
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
      areaList: [],
      areaId: [],
      total: '0',
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
      ids: [],
      formData: {
        project_name: '',
        project_type: '',
        area_detail: '',
        build_at: [],
        area_ids: [],
        declare_unit: '',
        unit_charge_name: '',
        unit_charge_mobile: '',
        declare_at: '',
        build_contents: [
          {
            content: '',
            invest_money: 0
          }
        ],
        product_benefit: '',
        land_nature_source: '',
        project_ss_unit: '',
        project_build_area: ''
      },
      rules: {
        project_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        project_type: [{ required: true, message: '请输入', trigger: 'blur' }],
        area_ids: [{ required: true, message: '请输入', trigger: 'blur' }],
        area_detail: [{ required: true, message: '请输入', trigger: 'blur' }],
        build_at: [{ required: true, message: '请输入', trigger: 'blur' }],
        declare_unit: [{ required: true, message: '请输入', trigger: 'blur' }],
        unit_charge_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        unit_charge_mobile: [
          {
            required: true,
            message: '请输入正确的手机号',
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur'
          }
        ],
        declare_at: [{ required: true, message: '请输入', trigger: 'blur' }],
        product_benefit: [{}],
        land_nature_source: [{}]
      },
      changeInfo: {},
      areaList: [],
      typeOptions: [
        {
          label: '种植业',
          value: '1'
        },
        {
          label: '养殖业',
          value: '2'
        },
        {
          label: '加工业',
          value: '3'
        },
        {
          label: '乡村建设',
          value: '4'
        },
        {
          label: '其他',
          value: '9'
        }
      ],
      addressChinese: ''
    }
  },
  created() {
    this.getAreaList()
    this.$store.commit('changeMenuActive', '1')
    if (this.$route.query.id) {
      this.getCurrentDetail()
    }
  },
  methods: {
    companyChange() {
      this.$forceUpdate()
    },
    declareUnitChange() {
      this.formData.project_ss_unit = this.formData.declare_unit
      this.$forceUpdate()
    },
    addressChange() {
      let h2i = this.areaList[0].children.find((ele) => {
        return this.formData.area_ids[1] == ele.id
      })
      if (h2i) {
        let h3i = h2i.children.find((ele) => {
          return this.formData.area_ids[2] == ele.id
        })
        this.addressChinese = '江山市' + h2i.name + h3i.name
        this.formData.project_build_area = this.addressChinese + this.formData.area_detail
        this.$forceUpdate()
      }
    },
    areaDetailChange() {
      this.formData.project_build_area = this.addressChinese + this.formData.area_detail
      this.$forceUpdate()
    },
    getAreaList() {
      this.ApiLists.getAreaList().then((res) => {
        if (res && res.code === 0) this.areaList = res.data.list
      })
    },
    calcFunction(array) {
      let temp = array.map((ele) => {
        if (!ele.invest_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      let res = temp.reduce((acc, current) => {
        return accAdd(acc, current.invest_money)
      }, 0)
      return res
    },
    goback() {
      if (this.$route.query.editAble == 2) {
        this.$router.back()
      } else {
        let res = confirm('确定要退出当前编辑吗?')
        if (res) {
          this.$router.back()
        }
      }
    },
    getAreaList() {
      this.ApiLists.getAreaList().then((res) => {
        if (res && res.code === 0) {
          this.areaList = res.data.list
        }
      })
    },
    saveCurrent() {
      if (this.formData.project_name) {
        this.formData.city_id = this.formData.area_ids[0] || 0
        this.formData.town_id = this.formData.area_ids[1] || 0
        this.formData.village_id = this.formData.area_ids[2] || 0
        this.formData.save_type = 'save'
        if (this.formData.build_at && this.formData.build_at.length) {
          this.formData.build_start_at = this.formData.build_at[0]
          this.formData.build_end_at = this.formData.build_at[1]
        } else {
          this.formData.build_start_at = ''
          this.formData.build_end_at = ''
        }
        if (this.$route.query.id) {
          this.formData.id = this.$route.query.id
          let newObj = JSON.stringify(this.formData)
          let afterObj = JSON.parse(newObj)
          afterObj.build_contents = JSON.stringify(this.formData.build_contents)
          console.log('afterObj', afterObj)
          this.ApiLists.projectReserveAction(afterObj)
            .then((res) => {
              if (res && res.code == 0) {
                this.$message.success('保存成功')
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch((err) => {
              this.$message.error(err)
            })
        } else {
          let newObj = JSON.stringify(this.formData)
          let afterObj = JSON.parse(newObj)
          afterObj.build_contents = JSON.stringify(this.formData.build_contents)
          this.ApiLists.projectReserveAction(afterObj)
            .then((res) => {
              if (res && res.code == 0) {
                this.$message.success('保存成功')
                let allQuery = this.$route.query
                this.$router.replace({
                  path: '/project/projectReserve/edit',
                  query: {
                    ...allQuery,
                    id: res.data.id
                  }
                })
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch((err) => {
              this.$message.error(err)
            })
        }
      } else {
        this.$message.error('项目名称不能为空')
      }
    },
    addDomain() {
      this.formData.build_contents.push({
        content: '',
        invest_money: 0
      })
    },
    removeDomain(item) {
      var index = this.formData.build_contents.indexOf(item)
      if (index !== -1) {
        this.formData.build_contents.splice(index, 1)
        this.$forceUpdate()
      }
    },
    getCurrentDetail() {
      this.ApiLists.projectReserveDetail({ id: this.$route.query.id }).then((res) => {
        let shorter = res.data.info
        this.formData = shorter
        console.log('this.formData', this.formData)
        this.formData.project_type = shorter.project_type ? String(shorter.project_type) : ''
        this.formData.build_contents = shorter.build_contents || []
        this.formData.area_ids = [shorter.city_id, shorter.town_id, shorter.village_id]
        if (this.formData.project_ss_unit) {
          //
        } else {
          //   this.formData.project_ss_unit = this.formData.declare_unit
        }
        this.ApiLists.getAreaList().then((res) => {
          if (res && res.code === 0) {
            this.areaList = res.data.list
            let track1 = this.areaList[0].children.find((ele) => {
              return ele.id == shorter.town_id
            })
            if (track1) {
              let track2 = track1.children.find((ele) => {
                return ele.id == shorter.village_id
              })
              if (track2) {
                this.addressChinese = '江山市' + track1.name + track2.name
                if (shorter.project_build_area) {
                  //
                } else {
                  this.$forceUpdate()
                  //   this.formData.project_build_area = this.addressChinese + this.formData.area_detail
                }
              }
            }
          }
        })

        if (shorter.build_start_at) {
          this.formData.build_at = [shorter.build_start_at, shorter.build_end_at]
        }
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formData.build_contents.length) {
            this.submitForm()
          } else {
            this.$message.error('项目建设内容不能为空')
          }
        } else {
          return false
        }
      })
    },
    nextPage() {
      this.$router.push({
        path: '/project/projectReserve/hugeTable',
        query: {
          id: this.$route.query.id,
          editAble: '2'
        }
      })
    },
    async submitForm() {
      this.formData.city_id = this.formData.area_ids[0]
      this.formData.town_id = this.formData.area_ids[1]
      this.formData.village_id = this.formData.area_ids[2]
      this.formData.save_type = 'save'
      if (this.formData.build_at && this.formData.build_at.length) {
        this.formData.build_start_at = this.formData.build_at[0]
        this.formData.build_end_at = this.formData.build_at[1]
      } else {
        this.formData.build_start_at = ''
        this.formData.build_end_at = ''
      }
      delete this.formData.status
      let newObj = JSON.stringify(this.formData)
      let afterObj = JSON.parse(newObj)
      afterObj.build_contents = JSON.stringify(this.formData.build_contents)
      this.ApiLists.projectReserveAction(afterObj)
        .then((res) => {
          if (res && res.code == 0) {
            this.$message.success('提交成功')
            let allQuery = this.$route.query
            this.$router.push({
              path: '/project/projectReserve/hugeTable',
              query: {
                ...allQuery,
                id: res.data.id
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    toProjectProgress() {
      this.$router.push({
        path: '/project/projectReserve'
      })
    },
    // 项目类型改变触发
    onChangeProjectType(e) {
      if (e == 1) {
        // 选择种植业增加提示信息
        this.$alert('种植花卉、水果、茶叶等经济作物，禁止占用永久基本农田。', '提示', {
          confirmButtonText: '确定',
          showClose: false
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.flexItemCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.resetBlue {
  background-color: #0270c3 !important;
  color: #fff !important;
}
.fakeRequired {
  position: relative;
  &::before {
    content: '*';
    color: #f56c6c;
    left: 35px;
    top: 10px;
    position: absolute;
  }
}
.deleteBtnCon {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-bottom: 20px;
  margin-left: 10px;
}
.contentTitle {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  line-height: 32px;
  margin-bottom: 30px;
  text-align: left;
}
.spPadding {
}
.deleteResetBtn {
  margin-bottom: 30px;
}
.marginItem {
  margin-bottom: 30px;
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
.alignCenter {
  text-align: center;
}
</style>
<style lang="less">
.projectReserveEditCon {
  .formItemSpecial {
    // .el-form-item__content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // }
  }
}
</style>
