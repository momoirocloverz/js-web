<template>
  <div class="QA-section">
    <div class="breadcrumbCon">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="routerGo('/')">首页</el-breadcrumb-item>
        <el-breadcrumb-item @click.native="routerGo('/understand?type=1')">明白纸</el-breadcrumb-item>
        <el-breadcrumb-item>问答专区</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="center">
      <div class="comsult" @click="routerGo('/QASection/consult')">
        <img src="../../assets/img/message.png" alt="" />
        <span>在线咨询</span>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in questionList" :key="item.id">
          <div class="title">{{ item.title }}</div>
          <div class="content">{{ item.desc }}</div>
          <div class="handle">
            <div @click="setLike(item, index)">
              <img v-show="!item.is_like" src="../../assets/img/like.png" alt="" />
              <img v-show="item.is_like" src="../../assets/img/is-like.png" alt="" />
              <span>赞 {{ item.like_count }}</span>
            </div>
            <div>
              <img src="../../assets/img/comment.png" alt="" />
              <span v-show="!item.answerListState" @click="checkAnswerList(item, index)">回答 {{ item.answer_count }}</span>
              <span v-show="item.answerListState" @click="item.answerListState = 0">收起回答</span>
            </div>
            <div>
              <span>发布时间：{{ item.created_at }}</span>
            </div>
          </div>
          <!-- 评论列表 -->
          <AnswerList ref="answerList" :id="item.id" :answerListState="item.answerListState" />
        </div>
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
</template>

<script>
import AnswerList from '@/components/AnswerList'
export default {
  layout: 'main',
  head() {
    return {
      title: '问答专区'
    }
  },
  components: {
    AnswerList
  },
  data() {
    return {
      isLoading: true,
      size: 10,
      total: 0,
      currentPage: 1,
      questionList: [],
      // mainAnswer: '',
      curQuestionId: ''
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    routerGo(path) {
      this.$router.push({
        path: path
      })
    },
    async fetchList() {
      const result = await this.ApiLists.questionList({
        page: this.currentPage,
        pagesize: this.size,
        keyword: ''
      })
      if (result.code === 0) {
        result.data.data.map((item) => {
          item.answerListState = 0
        })
        this.questionList = result.data.data
        this.total = result.data.total
      }
    },
    handleSizeChange(val) {
      this.size = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchList()
    },
    async setLike(item, index) {
      const result = await this.ApiLists.execLike({
        id: item.id
      })
      if (result.code === 0) {
        this.fetchList()
      }
    },
    checkAnswerList(item, index) {
      item.answerListState = 1
      this.$refs.answerList[index].getDetail()
    }
  }
}
</script>

<style scoped lang="less">
.QA-section {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 370px);
}
.breadcrumbCon {
  margin: 30px 0 20px;
}
.center {
  width: 100%;
  padding-top: 30px;
  box-sizing: border-box;
  background: #fff;
  overflow: hidden;
}
.pagHere {
  text-align: center;
  margin: 10px 0;
}
.comsult {
  width: 160px;
  height: 46px;
  display: flex;
  align-items: center;
  color: #fff;
  background: #1b82ec;
  font-size: 16px;
  justify-content: center;
  margin: 0 0 20px 90px;
  border-radius: 10px;
  img {
    width: 36px;
    margin-right: 10px;
  }
}
.list {
  overflow: hidden;
  padding: 0 80px;
  .item {
    overflow: hidden;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 20px;
    .title {
      font-size: 18px;
      color: #333;
      line-height: 22px;
      font-weight: bold;
      margin: 20px 10px 0;
    }
    .content {
      font-size: 15px;
      color: #121212;
      line-height: 20px;
      margin: 12px 10px 0;
    }
    .handle {
      display: flex;
      align-items: center;
      margin: 12px 10px 0;
      div {
        display: flex;
        align-items: center;
        margin-right: 24px;
        cursor: pointer;
        &:nth-last-of-type(1) {
          cursor: auto;
        }
        img {
          width: 16px;
        }
        span {
          font-size: 14px;
          color: #999;
          margin-left: 8px;
        }
      }
    }
    .answer {
      box-shadow: 0 2px 6px rgba(18 18 18 / 10%);
      border: 1px solid #ebebeb;
      box-sizing: border-box;
      margin: 10px 10px 0;
      padding: 0 20px;
      .total {
        font-size: 15px;
        color: #333;
        padding: 10px 0;
      }
      .input-area {
        display: flex;
        align-items: center;
        .sendBtn {
          background-color: #0270c3;
          color: #fff;
          margin-left: 30px;
        }
      }
      .answer-list {
        overflow: hidden;
        .answer-item {
          border-bottom: 1px solid #f2f2f2;
          padding: 0 0 10px 10px;
          p {
            &:nth-of-type(1) {
              font-size: 14px;
              color: #333;
              margin-top: 10px;
              line-height: 18px;
            }
            &:nth-of-type(2) {
              font-size: 12px;
              color: #999;
              margin-top: 5px;
            }
          }
        }
        .end {
          font-size: 14px;
          color: #999;
          text-align: center;
          margin: 10px 0;
        }
        .empty {
          font-size: 14px;
          color: #999;
          text-align: center;
          margin: 30px 0;
        }
      }
    }
  }
}
</style>
