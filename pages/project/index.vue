<template>
  <div class="projectPageCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>项目办事</el-breadcrumb-item>
          <el-breadcrumb-item>我的申报</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon">
        <div class="tagCon">
          <div class="tagIntroduce">分类：</div>
          <div class="singleItem" :class="currentActiveIndex == 0 ? 'singleActive' : ''" @click="selectCurrent(0)">
            <span>竞争性财政支农项目</span>
          </div>
          <div class="singleItem" :class="currentActiveIndex == 1 ? 'singleActive' : ''" @click="selectCurrent(1)">
            <span>惠农补贴</span>
          </div>
        </div>
        <div class="searchCon">
          <div class="title">项目名称：</div>
          <el-input class="limitSearch" placeholder="请输入你要搜索的内容" v-model="keywords" clearable></el-input>
          <el-button class="coverBtn" @click="searchTrigger">查询</el-button>
        </div>
        <div class="tableCon" v-if="currentActiveIndex == 0">
          <el-table class="basic-table" :data="basicTable">
            <el-table-column label="序号" align="center" prop="project_id">
              <template slot-scope="scope">
                <div class="markCon">
                  <div class="markSelf" v-if="scope.row.project_reserve_id" @click="toPreserveDetail(scope.row.project_reserve_id)">储备</div>
                  <div>{{ scope.row.project_id }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="项目名称" align="center" prop="project_name"></el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.created_at">{{ scope.row.created_at }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="operateCon">
                  <div class="operateBtn" @click="toDetail(scope)">查看</div>
                  <div class="deleteBtn" v-if="scope.row.status == 0" @click="popConfirm(scope)">删除</div>
                  <div class="rejectBtn" v-if="scope.row.status == 1" @click="popReject(scope)">撤回</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="tableCon" v-if="currentActiveIndex == 1">
          <el-table class="basic-table" :data="basicTable">
            <el-table-column label="序号" align="center" prop="project_id">
              <template slot-scope="scope">
                <div class="markCon">
                  <div class="markSelf" v-if="scope.row.project_reserve_id" @click="toPreserveDetail(scope.row.project_reserve_id)">储备</div>
                  <div>{{ scope.row.project_id }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="项目名称" align="center" prop="title"></el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.created_at">{{ scope.row.created_at }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="operateCon">
                  <div class="operateBtn" @click="toDetail(scope)">查看</div>
                  <div class="deleteBtn" v-if="scope.row.status == 0" @click="popConfirm(scope)">删除</div>
                  <div class="rejectBtn" v-if="scope.row.status == 1" @click="popReject(scope)">撤回</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-footer">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="total"
            class="pagination-info"
          ></el-pagination>
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
      title: '项目办事',
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
      keywords: '',
      basicTable: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      categoryArray: [],
      currentActiveIndex: 0
    }
  },
  mounted() {
    if (this.$route.query.currentActiveIndex) {
      this.currentActiveIndex = this.$route.query.currentActiveIndex - 0
    }
    this.initAction()
    this.initRequest()
  },
  methods: {
    toPreserveDetail(id) {
      this.$router.push({
        path: '/project/projectReserve/edit',
        query: {
          id: id,
          editAble: '2'
        }
      })
    },
    popReject(scope) {
      this.$confirm('此操作将撤回该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            project_id: scope.row.project_id
          }
          this.ApiLists.projectCancel(data)
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '撤回成功!'
                })
                this.initRequest()
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
            .catch((err) => {
              console.log('er', err)
            })
        })
        .catch(() => {})
    },
    popConfirm(scope) {
      this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            project_id: scope.row.project_id,
            type: this.currentActiveIndex + 1
          }
          this.ApiLists.projectRemove(data)
            .then((res) => {
              if (res && res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.initRequest()
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
            .catch((err) => {
              console.log('er', err)
            })
        })
        .catch(() => {})
    },
    toDetail(scope) {
      if (this.currentActiveIndex == 0) {
        // 竞争性
        if (scope.row.status || scope.row.status == 0) {
          if (scope.row.status == 0) {
            this.$router.push({
              path: '/project/material',
              query: {
                project_id: scope.row.project_id,
                policy_document_id: scope.row.policy_document_id
              }
            })
          } else {
            this.$router.push({
              path: '/project/progress',
              query: {
                project_id: scope.row.project_id,
                policy_document_id: scope.row.policy_document_id
              }
            })
          }
        }
      } else {
        // 惠农补贴
        const { form_type, policy_document_id, project_id } = scope.row
        // TODO：后续新增其他四种补贴 在这里判断跳转
        if (form_type == 26) {
          // 粮油补贴
          this.$router.push({
            path: '/project/crops',
            query: {
              project_id,
              policy_document_id
            }
          })
        } else if (form_type == 11) {
          this.$router.push({
            path: '/organic',
            query: {
              project_id,
              policy_document_id
            }
          })
        } else if (form_type == 25) {
          this.$router.push({
            path: '/dead',
            query: {
              project_id,
              policy_document_id
            }
          })
        } else if (form_type == 21) {
          this.$router.push({
            path: '/straw/machine',
            query: {
              project_id,
              policy_document_id
            }
          })
        } else if (form_type == 22) {
          this.$router.push({
            path: '/straw/index',
            query: {
              project_id,
              policy_document_id
            }
          })
        } else if (form_type == 23) {
          this.$router.push({
            path: '/straw/society',
            query: {
              project_id,
              policy_document_id
            }
          })
        } else if (form_type == 24) {
          this.$router.push({
            path: '/sheep',
            query: {
              project_id,
              policy_document_id
            }
          })
        }
      }
    },
    handleCurrentChange(e) {
      this.currentPage = e
      this.initRequest()
    },
    searchTrigger() {
      this.currentPage = 1
      this.initRequest()
    },
    initAction() {
      this.$store.commit('changeMenuActive', '3')
    },
    initRequest() {
      let data = {
        search_keyword: this.keywords,
        page: this.currentPage,
        pagesize: this.pageSize,
        type: this.currentActiveIndex + 1
      }
      this.ApiLists.fetchProjectList(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.basicTable = res.data.data
            this.total = res.data.total
          }
        })
        .catch((err) => {
          console.log('er', err)
        })
    },
    selectCurrent(type) {
      this.currentActiveIndex = type
      this.$nextTick(function () {
        this.initRequest()
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
}
.limitSearch {
  width: 484px;
  margin-right: 20px;
}
.searchCon {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  margin-bottom: 22px;
}
.coverBtn {
  background-color: #0270c3;
  color: #fff;
}
.title {
  font-size: 16px;
  color: #333;
}
.tableCon {
}
.operateBtn {
  color: #0270c3;
  cursor: pointer;
  // margin-right: 20px;
}
.operateCon {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  div {
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
}
.deleteBtn {
  color: #f56c6c;
  cursor: pointer;
  // margin-right: 20px;
}
.rejectBtn {
  color: #0270c3;
  cursor: pointer;
}
.pagination-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  margin-top: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}
.markCon {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
.markSelf {
  color: #ffa100;
  padding: 3px 16px;
  margin-right: 20px;
  background: rgba(255, 161, 0, 0.1);
  border-radius: 4px 4px 4px 4px;
  cursor: pointer;
}

.tagCon {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 26px;
  .singleItem {
    box-sizing: border-box;
    padding-left: 22px;
    padding-right: 22px;
    // height: 36px;
    text-align: center;
    line-height: 36px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
  }
  .singleActive {
    color: #fefefe;
    background-color: #0270c3;
    border-radius: 3px;
  }
  .tagIntroduce {
    width: 70px;
    line-height: 16px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: #333;
  }
}
</style>
