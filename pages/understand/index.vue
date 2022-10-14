<template>
  <div class="understandPageCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toHome">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ type === 1 ? '明白纸' : '公示公告栏' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="searchMasterCon">
        <div class="tagCon">
          <div class="tagIntroduce">分类：</div>
          <template v-for="(item, index) in categoryArray">
            <div :key="index" class="singleItem" :class="currentActiveIndex == index ? 'singleActive' : ''" @click="selectCurrent(item, index)">
              <span>{{ item.category_name }}</span>
              (<span>{{ item.category_sum }}</span
              >)
            </div>
          </template>
        </div>
        <div class="search-area">
          <el-input class="limitSearch" placeholder="请输入你要搜索的内容" icon="el-icon-search" v-model="keywords" @focus="onFocus" @blur="onBlur" />
          <el-button class="coverBtn" slot="append" icon="el-icon-search" @click="searchTrigger">搜索</el-button>

          <div class="keywords-list" v-show="showKeywordsList">
            <template v-if="keywordsList.length" v-for="keyword in keywordsList">
              <div class="item" @click="selectKeyword(keyword.name)" :key="keyword.id">{{ keyword.name }}</div>
            </template>
          </div>
        </div>
        <div class="QA-section" @click="toQA">
          <div>
            <p>问答专区</p>
            <p>点击查看 》</p>
          </div>
          <img src="../../assets/img/message2.png" alt="" />
        </div>
      </div>
      <div class="bottomCon">
        <div class="listCon">
          <template v-for="(item, index) in listArray">
            <div :key="index" class="itemCon" @click="toDetail(item)">
              <div class="titleText">{{ item.title }}</div>
              <div>
                <div class="actionRight">
                  <div class="rate" v-if="type == 1">
                    <span>匹配程度：</span>
                    <el-rate v-model="item.starValue" disabled :colors="['#1B82EC']" score-template="{value}"> </el-rate>
                  </div>
                  <div class="pv">
                    <img src="https://img.hzanchu.com/acimg/dfcd28fc76aeb6c746247e3050b621e0.png" alt="" />
                    <span>{{ item.pv ? item.pv : 0 }}</span>
                  </div>
                  <div class="releaseTimeCon">
                    <div>发布时间：</div>
                    <div class="timeCon">
                      {{ item.created_at ? Dayjs(item.created_at).format('YYYY-MM-DD') : '' }}
                    </div>
                  </div>
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
      title: '列表',
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
      currentActiveIndex: 0,
      type: 1,
      keywordsList: [],
      showKeywordsList: false
    }
  },
  mounted() {
    this.type = +this.$route.query.type
    this.initAction()
    this.initRequest()
  },
  methods: {
    toHome() {
      this.$router.push({
        path: '/'
      })
    },
    toQA() {
      this.$router.push({
        path: '/QASection'
      })
    },
    toDetail(item) {
      const { href } = this.$router.resolve({
        path: '/understand/detail',
        query: {
          id: item.id,
          type: this.type
        }
      })
      window.open(href, '_blank')
    },
    selectCurrent(item, index) {
      this.currentActiveIndex = index
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
      this.$store.commit('changeMenuActive', '1')
    },
    async fetchList() {
      let data = {
        category_id: this.categoryArray[this.currentActiveIndex].id,
        pagesize: this.size,
        keywords: this.keywords,
        title: this.keywords,
        page: this.currentPage
      }
      const result = this.type === 1 ? await this.ApiLists.fetchUnderstandPaperList(data) : await this.ApiLists.fetchNoticeList(data)
      if (result && result.code === 0) {
        result.data.data.forEach((v) => {
          v.starValue = v.star ? v.star / 20 : 0
        })
        this.listArray = result.data.data
        this.total = result.data.total
      } else {
        this.$message.error(result.msg)
      }
      // this.ApiLists.fetchUnderstandPaperList(data)
      //   .then(res => {
      //     if (res.code == 0) {
      //       this.listArray = res.data.data;
      //       this.total = res.data.total;
      //     } else {
      //       this.$message.error(res.msg);
      //     }
      //   })
      //   .catch(err => {
      //     console.log("er", err);
      //   });
    },
    async initRequest() {
      const result = this.type === 1 ? await this.ApiLists.fetchUnderstandCategoryList() : await this.ApiLists.fetchNoticeCategory()
      if (result && result.code === 0) {
        this.categoryArray = result.data
        this.fetchList()
      } else {
        this.$message.error(result.msg)
      }
      // this.ApiLists.fetchUnderstandCategoryList()
      //   .then(res => {
      //     if (res.code == 0) {
      //       this.categoryArray = res.data;
      //       this.fetchList();
      //     } else {
      //       this.$message.error(res.msg);
      //     }
      //   })
      //   .catch(err => {
      //     console.log("er", err);
      //   });
    },
    async onFocus() {
      if (this.type == 1) {
        // 获取明白纸关键词
        const result = await this.ApiLists.getSearchKeywords({ which_search: 1 })
        if (result.code === 0) {
          this.keywordsList = result.data.list.splice(0, 10) || []
          this.showKeywordsList = true
        } else {
          this.$message.error(result.msg)
        }
      }
    },
    onBlur() {
      setTimeout(() => {
        this.showKeywordsList = false
      }, 300)
    },
    selectKeyword(name) {
      this.keywords = name
      this.showKeywordsList = false
      this.$nextTick(() => {
        this.searchTrigger()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.withCursor {
  cursor: pointer;
}
.breadcrumbCon {
  margin-bottom: 20px;
}
.tagCon {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 26px;
  max-width: 800px;
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
.understandPageCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
  .titleText {
    // line-height: 16px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    padding-left: 10px;
    position: relative;
    max-width: 550px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &::before {
      content: ' ';
      position: absolute;
      left: 0;
      top: 50%;
      width: 4px;
      border-radius: 5px;
      height: 4px;
      margin-top: -2px;
      background: #666;
    }
  }
  .pagHere {
    text-align: center;
  }
  .centerItemMargin {
    margin-left: 50px;
    margin-right: 50px;
  }
  .search-area {
    display: flex;
    align-items: center;
    position: relative;

    .keywords-list {
      box-sizing: border-box;
      position: absolute;
      left: 0;
      top: 50px;
      width: 482px;
      min-height: 98px;
      padding: 8px 16px 16px;
      background: #ffffff;
      box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.16);
      border-radius: 8px;
      z-index: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .item {
        margin-right: 8px;
        margin-top: 8px;
        padding: 0 16px;
        height: 30px;
        line-height: 30px;
        background: #f5f7fa;
        border-radius: 19px;
        text-align: center;
        color: #666666;
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
  .limitSearch {
    width: 484px;
    margin-right: 20px;
  }
  .actionRight {
    display: flex;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
    line-height: 14px;
    font-size: 14px;
    font-weight: bold;
    color: #999;
  }

  .pv {
    min-width: 90px;
    text-align: left;
    display: flex;
    align-items: center;
    margin-right: 20px;
    img {
      width: 16px;
      height: 16px;
      margin-right: 12px;
    }
    span {
      color: #666666;
    }
  }
  .releaseTimeCon {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
  }
  .timeCon {
    width: 0.6rem;
  }
  .rate {
    display: flex;
    align-items: center;
    margin-right: 30px;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    color: #666666;
  }

  .bottomCon {
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px 30px 50px 30px;
    .listCon {
      margin-bottom: 40px;
      .itemCon {
        cursor: pointer;
        height: 40px;
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
      position: relative;
      .QA-section {
        position: absolute;
        top: 36px;
        right: 0;
        width: 236px;
        height: 70px;
        background: linear-gradient(180deg, #78b9fa 0%, #0c75e3 100%);
        box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        div {
          p {
            color: #fff;
            &:nth-of-type(1) {
              font-size: 24px;
              font-family: PingFang SC;
              font-weight: bold;
              line-height: 33px;
            }
            &:nth-of-type(2) {
              font-size: 14px;
              font-family: PingFang SC;
              text-align: center;
            }
          }
        }
        img {
          width: 52px;
          margin-left: 48px;
        }
      }
    }
  }
}
</style>
