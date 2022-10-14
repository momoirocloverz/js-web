<template>
  <div class="recordMasterCon">
    <div class="recordCon">
      <div class="recordTitleCon">申报记录</div>
      <div class="tableCon">
        <el-table class="basic-table" :data="basicTable">
          <el-table-column label="操作类型" align="center" prop="project_name">
            <template slot-scope="scope">
              <div v-if="scope.row.action_type">
                {{ typeMap[type][scope.row.action_type] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作人" align="center" prop="action_username"></el-table-column>
          <el-table-column label="操作时间" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.created_at">
                {{ scope.row.created_at }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="action_content" width="200"></el-table-column>
          <el-table-column label="附件" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.attachment && scope.row.attachment.length">
                <previewImage :src="scope.row.attachment[0]" :src-list="scope.row.attachment" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    basicTable: [],
    type: {
      type: String,
      default: '5'
    }
  },
  data() {
    return {
      typeMap: {
        5: {
          1: '材料提交',
          12: '乡镇经办人',
          19: '乡镇经办人',
          22: '公示(所在村)',
          29: '公示(所在村)',
          32: '乡镇领导',
          39: '乡镇领导',
          42: '农业农村局',
          49: '农业农村局',
          52: '公示(政府网)',
          59: '公示(政府网)',
          62: '资金拨付',
          69: '资金拨付'
        },
        6: {
          1: '材料提交',
          12: '乡镇经办人',
          19: '乡镇经办人',
          22: '公示(所在村)',
          29: '公示(所在村)',
          32: '乡镇领导',
          39: '乡镇领导',
          42: '农业农村局',
          49: '农业农村局',
          52: '公示(政府网)',
          59: '公示(政府网)',
          62: '资金拨付',
          69: '资金拨付'
        },
        7: {
          1: '材料提交',
          12: '乡镇经办人',
          19: '乡镇经办人',
          22: '公示(所在村)',
          29: '公示(所在村)',
          32: '乡镇领导',
          39: '乡镇领导',
          42: '农业农村局',
          49: '农业农村局',
          52: '公示(政府网)',
          59: '公示(政府网)',
          62: '资金拨付',
          69: '资金拨付'
        },
        8: {
          1: '材料提交',
          12: '乡镇经办人',
          19: '乡镇经办人',
          22: '公示(所在村)',
          29: '公示(所在村)',
          32: '乡镇领导',
          39: '乡镇领导',
          42: '农业农村局',
          49: '农业农村局',
          52: '公示(政府网)',
          59: '公示(政府网)',
          62: '资金拨付',
          69: '资金拨付'
        },
        9: {
          1: '材料提交',
          12: '乡镇经办人',
          19: '乡镇经办人',
          22: '市养殖发展服务中心',
          29: '市养殖发展服务中心',
          32: '农业农村局',
          39: '农业农村局',
          42: '公示',
          49: '公示',
          52: '资金拨付',
          59: '资金拨付'
        },
        10: {
          1: '材料提交',
          31: '材料提交',
          12: '申报-市养殖中心人员',
          22: '申报-公示',
          29: '申报-公示',
          32: '申请-市养殖中心人员',
          39: '申请-市养殖中心人员',
          42: '申请-公示',
          49: '申请-公示',
          19: '申报-市养殖中心人员'
        },
        11: {
          1: '材料提交',
          12: '公示(所在村)',
          19: '公示(所在村)',
          22: '村级审核人员',
          29: '村级审核人员',
          32: '乡镇街道审核',
          39: '乡镇街道审核',
        //   42: '乡镇农机中心领导',
        //   49: '乡镇农机中心领导',
          52: '农业农村局审核人员',
          59: '农业农村局审核人员',
        //   62: '第三方公司核查审核人',
        //   69: '第三方公司核查审核人',
          72: '公示(政府网)',
          79: '公示(政府网)',
          82: '资金拨付',
          89: '资金拨付'
        }
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.recordCon {
  margin-top: 20px;
  padding: 40px;
  box-sizing: border-box;
  background-color: #fff;
}
.recordTitleCon {
  margin-bottom: 10px;
  font-size: 16px;
}
</style>
