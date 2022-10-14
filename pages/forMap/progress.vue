<template>
  <div class="formapMoticeCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toHome">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="withCursor" @click.native="toUnderstand">投资一件事</el-breadcrumb-item>
          <el-breadcrumb-item>办事流程</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon" ref="htmlTarget">
        <div class="title">{{ info.bslc_title }}</div>
        <div class="timeCon">
          <div>
            <span>发布时间：</span>
            <span>{{ info.created_at }}</span>
          </div>
          <!-- <div @click="broadcast">
            <img src="../../assets/img/voice.png" alt="" />
            <span>语音播报</span>
          </div> -->
        </div>
        <el-button class="checkSource" @click="checkPolicy" v-if="info.policy_document_id" plain>查看相关政策文件</el-button>
        <div class="hrLine"></div>
        <div class="htmlContent" v-html="info.bslc_content"></div>
        <div class="pdfContent" v-if="info.attachment && info.attachment.length">
          查看附件：
          <template v-for="(item, index) in info.attachment">
            <div class="itemCon" :key="index">
              <span @click="checkPdf(item)">{{ index + 1 + '：' + item.name }}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="bottomOperateCon">
        <div @click="downloadTrigger" class="downloadCon">
          <img src="https://img.hzanchu.com/acimg/bd16424fcaa2f9832e6c7352901875b4.png" />
          <span>下载</span>
        </div>
        <div @click="printTrigger" class="printCon">
          <img src="https://img.hzanchu.com/acimg/39132d772e35526603982c1690de7397.png" />
          <span>打印</span>
        </div>
      </div>
    </div>
    <audio v-if="renderAudio" controls ref="AUDIO" @canplay="audioReady" :src="audioSrc"></audio>
  </div>
</template>
<script>
export default {
  layout: 'main',
  head() {
    return {
      title: '详情',
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
      info: {},
      type: 1,
      readerText: '',
      globalSpeech: null,
      playing: false,
      audioSrc: '',
      renderAudio: false,
      splitLength: 0,
      recordArray: [],
      dynamicArray: [],
      currentCount: 1,
      isNativeAPI: false
    }
  },
  mounted() {
    this.removespeech()
    this.type = +this.$route.query.type
    this.initAction()
    this.initRequest()
  },
  beforeDestroy() {
    this.removespeech()
  },
  methods: {
    audioReady() {
      console.log('ready')
    },
    removespeech() {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    },
    speechDetect() {
      let originStr = this.info.content
      var oDiv = document.createElement('div')
      oDiv.innerHTML = originStr
      var text = oDiv.innerText
      let after = text
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, '')
        .replace(/\s/gi, '')
        .replace(/#/gi, '')
      this.readerText = after
      console.log('this.readerText ', this.readerText.length)
      let synth = window.speechSynthesis
      this.globalSpeech = synth
      if (synth) {
        // 原生
        this.isNativeAPI = true
      } else {
        //   调用baidu
        let params = {
          tex: this.readerText,
          cuid: 'baike',
          lan: 'ZH',
          ie: 'utf-8',
          ctp: '1',
          pdt: '301',
          vol: '9',
          rate: '32',
          per: '10'
        }
        this.isNativeAPI = false
      }
      //   this.audioSrc = 'https://tts.baidu.com/text2audio?tex=' + encodeURI(this.readerText.slice(0, 1000)) + '&cuid=baike&lan=ZH&ie=utf-8&ctp=1&pdt=301&vol=9&rate=32&per=0'
      if (!this.isNativeAPI) {
        let divide = 1000
        const count = Math.ceil(this.readerText.length / divide)
        this.splitLength = count
        let empty = []
        for (let i = 0; i < count; i++) {
          empty.push('https://tts.baidu.com/text2audio?tex=' + encodeURI(this.readerText.slice(i * divide, (i + 1) * divide)) + '&cuid=baike&lan=ZH&ie=utf-8&ctp=1&pdt=301&vol=9&rate=32&per=0')
        }
        this.recordArray = empty
        this.dynamicArray = empty
        this.renderAudio = true
        let outer = this
        setTimeout(() => {
          function playTest(i, arr) {
            outer.audioSrc = arr[i]
          }
          playTest(0, empty)
        }, 100)
      }
    },
    broadcast() {
      if (this.isNativeAPI) {
        var msg = new SpeechSynthesisUtterance(this.readerText)
        msg.volume = 2 //音量
        msg.rate = 0.9 //语速
        if (this.globalSpeech.speaking) {
          if (this.playing) {
            this.globalSpeech.pause()
            this.playing = false
          } else {
            this.globalSpeech.resume()
            this.playing = true
          }
        } else {
          this.playing = true
          this.globalSpeech.speak(msg)
        }
        msg.onend = function (event) {
          console.log('SpeechSynthesisUtterance.onend')
        }
      } else {
        let tt = this.$refs.AUDIO
        let endHandler = () => {
          let current = this.dynamicArray[this.currentCount]
          this.audioSrc = current
          if (this.currentCount < this.splitLength) {
            setTimeout(() => {
              tt.play()
              this.currentCount++
            }, 200)
          } else {
            this.currentCount = 0
            this.playing = false
            let current = this.dynamicArray[0]
            this.audioSrc = current
            this.currentCount = 1
          }
        }
        tt.addEventListener('ended', endHandler, false)
        if (this.playing) {
          tt.pause()
          this.playing = false
        } else {
          tt.play()
          this.playing = true
        }
      }
    },
    checkPolicy() {
      const { href } = this.$router.resolve({
        path: '/policy/detail',
        query: {
          id: this.info.policy_document_id
        }
      })
      window.open(href, '_blank')
    },
    toHome() {
      this.$router.push({
        path: '/'
      })
    },
    toUnderstand() {
      this.$router.push({
        path: '/forMap'
      })
    },
    downloadTrigger() {
      let data = {
        invest_category_id: this.$route.query.invest_category_id,
        type: 'bslc'
      }
      this.ApiLists.downloadInvestBsydPdf(data)
        .then((res) => {
          if (res) {
            const content = res
            const blob = new Blob([content])
            const fileName = '办事流程' + Date.now() + '.pdf'
            if ('download' in document.createElement('a')) {
              // 非IE下载
              const elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName)
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((err) => {
          console.log('er', err)
        })
    },
    printTrigger() {
      this.$Print(this.$refs.htmlTarget)
    },
    initAction() {
      this.$store.commit('changeMenuActive', '1')
    },
    async initRequest() {
      let data = { invest_category_id: this.$route.query.invest_category_id }
      const result = await this.ApiLists.investBsydInfo(data)
      if (result && result.code === 0) {
        this.info = result.data.info
        this.speechDetect()
      } else {
        this.$message.error(result.msg)
      }
      // this.ApiLists.fetchUnderstandPaperInfo(data)
      //   .then(res => {
      //     if (res && res.code == 0) {
      //       this.info = res.data;
      //     } else {
      //       this.$message.error(res.msg);
      //     }
      //   })
      //   .catch(err => {
      //     console.log("er", err);
      //   });
    },
    checkPdf(item) {
      window.open(item.url)
    }
  }
}
</script>
<style lang="less" scoped>
audio {
  width: 0;
  height: 0;
  opacity: 0;
  display: none;
}
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
.formapMoticeCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 100px;
  min-height: calc(100vh - 370px);
}
.htmlContent {
  font-size: 14px;
  color: #4d4d4d;
  letter-spacing: 1px;
  overflow-x: auto;
}
.pdfContent {
  font-size: 14px;
  color: #4d4d4d;
  letter-spacing: 1px;
  word-break: break-all;
  margin-top: 20px;

  .itemCon {
    span {
      cursor: pointer;
      color: #0270c3;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.centerCon {
  width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  box-sizing: border-box;
  .checkSource {
    color: #0270c3;
    border-color: #0270c3;
    position: absolute;
    right: 30px;
    top: 30px;
  }
  .contentCon {
    position: relative;
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
      height: 16px;
      font-size: 16px;
      color: #999;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        display: flex;
        align-items: center;
        img {
          width: 20px;
        }

        &:nth-of-type(2) {
          cursor: pointer;
          margin-left: 20px;
          span {
            margin-left: 6px;
          }
        }
      }
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
.formapMoticeCon {
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
      word-break: break-all !important;
      font-size: 22px;
      white-space: normal !important;

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
