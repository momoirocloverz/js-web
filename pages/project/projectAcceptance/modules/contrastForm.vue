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
        <div class="contrast_form">
          <div class="content eg">
            <p class="title">实施前后对照图片要求</p>
            <p>1.所有计划文件中提及的建设内容必须有图片</p>
            <p>2.每个建设内容需两张图片（一张建设前，一张建设后，最好是同一角度拍摄，如下图所示）</p>
            <p>3.购置的设备同样要两张图片（一张设备整体图片，一张为设备上标有型号、出厂日期等的名牌，没有名牌的拍摄合格证）</p>
            <p>4.所有对照图片请添加说明。</p>
            <p>5.车辆购置的，请将车辆行驶证复印件附上。</p>
            <div class="eg_img">
              <div class="img_box" v-for="item in imgEg" :key="item.name">
                <preview-image :src="item.url" :src-list="[item.url]" />
                <p>{{ item.name }}</p>
              </div>
            </div>
          </div>
          <div class="content build_photo">
            <p class="title">实施前后对照图片上传</p>
            <div class="build_list" v-for="(item, index) in buildPhoto" :key="index" @click="saveItem(item)">
              <el-button type="text" class="text_danger" v-show="index !== 0" @click="removeList('build', index)">删除此行</el-button>
              <div class="img_box">
                <p class="fakeRequired1">建设前图片上传<span>(如需上传多张，请下方新增表单)</span></p>
                <img-upload :size="50" :limit="1" @handleChange="(e) => handleSaveBefore(e, index)" :originList="item.before_pic" accept=".doc,.docx,.jpg,.jpeg,.png,.pdf" />
              </div>
              <div class="img_box">
                <p class="fakeRequired1">备注</p>
                <el-input type="textarea" :rows="3" v-model="item.before_desc" placeholder="请输入" />
              </div>
              <div class="img_box">
                <p class="fakeRequired1">建设后图片上传<span>(如需上传多张，请下方新增表单)</span></p>
                <img-upload :size="50" :limit="1" @handleChange="(e) => handleSaveAfter(e, index)" :originList="item.after_pic" accept=".doc,.docx,.jpg,.jpeg,.png,.pdf" />
              </div>
              <div class="img_box">
                <p class="fakeRequired1">备注</p>
                <el-input type="textarea" :rows="3" v-model="item.after_desc" placeholder="请输入" />
              </div>
            </div>
            <div class="btn_box">
              <el-button class="cover_btn" @click="addList('build')">新 增</el-button>
            </div>
          </div>
          <div class="content build_photo">
            <p class="title">购置设备图片上传</p>
            <div class="build_list" v-for="(item, index) in buyPhoto" :key="index" @click="saveItem(item)">
              <el-button type="text" class="text_danger" v-show="index !== 0" @click="removeList('buy', index)">删除此行</el-button>
              <div class="img_box">
                <p class="fakeRequired1">设备图片上传<span>(如需上传多张，请下方新增表单)</span></p>
                <img-upload :size="50" :limit="1" @handleChange="(e) => handleBuyBefore(e, index)" :originList="item.gz_pic" accept=".doc,.docx,.jpg,.jpeg,.png,.pdf" />
              </div>
              <div class="img_box">
                <p class="fakeRequired1">备注</p>
                <el-input type="textarea" :rows="3" v-model="item.gz_desc" placeholder="请输入" />
              </div>
              <div class="img_box">
                <p class="fakeRequired1">设备铭牌上传<span>(如需上传多张，请下方新增表单)</span></p>
                <img-upload :size="50" :limit="1" @handleChange="(e) => handleBuyAfter(e, index)" :originList="item.nameplate_pic" accept=".doc,.docx,.jpg,.jpeg,.png,.pdf" />
              </div>
              <div class="img_box">
                <p class="fakeRequired1">备注</p>
                <el-input type="textarea" :rows="3" v-model="item.nameplate_desc" placeholder="请输入" />
              </div>
            </div>
            <div class="btn_box">
              <el-button class="cover_btn" @click="addList('buy')">新 增</el-button>
            </div>
          </div>
          <div class="btn_box_submit">
            <el-button class="cover_btn" @click="$router.back()">取 消</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="disableBtn">提 交</el-button>
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
      imgEg: [
        { name: '建设前', url: 'https://img.hzanchu.com/acimg/a5ec42770c9fe121ecc8102d7552db5a.jpeg' },
        { name: '建设后', url: 'https://img.hzanchu.com/acimg/3aa8d412cb9b559a4e5aa99a591a214d.jpeg' },
        { name: '设备', url: 'https://img.hzanchu.com/acimg/55aa8008920cd6f23883489419728170.png' },
        { name: '铭牌', url: 'https://img.hzanchu.com/acimg/fac9f1c93c678513b41c590aae5e7958.png' }
      ],
      buildPhoto: [],
      buyPhoto: [],
      buildObj: {
        before_pic: '',
        before_desc: '',
        after_pic: '',
        after_desc: ''
      },
      buyObj: {
        gz_pic: '',
        gz_desc: '',
        nameplate_pic: '',
        nameplate_desc: ''
      },
      curObj: {},
      disableBtn: false,
      disableTimer: null
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getDetail()
    } else {
      this.buildPhoto.push(JSON.parse(JSON.stringify(this.buildObj)))
    }
  },
  methods: {
    getDetail() {
      this.ApiLists.comparisonDetail({ project_id: this.$route.query.project_id }).then((res) => {
        this.buildPhoto = res.data.info.ss_content_list
        this.buyPhoto = res.data.info.gz_content_list
        this.$forceUpdate()
      })
    },
    handleSaveBefore(e, index) {
      this.curObj.before_pic = e.join(',')
      this.buildPhoto[index].before_pic = e.join(',')
    },
    handleSaveAfter(e, index) {
      this.curObj.after_pic = e.join(',')
      this.buildPhoto[index].after_pic = e.join(',')
    },
    handleBuyBefore(e, index) {
      this.curObj.gz_pic = e.join(',')
      this.buyPhoto[index].gz_pic = e.join(',')
    },
    handleBuyAfter(e, index) {
      this.curObj.nameplate_pic = e.join(',')
      this.buyPhoto[index].nameplate_pic = e.join(',')
    },
    saveItem(item) {
      this.curObj = item
    },
    removeList(type, index) {
      if (type === 'build') {
        this.buildPhoto.splice(index, 1)
      } else {
        this.buyPhoto.splice(index, 1)
      }
    },
    onSubmit() {
      let emptyIndex = ''
      this.buildPhoto.forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          console.log(item[key])
          if (item[key] === '') emptyIndex = index
        })
      })
      //   if (emptyIndex !== '') {
      //     this.$message.error('实施前后对比图，第' + (emptyIndex + 1) + '行有未填写完成内容')
      //     return
      //   }
      this.buyPhoto.forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          console.log(item[key])
          if (item[key] === '') emptyIndex = index
        })
      })
      //   if (emptyIndex !== '') {
      //     this.$message.error('购置设备图片，第' + (emptyIndex + 1) + '行有未填写完成内容')
      //     return
      //   }
      this.disableBtn = true
      this.submit()
    },
    submit() {
      let params = {
        save_type: 'submit',
        project_id: this.$route.query.project_id,
        ss_content_list: this.buildPhoto,
        gz_content_list: this.buyPhoto
      }
      this.ApiLists.editComparison(params)
        .then((res) => {
          if (res && res.code === 0) {
            this.$message.success('提交成功')
            this.$router.back()
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => {
          this.disableTimer = setTimeout(() => {
            this.disableBtn = false
            clearTimeout(this.disableTimer)
          }, 5000)
        })
    },
    addList(e) {
      if (e === 'build') {
        if (this.buildPhoto.length >= 20) {
          this.$message.error('最多不可超过20组')
          return
        }
        this.buildPhoto.push(JSON.parse(JSON.stringify(this.buildObj)))
      } else {
        if (this.buyPhoto.length >= 20) {
          this.$message.error('最多不可超过20组')
          return
        }
        this.buyPhoto.push(JSON.parse(JSON.stringify(this.buyObj)))
      }
    }
  }
}
</script>

<style scoped lang="less">
.fakeRequired {
  position: relative;
  &::before {
    content: '*';
    color: #f56c6c;
    left: -9px;
    top: 3px;
    position: absolute;
  }
}
.contrast_form {
  .content {
    padding: 20px 200px;
    border-bottom: 20px solid #f6f7f9;
    p {
      font-size: 14px;
      margin-top: 5px;
    }
    .title {
      font-size: 20px;
      font-weight: 500;
      margin: 0 0 20px;
    }
    .eg_img {
      display: flex;
      flex-wrap: wrap;
      .img_box {
        width: 50%;
        box-sizing: border-box;
        padding: 20px 20px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        .preview-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          cursor: pointer;
        }
        p {
          color: #666;
          margin-top: 10px;
        }
      }
    }
  }
  .build_photo {
    .build_list {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 30px;
      border-top: 1px solid #f6f7f9;
      .text_danger {
        position: absolute;
        right: 0;
        top: 16px;
      }
      .img_box {
        margin-top: 20px;
        p {
          margin-bottom: 8px;
          span {
            color: #666;
          }
        }
        &:nth-of-type(2n-1) {
          width: 40%;
        }
        &:nth-of-type(2n) {
          width: 60%;
        }
      }
    }
    .btn_box {
      display: flex;
      justify-content: center;
      margin: 30px 0;
      .cover_btn {
        padding: 12px 60px;
      }
    }
  }
  .btn_box_submit {
    display: flex;
    justify-content: center;
    gap: 30px;
    background: #f6f7f9;
  }
}
</style>
