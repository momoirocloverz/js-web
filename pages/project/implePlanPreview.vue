<template>
  <div class="implementationPlanCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toProject">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item class="withCursor" @click.native="toProject">我的申报</el-breadcrumb-item>
          <el-breadcrumb-item class="withCursor" @click.native="toMaterial">申报材料</el-breadcrumb-item>
          <el-breadcrumb-item>材料查看</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon">
        <div class="formCon">
          <div class="displayArea" ref="htmlTarget">
            <div class="contentTitle">
              <div>{{ currentInfo.project_declaration_name }}</div>
              <div>实施方案简表</div>
            </div>
            <div class="table-box">
              <table border="1" cellpadding="0" cellspacing="0" class="table-one">
                <tbody>
                  <tr>
                    <td class="table-title">一</td>
                    <td class="table-title">项目名称</td>
                    <td colspan="6">{{ currentInfo.project_name }}</td>
                  </tr>
                  <tr>
                    <td class="table-title">二</td>
                    <td class="table-title">建设单位( 印 )</td>
                    <td colspan="3">{{ currentInfo.declare_unit }}</td>
                    <td>负责人及电话</td>
                    <td colspan="2">{{ currentInfo.unit_charge_name }}-{{ currentInfo.unit_charge_mobile }}</td>
                  </tr>
                  <tr>
                    <td class="table-title">三</td>
                    <td class="table-title">项目建设地点</td>
                    <td colspan="6">{{ currentInfo.full_area }}</td>
                  </tr>
                  <tr>
                    <td class="table-title">四</td>
                    <td class="table-title">土地性质或来源</td>
                    <td colspan="6">{{ currentInfo.land_info }}</td>
                  </tr>
                  <tr>
                    <td class="table-title">五</td>
                    <td class="table-title">项目建设期限</td>
                    <td colspan="6">
                      {{ currentInfo.build_start_at ? Dayjs(currentInfo.build_start_at).format('YYYY年M月') : '' }}至{{
                        currentInfo.build_end_at ? Dayjs(currentInfo.build_end_at).format('YYYY年M月') : ''
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="table-title">六</td>
                    <td class="table-title">主要建设内容</td>
                    <td colspan="6" class="resetHeight">
                      {{ currentInfo.build_main_content }}
                    </td>
                  </tr>
                  <tr>
                    <td class="table-title">七</td>
                    <td class="table-title">项目建设分项名称</td>
                    <td class="center">建设地点</td>
                    <!-- <td>建设单位</td> -->
                    <td class="center">规模（数量）</td>
                    <td class="center">投资（万元）</td>
                    <td class="center">其中财政补助（万元）</td>
                    <td class="center" colspan="2">进度安排</td>
                  </tr>

                  <template v-if="currentInfo.part1 && currentInfo.part1.length">
                    <tr>
                      <td class="center">分项1</td>
                      <td class="table-title">基础设施建设</td>
                      <td colspan="6"></td>
                    </tr>
                    <tr v-for="(item, index) in currentInfo.part1" :key="index">
                      <td class="center">{{ index + 1 }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.location }}</td>
                      <!-- <td>{{ item.declare_unit }}</td> -->
                      <td>{{ item.scale }}</td>
                      <td>{{ item.invest_money }}</td>
                      <td>{{ item.subsidy_money }}</td>
                      <td colspan="2">
                        {{ item.schedule_start_at ? Dayjs(item.schedule_start_at).format('YYYY年M月') : '' }}至{{ item.schedule_end_at ? Dayjs(item.schedule_end_at).format('YYYY年M月') : '' }}
                      </td>
                    </tr>
                  </template>

                  <template v-if="currentInfo.part2 && currentInfo.part2.length">
                    <tr>
                      <td class="center">分项{{ currentInfo.part1 && currentInfo.part1.length ? '2' : '1' }}</td>
                      <td class="table-title">设施设备</td>
                      <td colspan="6"></td>
                    </tr>
                    <tr v-for="(item, index) in currentInfo.part2" :key="index + 1">
                      <td class="center">{{ index + 1 }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.location }}</td>
                      <!-- <td>{{ item.declare_unit }}</td> -->
                      <td>{{ item.scale }}</td>
                      <td>{{ item.invest_money }}</td>
                      <td>{{ item.subsidy_money }}</td>
                      <td colspan="2">
                        {{ item.schedule_start_at ? Dayjs(item.schedule_start_at).format('YYYY年M月') : '' }}至{{ item.schedule_end_at ? Dayjs(item.schedule_end_at).format('YYYY年M月') : '' }}
                      </td>
                    </tr>
                  </template>

                  <template v-if="currentInfo.part3 && currentInfo.part3.length">
                    <tr>
                      <td class="center">分项{{ getPart3Index() }}</td>
                      <td class="table-title">其他</td>
                      <td colspan="6"></td>
                    </tr>
                    <tr v-for="(item, index) in currentInfo.part3" :key="index + Date.now() + 1">
                      <td class="center">{{ index + 1 }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.location }}</td>
                      <!-- <td>{{ item.declare_unit }}</td> -->
                      <td>{{ item.scale }}</td>
                      <td>{{ item.invest_money }}</td>
                      <td>{{ item.subsidy_money }}</td>
                      <td colspan="2">
                        {{ item.schedule_start_at ? Dayjs(item.schedule_start_at).format('YYYY年M月') : '' }}至{{ item.schedule_end_at ? Dayjs(item.schedule_end_at).format('YYYY年M月') : '' }}
                      </td>
                    </tr>
                  </template>
                  <tr>
                    <td></td>
                    <td class="table-title">合计</td>
                    <td></td>
                    <td></td>
                    <td>{{ moneyFormat(invest_moneyTotal) }}</td>
                    <td>{{ moneyFormat(subsidy_moneyTotal) }}</td>
                    <td colspan="2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="operationArea">
            <el-button v-if="projectStatus != 40" type="primary" size="small" class="coverBtn" @click="toEdit">编辑</el-button>
            <el-button type="primary" size="small" class="coverBtn" @click="triggerDownload">下载</el-button>
            <el-button type="primary" size="small" class="coverBtn" @click="toPrint">打印</el-button>
          </div>
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
      title: '实施方案简表预览',
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
      invest_moneyTotal: 0,
      subsidy_moneyTotal: 0,
      currentInfo: {},
      projectStatus: 0
    }
  },
  mounted() {
    this.initAction()
    this.initRequest()
  },
  methods: {
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
    initAction() {
      this.$store.commit('changeMenuActive', '3')
    },
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
    initRequest() {
      if (this.$route.query.project_id) {
        let data = {
          project_id: this.$route.query.project_id
        }
        this.ApiLists.fetchProjectSchedule(data)
          .then((res) => {
            if (res && res.code == 0) {
              if (res.data.info) {
                this.projectStatus = res.data.info.status
              }
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch((err) => {
            console.log('er', err)
          })
      }
      this.ApiLists.fetchProjectImplementPlanDetail({
        project_id: this.$route.query.project_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            this.currentInfo = res.data.info
            this.currentInfo.part1 = this.currentInfo.part_options.find((ele) => {
              return ele.option_name == '基础设施建设'
            }).list
            this.currentInfo.part2 = this.currentInfo.part_options.find((ele) => {
              return ele.option_name == '设施设备'
            }).list
            this.currentInfo.part3 = this.currentInfo.part_options.find((ele) => {
              return ele.option_name == '其他'
            }).list
            let temp1 = this.currentInfo.part1.map((ele) => {
              if (!ele.invest_money || !ele.subsidy_money) {
                return {
                  ...ele,
                  invest_money: ele.invest_money ? ele.invest_money : 0,
                  subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                }
              } else {
                return {
                  ...ele
                }
              }
            })
            let temp2 = this.currentInfo.part2.map((ele) => {
              if (!ele.invest_money || !ele.subsidy_money) {
                return {
                  ...ele,
                  invest_money: ele.invest_money ? ele.invest_money : 0,
                  subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                }
              } else {
                return {
                  ...ele
                }
              }
            })
            let temp3 = this.currentInfo.part3.map((ele) => {
              if (!ele.invest_money || !ele.subsidy_money) {
                return {
                  ...ele,
                  invest_money: ele.invest_money ? ele.invest_money : 0,
                  subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                }
              } else {
                return {
                  ...ele
                }
              }
            })
            let tempMaster = [...temp1, ...temp2, ...temp3]
            let res1 = tempMaster.reduce((acc, current) => {
              return acc + current.invest_money
            }, 0)
            let res2 = tempMaster.reduce((acc, current) => {
              return acc + current.subsidy_money
            }, 0)
            this.invest_moneyTotal = res1
            this.subsidy_moneyTotal = res2
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    toPrint() {
      this.$Print(this.$refs.htmlTarget)
    },
    toEdit() {
      this.$router.push({
        path: '/project/implementationPlan',
        query: {
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id
        }
      })
    },
    triggerDownload() {
      let data = {
        project_id: this.$route.query.project_id
      }
      this.ApiLists.downloadProjectImplementPlan(data)
        .then((res) => {
          const content = res
          const blob = new Blob([content])
          const fileName = '实施方案简表' + Date.now() + '.pdf'
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    getPart3Index() {
      const { part1, part2, part3 } = this.currentInfo
      if (part3) {
        if (part1 && part1.length && part2 && part2.length) {
          return '3'
        } else if (!((part1 && part1.length) || (part2 && part2.length))) {
          return '1'
        } else {
          return '2'
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.withCursor {
  cursor: pointer;
}
@page {
  margin: 0;
  margin-top: 50px;
  margin-bottom: 50px;
}
.table-box {
  margin-top: 60px;
}
.table-box table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
}

.table-box table td {
  border: 1px solid #000;
  padding: 20px;
}

.table-box table .table-title {
  font-size: 16px;
  text-align: center;
  font-weight: bold;
  min-width: 80px;
}
.table-box table .center {
  text-align: center;
}
.resetHeight {
  height: 110px;
}
.operationArea {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-top: 30px;
}
.implementationPlanCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
}
.centerCon {
  width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  box-sizing: border-box;
}
.contentCon {
  margin-top: 20px;
  padding: 40px 100px 30px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 20px;
}
.contentTitle {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  text-align: center;
  line-height: 32px;
}
.tableCon {
}
.coverBtn {
  background-color: #0270c3;
  color: #fff;
}
</style>
