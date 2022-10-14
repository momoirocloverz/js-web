<template>
  <div class="draftsPageCon">
    <div class="centerCon">
      <div class="searchMasterCon">
        <div class="tagCon">
          <div class="tagIntroduce">分类：</div>
          <template v-for="(item, index) in categoryArray">
            <div :key="index" class="singleItem" :class="currentActiveIndex == item.id ? 'singleActive' : ''" @click="selectCurrent(item, index)">
              <span>{{ item.category_name }}</span>
            </div>
          </template>
        </div>
        <div class="search-area">
          <el-input class="limitSearch" placeholder="请输入你要搜索的内容" v-model.trim="keywords"></el-input>
          <el-button class="coverBtn" slot="append" icon="el-icon-search" @click="searchTrigger">搜索</el-button>
        </div>
      </div>
      <div class="bottomCon">
        <div class="listCon">
          <template v-for="(item, index) in listArray">
            <div :key="index" class="itemCon">
              <div>
                <div class="titleText">{{ (item.project_name || item.title || '未命名项目') + '（草稿）' }}</div>
                <div class="bottomInfo">
                  <div class="subItemCon">
                    <div class="subItemTitle">创建时间：</div>
                    <div>{{ item.created_at }}</div>
                  </div>
                  <!-- <div class="subItemCon centerItemMargin">
                    <div class="subItemTitle">牵头部门：</div>
                    <div class="departmentHolder">{{ item.department }}</div>
                  </div>
                  <div class="subItemCon">
                    <div class="subItemTitle">发布时间：</div>
                    <div class="timeHolder">{{ item.issue_at }}</div>
                  </div> -->
                </div>
              </div>
              <div class="handle">
                <div class="actionRight" @click="toEdit(item)">继续申报</div>
                <div class="delete" @click="toDelete(item)">删除草稿</div>
              </div>
            </div>
          </template>
          <el-empty :image-size="100" v-if="!listArray.length"></el-empty>
        </div>
        <el-pagination
          class="pagHere"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'main',
  head() {
    return {
      title: '惠农政策申报',
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
      size: 10,
      total: 0,
      currentPage: 1,
      keywords: '',
      listArray: [],
      categoryArray: [
        { id: 1, category_name: '竞争性财政支农项目' },
        { id: 2, category_name: '惠农补贴' },
        { id: 3, category_name: '项目储备' }
      ],
      currentActiveIndex: 1
    }
  },
  mounted() {
    this.getList()
    this.initAction()
  },
  methods: {
    async getList() {
      let data = {
        page: this.currentPage,
        pagesize: this.size,
        search_is_draft: 1,
        search_keyword: this.currentActiveIndex === 3 ? undefined : this.keywords,
        search_project_name: this.currentActiveIndex === 3 ? this.keywords : undefined,
        search_status: this.currentActiveIndex === 3 ? 0 : undefined,
        type: this.currentActiveIndex === 3 ? undefined : this.currentActiveIndex
      }
      ;(this.currentActiveIndex === 3 ? this.ApiLists.fetchProjectReserveList(data) : this.ApiLists.fetchProjectList(data))
        .then((res) => {
          if (this.currentActiveIndex == 2) {
            // 惠农补贴 暂时只有粮油补贴 需要过滤一下数据
            let list = res.data.data
            this.listArray = list
            this.total = list.length
          } else {
            this.listArray = res.data.data
            this.total = res.data.total
          }
        })
        .catch((err) => {
          console.log('er', err)
        })
    },
    toEdit(item) {
      if (this.currentActiveIndex === 3) {
        this.$router.push({
          path: '/project/projectReserve/edit',
          query: {
            id: item.id,
            editAble: '1'
          }
        })
      } else if (this.currentActiveIndex === 2) {
        // TODO：后续新增其他四种补贴 在这里判断跳转
        const { form_type, policy_document_id, project_id } = item
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
      } else {
        // this.$router.push({
        //   path: '/policy/detail',
        //   query: {
        //     id: item.id
        //   }
        // })
        this.$router.push({
          path: '/project/material',
          query: {
            policy_document_id: item.policy_document_id,
            project_id: item.project_id
          }
        })
      }
      // const { href } = this.$router.resolve({
      //   path: "/policy/detail",
      //   query: {
      //     id: item.id
      //   }
      // });
      // window.open(href, "_blank");
    },
    toDelete(item) {
      let _this = this
      this.$confirm('确定删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (_this.currentActiveIndex === 3) {
          this.deleteProjectReserve(item.id)
        } else if (this.currentActiveIndex === 2) {
          // 惠农补贴
          this.deleteProject(item.project_id, 2)
        } else {
          this.deleteProject(item.project_id, 1)
        }
      })
    },
    // 竞争性项目草稿删除
    deleteProject(id, type) {
      let params = {
        type,
        project_id: id
      }
      this.ApiLists.projectRemove(params)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((e) => {})
    },
    // 项目储备草稿删除
    deleteProjectReserve(id) {
      this.ApiLists.projectResetveRemove({
        id: id
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
    selectCurrent(item, index) {
      this.currentActiveIndex = item.id
      this.currentPage = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    searchTrigger() {
      this.currentPage = 1
      this.getList()
    },
    initAction() {
      this.$store.commit('changeMenuActive', '5')
    }
  }
}
</script>
<style lang="less" scoped>
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
    height: 36px;
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
.draftsPageCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
  .titleText {
    line-height: 16px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-left: 10px;
    position: relative;
    margin-bottom: 17px;
    &::before {
      content: ' ';
      position: absolute;
      left: -10px;
      top: 5px;
      width: 4px;
      height: 4px;
      background: #666;
    }
  }
  .departmentHolder {
  }
  .timeHolder {
  }
  .pagHere {
    text-align: center;
  }
  .centerItemMargin {
    margin-left: 50px;
    margin-right: 50px;
  }
  .bottomInfo {
    font-size: 14px;
    font-weight: bold;
    color: #999;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    .subItemCon {
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
    }
    .subItemTitle {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      align-items: center;
    }
  }
  .search-area {
    display: flex;
    align-items: center;
    .limitSearch {
      width: 424px;
      margin-right: 20px;
    }
  }
  .handle {
    display: flex;
    align-items: center;
    div {
      height: 30px;
      border-radius: 4px;
      line-height: 30px;
      font-size: 14px;
      text-align: center;
      padding: 0 13px;
      cursor: pointer;
    }
    .actionRight {
      border: 1px solid #0270c3;
      color: #0270c3;
    }
    .delete {
      border: 1px solid #ff3737;
      color: #ff3737;
      margin-left: 12px;
    }
  }

  .bottomCon {
    background-color: #fff;
    box-sizing: border-box;
    padding: 10px 30px 50px 30px;
    .listCon {
      margin-bottom: 40px;
      .itemCon {
        height: 83px;
        display: flex;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        border-bottom: 1px solid #f2f2f2;
      }
    }
  }
  .coverBtn {
    background-color: #0270c3;
    color: #fff;
  }
  .centerCon {
    width: 1200px;
    margin: 0 auto;
    padding-top: 30px;
    box-sizing: border-box;
    .searchMasterCon {
      padding: 20px 30px 30px;
      box-sizing: border-box;
      background-color: #fff;
      margin-bottom: 20px;
    }
  }
}
</style>
