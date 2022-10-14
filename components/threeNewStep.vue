<template>
  <div class="newStepCon">
    <el-steps :active="currentActive" align-center>
      <el-step title="材料提交">
        <div slot="icon" :class="[currentActive > 0 ? 'bluePassed' : 'greyWait']"></div>
      </el-step>
      <el-step title="养殖中心人员审核">
        <div slot="icon" :class="[currentActive > 1 ? 'bluePassed' : 'greyWait']"></div>
      </el-step>
      <el-step title="公示">
        <div slot="icon" :class="[currentActive > 2 ? 'bluePassed' : 'greyWait']"></div>
      </el-step>
    </el-steps>
  </div>
</template>
<script>
export default {
  props: {
    currentActive: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.bluePassed {
  background-color: #409eff;
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
.greyWait {
  background-color: #c0c4cc;
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
</style>

<style lang="less">
.newStepCon {
  .is-process {
    color: #c0c4cc;
    border-color: #c0c4cc;
  }
}
</style>
