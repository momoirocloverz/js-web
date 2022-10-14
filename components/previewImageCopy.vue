<template>
  <div class="preview-image">
    <div class="bgSet" :style="{ backgroundImage: imgIconFilter(src) }" @click="previewBig(src)"></div>
    <!-- <el-image
      :src="src"
      alt=""
      @click="previewBig"
    /> -->
    <el-dialog title="查看图片" width="1000px" height="75%" append-to-body :visible.sync="visible" custom-class="preview_dialog">
      <div class="preview_image">
        <el-carousel v-if="visible" :interval="0" :arrow="srcList.length > 1 ? 'always' : 'never'" :initial-index="activeIndex">
          <el-carousel-item v-for="(item, index) in srcList" :key="index">
            <img :src="item" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
    <el-dialog title="查看" width="1000px" height="75%" append-to-body :visible.sync="wordvisible" custom-class="preview_dialog">
      <iframe width="100%" class="innerIframe" height="520" :src="'https://view.officeapps.live.com/op/view.aspx?src=' + currentWord"></iframe>
    </el-dialog>

    <el-dialog title="查看" width="1000px" height="75%" append-to-body :visible.sync="pdfvisible" custom-class="preview_dialog">
      <iframe width="100%" class="innerIframe" height="520" :src="currentPdf"></iframe>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    srcList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      visible: false,
      activeIndex: 0,
      renderSrc: '',
      docIcon: 'https://img.hzanchu.com/acimg/18b4db2f0a34e503869c5ea5e515f24b.png',
      docxIcon: 'https://img.hzanchu.com/acimg/baf327802e8e5536d75a619da1e41703.png',
      pdfIcon: 'https://img.hzanchu.com/acimg/55b8d7dceaca8e5d8526f32dc8c8d603.png',
      currentWord: '',
      wordvisible: false,
      pdfvisible: false,
      currentPdf: ''
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.activeIndex = 0
        return
      }
      this.srcList.some((item, index) => {
        if (item === this.src) {
          this.activeIndex = index
          return true
        }
      })
    }
  },
  created() {
    // const index = this.srcList.findIndex(this.src)
  },
  methods: {
    imgIconFilter(ele) {
      if (ele) {
        let eleArr = ele.split('.')
        let suffix = eleArr[eleArr.length - 1]
        let part =
          suffix.toUpperCase() === 'PNG' || suffix.toUpperCase() === 'JPG' || suffix.toUpperCase() === 'JPEG'
            ? ele
            : suffix.toUpperCase() === 'ZIP'
            ? this.zipIcon
            : suffix.toUpperCase() === 'RAR'
            ? this.rarIcon
            : suffix.toUpperCase() === 'PDF'
            ? this.pdfIcon
            : suffix.toUpperCase() === 'DOC'
            ? this.docIcon
            : suffix.toUpperCase() === 'DOCX'
            ? this.docxIcon
            : ''
        let obj = 'url(' + part + ')'
        return obj
      }
    },
    previewBig(ele) {
      if (ele) {
        let eleArr = ele.split('.')
        let suffix = eleArr[eleArr.length - 1]
        let IsImage = suffix.toUpperCase() === 'PNG' || suffix.toUpperCase() === 'JPG' || suffix.toUpperCase() === 'JPEG'
        let isPdf = suffix.toUpperCase() === 'PDF'
        let isWord = suffix.toUpperCase() === 'DOC' || suffix.toUpperCase() === 'DOCX'
        if (IsImage) {
          this.visible = true
        } else if (isPdf) {
          this.pdfvisible = true
          this.currentPdf = ele
        } else if (isWord) {
          this.currentWord = ele
          this.wordvisible = true
        }
      }
    }
  }
}
</script>

<style lang="less">
.preview-image {
  width: 100%;
  height: 100%;
}
.el-image {
  width: 100%;
  height: 100%;
}
img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
.preview_image {
  // 左右滑动指示器
  .el-carousel__arrow {
    background: #1f2d3d;
    i {
      font-size: 24px;
    }
  }
  // 下标指示器
  .el-carousel__indicators {
    .el-carousel__indicator {
      .el-carousel__button {
        background: #1f2d3d;
        height: 4px;
        border-radius: 2px;
      }
    }
  }
  // 轮播区域
  .el-carousel__container {
    height: 70vh;
    .el-carousel__item {
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.bgSet {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  //   width: 120px;
  //   height: 160px;
  width: 100%;
  height: 100%;
}
</style>
