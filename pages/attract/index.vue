<template>
  <div class="attractPageCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toHome"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>招商简介项目</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="searchMasterCon">
        <div class="tagCon">
          <div class="tagIntroduce">分类：</div>
          <template v-for="(item, index) in categoryArray">
            <div
              :key="index"
              class="singleItem"
              :class="currentActiveIndex == index ? 'singleActive' : ''"
              @click="selectCurrent(item, index)"
            >
              <span>{{ item.category_name }}</span>
              (<span>{{ item.category_sum }}</span
              >)
            </div>
          </template>
        </div>
        <el-input
          class="limitSearch"
          placeholder="请输入你要搜索的内容"
          v-model="keywords"
        >
          <el-button
            class="coverBtn"
            slot="append"
            icon="el-icon-search"
            @click="searchTrigger"
          ></el-button>
        </el-input>
      </div>
      <div class="bottomCon">
        <div class="listCon">
          <template v-for="(item, index) in listArray">
            <div :key="index" class="itemCon" @click="toDetail(item)">
              <div class="titleText">{{ item.title }}</div>
              <div>
                <div class="actionRight">
                  <div>发布时间：</div>
                  <div>
                    {{
                      item.created_at
                        ? Dayjs(item.created_at).format("YYYY-MM-DD")
                        : ""
                    }}
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
  layout: "main",
  head() {
    return {
      title: "招商推介",
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: "江山农业项目投资一件事"
        },
        {
          hid: "description",
          name: "description",
          content: "江山农业项目投资一件事"
        }
      ]
    };
  },
  data() {
    return {
      size: 10,
      total: 0,
      currentPage: 1,
      keywords: "",
      listArray: [],
      categoryArray: [],
      currentActiveIndex: 0
    };
  },
  mounted() {
    this.initAction();
    this.initRequest();
  },
  methods: {
    toHome() {
      this.$router.push({
        path: "/"
      });
    },
    toDetail(item) {
      const { href } = this.$router.resolve({
        path: "/attract/detail",
        query: {
          id: item.id
        }
      });
      window.open(href, "_blank");
    },
    selectCurrent(item, index) {
      this.currentActiveIndex = index;
      this.currentPage = 1
      this.fetchList();
    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchList();
    },
    searchTrigger() {
      this.currentPage = 1;
      this.fetchList();
    },
    initAction() {
      this.$store.commit("changeMenuActive", "1");
    },
    fetchList() {
      let data = {
        category_id: this.categoryArray[this.currentActiveIndex].id,
        pagesize: this.size,
        keywords: this.keywords,
        page: this.currentPage
      };
      this.ApiLists.fetchAttractInvestmentList(data)
        .then(res => {
          if (res.code == 0) {
            this.listArray = res.data.data;
            this.total = res.data.total;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log("er", err);
        });
    },
    initRequest() {
      this.ApiLists.fetchAttractCategoryList()
        .then(res => {
          if (res.code == 0) {
            this.categoryArray = res.data;
            this.fetchList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log("er", err);
        });
    }
  }
};
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
.attractPageCon {
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
    &::before {
      content: " ";
      position: absolute;
      left: -10px;
      top: 5px;
      width: 4px;
      height: 4px;
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
  .limitSearch {
    width: 484px;
  }
  .actionRight {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    line-height: 14px;
    font-size: 14px;
    font-weight: bold;
    color: #999;
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
    }
  }
}
</style>
