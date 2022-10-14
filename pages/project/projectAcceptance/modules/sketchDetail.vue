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
        <div class="sketch_detail">
          <div class="title">
            <div class="btns">
              <el-button class="cover_btn" @click="$router.back()">返 回</el-button>
              <el-button class="cover_btn" @click="editForm">编 辑</el-button>
              <el-button type="primary" @click="documentPage">下 载</el-button>
              <el-button type="primary" @click="printPage">打 印</el-button>
            </div>
          </div>
          <div class="table_box" ref="targetTable">
            <div class="list_box" v-for="(item, index) in detailInfo.content_list" :key="index">
              <p class="name">{{ '竣工验收示意图' + (index + 1) }}</p>
              <div class="base_box">
                <div class="base_info">
                  <div>
                    <p>项目名称：</p>
                    <p>{{ detailInfo.project_name }}</p>
                  </div>
                  <div>
                    <p>实施单位：</p>
                    <p>{{ item.declare_unit }}</p>
                  </div>
                  <div>
                    <p>实施地址：</p>
                    <p>{{ item.full_area }}</p>
                  </div>
                  <div>
                    <p>验收时间：</p>
                    <p>{{ item.check_complete_at }}</p>
                  </div>
                </div>
                <p class="shebei" @click="checkoutList(item.facility_list)">{{ item.facility_list && item.facility_list.length ? '查看设备清单表' : '' }}</p>
              </div>
              <preview-imageCopy v-for="(image, index) in item.pic_list" :src="image" :key="index" :src-list="[image]" />
              <el-dialog title="设备清单表" :visible.sync="visible" width="30%">
                <div class="facility_list_box">
                  <div v-for="(item, index) in facilityList" :key="index" :style="{ backgroundImage: imgIconFilter(item) }"></div>
                </div>
              </el-dialog>
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
      docIcon: 'https://img.hzanchu.com/acimg/18b4db2f0a34e503869c5ea5e515f24b.png',
      docxIcon: 'https://img.hzanchu.com/acimg/baf327802e8e5536d75a619da1e41703.png',
      pdfIcon: 'https://img.hzanchu.com/acimg/55b8d7dceaca8e5d8526f32dc8c8d603.png',
      detailInfo: {},
      facilityList: [],
      visible: false
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    checkoutList(list) {
      if (list && list.length) {
        this.facilityList = list
        this.visible = true
      }
    },
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
    getDetail() {
      this.ApiLists.sketchDetail({ project_id: this.$route.query.project_id }).then((res) => {
        this.detailInfo = res.data.info
        this.detailInfo.content_list.forEach((item) => {
          if (typeof item.facility_list === 'string') {
            item.facility_list = item.facility_list ? item.facility_list.split(',') : []
          }
          //   item.facility_list = item.facility_list ? item.facility_list.split(',') : []
        })
        console.log(this.detailInfo.content_list)
      })
    },
    editForm() {
      this.$router.push({
        path: '/project/projectAcceptance/modules/sketchForm',
        query: {
          ...this.$route.query,
          type: 'form'
        }
      })
    },
    documentPage() {
      const params = {
        project_id: this.$route.query.project_id,
        download_which_type: 'completed_sketch'
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
.sketch_detail {
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
    .list_box {
      .name {
        font-size: 22px;
        font-weight: 600;
        margin: 50px 0 20px;
      }
      .base_box {
        display: flex;
        .base_info {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          div {
            font-size: 14px;
            width: 50%;
            box-sizing: border-box;
            padding-right: 20px;
            display: flex;
            margin-bottom: 10px;
            p {
              &:nth-of-type(1) {
                color: #999;
                width: 100px;
              }
              &:nth-of-type(2) {
                width: 0;
                flex: 1;
              }
            }
          }
        }
        .shebei {
          width: 160px;
          color: #2d6fbd;
          text-align: right;
          cursor: pointer;
        }
      }
      .preview-image {
        height: 464px;
        margin-bottom: 14px;
      }
    }
  }
  .facility_list_box {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    div {
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      width: 120px;
      height: 160px;
    }
  }
}
</style>
