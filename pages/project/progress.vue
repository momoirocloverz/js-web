<template>
  <div class="projectPageCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toProject">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item>项目进度</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon">
        <helpCom class="setHelpPosition" :name="currentInfo.linkman && currentInfo.linkman.real_name" :phone="currentInfo.linkman && currentInfo.linkman.mobile" />
        <el-radio-group v-model="activeName" class="step-tab" @change="handleClick">
          <el-radio-button label="first">项目申报</el-radio-button>
          <el-radio-button label="second" :disabled="!isShowTas">项目实施</el-radio-button>
          <el-radio-button label="third" :disabled="!isShowTas">项目验收</el-radio-button>
          <el-radio-button label="fourth" :disabled="!isShowTas">资金兑现</el-radio-button>
        </el-radio-group>
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="项目申报" name="first"></el-tab-pane>
          <el-tab-pane label="项目实施" :disabled="!isShowTas" name="second"></el-tab-pane>
          <el-tab-pane label="项目验收" :disabled="!isShowTas" name="third"></el-tab-pane>
          <el-tab-pane label="资金兑现" :disabled="!isShowTas" name="fourth"></el-tab-pane>
        </el-tabs> -->
        <project-declare @showTabs="showTabs" v-show="activeName === 'first'" />
        <project-implement v-if="activeName === 'second'" />
        <project-acceptance v-if="activeName === 'third'" />
        <money-cash v-if="activeName === 'fourth'" />
      </div>
    </div>
  </div>
</template>

<script>
import projectDeclare from './modules/projectDeclare'
import projectImplement from './modules/projectImplement'
import moneyCash from './modules/moneyCash'
import projectAcceptance from './modules/projectAcceptance'
export default {
  layout: 'main',
  head() {
    return {
      title: '项目申报进度',
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
  components: {
    moneyCash,
    projectDeclare,
    projectImplement,
    projectAcceptance
  },
  data() {
    return {
      activeName: '',
      isShowTas: false,
      currentInfo: {}
    }
  },
  mounted() {
    this.activeName = this.$route.query.active || 'first'
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
    showTabs(e) {
      this.isShowTas = e
    },
    handleClick(tab, event) {
      const query = this.$route.query
      // 不需要跳转 只记载路由参数
      this.$router.replace({
        name: this.$route.name,
        query: {
          ...query,
          active: this.activeName
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.projectPageCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);

  .step-tab {
    margin-bottom: 20px;
    width: 100%;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -20px;
      width: 100%;
      height: 1px;
      background: rgba(112, 112, 112, 0.2);
      transform: scaleY(0.5);
    }
  }
}
.centerCon {
  width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  box-sizing: border-box;
}
.contentCon {
  margin-top: 20px;
  padding: 20px 30px 30px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 20px;
  position: relative;
}
.setHelpPosition {
  position: fixed;
  right: 290px;
  bottom: 300px;
//   right: -70px;
//   top: 50px;
}
</style>

<style lang="less">
.projectPageCon {
  .el-radio-button {
    height: 36px;
    .el-radio-button__inner {
      border: none !important;
      font-size: 16px;
      height: 100%;
      line-height: 19px;
      width: 121px;
      color: #333333;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &.is-active {
      .el-radio-button__inner {
        background: #0270c3;
        border-radius: 4px;
        color: #fff;
      }
    }

    &.is-disabled {
      .el-radio-button__inner {
        color: #c0c4cc;
      }
    }
  }
}
</style>
