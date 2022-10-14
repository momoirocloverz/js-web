<template>
  <div class="money_cash">
    <!-- <div class="btn">
      <el-button class="cover_btn" size="medium" @click="editForm" v-if="!tableData.length">财政专项资金拨款申请表</el-button>
    </div> -->
    <div class="money-data">
      <div class="money-data-item">可补助总金额（万元）：{{ summarInfo.has_order_amount || summarInfo.has_order_amount === 0 ? summarInfo.has_order_amount : '-' }}</div>
      <div class="money-data-item">剩余可申报金额（万元）：{{ summarInfo.remain_can_apply_amount || summarInfo.remain_can_apply_amount === 0 ? summarInfo.remain_can_apply_amount : '-' }}</div>
      <div class="money-data-item">累计补助金额（万元）：{{ summarInfo.has_total_apply_amount || summarInfo.has_total_apply_amount === 0 ? summarInfo.has_total_apply_amount : '-' }}</div>
    </div>
    <el-button style="margin-bottom: 24px" type="primary" @click="editForm">财政专项资金拨款申请表</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="project_name" label="文件名"></el-table-column>
      <el-table-column prop="apply_at" label="申请时间"></el-table-column>
      <el-table-column prop="apply_amount" label="申报金额"></el-table-column>
      <el-table-column prop="is_check" label="状态">
        <template slot-scope="scope">
          <!-- {{ status[scope.row.is_check] }} -->
          {{ scope.row.is_check == 4 ? '已通过' : '审核中' }}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDetail(scope.row)">查看</el-button>
          <!-- <el-button type="text" v-if="scope.row.is_check !== 4 && scope.row.is_check !== 2" size="small" @click="editForm(scope.row)">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
      tableData: [],
      status: {
        1: '待审核',
        2: '审核通过（待拨款）',
        3: '驳回',
        4: '完成拨款'
      },
      summarInfo: {}
    }
  },
  created() {
    this.getSummarInfo()
    this.getList()
  },
  methods: {
    getList() {
      this.ApiLists.projectApplyList({ project_id: this.$route.query.project_id, page: 1, pagesize: Number.MAX_SAFE_INTEGER }).then((res) => {
        this.tableData = res.data.data.map((v) => {
          v.apply_at = dayjs(v.apply_at).format('YYYY-MM-DD')
          return v
        })
      })
    },
    toDetail(item) {
      this.$router.push({
        path: '/project/moneyCash/moneyCashDetail',
        query: {
          id: item.id,
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id,
          active: this.$route.query.active,
          apply_id: item.id
        }
      })
    },
    editForm(item) {
      this.$router.push({
        path: '/project/moneyCash/moneyCashForm',
        query: {
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id,
          active: this.$route.query.active,
          apply_id: item ? item.id : 0
        }
      })
    },

    go2form() {
      this.$router.push({
        path: '/monryCashForm',
        query: {}
      })
    },

    getSummarInfo() {
      this.ApiLists.amountApplySummarInfo({ project_id: this.$route.query.project_id })
        .then((res) => {
          if (res.code === 0) {
            this.summarInfo = res.data
          } 
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

<style scoped lang="less">
.money_cash {
  padding: 20px 0;

  .money-data {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    gap: 80px;
  }

  .btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<style lang="less">
.money_cash {
  .el-table__header-wrapper {
    thead {
      tr {
        th {
          background: rgba(244, 246, 249, 1);
        }
      }
    }
  }
}
</style>
