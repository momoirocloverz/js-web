<template>
  <div class="accept_apply_detail">
    <div class="title">
      <div class="btns">
        <el-button class="cover_btn" @click="$router.back()">返 回</el-button>
        <el-button class="cover_btn" @click="editForm">编 辑</el-button>
        <el-button type="primary" @click="documentPage">下 载</el-button>
        <el-button type="primary" @click="printPage">打 印</el-button>
      </div>
    </div>
    <div class="table_box" ref="targetTable">
      <div class="header_box">
        <div class="name">江山市农业农村局财政支农项目验收申请书</div>
        <div class="base_info">
          <div>申请单位（盖章）：{{ detailInfo && detailInfo.declare_unit }}</div>
          <div>申请日期：{{ detailInfo && detailInfo.apply_at }}</div>
        </div>
      </div>
      <div class="table_one">
        <table border="1" cellpadding="0" cellspacing="0" class="table_one">
          <tbody>
            <tr>
              <td colspan="4" class="table_title" style="width: 18.8%">项目名称</td>
              <td colspan="20">{{ detailInfo.project_name }}</td>
            </tr>
            <tr>
              <td colspan="4" class="table_title">申请单位负责人</td>
              <td colspan="4">{{ detailInfo.unit_charge_name }}</td>
              <td colspan="4" class="table_title">联系人</td>
              <td colspan="4">{{ detailInfo.unit_linker_name }}</td>
              <td colspan="4" class="table_title">电话</td>
              <td colspan="4">{{ detailInfo.unit_charge_mobile }}</td>
            </tr>
            <tr>
              <td colspan="4" class="table_title">申请验收项目建设地点</td>
              <td colspan="20">{{ detailInfo.full_area }}</td>
            </tr>
            <tr>
              <td colspan="4" class="table_title">项目计划建设内容</td>
              <td colspan="20" class="reset_height">{{ detailInfo.build_plan_content }}</td>
            </tr>
            <tr>
              <td colspan="4" class="table_title">建设内容完成情况</td>
              <td colspan="20" class="reset_height">{{ detailInfo.build_complete_content }}</td>
            </tr>
            <tr>
              <td colspan="4" class="table_title">财务（资金）执行情况</td>
              <td colspan="20" class="reset_height">{{ detailInfo.fund_exec_content }}</td>
            </tr>
            <tr>
              <td colspan="4" class="table_title">申请单位意见</td>
              <td colspan="20">
                <div>本单位已经按要求完成项目建设任务，提供的项目验收资料真实有效，如有虚假愿承担一切责任。</div>
                <div class="flex_row">
                  <div>（单位盖章）</div>
                  <div>经手人：</div>
                  <div>负责人：</div>
                </div>
                <div class="time">年&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;日</div>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="table_title">项目管理责任单位审查意见</td>
              <td colspan="20">
                <div>{{ detailInfo.ys_suggest }}</div>
                <div class="flex_row">
                  <div>（单位盖章）</div>
                  <div>经手人：</div>
                  <div>负责人：</div>
                </div>
                <div class="time">年&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;日</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailInfo: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.ApiLists.acceptDetailInfo({ project_id: this.$route.query.project_id }).then((res) => {
        this.detailInfo = res.data.info
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
        project_id: this.$route.query.project_id,
        download_which_type: 'finance_application'
      }
      this.ApiLists.downloadAcceptance(params).then((res) => {
        if (res) {
          const content = res
          const blob = new Blob([content])
          const fileName = '项目验收申请书' + Date.now() + '.pdf'
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
.accept_apply_detail {
  .title {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20px;
  }
  .header_box {
    .name {
      font-size: 22px;
      text-align: center;
    }
    .base_info {
      margin: 30px 0 20px;
      display: flex;
      justify-content: space-between;
    }
  }
  .table_title {
    font-weight: 600;
  }
  .reset_height {
    height: 160px;
  }
  .flex_row {
    display: flex;
    p {
      flex: 1;
    }
  }
  .time {
    text-align: right;
  }
}
</style>
