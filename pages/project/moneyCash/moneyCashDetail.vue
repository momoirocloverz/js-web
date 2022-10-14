<template>
  <div class="money_cash_detail box_wrap">
    <div class="center_box">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item @click.native="toProjectManage">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item @click.native="toProjectProgress">项目进度</el-breadcrumb-item>
          <el-breadcrumb-item>材料详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <div class="title">
          <p>材料详情</p>
          <div class="btns">
            <el-button class="cover_btn" @click="$router.back()">返 回</el-button>
            <el-button class="cover_btn" @click="editForm" v-if="applyDetail.is_check !== 4">编 辑</el-button>
            <el-button type="primary" @click="documentPage">下 载</el-button>
            <el-button type="primary" @click="printPage">打 印</el-button>
          </div>
        </div>
        <div class="table_box" ref="targetTable">
          <div class="header_box">
            <p class="name">江山市农业农村局财政专项资金拨款申请表</p>
            <div class="base_info">
              <p>申请单位（盖章）：{{ applyDetail.apply_unit }}</p>
              <!-- <p>申请日期：{{ applyDetail.apply_at }}</p> -->
              <p>申请日期：{{ Dayjs(applyDetail.apply_at).format('YYYY年M月D日') }}</p>
            </div>
          </div>
          <div class="table_one">
            <table border="1" cellpadding="0" cellspacing="0" class="table_one">
              <tbody>
                <tr>
                  <td colspan="4" class="table_title" style="width: 18.8%">项目名称</td>
                  <td colspan="20">{{ applyDetail.project_name }}</td>
                </tr>
                <tr>
                  <td colspan="4" class="table_title">负责人</td>
                  <td colspan="4">{{ applyDetail.principal }}</td>
                  <td colspan="4" class="table_title">经手人</td>
                  <td colspan="4">{{ applyDetail.pass_person }}</td>
                  <td colspan="4" class="table_title">联系电话</td>
                  <td colspan="4">{{ applyDetail.link_mobile }}</td>
                </tr>
                <tr>
                  <td colspan="4" class="table_title">项目主要建设内容</td>
                  <td colspan="20">{{ applyDetail.construction_content }}</td>
                </tr>
                <tr>
                  <td colspan="4" class="table_title">项目实施情况及进度</td>
                  <td colspan="20">{{ applyDetail.progress }}</td>
                </tr>
                <tr>
                  <td rowspan="4" colspan="2" class="table_title" width="1">申请拨款</td>
                  <td colspan="2" class="table_title">依据</td>
                  <td colspan="10">{{ applyDetail.allotment_according }}</td>
                  <td colspan="5">计划补助金额（万元）</td>
                  <td colspan="5">{{ applyDetail.plan_subsidy }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="table_title">已补助金额</td>
                  <td colspan="20">
                    <div class="tableFlexItem">
                      <div>人民币（大写）{{ +applyDetail.already_subsidy ? changeNumMoneyToChinese(+applyDetail.already_subsidy * 10000) : changeNumMoneyToChinese('0') }}</div>
                      <div>¥:{{ +applyDetail.already_subsidy * 10000 }}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="table_title">本次申报金额</td>
                  <td colspan="20">
                    <div class="tableFlexItem">
                      <div>人民币（大写）{{ +applyDetail.apply_amount ? changeNumMoneyToChinese(+applyDetail.apply_amount * 10000) : changeNumMoneyToChinese('0') }}</div>
                      <div>¥:{{ +applyDetail.apply_amount * 10000 }}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="table_title">累计补助金额</td>
                  <td colspan="20">
                    <div class="tableFlexItem">
                      <div>人民币（大写）{{ +applyDetail.total_subsidy ? changeNumMoneyToChinese(+applyDetail.total_subsidy * 10000) : changeNumMoneyToChinese('0') }}</div>
                      <div>¥:{{ +applyDetail.total_subsidy * 10000 }}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="4" class="table_title">开户银行及账号</td>
                  <td colspan="20">
                    <p>{{ applyDetail.bank }}</p>
                    <p>{{ applyDetail.bank_account }}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="4" class="table_title">项目管理责任单位负责人意见</td>
                  <td colspan="22" class="table_time">
                    <p>{{ applyDetail.principal_reason }}</p>
                    <!-- <p>{{ applyDetail.principal_at }}</p> -->
                    <p v-if="applyDetail.principal_at">{{ Dayjs(applyDetail.principal_at).format('YYYY年M月D日') }}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="4" class="table_title">分管领导意见</td>
                  <td colspan="22" class="table_time">
                    <p>{{ applyDetail.leader_reason }}</p>
                    <!-- <p>{{ applyDetail.leader_at }}</p> -->
                    <p v-if="applyDetail.leader_at">{{ Dayjs(applyDetail.leader_at).format('YYYY年M月D日') }}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="4" class="table_title">主要领导意见</td>
                  <td colspan="22" class="table_time">
                    <p>{{ applyDetail.important_reason }}</p>
                    <!-- <p>{{ applyDetail.important_at }}</p> -->
                    <p v-if="applyDetail.important_at">{{ Dayjs(applyDetail.important_at).format('YYYY年M月D日') }}</p>
                  </td>
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
import { changeNumMoneyToChinese } from '@/plugins/util'
export default {
  name: 'changeFormDetail',
  layout: 'main',
  data() {
    return {
      applyDetail: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.ApiLists.projectApplyDetail({ id: this.$route.query.id }).then((res) => {
        this.applyDetail = res.data
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
    editForm() {
      this.$router.push({
        path: '/project/moneyCash/moneyCashForm',
        query: {
          id: this.$route.query.id,
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id,
          active: this.$route.query.active,
          apply_id: this.$route.query.apply_id
        }
      })
    },
    documentPage() {
      this.ApiLists.downloadPayApply({ id: this.$route.query.apply_id })
        .then((res) => {
          if (res) {
            const content = res
            const blob = new Blob([content])
            const fileName = '拨款申请表' + Date.now() + '.pdf'
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
    },
    printPage() {
      this.$Print(this.$refs.targetTable)
    },
    changeNumMoneyToChinese
  }
}
</script>

<style scoped lang="less">
.tableFlexItem {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  padding-left: 100px;
  box-sizing: border-box;
  div {
    &:last-child {
      margin-left: 100px;
    }
  }
}
.money_cash_detail {
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
    height: 160px;
  }
  .table_time {
    height: 100px;
    p {
      &:nth-of-type(2) {
        text-align: right;
      }
    }
  }
  .header_box {
    padding: 20px 0 0;
    line-height: 40px;
    font-size: 16px;
    .name {
      width: 100%;
      text-align: center;
      font-size: 20px;
      font-weight: 600;
    }
    .base_info {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
