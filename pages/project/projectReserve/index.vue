<template>
  <div class="projectPreservePageCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>项目储备</el-breadcrumb-item>
          <el-breadcrumb-item>我的申报</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon">
        <div class="searchMaster">
          <div class="searchCon">
            <div class="title">项目名称：</div>
            <el-input class="limitSearch" placeholder="请输入你要搜索的内容" v-model="keywords" clearable></el-input>
            <el-button class="coverBtn" @click="searchTrigger">查询</el-button>
          </div>
          <div class="checkCon">
            <div class="fakeBtn marginRight" @click="toCheck">查看</div>
            <div class="fakeBtn marginRight" @click="requestAction">申请</div>
          </div>
        </div>
        <div class="tableCon">
          <el-table class="basic-table" :data="basicTable">
            <el-table-column label="项目名称" align="center" prop="project_name"></el-table-column>
            <el-table-column label="项目类型" align="center" prop="project_type">
              <template slot-scope="scope">
                <div v-if="scope.row.project_type">
                  {{ typeMap[scope.row.project_type] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="申报时间" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.declare_at">
                  {{ Dayjs(scope.row.declare_at).format('YYYY-MM-DD') }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="建设期限" align="center" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.build_start_at">{{ Dayjs(scope.row.build_start_at).format('YYYY-MM-DD') }}至{{ Dayjs(scope.row.build_end_at).format('YYYY-MM-DD') }}</div>
              </template>
            </el-table-column>
            <el-table-column label="投资额（万元）" align="center" width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.all_invest_money">
                  {{ scope.row.all_invest_money }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                {{ scope.row.status == 1 ? '待审核' : scope.row.status == 2 ? '已通过' : '已驳回' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="operateCon">
                  <div class="operateBtn" @click="toDetail(scope)">查看</div>
                  <div class="operateBtn" v-if="!scope.row.status || scope.row.status == 9" @click="toEdit(scope)">编辑</div>
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
    <el-dialog title="请选择地址" :visible.sync="addressVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="30%">
      <el-cascader
        :style="{ width: '200px', marginBottom: '200px' }"
        v-model="areaId"
        :options="areaList"
        :props="{
          label: 'name',
          value: 'id'
        }"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onAddressChange(areaId)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看申请详情" :visible.sync="describeVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="40%">
      <div>
        <div class="marginBottom">
          <div>申报范围</div>
          <div>包含种植业、养殖业、加工业、乡村建设等多种相关产业。</div>
        </div>
        <div>
          <div>申报对象</div>
          <div>原则上申报对象为农业相关建设主体。</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shutDown()">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  layout: 'main',
  head() {
    return {
      title: '项目储备',
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
      typeMap: {
        1: '种植业',
        2: '养殖业',
        3: '加工业',
        4: '乡村建设',
        9: '其他'
      },
      describeVisible: false,
      keywords: '',
      basicTable: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      areaList: [],
      areaId: [],
      addressVisible: false
    }
  },
  mounted() {
    this.initAction()
    this.initRequest()
  },
  methods: {
    onAddressChange(e) {
      if (!e || e.length === 0) {
        this.$message.error('请选择地址')
        return
      }
      let track1 = this.areaList[0].children.find((ele) => {
        return ele.id == e[1]
      })
      if (track1) {
        let track2 = track1.children.find((ele) => {
          return ele.id == e[2]
        })
        const params = {
          city_id: e[0],
          town_id: e[1],
          village_id: e[2],
          city: this.areaList[0].name,
          town: track1.name,
          village: track2.name,
          editAble: '1'
        }
        this.addressVisible = false
        this.$router.push({
          path: '/project/projectReserve/edit',
          query: params
        })
      }
      console.log('track1', track1)

      // this.ApiLists.setPorjectArea(params).then(res => {
      //     if (res && res.code === 0) {
      //         this.addressVisible = false
      //     } else {
      //         this.$message.error(res.msg)
      //     }
      // })
    },
    toCheck() {
      this.describeVisible = true
    },
    shutDown() {
      this.describeVisible = false
    },
    requestAction() {
      //   this.addressVisible = true;

      this.$router.push({
        path: '/project/projectReserve/edit'
        // query: {
        //   id: scope.row.id,
        //   editAble: "1"
        // }
      })
    },
    popConfirm(scope) {
      this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            project_id: scope.row.project_id
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
    toEdit(scope) {
      this.$router.push({
        path: '/project/projectReserve/edit',
        query: {
          id: scope.row.id,
          editAble: '1'
        }
      })
    },
    toDetail(scope) {
      this.$router.push({
        path: '/project/projectReserve/edit',
        query: {
          id: scope.row.id,
          editAble: '2'
        }
      })
    },
    toDraftList() {
      this.$router.push({
        path: '/project/projectReserve/draft'
      })
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
      this.$store.commit('changeMenuActive', '1')
    },
    initRequest() {
      let data = {
        search_project_name: this.keywords,
        page: this.currentPage,
        pagesize: this.pageSize
      }
      this.ApiLists.fetchProjectReserveList(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.basicTable = res.data.data
            this.total = res.data.total
          }
        })
        .catch((err) => {
          console.log('er', err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.checkCon {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
}
.marginRight {
  margin-right: 20px;
}
.marginBottom {
  margin-bottom: 20px;
}
.fakeBtn {
  width: 70px;
  height: 36px;
  border: 1px solid #0270c3;
  border-radius: 4px;
  line-height: 36px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #0270c3;
  cursor: pointer;
}
.projectPreservePageCon {
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
.searchMaster {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  margin-bottom: 22px;
}
.searchCon {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
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

  &:last-child {
    margin-left: 20px;
  }

  &:first-child {
    margin: 0;
  }
}
.operateCon {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.deleteBtn {
  color: #f56c6c;
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
</style>
