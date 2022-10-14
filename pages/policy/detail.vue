<template>
  <div class="policyDetailPageCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toPolicy">惠农政策申报</el-breadcrumb-item>
          <el-breadcrumb-item>政策详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon">
        <div class="title">{{ info.title }}</div>
        <div class="timeCon">
          <span>发布时间：</span>
          <span>{{ info.created_at }}</span>
        </div>
        <el-button class="checkSource" @click="checkUnderStand" v-if="info.understand_paper_id" plain>查看相关明白纸</el-button>
        <div class="hrLine"></div>
        <div class="htmlContent" v-html="info.content"></div>
        <div class="pdfContent" v-if="info.accessory && info.accessory.length">
          查看附件：
          <template v-for="(item, index) in info.accessory">
            <div class="itemCon" :key="index">
              <span @click="checkPdf(item)">{{ index + 1 + '：' + item.name }}</span>
            </div>
          </template>
        </div>
        <div class="jumpTriggerCon" v-if="showBtn">
          <div v-if="info.category && info.category.category_name == '秸秆综合利用补贴'" class="flexCon">
            <template v-if="!(applyDisable || project_sub_apply_switch != '1')">
              <el-button type="primary" :disabled="applyDisable || project_sub_apply_switch != '1'" class="jumpBtn" @click="toStrawApply(1)">农机购置补助申请</el-button>
              <el-button type="primary" :disabled="applyDisable || project_sub_apply_switch != '1'" class="jumpBtn" @click="toStrawApply(2)">秸秆利用补助申请</el-button>
              <el-button type="primary" :disabled="applyDisable || project_sub_apply_switch != '1'" class="jumpBtn" @click="toStrawApply(3)">社会化服务补助申请</el-button>
            </template>
            <template v-else>
              <el-button type="primary" disabled class="jumpBtn">{{ applyDisable ? '申报已截止' : project_sub_apply_switch != '1' ? '申报结束' : '在线申报' }}</el-button>
            </template>
          </div>
          <div v-else>
            <el-button type="primary" :disabled="applyDisable || project_apply_switch != '1'" v-if="isCompete" class="jumpBtn" @click="toApply">{{
              applyDisable ? '申报已截止' : project_apply_switch != '1' ? '申报结束' : '在线申报'
            }}</el-button>
            <el-button type="primary" :disabled="applyDisable || project_sub_apply_switch != '1'" v-else class="jumpBtn" @click="toApply">{{
              applyDisable ? '申报已截止' : project_sub_apply_switch != '1' ? '申报结束' : '在线申报'
            }}</el-button>
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
      project_apply_switch: '1',
      project_sub_apply_switch: '1',
      isCompete: false,
      applyDisable: false,
      info: {},
      loginStatus: false,
      showBtn: false,
      areaId: [],
      areaList: [],
      currentType: '',
      typeList: [
        {
          label: '农机购置补助',
          value: '1'
        },
        {
          label: '秸秆利用补助',
          value: '2'
        },
        {
          label: '社会化服务补助',
          value: '3'
        }
      ],
      typeVisible: true
    }
  },
  mounted() {
    this.initAction()
    this.initRequest()
    this.getAreaList()
  },
  methods: {
    getAreaList() {
      this.ApiLists.getAreaList().then((res) => {
        if (res && res.code === 0) this.areaList = res.data.list
      })
    },
    onTypeChange(e) {
      console.log('e', e)
    },
    checkUnderStand() {
      const { href } = this.$router.resolve({
        path: '/understand/detail',
        query: {
          id: this.info.understand_paper_id,
          type: 1
        }
      })
      window.open(href, '_blank')
    },
    toPolicy() {
      this.$router.push({
        path: '/policy'
      })
    },
    toStrawApply(val) {
      if (this.loginStatus) {
        let map = {
          1: '/straw/machine',
          2: '/straw/index',
          3: '/straw/society'
        }
        this.ApiLists.checkCanApply({
          policy_document_id: this.$route.query.id
        }).then((e) => {
          if (e.code !== 0) {
            this.$message.error(e.msg)
          } else {
            this.$router.push({
              path: map[val],
              query: {
                policy_document_id: this.$route.query.id
              }
            })
          }
        })
      } else {
        this.$router.push({
          path: '/login'
        })
      }
    },
    toApply() {
      if (this.loginStatus) {
        if (this.info.category.category_name == '竞争性财政支农项目') {
          // 添加判断条件 用户是否申报过当前项目
          this.ApiLists.checkCanApply({
            policy_document_id: this.$route.query.id
          }).then((e) => {
            if (e.code !== 0) {
              this.$message.error(e.msg)
            } else {
              this.$router.push({
                path: '/project/material',
                query: {
                  policy_document_id: this.$route.query.id
                }
              })
            }
          })
        } else {
          if (this.info.category.category_name == '有机肥使用补贴') {
            this.ApiLists.checkCanApply({
              policy_document_id: this.$route.query.id
            }).then((e) => {
              if (e.code !== 0) {
                this.$message.error(e.msg)
              } else {
                this.$router.push({
                  path: '/organic',
                  query: {
                    policy_document_id: this.$route.query.id
                  }
                })
              }
            })
          } else if (this.info.category.category_name == '秸秆综合利用补贴') {
          } else if (this.info.category.category_name == '湖羊产业补贴') {
            this.ApiLists.checkCanApply({
              policy_document_id: this.$route.query.id
            }).then((e) => {
              if (e.code !== 0) {
                this.$message.error(e.msg)
              } else {
                this.$router.push({
                  path: '/sheep',
                  query: {
                    policy_document_id: this.$route.query.id
                  }
                })
              }
            })
          } else if (this.info.category.category_name == '病死动物无害化处理补贴') {
            this.ApiLists.checkCanApply({
              policy_document_id: this.$route.query.id
            }).then((e) => {
              if (e.code !== 0) {
                this.$message.error(e.msg)
              } else {
                this.$router.push({
                  path: '/dead',
                  query: {
                    policy_document_id: this.$route.query.id
                  }
                })
              }
            })
          } else if (this.info.category.category_name == '粮油适度规模经营补贴') {
            this.ApiLists.checkCanApply({
              policy_document_id: this.$route.query.id
            }).then((e) => {
              if (e.code !== 0) {
                this.$message.error(e.msg)
              } else {
                this.$router.push({
                  path: '/project/crops',
                  query: {
                    policy_document_id: this.$route.query.id
                  }
                })
              }
            })
          }
        }
      } else {
        this.$router.push({
          path: '/login'
        })
      }
    },
    initAction() {
      this.$store.commit('changeMenuActive', '2')
    },
    initRequest() {
      this.loginStatus = localStorage.getItem('loginToken') ? true : false
      let data = {
        id: this.$route.query.id
      }
      this.ApiLists.fetchPolicyDocumentInfo(data)
        .then((res) => {
          if (res && res.code == 0) {
            let { accessory } = res.data || {}
            res.data.accessory = (accessory && typeof accessory == 'string') ? JSON.parse(accessory) : accessory
            this.info = res.data
            if (['竞争性财政支农项目'].includes(res.data.category.category_name)) {
              this.isCompete = true
              let keyData = {
                key: 'project_apply_switch'
              }
              this.ApiLists.getSysSingleConfig(keyData).then((res) => {
                this.project_apply_switch = res.data.info.value
              })
            } else {
              let keyData2 = {
                key: 'project_sub_apply_switch'
              }
              this.ApiLists.getSysSingleConfig(keyData2).then((res) => {
                this.project_sub_apply_switch = res.data.info.value
              })
            }
            this.applyDisable = res.data.project_can_apply == 1 ? false : true
            this.showBtn = true
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((err) => {
          console.log('er', err)
        })
    },
    checkPdf(item) {
      window.open(item.url)
    }
  }
}
</script>
<style lang="less" scoped>
.policyDetailPageCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
}
.jumpTriggerCon {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  .jumpBtn {
    margin: 0 auto;
    width: 224px;
    height: 50px;
    font-size: 16px;
    font-weight: bold;
  }
  .flexCon {
    display: flex;
    justify-content: center;
    width: 70%;
  }
}
.checkSource {
  color: #0270c3;
  border-color: #0270c3;
  position: absolute;
  right: 30px;
  top: 30px;
}
.htmlContent {
  font-size: 14px;
  color: #4d4d4d;
  letter-spacing: 1px;
  word-break: break-all;
}

.pdfContent {
  font-size: 14px;
  color: #4d4d4d;
  letter-spacing: 1px;
  word-break: break-all;
  margin-top: 20px;
}
.itemCon {
  span {
    cursor: pointer;
    color: #0270c3;
    &:hover {
      opacity: 0.8;
    }
  }
}
.centerCon {
  width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  box-sizing: border-box;
  .checkUnderStand {
    border: 1px solid #0270c3;
  }
  .contentCon {
    position: relative;
    margin-top: 20px;
    padding: 20px 30px 30px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 20px;
    .title {
      line-height: 22px;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      color: #333;
      max-width: 720px;
      margin: 0 auto;
      margin-bottom: 20px;
    }
    .timeCon {
      text-align: center;
      line-height: 16px;
      font-size: 16px;
      font-weight: bold;
      color: #666;
      margin-bottom: 20px;
    }
    .hrLine {
      width: 100%;
      height: 2px;
      background-color: #ededed;
      margin-bottom: 40px;
    }
  }
}
</style>

<style lang="less">
// 富文本h5表格样式重置
.policyDetailPageCon {
  table {
    border: 1px solid #333;
    border-collapse: collapse;
    table-layout: fixed;
    word-break: break-all;
    word-wrap: break-word;
    margin: 0;
    padding: 0;
    max-width: 100%;
    td,
    th {
      border: 1px solid #333;
      border-collapse: collapse;
      font-size: 22px;
    }
    td {
      width: 100px !important;
      font-size: 22px;

      span {
        display: inline-block;
        font-family: 'PingFang SC Medium, PingFang SC Medium-Medium' !important;
        white-space: pre-line;
        word-wrap: break-word;
        word-break: break-all;
        font-size: 22px;
      }

      .MsoNormal {
        text-indent: 0 !important;
      }
    }
  }

  .contentCon {
    p {
      img[src*='http'] {
        max-width: 100%;
        height: auto;
      }
    }
  }
}
</style>
