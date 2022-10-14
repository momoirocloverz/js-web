<template>
  <div class="change_form_list box_wrap">
    <div class="center_box">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item @click.native="toProjectManage">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item @click.native="toProjectProgress">项目进度</el-breadcrumb-item>
          <el-breadcrumb-item>变更申请</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <div class="title">
          <el-button class="cover_btn" @click="$router.back()">返回</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="file_name" label="文件名"></el-table-column>
          <el-table-column prop="is_check" label="状态">
            <template slot-scope="scope">
              {{ status[scope.row.is_check] }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toDetail(scope.row)">查看</el-button>
              <el-button v-if="scope.row.is_check == 3" type="text" size="small" @click="addForm(scope.row)">{{ scope.row.is_check === 1 ? '编辑' : '重新编辑' }}</el-button>
              <!--              <el-button type="text" class="text_danger" size="small">撤回</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="button_box">
          <el-button type="primary" size="small" @click="addForm" v-if="tableData.length === 0">添加项目变更申请</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'changeFormList',
  layout: 'main',
  data() {
    return {
      tableData: [],
      status: {
        1: '待审核',
        2: '已通过',
        3: '已拒绝'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.ApiLists.projectChangeList({ project_id: this.$route.query.project_id }).then((res) => {
        this.tableData = res.data?.data
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
    },
    toDetail(item) {
      this.$router.push({
        path: '/project/projectChange/changeFormDetail',
        query: {
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id,
          active: this.$route.query.active,
          change_id: item.id
        }
      })
    },
    addForm(item) {
      this.$router.push({
        path: '/project/projectChange/changeForm',
        query: {
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id,
          active: this.$route.query.active,
          change_id: item.id
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.change_form_list {
  .content_box {
    padding: 30px;
    .title {
      display: flex;
      justify-content: flex-end;
    }
    .button_box {
      display: flex;
      justify-content: center;
      margin: 60px;
    }
  }
}
</style>
