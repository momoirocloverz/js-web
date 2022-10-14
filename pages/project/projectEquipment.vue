<template>
  <div class="projectEquipmentCon">
    <div class="centerCon">
      <helpCom class="setHelpPosition" :name="currentInfo.linkman && currentInfo.linkman.real_name" :phone="currentInfo.linkman && currentInfo.linkman.mobile" />
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toProject">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item class="withCursor" @click.native="toProject">我的申报</el-breadcrumb-item>
          <el-breadcrumb-item class="withCursor" @click.native="toMaterial">申报材料</el-breadcrumb-item>
          <el-breadcrumb-item>材料填写</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon">
        <div class="contentTitle">项目购置设备设施清单</div>
        <div class="formCon">
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="120px" class="demo-dynamic">
            <template v-for="(domain, index) in dynamicValidateForm.domains">
              <div :key="index" class="flexFormItemCon">
                <el-form-item
                  :label="'设备名称'"
                  :prop="'domains.' + index + '.name'"
                  :rules="{
                    required: true,
                    message: '设备名称不能为空',
                    trigger: 'blur'
                  }"
                >
                  <el-input placeholder="请输入" v-model="domain.name"></el-input>
                </el-form-item>
                <el-form-item
                  class="resetItemWidth"
                  :label="'数量'"
                  :prop="'domains.' + index + '.number'"
                  :rules="{
                    required: true,
                    message: '数量不能为空',
                    trigger: 'blur'
                  }"
                >
                  <el-input-number v-model="domain.number" controls-position="right" @change="handleCountChange" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item
                  :label="'单价（万元）'"
                  :prop="'domains.' + index + '.money'"
                  :rules="{
                    required: true,
                    message: '单价不能为空',
                    trigger: 'blur'
                  }"
                >
                  <el-input-number :min="0" :precision="2" @change="handleMoneyChange" v-model="domain.money" :step="1"></el-input-number>
                </el-form-item>
                <div class="deleteBtnCon" v-if="index">
                  <el-button @click.prevent="removeDomain(domain)" class="deleteResetBtn ml20" type="danger" size="small">删除</el-button>
                </div>
                <div v-else class="emptyHolder ml20"></div>
              </div>
            </template>
            <div class="alignCenter">
              <el-button @click="addDomain" class="deleteResetBtn resetBlue" icon="el-icon-plus" type="primary" size="small">新增</el-button>
            </div>
            <div class="countMasterCon">
              <div>
                合计：<span>{{ moneyFormat(allCount) }}万元</span>
              </div>
            </div>
            <div class="alignCenter">
              <el-button type="primary" class="submitBtn resetBlue" @click="submitForm('dynamicValidateForm')" size="small" :disabled="disableBtn">提交</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'main',
  head() {
    return {
      title: '项目购置设备设施清单',
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
      allCount: 0,
      dynamicValidateForm: {
        domains: [
          {
            name: '',
            number: 1,
            money: 0
          }
        ]
      },
      disableBtn: false,
      disableTimer: null,
      currentInfo: {}
    }
  },
  mounted() {
    this.initAction()
    this.fetchCurrent()
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
    fetchCurrent() {
      if (this.$route.query.project_id) {
        let data = {
          project_id: this.$route.query.project_id
        }
        this.ApiLists.fetchProjectFacilityDetail(data)
          .then((res) => {
            if (res && res.code === 0) {
              if (res.data && res.data.list && res.data.list.facility_list && res.data.list.facility_list.length) {
                this.dynamicValidateForm.domains = res.data.list.facility_list
              }
              if (res.data.total_money) {
                this.allCount = res.data.total_money
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
    moneyFormat(value) {
      if (value || value == 0) {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2)
        return fix
      }
    },
    handleMoneyChange(value) {
      //   console.log(value);
      this.$forceUpdate()
      this.calcFunction()
    },
    handleCountChange(value) {
      //   console.log(value);
      this.$forceUpdate()
      this.calcFunction()
    },
    submitForm(formName) {
      this.disableBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let array = this.dynamicValidateForm.domains
          let data = {
            save_type: 'submit',
            policy_document_id: this.$route.query.policy_document_id,
            facility_list: array
          }
          if (this.$route.query.project_id) {
            data.project_id = this.$route.query.project_id
          }
          if (array.length) {
            this.ApiLists.actionProjectFacilityList(data)
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
                  this.disableBtn = false
                  clearTimeout(this.disableTimer)
                }, 5000)
              })
          } else {
            this.disableBtn = false
            this.$message.error('请填写设备设施清单')
          }
        } else {
          this.disableBtn = false
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    calcFunction() {
      let temp = this.dynamicValidateForm.domains.map((ele) => {
        if (!ele.money || !ele.number) {
          return {
            ...ele,
            money: ele.money ? ele.money : 0,
            number: ele.number ? ele.number : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      let res = temp.reduce((acc, current) => {
        return acc + current.money * current.number
      }, 0)
      this.allCount = res
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
        this.$forceUpdate()
        this.calcFunction()
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        name: '',
        number: 1,
        money: 0
      })
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
.withCursor {
  cursor: pointer;
}
.flexFormItemCon {
  display: flex;
  justify-content: flex-start;
}
.projectEquipmentCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
}
.deleteResetBtn {
}
.submitBtn {
  background-color: #0270c3;
  border-color: #0270c3;
}
.alignCenter {
  text-align: center;
}
.countMasterCon {
  border-top: 1px solid #eee;
  margin-top: 50px;
  box-sizing: border-box;
  padding-top: 20px;
  text-align: center;
  font-size: 20px;
  color: #333;
  line-height: 32px;
  margin-bottom: 40px;
  span {
    color: #f51818;
  }
}
.resetBlue {
  background-color: #0270c3 !important;
  color: #fff !important;
}
.deleteBtnCon {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.ml20 {
  margin-left: 10px;
}
.emptyHolder {
  width: 60px;
  margin-left: 10px;
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
  //   padding: 40px 230px 30px;
  padding: 40px 160px 30px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 20px;
}
.contentTitle {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  line-height: 32px;
}
.formCon {
  margin-top: 30px;
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
</style>
<style lang="less">
.projectEquipmentCon {
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
  .resetItemWidth {
    .el-form-item__label {
      width: 70px !important;
    }
    .el-form-item__content {
      margin-left: 70px !important;
    }
  }
}
</style>
