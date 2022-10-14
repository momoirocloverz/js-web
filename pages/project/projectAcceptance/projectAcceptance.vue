<template>
  <div class="project_acceptance box_wrap">
    <div class="center_box">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item @click.native="toProjectManage">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item @click.native="toProjectProgress">项目进度</el-breadcrumb-item>
          <el-breadcrumb-item>项目验收</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <accept-apply-form key="1" v-show="type === 'form' && apply === 1" :project-info="projectInfo" />
        <accept-apply-detail key="2" v-show="type === 'table' && apply === 1" />
        <work-summary-form key="3" v-show="type === 'form' && apply === 2" />
        <work-summary-detail key="4" v-show="type === 'table' && apply === 2" />
        <compare-form key="5" v-show="type === 'form' && apply === 3" :project-info="projectInfo" />
        <compare-detail key="6" v-show="type === 'table' && apply === 3" :project-info="projectInfo" />
        <!-- <sketch-form key="7" v-if="type === 'form' && apply === 4" :project-info="projectInfo" />
        <sketch-detail key="8" v-if="type === 'table' && apply === 4" />
        <contrast-form key="9" v-if="type === 'form' && apply === 5" />
        <contrast-detail key="10" v-if="type === 'table' && apply === 5" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import acceptApplyForm from './modules/acceptApplyForm'
import acceptApplyDetail from './modules/acceptApplyDetail'
import workSummaryForm from './modules/workSummaryForm'
import workSummaryDetail from './modules/workSummaryDetail'
// import sketchForm from './modules/sketchForm'
// import sketchDetail from './modules/sketchDetail'
// import contrastForm from './modules/contrastForm'
// import contrastDetail from './modules/contrastDetail'
import compareForm from './modules/compareForm'
import compareDetail from './modules/compareDetail'
export default {
  layout: 'main',
  components: {
    acceptApplyForm,
    acceptApplyDetail,
    workSummaryForm,
    workSummaryDetail,
    compareForm,
    compareDetail,
    // sketchForm,
    // sketchDetail,
    // contrastForm,
    // contrastDetail
  },
  data() {
    return {
      projectInfo: {},
      type: '',
      apply: ''
    }
  },
  created() {
    this.getProjectInfo()
  },
  methods: {
    getProjectInfo() {
      this.ApiLists.fetchProjectSchedule({ project_id: this.$route.query.project_id }).then((res) => {
        this.projectInfo = res.data.info
      })
    },
    toProjectManage() {
      this.$router.push({
        path: '/project'
      })
    },
    toProjectProgress() {
      this.$router.push({
        path: '/project/progress',
        query: {
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id,
          active: this.$route.query.active
        }
      })
    }
  },
  watch: {
    $route: {
      handler(val) {
        this.type = this.$route.query.type
        this.apply = +this.$route.query.apply
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang="less">
.project_acceptance {
}
</style>
