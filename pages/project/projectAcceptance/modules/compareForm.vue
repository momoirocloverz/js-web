<template>
  <div class="compare_form">
    <div class="title">
      <p>{{ projectInfo.project_name + '项目完成情况对比表' }}</p>
      <el-button class="cover_btn" @click="visible = true">查看对比表案例</el-button>
    </div>
    <el-form :model="formData" ref="form">
      <div class="el_table_box">
        <p class="name">分项1：基础设施建设</p>
        <el-table :data="formData.list1" style="width: 100%">
          <el-table-column label="分项名称">
            <template slot-scope="scope">
              <el-form-item :prop="'list1.' + scope.$index + '.name'" :rules="[{ required: true, message: '名称不能为空' }]">
                <el-input v-model="scope.row.name" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="建设地点">
            <template slot-scope="scope">
              <el-form-item :prop="'list1.' + scope.$index + '.location'" :rules="[{ required: true, message: '地点不能为空' }]">
                <el-input v-model="scope.row.location" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="建设内容计划数">
            <template slot-scope="scope">
              <el-form-item :prop="'list1.' + scope.$index + '.plan_scale'" :rules="[{ required: true, message: '计划数不能为空' }]">
                <el-input v-model="scope.row.plan_scale" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="建设内容完成数">
            <template slot-scope="scope">
              <el-form-item :prop="'list1.' + scope.$index + '.complete_scale'" :rules="[{ required: true, message: '完成数不能为空' }]">
                <el-input v-model="scope.row.complete_scale" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="投资金额计划数(万元)">
            <template slot-scope="scope">
              <el-form-item :prop="'list1.' + scope.$index + '.plan_invest_money'" :rules="[{ required: true, message: '计划数不能为空' }]">
                <el-input-number v-model="scope.row.plan_invest_money" controls-position="right" :min="1" :max="1000" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="投资金额完成数(万元)">
            <template slot-scope="scope">
              <el-form-item :prop="'list1.' + scope.$index + '.complete_invest_money'" :rules="[{ required: true, message: '完成数不能为空' }]">
                <el-input-number v-model="scope.row.complete_invest_money" controls-position="right" :min="1" :max="1000" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteRow(1, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="btns">
          <p @click="addRow(1)">+ 新增一行</p>
          <p>
            合计： 投资金额计划数 <span>{{ moneyFormat(sub(1, 'plan_invest_money')) }}</span> 万元，投资金额完成数 <span>{{ moneyFormat(sub(1, 'complete_invest_money')) }}</span> 万元
          </p>
        </div>
      </div>
      <div class="el_table_box">
        <p class="name">分项2：设施设备</p>
        <el-table :data="formData.list2" style="width: 100%">
          <el-table-column label="分项名称">
            <template slot-scope="scope">
              <el-form-item :prop="'list2.' + scope.$index + '.name'" :rules="[{ required: true, message: '名称不能为空' }]">
                <el-input v-model="scope.row.name" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="建设地点">
            <template slot-scope="scope">
              <el-form-item :prop="'list2.' + scope.$index + '.location'" :rules="[{ required: true, message: '地点不能为空' }]">
                <el-input v-model="scope.row.location" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="建设内容计划数">
            <template slot-scope="scope">
              <el-form-item :prop="'list2.' + scope.$index + '.plan_scale'" :rules="[{ required: true, message: '计划数不能为空' }]">
                <el-input v-model="scope.row.plan_scale" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="建设内容完成数">
            <template slot-scope="scope">
              <el-form-item :prop="'list2.' + scope.$index + '.complete_scale'" :rules="[{ required: true, message: '完成数不能为空' }]">
                <el-input v-model="scope.row.complete_scale" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="投资金额计划数(万元)">
            <template slot-scope="scope">
              <el-form-item :prop="'list2.' + scope.$index + '.plan_invest_money'" :rules="[{ required: true, message: '计划数不能为空' }]">
                <el-input-number v-model="scope.row.plan_invest_money" controls-position="right" :min="1" :max="1000" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="投资金额完成数(万元)">
            <template slot-scope="scope">
              <el-form-item :prop="'list2.' + scope.$index + '.complete_invest_money'" :rules="[{ required: true, message: '完成数不能为空' }]">
                <el-input-number v-model="scope.row.complete_invest_money" controls-position="right" :min="1" :max="1000" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteRow(2, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="btns">
          <p @click="addRow(2)">+ 新增一行</p>
          <p>
            合计： 投资金额计划数 <span>{{ moneyFormat(sub(2, 'plan_invest_money')) }}</span> 万元，投资金额完成数 <span>{{ moneyFormat(sub(2, 'complete_invest_money')) }}</span> 万元
          </p>
        </div>
      </div>
      <div class="el_table_box">
        <p class="name">分项3：其他</p>
        <el-table :data="formData.list3" style="width: 100%">
          <el-table-column label="分项名称">
            <template slot-scope="scope">
              <el-form-item :prop="'list3.' + scope.$index + '.name'" :rules="[{ required: true, message: '名称不能为空' }]">
                <el-input v-model="scope.row.name" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="建设地点">
            <template slot-scope="scope">
              <el-form-item :prop="'list3.' + scope.$index + '.location'" :rules="[{ required: true, message: '地点不能为空' }]">
                <el-input v-model="scope.row.location" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="建设内容计划数">
            <template slot-scope="scope">
              <el-form-item :prop="'list3.' + scope.$index + '.plan_scale'" :rules="[{ required: true, message: '计划数不能为空' }]">
                <el-input v-model="scope.row.plan_scale" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="建设内容完成数">
            <template slot-scope="scope">
              <el-form-item :prop="'list3.' + scope.$index + '.complete_scale'" :rules="[{ required: true, message: '完成数不能为空' }]">
                <el-input v-model="scope.row.complete_scale" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="投资金额计划数(万元)">
            <template slot-scope="scope">
              <el-form-item :prop="'list3.' + scope.$index + '.plan_invest_money'" :rules="[{ required: true, message: '计划数不能为空' }]">
                <el-input-number v-model="scope.row.plan_invest_money" controls-position="right" :min="1" :max="1000" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="投资金额完成数(万元)">
            <template slot-scope="scope">
              <el-form-item :prop="'list3.' + scope.$index + '.complete_invest_money'" :rules="[{ required: true, message: '完成数不能为空' }]">
                <el-input-number v-model="scope.row.complete_invest_money" controls-position="right" :min="1" :max="1000" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteRow(3, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="btns">
          <p @click="addRow(3)">+ 新增一行</p>
          <p>
            合计： 投资金额计划数 <span>{{ moneyFormat(sub(3, 'plan_invest_money')) }}</span> 万元，投资金额完成数 <span>{{ moneyFormat(sub(3, 'complete_invest_money')) }}</span> 万元
          </p>
        </div>
      </div>
      <p class="statisic">
        总计： 投资金额计划数 <span>{{ moneyFormat(plan) }} </span>万元，投资金额完成数 <span>{{ moneyFormat(complete) }}</span> 万元
      </p>
      <el-form-item :style="{ display: 'flex', justifyContent: 'center', margin: '30px 80px 30px 0' }">
        <el-button class="cover_btn" @click="$router.back()">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')" :disabled="disableBtn">提 交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="visible" width="790px">
      <img width="720" src="https://img.hzanchu.com/acimg/5731724047c1881e4f536c3359029902.jpeg" alt="" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    projectInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      objItem: {
        name: '',
        location: '',
        plan_scale: '',
        complete_scale: '',
        plan_invest_money: '',
        complete_invest_money: ''
      },
      formData: {
        list1: [],
        list2: [],
        list3: []
      },
      plan: 0,
      complete: 0,
      visible: false,
      disableBtn: false,
      disableTimer: null
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getCompare()
    } else {
      this.getDetail()
    }
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
    sub(id, key) {
      let value = 0
      this.formData['list' + id].forEach((item) => {
        return (value += +item[key])
      })
      return value
    },
    addRow(id) {
      this.formData['list' + id].push(JSON.parse(JSON.stringify(this.objItem)))
    },
    deleteRow(id, index) {
      this.formData['list' + id].splice(index, 1)
    },
    onSubmit(formName) {
      this.disableBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitCompare()
        } else {
          this.disableBtn = false
          return false
        }
      })
    },
    submitCompare() {
      let params = {
        save_type: 'submit',
        project_id: this.$route.query.project_id,
        part_options: [
          {
            option_name: '基础设施建设',
            option_mark: 'infrastructure_construction',
            list: this.formData.list1
          },
          {
            option_name: '设施设备',
            option_mark: 'mechanical_equipment',
            list: this.formData.list2
          },
          {
            option_name: '其他',
            option_mark: 'other',
            list: this.formData.list3
          }
        ]
      }
      this.ApiLists.editCompare(params)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('提交成功')
            this.$router.back()
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
    getCompare() {
      this.ApiLists.compareDetail({ project_id: this.$route.query.project_id }).then((res) => {
        res.data.info.part_options.forEach((item, itemIndex) => {
          item.list.forEach((list) => {
            this.formData['list' + (itemIndex + 1)].push(list)
          })
        })
      })
    },
    getDetail() {
      this.ApiLists.fetchProjectImplementPlanDetail({ project_id: this.$route.query.project_id }).then((res) => {
        res.data.info.part_options.forEach((item, itemIndex) => {
          item.list.forEach((list) => {
            let obj = JSON.parse(JSON.stringify(this.objItem))
            obj.name = list.name
            obj.location = list.location
            obj.plan_scale = list.scale
            obj.plan_invest_money = list.invest_money
            this.formData['list' + (itemIndex + 1)].push(obj)
          })
        })
      })
    }
  },
  watch: {
    formData: {
      handler(val) {
        // val.list1.forEach((item) => {
        //   this.plan += +item.plan_invest_money
        //   this.complete += +item.complete_invest_money
        // })
        // val.list2.forEach((item) => {
        //   this.plan += +item.plan_invest_money
        //   this.complete += +item.complete_invest_money
        // })
        // val.list3.forEach((item) => {
        //   this.plan += +item.plan_invest_money
        //   this.complete += +item.complete_invest_money
        // })
        // console.log(' this.plan', this.plan)

        let temp1 = val.list1.map((ele) => {
          if (!ele.plan_invest_money || !ele.complete_invest_money) {
            return {
              ...ele,
              plan_invest_money: ele.plan_invest_money ? ele.plan_invest_money : 0,
              complete_invest_money: ele.complete_invest_money ? ele.complete_invest_money : 0
            }
          } else {
            return {
              ...ele
            }
          }
        })
        let temp2 = val.list2.map((ele) => {
          if (!ele.plan_invest_money || !ele.complete_invest_money) {
            return {
              ...ele,
              plan_invest_money: ele.plan_invest_money ? ele.plan_invest_money : 0,
              complete_invest_money: ele.complete_invest_money ? ele.complete_invest_money : 0
            }
          } else {
            return {
              ...ele
            }
          }
        })
        let temp3 = val.list3.map((ele) => {
          if (!ele.plan_invest_money || !ele.complete_invest_money) {
            return {
              ...ele,
              plan_invest_money: ele.plan_invest_money ? ele.plan_invest_money : 0,
              complete_invest_money: ele.complete_invest_money ? ele.complete_invest_money : 0
            }
          } else {
            return {
              ...ele
            }
          }
        })
        let tempMaster = [...temp1, ...temp2, ...temp3]
        let res1 = tempMaster.reduce((acc, current) => {
          return acc + current.plan_invest_money
        }, 0)
        let res2 = tempMaster.reduce((acc, current) => {
          return acc + current.complete_invest_money
        }, 0)
        this.plan = res1
        this.complete = res2
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
.compare_form {
  padding-bottom: 50px;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 22px;
    font-weight: 600;
    padding: 30px 80px 30px 120px;
  }
  .el_table_box {
    padding: 20px 20px 40px;
    border-bottom: 1px solid #f0f0f0;
    .name {
      font-size: 18px;
      font-weight: 600;
      text-indent: 100px;
    }
  }
  .el-input-number {
    width: 140px;
  }
  .btns {
    p {
      height: 30px;
      line-height: 30px;
      text-align: center;
      &:nth-of-type(1) {
        color: #2d6fbd;
        border: 1px dashed #2d6fbd;
        border-radius: 4px;
        margin: 20px 0;
        cursor: pointer;
      }
      &:nth-of-type(2) {
        text-align: right;
        font-size: 14px;
        color: #666;
        span {
          font-size: 22px;
          color: #2d6fbd;
          padding: 0 10px;
        }
      }
    }
  }
  .statisic {
    text-align: center;
    margin-top: 30px;
    span {
      font-size: 22px;
      color: #f51818;
    }
  }
}
</style>
