<template>
  <div class="work_summary_detail">
    <div class="title">
      <div class="btns">
        <el-button class="cover_btn" @click="$router.back()">返 回</el-button>
        <el-button class="cover_btn" @click="editForm">编 辑</el-button>
        <el-button type="primary" @click="documentPage">下 载</el-button>
        <el-button type="primary" @click="printPage">打 印</el-button>
      </div>
    </div>
    <div class="table_box" ref="targetTable">
      <p class="name">项目实施工作总结（提纲）</p>
      <div>
        <p>前言</p>
        <p>{{ detailInfo.foreword }}</p>
      </div>
      <div>
        <p>一、项目建设计划</p>
        <p>{{ detailInfo.build_plan_content }}</p>
      </div>
      <div>
        <p>二、项目预期目标</p>
        <p>{{ detailInfo.expected_goal_content }}</p>
      </div>
      <div>
        <p>三、项目建设计划完成情况</p>
        <p>{{ detailInfo.build_plan_complete_content }}</p>
      </div>
      <div>
        <p>四、项目建设取得的成效</p>
        <p>{{ detailInfo.build_achievement_content }}</p>
      </div>
      <div>
        <p>五、项目存在的问题及以下打算</p>
        <p>{{ detailInfo.problem_intend_content }}</p>
      </div>
      <div>
        <p>六、相关附件</p>
        <div class="previewDialogCon">
          <template v-for="(item, index) in filesArray">
            <div :key="index" class="previewCon" @click="checkDetail(item, filesArray)">
              <!-- <div
                class="previewImg"
                :style="{
                  backgroundImage: imgIconFilter(item)
                }"
              ></div> -->
              <img class="previewImg" :src="imgIconFilter(item)" />
              <div class="previewName">
                <span>{{ item.name }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <viewer :images="images" :options="options" @inited="inited" class="viewerCus" ref="viewer" v-show="false">
      <img v-for="(src, index) in images" :src="src" :key="index" />
    </viewer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailInfo: {},
      options: {
        initialViewIndex: 0
      },
      images: [],
      filesArray: [],
      docIcon: 'https://img.hzanchu.com/acimg/18b4db2f0a34e503869c5ea5e515f24b.png',
      docxIcon: 'https://img.hzanchu.com/acimg/baf327802e8e5536d75a619da1e41703.png',
      rarIcon: 'https://img.hzanchu.com/acimg/21f96594470ebf4190f90b7a313207f1.png',
      pdfIcon: 'https://img.hzanchu.com/acimg/55b8d7dceaca8e5d8526f32dc8c8d603.png',
      zipIcon: 'https://img.hzanchu.com/acimg/35fc02369154eb26c99f0dac911c850b.png',
      xlsxIcon: 'https://img.hzanchu.com/acimg/2850bd929723576ff53afd3315b5fd40.png',
      xlsIcon: 'https://img.hzanchu.com/acimg/2d28f8877e8b0a3194b4f2fcfcbcfac2.png',
      wpsIcon: 'https://img.hzanchu.com/acimg/744ca05e5f8b341d2199be5c8aa3896b.png',
      csvIcon: 'https://img.hzanchu.com/acimg/8e0f2b1cd0de448ca444d0af1c3b35eb.png'
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    imgIconFilter(ele) {
      let part =
        ele.suffix.toUpperCase() == 'PNG' || ele.suffix.toUpperCase() == 'JPG' || ele.suffix.toUpperCase() == 'JPEG'
          ? ele.url
          : ele.suffix.toUpperCase() == 'ZIP'
          ? this.zipIcon
          : ele.suffix.toUpperCase() == 'RAR'
          ? this.rarIcon
          : ele.suffix.toUpperCase() == 'PDF'
          ? this.pdfIcon
          : ele.suffix.toUpperCase() == 'DOC' || ele.suffix.toUpperCase() == 'KSWPS'
          ? this.docIcon
          : ele.suffix.toUpperCase() == 'DOCX' || ele.suffix.toUpperCase() == 'DOCUMENT'
          ? this.docxIcon
          : ele.suffix.toUpperCase() == 'XLSX'
          ? this.xlsxIcon
          : ele.suffix.toUpperCase() == 'XLS'
          ? this.xlsIcon
          : ele.suffix.toUpperCase() == 'CSV'
          ? this.csvIcon
          : ele.suffix.toUpperCase() == 'WPS'
          ? this.wpsIcon
          : ''
      let obj = part
      return obj
    },
    checkDetail(ele, array) {
      if (ele.suffix.toUpperCase() == 'PNG' || ele.suffix.toUpperCase() == 'JPG' || ele.suffix.toUpperCase() == 'JPEG') {
        let newArray = array.filter((ele) => {
          return ele.suffix.toUpperCase() == 'PNG' || ele.suffix.toUpperCase() == 'JPG' || ele.suffix.toUpperCase() == 'JPEG'
        })
        let index = newArray.findIndex((sub) => {
          return ele.url == sub.url
        })
        this.images = newArray.map((ele) => {
          return ele.url
        })
        this.options.initialViewIndex = index
        setTimeout(() => {
          this.$viewer.show()
        }, 400)
      }
    },
    inited(viewer) {
      this.$viewer = viewer
    },
    getData() {
      this.ApiLists.workSummaryDetail({ project_id: this.$route.query.project_id }).then((res) => {
        this.detailInfo = res.data.info
        if (res.data.info.attachment) {
          let after = JSON.parse(res.data.info.attachment)
          after.forEach((ele) => {
            ele.suffix = ele.name.split('.')[ele.name.split('.').length - 1]
          })
          this.filesArray = after
        }
      })
    },
    editForm() {
      this.$router.push({
        path: '/project/projectAcceptance/projectAcceptance',
        query: {
          ...this.$route.query,
          type: 'form'
        }
      })
    },
    documentPage() {
      const params = {
        project_id: +this.$route.query.project_id,
        download_which_type: 'work_summary'
      }
      this.ApiLists.downloadAcceptance(params).then((res) => {
        if (res) {
          const content = res
          const blob = new Blob([content])
          const fileName = '项目实施工作总结' + Date.now() + '.pdf'
          if ('download' in document.createElement('a')) {
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            navigator.msSaveBlob(blob, fileName)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    printPage() {
      this.$Print(this.$refs.targetTable)
    }
  }
}
</script>

<style scoped lang="less">
.previewDialogCon {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  align-content: flex-start;
  height: 400px;
  overflow-y: auto;
}
.previewName {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  overflow: hidden;
  span {
    width: 100px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.previewImg {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}
.work_summary_detail {
  .title {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20px;
  }
  .name {
    font-size: 22px;
    text-align: center;
    padding: 30px;
  }
  .table_box {
    div {
      p {
        font-size: 14px;
        padding: 20px;
        &:nth-of-type(2) {
          text-indent: 2em;
          border: 1px solid #f0f0f0;
          border-radius: 10px;
          white-space: pre-line;
        }
      }
    }
  }
}
</style>
