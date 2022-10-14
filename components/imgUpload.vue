<template>
  <div class="file_uplaod">
    <el-upload
      ref="upload"
      :class="['avatar-uploader', hideUpload || status > 0 || disabled ? 'hide' : '']"
      action=""
      list-type="picture-card"
      :show-file-list="true"
      :file-list="fileList"
      :on-success="handleAvatarSuccess"
      :before-upload="handleBeforeUpload"
      :on-change="handleChange"
      :headers="headers"
      :multiple="false"
      name="file"
      :accept="accept"
      :http-request="httpRequest"
      :disabled="disabled"
    >
      <i class="el-icon-plus" />
      <template slot="file" v-if="file.status === 'success'" slot-scope="{ file }">
        <div class="upload-file-content">
          <template v-if="file.suffix && ['jpg', 'jpeg', 'png'].includes(file.suffix.toLowerCase())">
            <img class="el-upload-list__item-thumbnail" :src="file.url" />
          </template>
          <template v-else>
            <img class="el-upload-list__item-thumbnail" :src="imgIconFilter(file)" alt="文件图标" />
          </template>
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePicturePreview(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span class="el-upload-list__item-delete" v-if="status == 0" @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </template>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" custom-class="preview_dialog" append-to-body center>
      <img v-if="dialogVisible" width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import OSS from 'ali-oss'
const OSSLINK = 'https://jiangshan-tzyjs-img.zjsszxc.com/'
export default {
  props: {
    limit: {
      // 图片数量限制
      type: Number,
      default: 0
    },
    status: {
      type: Number,
      default: 0
    },
    size: {
      // 上传大小上限MB
      type: Number,
      default: 0
    },
    originList: {
      type: [Array, String], // 单张为String, 多张为Array
      default: ''
    },
    fileId: {
      type: [String, Number], // 单张为Number, 多张为String
      default: ''
    },
    whichType: {
      type: Number || undefined,
      default: 0
    },
    disabled: {
      type: Boolean || undefined,
      default: false
    },
    accept: {
      type: String,
      default: 'image/*'
    }
  },
  data() {
    return {
      action: '/web/web/upload/upload_images',
      headers: {},
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      hideUpload: false,
      client: {},
      docIcon: 'https://img.hzanchu.com/acimg/18b4db2f0a34e503869c5ea5e515f24b.png',
      docxIcon: 'https://img.hzanchu.com/acimg/baf327802e8e5536d75a619da1e41703.png',
      rarIcon: 'https://img.hzanchu.com/acimg/21f96594470ebf4190f90b7a313207f1.png',
      pdfIcon: 'https://img.hzanchu.com/acimg/55b8d7dceaca8e5d8526f32dc8c8d603.png',
      zipIcon: 'https://img.hzanchu.com/acimg/35fc02369154eb26c99f0dac911c850b.png',
      xlsxIcon: 'https://img.hzanchu.com/acimg/2850bd929723576ff53afd3315b5fd40.png',
      xlsIcon: 'https://img.hzanchu.com/acimg/2d28f8877e8b0a3194b4f2fcfcbcfac2.png',
      wpsIcon: 'https://img.hzanchu.com/acimg/744ca05e5f8b341d2199be5c8aa3896b.png',
      csvIcon: 'https://img.hzanchu.com/acimg/8e0f2b1cd0de448ca444d0af1c3b35eb.png'
    }
  },
  mounted() {
    this.headers = {
      Authorization: localStorage.getItem('loginToken')
    }
    if (process.env.NODE_ENV === 'development') {
      this.action = '/web/web/upload/upload_images'
    } else {
      this.action = '/web/upload/upload_images'
    }
    this.getOss()
    if (this.originList && this.originList.length) {
      let originList = this.originList
      if (typeof originList === 'string') {
        this.fileList.push({ url: originList, suffix: originList.split('.')[originList.split('.').length - 1] })
        this.$nextTick(() => {
          this.getFileList()
          this.$emit('handleChange', this.getFileList())
        })
      } else {
        originList.forEach((item, index) => {
          this.fileList.push({
            url: originList[index].src ? originList[index].src : originList[index],
            suffix: originList[index].src ? originList[index].src.split('.')[originList[index].src.split('.').length - 1] : originList[index].split('.')[originList[index].split('.').length - 1]
          })
        })
        this.$nextTick(() => {
          this.getFileList()
          this.$emit('handleChange', this.getFileList())
        })
      }
    }
  },
  watch: {
    originList: {
      handler(newVal = [], oldVal = []) {
        if (newVal.length != oldVal.length && this.whichType) {
          // 普惠政策才走这里的逻辑
          this.fileList = []
          if (typeof newVal === 'string') {
            this.fileList.push({ url: originList })
          } else {
            // let originList = newVal.reverse()
            newVal.forEach((item, index) => {
              item.url = item.src
              // this.fileList.push({ url: item.src, ...item })
            })
            this.fileList = newVal
          }
        }
      },
      deep: true
    }
  },
  methods: {
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

      let url = `${this.client.path}/${file.name.split('.')[0]}-${file.uid}.${filename.split('.')[filename.split('.').length - 1]}`

      //   let url = `${this.client.path}/${file.name.split('.')[0]}-${file.uid}.${file.type.split('/')[1]}`
      this.client
        // .multipartUpload(filename, file)
        .multipartUpload(url, file)
        .then((res) => {
          let newUrl = OSSLINK + res.name
          e.onSuccess({
            url: newUrl
          })
          if (this.whichType > 0) {
            this.handleAddFile({ file, url: newUrl })
          } else {
            this.$emit('handleChange', this.getFileList())
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    handlePicturePreview(file) {
      if (file.suffix && ['jpg', 'jpeg', 'png'].includes(file.suffix)) {
        this.dialogVisible = true
        this.dialogImageUrl = file.url
      } else {
        // 非图片
        window.open(file.url)
      }
    },
    handleAvatarSuccess(res) {
      if (res && res.code === 0) {
        res.data.img_url = 'https://jiangshan-tzyjs-img.zjsszxc.com/' + res.data.img_url
      }
    },
    handleRemove(file) {
      const index = this.$refs.upload.uploadFiles.findIndex((item) => item === file)
      if (this.whichType > 0) {
        this.handleRemoveFile(index)
      } else {
        this.$refs.upload.uploadFiles.splice(index, 1)
        this.handleChange()
      }
    },
    handleChange() {
      this.$emit('handleChange', this.getFileList())
    },
    handleAddFile(file) {
      let params = new FormData()
      params.append('file', file.file, file.file.name)
      params.append('which_type', this.whichType)
      params.append('cl_type', 1)
      params.append('policy_document_id', this.$route.query.policy_document_id)
      params.append('project_id', this.$route.query.project_id)
      params.append('fileOriginName', file.file.name)
      this.ApiLists.projectUploadMaterials(params).then((res) => {
        this.$emit('handleAddFile', this.whichType)
      })
    },
    handleRemoveFile(index) {
      const { id } = this.$refs.upload.uploadFiles[index] || {}
      this.ApiLists.projectRemoveMaterials({ materials_id: id }).then((res) => {
        this.$refs.upload.uploadFiles.splice(index, 1)
        // this.handleChange()
        this.$emit('handleRemoveFile', this.whichType, id)
      })
    },
    getFileList() {
      const uploadFiles = this.$refs.upload.uploadFiles.filter((item) => item.status === 'success')
      this.hideUpload = uploadFiles.length >= this.limit
      return uploadFiles.map((item) => {
        return item.response ? item.response.url : item.url
      })
    },
    handleBeforeUpload(file) {
      if (this.size) {
        const fileSize = file.size / 1024 / 1024
        if (this.size < fileSize) {
          this.$message({ type: 'warning', message: `上传文件限制大小为：${this.size}MB` })
          return false
        }
      }
      if (this.limit) {
        const uploadFiles = this.$refs.upload.uploadFiles
        const length = uploadFiles.length
        if (this.limit < length) {
          this.$message({ type: 'warning', message: `上传文件最大数量为：${this.limit}个` })
          return false
        }
      }
    },
    imgIconFilter(ele) {
      if (!ele.suffix) {
        ele.suffix = ele.name ? ele.name.split('.').pop().toLowerCase() : ''
      }
      let part =
        ele.suffix.toUpperCase() == 'PNG' || ele.suffix.toUpperCase() == 'JPG' || ele.suffix.toUpperCase() == 'JPEG'
          ? ele.src || ele.url
          : ele.suffix.toUpperCase() == 'ZIP'
          ? this.zipIcon
          : ele.suffix.toUpperCase() == 'RAR'
          ? this.rarIcon
          : ele.suffix.toUpperCase() == 'PDF'
          ? this.pdfIcon
          : ele.suffix.toUpperCase() == 'DOC' || ele.suffix.toUpperCase() == 'KSWPS'
          ? this.docIcon
          : ele.suffix.toUpperCase() == 'DOCX' || ele.suffix.toUpperCase() == 'DOCUMENT'
          ? this.docxIcon
          : ele.suffix.toUpperCase() == 'XLSX'
          ? this.xlsxIcon
          : ele.suffix.toUpperCase() == 'XLS'
          ? this.xlsIcon
          : ele.suffix.toUpperCase() == 'CSV'
          ? this.csvIcon
          : ele.suffix.toUpperCase() == 'WPS'
          ? this.wpsIcon
          : ''
      //   console.log('part', part)
      return part
    }
  }
}
</script>

<style lang="less">
.hide .el-upload--picture-card {
  display: none;
}
.file_uplaod {
  .el-upload-list__item,
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
  }
  .el-upload--picture-card {
    line-height: 100px;
    width: 100px;
    height: 100px;
  }
  .el-progress,
  .el-progress-circle {
    width: 80px !important;
    height: 80px !important;
  }
  .upload-file-content {
    width: 100px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .el-upload-list__item {
    transition: none;
  }
}
</style>
