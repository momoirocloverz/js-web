<template>
  <div class="noticeDetailPageCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toHome"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item class="withCursor" @click.native="toUnderstand"
            >公示栏</el-breadcrumb-item
          >
          <el-breadcrumb-item>公示栏详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon" ref="htmlTarget">
        <div class="title">{{ info.title }}</div>
        <div class="timeCon">
          <span>发布时间：</span>
          <span>{{ info.created_at }}</span>
        </div>
        <div class="hrLine"></div>
        <div class="htmlContent" v-html="info.content"></div>
      </div>
      <div class="bottomOperateCon">
        <div @click="downloadTrigger" class="downloadCon">
          <img
            src="https://img.hzanchu.com/acimg/bd16424fcaa2f9832e6c7352901875b4.png"
          />
          <span>下载</span>
        </div>
        <div @click="printTrigger" class="printCon">
          <img
            src="https://img.hzanchu.com/acimg/39132d772e35526603982c1690de7397.png"
          />
          <span>打印</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "main",
  head() {
    return {
      title: "公示栏详情",
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
      info: {}
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
    toUnderstand() {
      this.$router.push({
        path: "/notice"
      });
    },
    downloadTrigger() {
      let data = {
        id: this.$route.query.id
      };
      this.ApiLists.downloadUnderstandPaper(data)
        .then(res => {
          if (res) {
            const content = res;
            const blob = new Blob([content]);
            const fileName = "明白纸详情" + Date.now() + ".pdf";
            if ("download" in document.createElement("a")) {
              // 非IE下载
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log("er", err);
        });
    },
    printTrigger() {
      this.$Print(this.$refs.htmlTarget);
    },
    initAction() {
      this.$store.commit("changeMenuActive", "1");
    },
    initRequest() {
      let data = {
        id: this.$route.query.id
      };
      this.ApiLists.fetchUnderstandPaperInfo(data)
        .then(res => {
          if (res && res.code == 0) {
            this.info = res.data;
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
@page {
  margin: 0;
  margin-top: 50px;
  margin-bottom: 50px;
}
.bottomOperateCon {
  width: 100%;
  height: 36px;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  .printCon {
    font-size: 16px;
    font-weight: bold;
    color: #666;
    margin-right: 20px;
    cursor: pointer;
    img {
      vertical-align: middle;
      height: 16px;
      width: 16px;
    }
  }
  .downloadCon {
    font-size: 16px;
    font-weight: bold;
    color: #666;
    margin-right: 20px;
    cursor: pointer;
    img {
      vertical-align: middle;
      height: 16px;
      width: 16px;
    }
  }
}
.noticeDetailPageCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 100px;
  min-height: calc(100vh - 370px);
}
.htmlContent {
  font-size: 14px;
  color: #4d4d4d;
  letter-spacing: 1px;
}
.centerCon {
  width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  box-sizing: border-box;
  .contentCon {
    margin-top: 20px;
    padding: 20px 60px 60px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 20px;
    .title {
      line-height: 22px;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      color: #333;
      margin-bottom: 20px;
    }
    .timeCon {
      text-align: center;
      line-height: 16px;
      font-size: 16px;
      font-weight: bold;
      color: #666;
      margin-bottom: 20px;
    }
    .hrLine {
      width: 100%;
      height: 2px;
      background-color: #ededed;
      margin-bottom: 40px;
    }
  }
}
</style>
<style lang="less">
// 富文本h5表格样式重置
.noticeDetailPageCon {
  table {
    border: 1px solid #333;
    border-collapse: collapse;
    table-layout: fixed;
    word-break: break-all;
    word-wrap: break-word;
    margin: 0;
    padding: 0;
    max-width: 100%;
    td,
    th {
      border: 1px solid #333;
      border-collapse: collapse;
      font-size: 22px;
    }
    td {
      width: 100px !important;
      font-size: 22px;

      span {
        display: inline-block;
        font-family: 'PingFang SC Medium, PingFang SC Medium-Medium' !important;
        white-space: pre-line;
        word-wrap: break-word;
        word-break: break-all;
        font-size: 22px;
      }

      .MsoNormal {
        text-indent: 0 !important;
      }
    }
  }

  .contentCon {
    p {
      img[src*='http'] {
        max-width: 100%;
        height: auto;
      }
    }
  }
}
</style>
