<template>
  <div class="policyPageCon">
    <div class="centerCon">
      <div class="searchMasterCon">
        <div class="tagCon">
          <div class="tagIntroduce">分类：</div>
          <template v-for="(item, index) in categoryArray">
            <div :key="item.id" class="singleItem" :class="currentActiveIndex == item.id ? 'singleActive' : ''" @click="selectCurrent(item, index, 'firstTab')">
              <span>{{ item.category_name }}</span>
            </div>
          </template>
        </div>
        <div v-if="currentActiveIndex == tabIdObj.discountCategoryId" class="second-level-tab">
          <template v-for="(item, index) in secondCategoryArray">
            <div :key="item.id" class="singleItem" :class="secondCurrentActiveIndex == item.id ? 'singleActive' : ''" @click="selectCurrent(item, index, 'secondTab')">
              <span>{{ item.category_name }}({{ item.category_sum }})</span>
            </div>
          </template>
        </div>
        <div class="search-area">
          <el-input class="limitSearch" placeholder="请输入你要搜索的内容" v-model="keywords"></el-input>
          <el-button class="coverBtn" slot="append" icon="el-icon-search" @click="searchTrigger">搜索</el-button>
        </div>
      </div>
      <div class="bottomCon">
        <div class="listCon">
          <template v-for="(item, index) in listArray">
            <div :key="index" class="itemCon" @click="toDetail(item)">
              <div>
                <div class="titleText">{{ item.title }}</div>
                <div class="bottomInfo">
                  <div class="subItemCon">
                    <div class="subItemTitle">政策时效：</div>
                    <div>{{ item.aging }}</div>
                  </div>
                  <div class="subItemCon centerItemMargin">
                    <div class="subItemTitle">牵头部门：</div>
                    <div class="departmentHolder">{{ item.department }}</div>
                  </div>
                  <div class="subItemCon">
                    <div class="subItemTitle">发布时间：</div>
                    <div class="timeHolder">{{ item.issue_at }}</div>
                  </div>
                </div>
              </div>
              <div>
                <div class="actionRight">
                  <!-- {{ item.category_name == '竞争性财政支农项目' ? '申请' : '详情' }} -->
                  申请
                </div>
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
      categoryArray: [],
      secondCategoryArray: [],
      currentActiveIndex: 0,
      secondCurrentActiveIndex: 19,
      tabIdObj: {
        competeCategoryId: 14, //竞争性财政支农项目 tabID
        discountCategoryId: 19, //惠农补贴 tabID
        allCategoryId: 0 //全部 tabID
      }
    }
  },
  mounted() {
    // this.fetchList();
    this.initAction()
    this.initRequest()
  },
  methods: {
    toDetail(item) {
      const { href } = this.$router.resolve({
        path: '/policy/detail',
        query: {
          id: item.id
        }
      })
      window.open(href, '_blank')
    },
    selectCurrent(item, index, type) {
      console.log(item?.id, index, '123')
      if (type == 'firstTab') this.currentActiveIndex = item.id || 0
      if (type == 'secondTab') this.secondCurrentActiveIndex = item.id || 0
      this.currentPage = 1
      this.fetchList()
    },
    handleSizeChange(val) {
      this.size = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchList()
    },
    searchTrigger() {
      this.currentPage = 1
      this.fetchList()
    },
    initAction() {
      this.$store.commit('changeMenuActive', '2')
    },
    fetchList() {
      let data = {
        category_id: this.currentActiveIndex == this.tabIdObj.discountCategoryId ? this.secondCurrentActiveIndex : this.currentActiveIndex,
        pagesize: this.size,
        keywords: this.keywords,
        page: this.currentPage
      }
      this.ApiLists.fetchPolicyDocumentList(data)
        .then((res) => {
          if (res.code == 0) {
            this.listArray = res.data.data
            this.total = res.data.total
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((err) => {
          console.log('er', err)
        })
    },
    initRequest() {
      this.ApiLists.getPolicyCategoryTabList() //获取tab列表
        .then((res) => {
          if (res.code == 0) {
            let after = res.data.filter((ele) => {
              return ele.id == this.tabIdObj.allCategoryId || ele.id == this.tabIdObj.competeCategoryId || ele.id == this.tabIdObj.discountCategoryId
            })
            this.secondCategoryArray = res.data.filter((ele) => {
              return ele.id == this.tabIdObj.discountCategoryId
            })[0].children //拿到惠农补贴tab
            this.categoryArray = after
            if (this.$route.query && this.$route.query.tabIndex) {
              this.currentActiveIndex = this.tabIdObj.competeCategoryId
            }
            this.fetchList()
          } else {
            this.$message.error(res.msg)
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
.tagCon {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: 1px solid #707070;
  padding-bottom: 13px;
  margin-bottom: 13px;
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
.second-level-tab {
  display: flex;
  overflow: auto;
  margin-bottom: 24px;
  font-family: PingFang SC;
  .singleItem {
    margin-right: 24px;
    color: #999999;
    height: 30px;
    cursor: pointer;
  }
  .singleActive {
    color: #0270c3;
    height: 30px;
    border-bottom: 5px solid #0270c3;
  }
}
.policyPageCon {
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

  .actionRight {
    width: 86px;
    height: 32px;
    border: 1px solid #0270c3;
    border-radius: 4px;
    line-height: 32px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: #0270c3;
    cursor: pointer;
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
