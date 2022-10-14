<template>
  <div class="compare_detail">
    <div class="title">
      <div class="btns">
        <el-button class="cover_btn" @click="$router.back()">返 回</el-button>
        <el-button class="cover_btn" @click="editForm">编 辑</el-button>
        <el-button type="primary" @click="documentPage">下 载</el-button>
        <el-button type="primary" @click="printPage">打 印</el-button>
      </div>
    </div>
    <div class="table_box" ref="targetTable">
      <p class="name">{{ projectInfo.project_name + '项目完成情况对比表' }}</p>
      <div class="table_one">
        <table border="1" cellpadding="0" cellspacing="0" class="table_one">
          <tbody>
            <tr>
              <td colspan="2" rowspan="2" style="width: 8%">序号</td>
              <td colspan="5" rowspan="2" style="width: 20%">项目建设分项名称</td>
              <td colspan="5" rowspan="2">建设地点</td>
              <td colspan="6">建设内容</td>
              <td colspan="6">投资情况（万元）</td>
            </tr>
            <tr>
              <td colspan="3">计划数</td>
              <td colspan="3">完成数</td>
              <td colspan="3">计划数</td>
              <td colspan="3">完成数</td>
            </tr>
            <tr>
              <td colspan="2">（一）</td>
              <td colspan="5">基础设施建设</td>
              <td colspan="5">-</td>
              <td colspan="3">-</td>
              <td colspan="3">-</td>
              <td colspan="3">{{ detailInfo.part_options[0].sum_plan }}</td>
              <td colspan="3">{{ detailInfo.part_options[0].sum_complete }}</td>
            </tr>
            <template v-for="(item, index) in detailInfo.part_options[0].list">
              <tr>
                <td colspan="2">{{ index + 1 }}</td>
                <td colspan="5">{{ item.name }}</td>
                <td colspan="5">{{ item.location }}</td>
                <td colspan="3">{{ item.plan_scale }}</td>
                <td colspan="3">{{ item.complete_scale }}</td>
                <td colspan="3">{{ item.plan_invest_money }}</td>
                <td colspan="3">{{ item.complete_invest_money }}</td>
              </tr>
            </template>
            <tr>
              <td colspan="2">（二）</td>
              <td colspan="5">购置设备</td>
              <td colspan="5">-</td>
              <td colspan="3">-</td>
              <td colspan="3">-</td>
              <td colspan="3">{{ detailInfo.part_options[1].sum_plan }}</td>
              <td colspan="3">{{ detailInfo.part_options[1].sum_complete }}</td>
            </tr>
            <template v-for="(item, index) in detailInfo.part_options[1].list">
              <tr>
                <td colspan="2">{{ index + 1 }}</td>
                <td colspan="5">{{ item.name }}</td>
                <td colspan="5">{{ item.location }}</td>
                <td colspan="3">{{ item.plan_scale }}</td>
                <td colspan="3">{{ item.complete_scale }}</td>
                <td colspan="3">{{ item.plan_invest_money }}</td>
                <td colspan="3">{{ item.complete_invest_money }}</td>
              </tr>
            </template>
            <tr>
              <td colspan="2">（三）</td>
              <td colspan="5">其他</td>
              <td colspan="5">-</td>
              <td colspan="3">-</td>
              <td colspan="3">-</td>
              <td colspan="3">{{ detailInfo.part_options[2].sum_plan }}</td>
              <td colspan="3">{{ detailInfo.part_options[2].sum_complete }}</td>
            </tr>
            <template v-for="(item, index) in detailInfo.part_options[2].list">
              <tr>
                <td colspan="2">{{ index + 1 }}</td>
                <td colspan="5">{{ item.name }}</td>
                <td colspan="5">{{ item.location }}</td>
                <td colspan="3">{{ item.plan_scale }}</td>
                <td colspan="3">{{ item.complete_scale }}</td>
                <td colspan="3">{{ item.plan_invest_money }}</td>
                <td colspan="3">{{ item.complete_invest_money }}</td>
              </tr>
            </template>
            <tr>
              <td colspan="18">合计</td>
              <td colspan="3">{{ detailInfo.sum_plan }}</td>
              <td colspan="3">{{ detailInfo.sum_complete }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    projectInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      detailInfo: {
        part_options: [{}, {}, {}]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.ApiLists.compareDetail({ project_id: this.$route.query.project_id }).then((res) => {
        res.data.info.part_options.forEach((item) => {
          let sum_plan = 0
          let sum_complete = 0
          item.list.forEach((item) => {
            sum_plan += +item.plan_invest_money
            sum_complete += item.complete_invest_money
          })
          item.sum_plan = sum_plan
          item.sum_complete = sum_complete
        })
        res.data.info.sum_plan = 0
        res.data.info.sum_complete = 0
        res.data.info.part_options.forEach((item) => {
          res.data.info.sum_plan += +item.sum_plan
          res.data.info.sum_complete += +item.sum_complete
        })
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
        // download_which_type: 'comparison_pic'
        download_which_type: 'complete_compare'
      }
      this.ApiLists.downloadAcceptance(params).then((res) => {
        if (res) {
          const content = res
          const blob = new Blob([content])
          const fileName = '项目完成情况对比表' + Date.now() + '.pdf'
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
.compare_detail {
  .title {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20px;
  }
  .table_box {
    .name {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 30px;
      text-align: center;
    }
    td {
      text-align: center;
    }
  }
}
</style>
