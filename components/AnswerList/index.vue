<template>
  <div class="answer-list">
    <div class="answer" v-show="answerListState === 1">
      <div class="total">{{list.length}} 条回答</div>
      <div class="input-area">
        <el-input 
          v-model="mainAnswer" 
          clearable 
          placeholder="写下你的回答，不得超过200字" 
          size="small"
        />
        <el-button 
          class="sendBtn" 
          @click="send" 
          size="small"
        > 发 送 </el-button>
      </div>
      <div class="answer-list">
        <div class="answer-item" v-for="item in list" :key="item.id">
          <p>{{ item.answer }}</p>
          <p>{{ item.created_at }}</p>
        </div>
        <div class="end" v-show="list.length">
          已经到底啦
        </div>
        <div class="empty" v-show="!list.length">
          暂无回答，快来抢沙发~
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: 0
    },
    answerListState: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [],
      mainAnswer: ''
    }
  },
  mounted() {
    
  },
  methods: {
    async getDetail() {
      const result = await this.ApiLists.questionInfo({
        id: this.id
      })
      if(result.code === 0) {
        this.list = result.data.info.answer_list
      }
    },
    async send() {
      const result = await this.ApiLists.submitAnswer({
        question_id: this.id,
        answer: this.mainAnswer
      })
      if(result.code === 0) {
        this.$message.success('发送成功')
        // this.questionList[index].answer_list.unshift({
        //   answer: item.mainAnswer,
        //   created_at: new Date().toLocaleString().replace(/\//g, '-')
        // })
        this.mainAnswer = '';
        this.getDetail();
      } else {
        this.$message.error(result.msg)
      }
    },
  }
}
</script>

<style lang="less" scope>
  .item {
    overflow: hidden;
    border-bottom: 1px solid #F2F2F2;
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
          border-bottom: 1px solid #F2F2F2;
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
</style>