<template>
  <div class="change_form_detail box_wrap">
    <div class="center_box">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item @click.native="toProjectManage">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item @click.native="toProjectProgress">项目进度</el-breadcrumb-item>
          <el-breadcrumb-item>变更申请表详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <div class="title">
          <p>变更申请表详情</p>
          <div class="btns">
            <el-button class="cover_btn" @click="$router.back()">返 回</el-button>
            <el-button class="cover_btn" @click="editForm" v-if="changeInfo.is_check == 3">编 辑</el-button>
            <el-button type="primary" @click="downloadPage">下 载</el-button>
            <el-button type="primary" @click="printPage">打 印</el-button>
          </div>
        </div>
        <div class="table_box" ref="targetTable">
          <div class="header_box">
            <p class="name">财政支农项目建设内容变更申请表</p>
            <div class="flexLine">
              <p>申请单位（盖章）：{{ changeInfo.apply_unit }}</p>
              <p>联系人：{{ changeInfo.link_person }}</p>
            </div>
            <div class="flexLine">
              <p>联系电话：{{ changeInfo.link_mobile }}</p>
              <!-- <p>申请时间：{{ changeInfo.created_at }}</p> -->
              <p>申请时间：{{ Dayjs(changeInfo.created_at).format('YYYY年M月D日') }}</p>
            </div>
          </div>
          <div class="table_one">
            <table border="1" cellpadding="0" cellspacing="0" class="table_one">
              <tbody>
                <tr>
                  <td colspan="2" class="table_title" width="20%">项目名称</td>
                  <td colspan="5">{{ changeInfo.project_name }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="table_title">文件名称</td>
                  <td colspan="2">{{ changeInfo.file_name }}</td>
                  <td colspan="1" class="table_title">文号</td>
                  <td colspan="2">{{ changeInfo.file_number }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="table_title">文件下达的建设计划</td>
                  <td colspan="5">{{ changeInfo.construction_content }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="table_title">延期时间</td>
                  <td colspan="5">{{ changeInfo.delay_start_date ? Dayjs(changeInfo.delay_start_date).format('YYYY年M月D日') : '未延期' }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="table_title">申请变更内容</td>
                  <td colspan="5" v-html="changeInfo.change_apply_content">{{ changeInfo.change_apply_content }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="table_title">申请变更原因</td>
                  <td colspan="5">{{ changeInfo.apply_reason }}</td>
                </tr>

                <tr>
                  <td colspan="2" class="table_title">变更后项目建设计划</td>
                  <td colspan="5">{{ changeInfo.after_build_plan }}</td>
                </tr>

                <!-- <tr>
                  <td colspan="2" class="table_title">文件下达建设内容</td>
                  <td colspan="5">{{ changeInfo.construction_content }}</td>
                </tr> -->

                <tr>
                  <td colspan="2" class="table_title">项目主管部门审核意见</td>
                  <td colspan="5">{{ changeInfo.check_reason }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="table_title">备注</td>
                  <td colspan="5">{{ changeInfo.remark }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'changeFormDetail',
  layout: 'main',
  data() {
    return {
      changeInfo: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.ApiLists.projectChangeDetail({ id: this.$route.query.project_id }).then((res) => {
        this.changeInfo = res.data
      })
    },
    editForm() {
      this.$router.push({
        path: '/project/projectChange/changeForm',
        query: {
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id,
          active: this.$route.query.active,
          change_id: this.$route.query.change_id
        }
      })
    },
    toProjectManage() {
      this.$router.push({
        path: '/project'
      })
    },
    toProjectProgress() {
      this.$router.push({
        path: '/project/progress',
        query: {
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id,
          active: this.$route.query.active
        }
      })
    },
    printPage() {
      this.$Print(this.$refs.targetTable)
    },
    downloadPage() {
      this.ApiLists.downloadChange({ id: this.$route.query.change_id })
        .then((res) => {
          if (res) {
            const content = res
            const blob = new Blob([content])
            const fileName = '财政支农项目建设内容变更申请表' + Date.now() + '.pdf'
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
        .catch((err) => {
          console.log('er', err)
        })
    }
  }
}
</script>

<style scoped lang="less">
td {
  word-wrap: break-word;
  word-break: break-all;
}
.flexLine {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.change_form_detail {
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    p {
      font-size: 18px;
      font-weight: 600;
    }
  }
  .reset_height {
    height: 200px;
  }
  .header_box {
    padding: 20px;
    line-height: 40px;
    font-size: 16px;
    .name {
      width: 100%;
      text-align: center;
      font-size: 20px;
      font-weight: 600;
    }
  }
}
</style>
