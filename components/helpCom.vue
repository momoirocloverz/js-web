<template>
  <div class="helpComCon">
    <el-popover placement="left" width="200" trigger="hover" :content="`遇到问题可联系 项目负责人:${name},联系电话:${phone}`">
      <div class="answerTrigger" slot="reference">
        <div class="centerImg"></div>
      </div>
    </el-popover>
    <div class="formTrigger" @click="toSupport">
      <div class="formImg"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    phone: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    toSupport() {
      this.$router.push({
        path: '/support'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.helpComCon {
  width: 50px;
}
.answerTrigger {
  width: 44px;
  height: 44px;
  background: #fff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.08);
  border-radius: 22px;
  padding: 11px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    .centerImg {
      background-image: url(https://img.hzanchu.com/acimg/a179c27c363dd61f76219f33d887a272.png);
    }
  }
}
.centerImg {
  width: 22px;
  height: 22px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(https://img.hzanchu.com/acimg/f6fd04d393948efdb22f31698e95e47d.png);
}
.formTrigger {
  margin-top: 12px;
  width: 44px;
  height: 44px;
  background: #fff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.08);
  border-radius: 22px;
  padding: 11px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    .formImg {
      background-image: url(https://img.hzanchu.com/acimg/5c30d154f983b665aec3c90db5ee3b43.png);
    }
  }
}
.formImg {
  width: 22px;
  height: 22px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(https://img.hzanchu.com/acimg/0562bf32605bb7a05630c546fb7bd408.png);
}
</style>
