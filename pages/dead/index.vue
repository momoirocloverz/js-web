<template>
  <div class="deadOuterCon">
    <div class="mainCon">
      <helpCom class="setHelpPosition" :name="currentInfo.linkman && currentInfo.linkman.real_name" :phone="currentInfo.linkman && currentInfo.linkman.mobile" />
      <div class="breadcrumb-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toPolicy">惠农政策申报</el-breadcrumb-item>
          <el-breadcrumb-item>病死动物无害化</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="marginTop">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="项目申报" name="first"></el-tab-pane>
          <el-tab-pane label="申请" name="second" :disabled="status < 30"></el-tab-pane>
        </el-tabs>
        <Declare v-if="activeName == 'first'" @fetchStatus="fetchStatus" />
        <Apply v-if="activeName == 'second'" />
      </div>
    </div>
  </div>
</template>
<script>
import Declare from './declare.vue'
import Apply from './apply.vue'
export default {
  layout: 'main',
  components: {
    Declare,
    Apply
  },
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
      status: 0,
      activeName: 'first',
      currentInfo: {}
    }
  },
  mounted() {
    this.initHelp()
    // this.getData(this.$route.query.project_id)
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
    fetchStatus(val) {
      this.status = val
    },
    handleClick(tab, event) {
      //   console.log(tab, event)
    },
    toPolicy() {
      this.$router.push({
        path: '/policy'
      })
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
.deadOuterCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  min-height: calc(100vh - 370px);

  .marginTop {
    margin-top: 20px;
  }

  .mainCon {
    width: 1200px;
    margin: 0 auto;
    padding-top: 30px;
    box-sizing: border-box;
  }
}
</style>
