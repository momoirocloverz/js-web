<template>
  <div class="project_acceptance box_wrap">
    <div class="center_box">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item @click.native="toProjectManage">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item @click.native="toProjectProgress">项目进度</el-breadcrumb-item>
          <el-breadcrumb-item>项目验收</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <div class="contrast-detail">
          <div class="title">
            <div class="btns">
              <el-button class="cover_btn" @click="$router.back()">返 回</el-button>
              <el-button class="cover_btn" @click="editForm">编 辑</el-button>
              <el-button type="primary" @click="documentPage">下 载</el-button>
              <el-button type="primary" @click="printPage">打 印</el-button>
            </div>
          </div>
          <div class="table_box" ref="targetTable">
            <div class="info_box" v-for="(item, index) in buildInfo" :key="index">
              <p class="name">{{ '实施前后对照' + (index + 1) }}</p>
              <div class="image_box">
                <preview-imageCopy :src="item.before_pic" :src-list="[item.before_pic]" />
                <p>{{ item.before_desc }}</p>
              </div>
              <div class="image_box">
                <preview-imageCopy :src="item.after_pic" :src-list="[item.after_pic]" />
                <p>{{ item.after_desc }}</p>
              </div>
            </div>
            <div class="info_box" v-for="(item, index) in buyInfo" :key="index + 1000">
              <p class="name">{{ '购置设备' + (index + 1) }}</p>
              <div class="image_box">
                <preview-imageCopy :src="item.gz_pic" :src-list="[item.gz_pic]" />
                <p>{{ item.gz_desc }}</p>
              </div>
              <div class="image_box">
                <preview-imageCopy :src="item.nameplate_pic" :src-list="[item.nameplate_pic]" />
                <p>{{ item.nameplate_desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'main',
  data() {
    return {
      buildInfo: [],
      buyInfo: []
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    checkType(value) {
      console.log(value)
    },
    getDetail() {
      this.ApiLists.comparisonDetail({ project_id: this.$route.query.project_id }).then((res) => {
        this.buildInfo = res.data.info.ss_content_list || []   
        this.buyInfo = res.data.info.gz_content_list || []
      })
    },
    editForm() {
      this.$router.push({
        path: '/project/projectAcceptance/modules/contrastForm',
        query: {
          ...this.$route.query,
          type: 'form'
        }
      })
    },
    documentPage() {
      const params = {
        project_id: this.$route.query.project_id,
        // download_which_type: 'complete_compare'
        download_which_type: 'comparison_pic'
      }
      this.ApiLists.downloadAcceptance(params).then((res) => {
        if (res) {
          const content = res
          const blob = new Blob([content])
          const fileName = '实施前后对比图' + Date.now() + '.pdf'
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
.contrast-detail {
  .title {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20px;
  }
  .preview-image {
    width: 100%;
    height: 250px;
    cursor: pointer;
  }
  .table_box {
    .info_box {
      position: relative;
      display: flex;
      padding-top: 40px;
      .name {
        position: absolute;
        font-size: 22px;
        font-weight: 600;
        top: 20px;
        text-indent: 20px;
      }
      .image_box {
        width: 50%;
        box-sizing: border-box;
        padding: 20px;
        p {
          font-size: 14px;
          line-height: 20px;
          color: #666;
          padding-top: 10px;
          text-indent: 2em;
        }
      }
    }
  }
}
</style>
