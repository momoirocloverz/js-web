<template>
  <div class="projectReportCon">
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
            <div class="all">
              <div class="page firstPage">
                <div class="subject">
                  <div>{{ currentInfo.project_declaration_name }}</div>
                  <div>项目申报书</div>
                </div>
                <div class="inner-box">
                  <div class="item withFlex">
                    <div class="title">项目名称：</div>
                    <div class="content">{{ currentInfo.project_name }}</div>
                  </div>
                  <div class="item withFlex">
                    <div class="title">项目地点：</div>
                    <div class="content">{{ currentInfo.full_area }}</div>
                  </div>
                  <div class="item withFlex">
                    <div class="title">建设期限：</div>
                    <div class="content">
                      {{ currentInfo.build_start_at ? Dayjs(currentInfo.build_start_at).format('YYYY年M月') : '' }}至{{
                        currentInfo.build_end_at ? Dayjs(currentInfo.build_end_at).format('YYYY年M月') : ''
                      }}
                    </div>
                  </div>
                  <div class="item withFlex">
                    <div class="title">建设单位：</div>
                    <div class="withMarkCon">
                      <div class="underWithMarkContent">
                        {{ currentInfo.declare_unit }}
                      </div>
                      <div>（ 公章 ）</div>
                    </div>
                  </div>
                  <div class="item withFlex">
                    <div class="divideCon">
                      <div class="title">负责人：</div>
                      <div class="divideContent">
                        {{ currentInfo.unit_charge_name }}
                      </div>
                    </div>
                    <div class="divideCon">
                      <div class="title">联系电话：</div>
                      <div class="divideContent">
                        {{ currentInfo.unit_charge_mobile }}
                      </div>
                    </div>
                  </div>
                  <div class="item withFlex">
                    <div class="title">申报日期：</div>
                    <div class="content">
                      {{ currentInfo.start_declare_at ? Dayjs(currentInfo.start_declare_at).format('YYYY年M月D日') : '' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="page">
                <div class="table-box">
                  <table border="1" cellpadding="0" cellspacing="0" class="table-one">
                    <tbody>
                      <tr>
                        <td colspan="3" class="table-title">一、项目建设条件</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="titleResetHeight">
                          {{ currentInfo.build_condition }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3" class="table-title">二、项目资金筹措</td>
                      </tr>
                      <tr>
                        <td colspan="3">{{ currentInfo.fund_raise }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="table-title">三、项目建设内容</td>
                      </tr>
                      <tr>
                        <td class="table-sub-title">序号</td>
                        <td class="table-sub-title">名称、规模数量、建设标准、设备设施规格型号等，要求内容详实</td>
                        <td class="table-sub-title">投资额（万元）</td>
                      </tr>
                      <template v-for="(item, index) in currentInfo.build_contents">
                        <tr :key="index">
                          <td>{{ index + 1 }}</td>
                          <td>{{ item.content }}</td>
                          <td>{{ item.invest_money }}</td>
                        </tr>
                      </template>
                      <tr>
                        <td colspan="2">合计</td>
                        <td>{{ moneyFormat(currentInfo.total_money) }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="table-title">四、建设进度安排</td>
                      </tr>
                      <template v-for="(item, index) in currentInfo.schedule_contents">
                        <tr :key="index + Date.now()">
                          <td>{{ index + 1 }}</td>
                          <td colspan="2">{{ item.content }}</td>
                        </tr>
                      </template>
                      <tr>
                        <td colspan="3" class="table-title">五、项目效益分析</td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          {{ currentInfo.efficiency_analysis }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <div class="twentyFont">申报主体承诺：</div>
                          <div class="twentyFont">&nbsp;&nbsp;&nbsp;&nbsp;以上申报材料真实有效，并按期完成项目建设计划。承诺保证不出现任何项目建设违法违规行为，如出现上述问题将承担一切责任。</div>
                          <div class="alignRight mr100 twentyFont">负责人（签章）：</div>
                          <div class="alignRight mr100 twentyFont">单位（公章）：</div>
                          <br />
                          <div class="alignRight twentyFont">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <div class="twentyFont">乡镇(街道)审核意见：</div>
                          <br />
                          <div class="alignRight mr50 twentyFont">负责人（签字）：&nbsp;&nbsp;&nbsp;&nbsp;（公章）</div>
                          <div class="alignRight twentyFont">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
</template>
<script>
export default {
  layout: 'main',
  head() {
    return {
      title: '项目申报书预览',
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
      projectStatus: 0,
      currentInfo: {}
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
    moneyFormat(value) {
      if (value || value == 0) {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2)
        return fix
      }
    },
    initAction() {
      this.$store.commit('changeMenuActive', '3')
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
      let data = {
        project_id: this.$route.query.project_id
      }
      this.ApiLists.fetchProjectDeclarationDetail(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.currentInfo = res.data.info
            if (res.data.info.build_contents && res.data.info.build_contents.length) {
              var short = this.currentInfo.build_contents
              let res = short.reduce((acc, current) => {
                return acc + current.invest_money
              }, 0)
              this.currentInfo.total_money = res
            }
          } else {
            this.$message.error(res.msg)
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
        path: '/project/projectReport',
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
      this.ApiLists.downloadProjectDeclaration(data)
        .then((res) => {
          const content = res
          const blob = new Blob([content])
          const fileName = '项目申报书' + Date.now() + '.pdf'
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
.all {
  margin: 0 auto;
}
.all .subject {
  font-size: 24px;
  text-align: center;
  margin-top: 120px;
  margin-bottom: 120px;
}
.firstPage {
  height: 83%;
  padding-left: 180px;
  padding-right: 180px;
  box-sizing: border-box;
}
.all .inner-box {
  margin-top: 30px;
  padding-left: 60px;
  padding-right: 60px;
  box-sizing: border-box;
}
.all .inner-box .item {
  margin-top: 70px;
}
.all .inner-box .item .title {
  font-size: 20px;
  width: 130px;
}
.all .inner-box .item .content {
  font-size: 19px;
  width: calc(100% - 130px);
  border-bottom: 1px solid #000;
}
.withMarkCon {
  font-size: 19px;
  width: calc(100% - 130px);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  align-content: center;
}
.underWithMarkContent {
  width: calc(100% - 200px);
  border-bottom: 1px solid #000;
}
.withFlex {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  align-content: center;
}
.divideCon {
  width: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  align-content: center;
}
.divideContent {
  width: calc(100% - 130px);
  border-bottom: 1px solid #000;
  font-size: 19px;
}
.all .page {
  min-height: 1080px;
}
.all .page .table-box {
  margin-top: 60px;
}
.table-box table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
}
.table-box table td {
  border: 1px solid black;
  padding: 20px;
}
.table-box table .table-title {
  font-size: 20px;
  text-align: center;
}
.table-box table .table-sub-title {
  font-style: italic;
  color: rgba(0, 0, 0, 0.91);
}
.text-align-left {
  text-align: left;
}
.text-align-center {
  text-align: center;
}
.text-align-right {
  text-align: right;
}
.padding20 {
  padding: 20px;
}
.alignRight {
  text-align: right;
}
.mr100 {
  margin-right: 100px;
}
.mr50 {
  margin-right: 50px;
}
.twentyFont {
  font-size: 20px;
}
.titleResetHeight {
  height: 300px;
}
.operationArea {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-top: 30px;
}
.projectReportCon {
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
  padding: 40px 60px 30px;
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
.coverBtn {
  background-color: #0270c3;
  color: #fff;
}
.tableCon {
}
</style>
