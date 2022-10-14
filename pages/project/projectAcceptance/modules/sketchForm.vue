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
        <div class="sketch_form">
          <p class="title">竣工验收示意图上传</p>
          <el-form label-width="120px" :model="formData" ref="form">
            <div :style="{ marginBottom: '40px', position: 'relative' }" v-for="(item, index) in formData.items" @click="saveItem(item, index)" :key="index">
              <el-button type="text" class="text_danger" v-if="index !== 0" @click="removeForm(index)">删除该表单</el-button>
              <el-form-item label="实施单位" :prop="'items.' + index + '.declare_unit'" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
                <el-input v-model="item.declare_unit" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="实施地址" :prop="'items.' + index + '.area_ids'">
                <span :style="{ marginRight: '10px', color: '#666' }" v-for="(item, index) in item.area_ids" :key="index">{{ item }}</span>
              </el-form-item>
              <!--        <el-form-item label="实施地址" :prop="'items.' + index + '.area_ids'" :rules="{ required: true, message: '选择地址', trigger: 'blur' }">-->
              <!--          <div class="flexDate">-->
              <!--            <el-cascader-->
              <!--              class="resetDateWidth"-->
              <!--              v-model="item.province"-->
              <!--              @change="provinceChange"-->
              <!--              :options="item.options"-->
              <!--            />-->
              <!--            <el-cascader-->
              <!--              class="resetDateWidth"-->
              <!--              v-model="item.city"-->
              <!--              :options="item.options2"-->
              <!--              @change="cityChange"-->
              <!--            />-->
              <!--            <el-cascader-->
              <!--              class="resetDateWidth"-->
              <!--              v-model="item.area"-->
              <!--              :options="item.options3"-->
              <!--              @change="areaChange"-->
              <!--            />-->
              <!--          </div>-->
              <!--        </el-form-item>-->
              <el-form-item label="地址详情" :prop="'items.' + index + '.area_detail'" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
                <el-input v-model="item.area_detail" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="验收时间" :prop="'items.' + index + '.check_complete_at'" :rules="{ required: true, message: '选择时间', trigger: 'blur' }">
                <el-date-picker style="width: 100%" v-model="item.check_complete_at" type="date" placeholder="选择日期" />
              </el-form-item>
              <el-form-item label="上传示意图" :prop="'items.' + index + '.pic_list'" :rules="{ required: true, message: '请上传示意图', trigger: 'blur' }">
                <div class="img_box">
                  <img-upload :size="50" :limit="10" @handleChange="handleChange" :originList="item.pic_list" accept=".doc,.docx,.jpg,.jpeg,.png,.pdf" />
                  <div class="img_name">
                    <preview-image src="https://img.hzanchu.com/acimg/725aaf9d22cb304fbd36340bcc1bf4be.jpeg" :src-list="['https://img.hzanchu.com/acimg/725aaf9d22cb304fbd36340bcc1bf4be.jpeg']" />
                    <p>示例图</p>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="上传设备清单表" :prop="'items.' + index + '.facility_list'">
                <el-upload
                  ref="uploads"
                  class="upload-demo"
                  :action="action"
                  drag
                  :show-file-list="true"
                  :file-list="item.facility_list_read"
                  :on-success="handleAvatarSuccess"
                  :on-change="getFileList"
                  :on-remove="handleRemove"
                  :headers="headers"
                  name="file"
                  multiple
                  accept=".doc,.pdf,.docx,.png,.jpg,.jpeg"
                  :http-request="httpRequest"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">支持扩展名：.doc .docx .pdf .jpg .png</div>
                </el-upload>
              </el-form-item>
            </div>
            <el-form-item :style="{ display: 'flex', justifyContent: 'center', marginRight: '80px' }">
              <el-button class="cover_btn" @click="$router.back()">取 消</el-button>
              <el-button type="primary" @click="addRow">新 增</el-button>
              <el-button type="primary" @click="onSubmit('form')" :disabled="disableBtn || submitBtnDisable">提 交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import provinceData from '/static/city-data/province.js'
import cityData from '/static/city-data/city'
import areaData from '/static/city-data/area'
import OSS from 'ali-oss'
const OSSLINK = 'https://jiangshan-tzyjs-img.zjsszxc.com/'
export default {
  layout: 'main',
  //   props: {
  //     projectInfo: {
  //       type: Object,
  //       default: () => {
  //         return {}
  //       }
  //     }
  //   },
  data() {
    return {
      client: {},
      formData: {
        items: []
      },
      itemObj: {
        // province: '',
        // city: '',
        // area: '',
        declare_unit: '',
        area_ids: '',
        area_ids_store: '',
        area_detail: '',
        check_complete_at: '',
        pic_list: '',
        facility_list: []
        // options: provinceData,
        // options2: cityData,
        // options3: areaData,
        // track1Item: '',
        // track1Index: '',
        // track2Index: '',
        // track2Item: '',
        // track3Item: '',
      },
      curItem: {},
      curIndex: 0,
      action: '/web/web/upload/upload_images',
      headers: {},
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      hideUpload: false,
      disableBtn: false,
      disableTimer: null,
      projectInfo: {},
      backupInfo: {},
      submitBtnDisable: false
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.action = '/web/web/upload/upload_images'
    } else {
      this.action = '/web/upload/upload_images'
    }
    this.getOss()
    this.ApiLists.fetchProjectSchedule({ project_id: this.$route.query.project_id }).then((res) => {
      this.projectInfo = res.data.info
      let shorter = res.data.info
      this.backupInfo = shorter
      this.formData.area_ids = shorter.area_ids
      this.itemObj.declare_unit = shorter.declare_unit
      this.itemObj.area_ids = shorter.area_ids
      this.itemObj.area_ids_store = shorter.area_ids_store
      this.itemObj.area_detail = shorter.area_detail

      if (this.$route.query.id) {
        this.getDetail()
      } else {
        setTimeout(() => {
          this.formData.items.push(JSON.parse(JSON.stringify(this.itemObj)))
        }, 1000)
      }
    })

    this.headers = {
      Authorization: localStorage.getItem('loginToken')
    }
  },
  methods: {
    getProjectInfo() {
      this.ApiLists.fetchProjectSchedule({ project_id: this.$route.query.project_id }).then((res) => {
        this.projectInfo = res.data.info
        let shorter = res.data.info
        this.backupInfo = shorter
        this.formData.area_ids = shorter.area_ids
        this.itemObj.declare_unit = shorter.declare_unit
        this.itemObj.area_ids = shorter.area_ids
        this.itemObj.area_ids_store = shorter.area_ids_store
        this.itemObj.area_detail = shorter.area_detail
      })
    },
    getOss() {
      this.ApiLists.getOssInfo().then((res) => {
        if (res && res.code === 0) {
          let after = res.data.info
          this.client = new OSS({
            // region: after.endpoint_upload,
            region: 'oss-cn-hangzhou',
            accessKeyId: after.access_key,
            accessKeySecret: after.secret_key,
            bucket: after.bucket
          })
          this.client.path = after.path_class
        }
      })
    },
    httpRequest(e) {
      let file = e.file // 文件信息
      if (!file) {
        return false
      }
      //   else if (!/\.(png|jpg)$/.test(file.name.toLowerCase())) {
      //     // 格式根据自己需求定义
      //     this.$message.error('上传格式不正确，请上传png或者jpg格式')
      //     return false
      //   }
      let filename = file.name
      const suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      let url = `${this.client.path}/${file.name.split('.')[0]}-${file.uid}.${suffix}`
      this.submitBtnDisable = true
      this.client
        .multipartUpload(url, file)
        .then((res) => {
          let newUrl = OSSLINK + res.name
          e.onSuccess({
            url: newUrl
          })
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          this.submitBtnDisable = false
        })
    },
    handleChange(e) {
      this.curItem.pic_list = e
    },
    saveItem(item, index) {
      this.curItem = item
      this.curIndex = index
    },
    getDetail() {
      this.ApiLists.sketchDetail({ project_id: this.$route.query.project_id }).then((res) => {
        this.formData.items = res.data.info.content_list
        // this.formData.items.forEach((item, index) => {
        // item.province = item.area_ids_store[0]
        // item.city = item.area_ids_store[1]
        // item.area = item.area_ids_store[2]
        // item.options = provinceData
        // let idx = item.options.findIndex(ele => {
        //     return item.province == ele.value
        //   })
        // item.track1Item = item.options[idx]
        // item.track1Index = idx
        // item.options2 = cityData[idx]
        // let idx2 = item.options2.findIndex(ele => {
        //   return item.city == ele.value
        // })
        // item.track2Item = item.options2[idx2]
        // item.track2Index = idx2
        // item.options3 = areaData[item.track1Index][idx2]
        // let idx3 = item.options3.find(ele => {
        //   return item.area == ele.value
        // })
        // item.track3Item = idx3
        // })
        this.formData.items.map((item) => {
          if (typeof item.facility_list === 'string') {
            item.facility_list = item.facility_list ? item.facility_list.split(',') : []
          }
        })
        this.formData.items.map((item) => {
          let arr = []
          item.facility_list.map((child) => {
            arr.push({ url: child, name: child })
          })
          item.facility_list = arr
          item.facility_list_read = item.facility_list
          item.area_ids = this.backupInfo.area_ids
        })
      })
    },
    addRow() {
      this.formData.items.push(JSON.parse(JSON.stringify(this.itemObj)))
    },
    removeForm(index) {
      this.formData.items.splice(index, 1)
    },
    onSubmit(formName) {
      this.disableBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitSketch()
        } else {
          this.disableBtn = false
          return false
        }
      })
    },
    submitSketch() {
      const formData = JSON.parse(JSON.stringify(this.formData.items))
      formData.map((item) => {
        item.check_complete_at = this.Dayjs(item.check_complete_at).format('YYYY-MM-DD')
        let listStr = []
        item.facility_list.map((item) => {
          listStr.push(item.url)
        })
        item.facility_list = listStr.join(',')
        // delete item.area
        // delete item.city
        // delete item.province
        // delete item.full_area
        // delete item.options
        // delete item.options2
        // delete item.options3
        // delete item.facility_list_read
        // delete item.track1Index
        // delete item.track2Index
        // delete item.track1Item
        // delete item.track2Item
        // delete item.track3Item
      })
      let params = {
        save_type: 'submit',
        project_id: this.$route.query.project_id,
        content_list: formData
      }
      this.ApiLists.editSketch(params)
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
    handleAvatarSuccess(res) {
      if (res && res.code === 0) {
        res.data.img_url = 'https://jiangshan-tzyjs-img.zjsszxc.com/' + res.data.img_url
      }
    },
    handleRemove(file, fileList) {
      // const index = this.$refs.uploads[this.curIndex].uploadFiles.findIndex(item => item.url === file.url)
      // this.$refs.uploads[this.curIndex].uploadFiles.splice(index, 1)
      this.getFileList()
    },
    getFileList() {
      const uploadFiles = this.$refs.uploads[this.curIndex].uploadFiles.filter((item) => item.status === 'success')
      let array = uploadFiles.map((item) => {
        return { url: item.response ? item.response.url : item.url, name: item.response ? item.response.url : item.url }
      })
      //   let array = uploadFiles.map((item) => {
      //     return { url: item.response?.data.img_url || item.url, name: item.response?.data.img_url || item.url }
      //   })
      this.formData.items[this.curIndex].facility_list = array
    }
    // provinceChange(value) {
    //   this.curItem.options3 = []
    //   this.curItem.options2 = []
    //   this.curItem.city = ''
    //   this.curItem.area = ''
    //   let hi = this.curItem.options.findIndex(ele => {
    //     return value[0] == ele.value
    //   })
    //   this.curItem.track1Item =  this.curItem.options[hi]
    //   this.curItem.track1Index = hi
    //   this.curItem.options2 = cityData[hi]
    //   this.formData.items[this.curIndex] = this.curItem
    // },
    // cityChange(value) {
    //   let hi =  this.curItem.options2.findIndex(ele => {
    //     return value[0] == ele.value
    //   })
    //   this.curItem.track2Item =  this.curItem.options2[hi]
    //   this.curItem.track2Index = hi
    //   this.curItem.options3 = areaData[ this.curItem.track1Index][hi]
    // },
    // areaChange(value) {
    //   let hi =  this.curItem.options3.find(ele => {
    //     return value[0] == ele.value
    //   })
    //   this.curItem.track3Item = hi
    //   this.curItem.area_ids = [this.curItem.track1Item.label,  this.curItem.track2Item.label,  this.curItem.track3Item.label]
    //   this.curItem.area_ids_store = [this.curItem.track1Item.value,  this.curItem.track2Item.value,  this.curItem.track3Item.value]
    // },
  },
  watch: {
    // projectInfo: {
    //   handler(val) {
    //     console.log('val', val)
    //     this.itemObj.declare_unit = val.declare_unit
    //     this.itemObj.area_ids = val.area_ids
    //     this.itemObj.area_ids_store = val.area_ids_store
    //     this.itemObj.area_detail = val.area_detail
    //   },
    //   deep: true,
    //   immediate: true
    // }
  }
}
</script>

<style scoped lang="less">
.sketch_form {
  padding: 30px 220px;
  .text_danger {
    position: absolute;
    top: 0;
    right: -120px;
  }
  .flexDate {
    display: flex;
    gap: 20px;
    .resetDateWidth {
      flex: 1;
    }
  }
  .title {
    font-size: 20px;
    font-weight: 500;
    margin: 0 0 20px;
  }
  .img_box {
    display: flex;
    .img_name {
      margin-left: 10px;
      .preview-image {
        border-radius: 6px;
        overflow: hidden;
        width: 100px;
        height: 100px;
        cursor: pointer;
      }
      p {
        text-align: center;
      }
    }
  }
}
</style>
