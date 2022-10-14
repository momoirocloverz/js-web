<template>
  <div class="work_summary_form work_summary_formCon">
    <p class="title">项目实施工作总结</p>
    <el-form class="from_rows" :rules="rules" :model="formData" ref="form">
      <el-form-item label="前言" prop="foreword">
        <el-input v-model="formData.foreword" type="textarea" :rows="5" placeholder="建设主体基本情况、项目来源、项目建设期限、项目建设地点等（1000字以内）" :maxlength="1000" show-word-limit />
      </el-form-item>
      <el-form-item label="一、项目建设计划" prop="build_plan_content">
        <el-input v-model="formData.build_plan_content" type="textarea" :rows="5" placeholder="包括建设内容、投资计划（1000字以内）" :maxlength="1000" show-word-limit />
      </el-form-item>
      <el-form-item label="二、项目预期目标" prop="expected_goal_content">
        <el-input v-model="formData.expected_goal_content" type="textarea" :rows="5" placeholder="1000字以内" :maxlength="1000" show-word-limit />
      </el-form-item>
      <el-form-item label="三、项目建设计划完成情况" prop="build_plan_complete_content">
        <el-input v-model="formData.build_plan_complete_content" type="textarea" :rows="5" placeholder="填写实际数据，与验收申请表数据一致（1000字以内）" :maxlength="1000" show-word-limit />
      </el-form-item>
      <el-form-item label="四、项目建设取得的成效" prop="build_achievement_content">
        <el-input v-model="formData.build_achievement_content" type="textarea" :rows="5" placeholder="1000字以内" :maxlength="1000" show-word-limit />
      </el-form-item>
      <el-form-item label="五、项目存在的问题及以下打算" prop="problem_intend_content">
        <el-input v-model="formData.problem_intend_content" type="textarea" :rows="5" placeholder="1000字以内" :maxlength="1000" show-word-limit />
      </el-form-item>
      <el-form-item label="六、相关附件" prop="attachment">
        <div class="inner">
          <div class="file_uplaod">
            <el-upload
              ref="upload"
              :class="['avatar-uploader', hideUpload || disabled ? 'hide' : '']"
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
              accept=".doc,.docx,.jpg,.jpeg,.png,.pdf"
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
                    <!-- <span class="el-upload-list__item-preview" @click="handlePicturePreview(file)">
                      <i class="el-icon-zoom-in"></i>
                    </span> -->
                    <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </template>
            </el-upload>
          </div>
        </div>
      </el-form-item>
      <el-form-item :style="{ display: 'flex', justifyContent: 'center', marginRight: '80px' }">
        <el-button class="cover_btn" @click="$router.back()">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')" :disabled="disableBtn">提 交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" custom-class="preview_dialog" append-to-body center>
      <img v-show="dialogVisible" width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import OSS from 'ali-oss'
const OSSLINK = 'https://jiangshan-tzyjs-img.zjsszxc.com/'
export default {
  data() {
    return {
      disableBtn: false,
      disableTimer: null,
      fileList: [],
      action: '/web/web/upload/upload_images',
      headers: {},
      dialogVisible: false,
      dialogImageUrl: '',
      disabled: false,
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
      csvIcon: 'https://img.hzanchu.com/acimg/8e0f2b1cd0de448ca444d0af1c3b35eb.png',
      formData: {
        foreword: '',
        build_plan_content: '',
        expected_goal_content: '',
        build_plan_complete_content: '',
        build_achievement_content: '',
        problem_intend_content: '',
        attachment: ''
      },
      rules: {
        foreword: [{ required: true, message: '请输入', trigger: 'blur' }],
        build_plan_content: [{ required: true, message: '请输入', trigger: 'blur' }],
        expected_goal_content: [{ required: true, message: '请输入', trigger: 'blur' }],
        build_plan_complete_content: [{ required: true, message: '请输入', trigger: 'blur' }],
        build_achievement_content: [{ required: true, message: '请输入', trigger: 'blur' }],
        problem_intend_content: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchUploadInfo()
    if (this.$route.query.id) this.getData()
  },
  methods: {
    httpRequest(e) {
      let file = e.file // 文件信息
      if (!file) {
        return false
      }
      let filename = file.name
      let url = `${this.client.path}/${file.name.split('.')[0]}-${file.uid}.${filename.split('.')[filename.split('.').length - 1]}`
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
    handlePicturePreview(file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    getFileList() {
      const uploadFiles = this.$refs.upload.uploadFiles.filter((item) => item.status === 'success')
      this.hideUpload = uploadFiles.length >= 3
      return uploadFiles.map((item) => {
        return item.response ? item.response.url : item.url
      })
    },
    handleChange() {
      this.getFileList()
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
      return part
    },
    handleAvatarSuccess(res, file) {
      file.url = file.response.url
      this.fileList.push(file)
    },
    handleRemove(file, fileList) {
      const index = this.$refs.upload.uploadFiles.findIndex((item) => item === file)
      this.$refs.upload.uploadFiles.splice(index, 1)
      this.fileList.splice(index, 1)
      this.getFileList()
    },
    fetchUploadInfo() {
      this.headers = {
        Authorization: localStorage.getItem('loginToken')
      }
      if (process.env.NODE_ENV === 'development') {
        this.action = '/web/web/upload/upload_images'
      } else {
        this.action = '/web/upload/upload_images'
      }
      this.getOss()
    },
    getData() {
      this.ApiLists.workSummaryDetail({ project_id: this.$route.query.project_id }).then((res) => {
        Object.keys(res.data.info).forEach((key) => {
          Object.keys(this.formData).forEach((keys) => {
            if (key === keys) {
              this.formData[key] = res.data.info[key]
            }
          })
        })
        if (res.data.info.attachment) {
          this.fileList = JSON.parse(res.data.info.attachment)
          if (this.fileList.length == 3) {
            this.hideUpload = true
          }
        }
      })
    },
    onSubmit(formName) {
      this.disableBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitWorkSummary()
        } else {
          this.disableBtn = false
          return false
        }
      })
    },
    submitWorkSummary() {
      const params = {
        save_type: 'submit',
        project_id: this.$route.query.project_id,
        ...this.formData,
        attachment: JSON.stringify(
          this.fileList.map((ele) => {
            return {
              name: ele.name,
              url: ele.url
            }
          })
        )
      }
      this.ApiLists.editWorkSummary(params)
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
    }
  }
}
</script>

<style scoped lang="less">
.inner {
  position: relative;
  margin-top: 40px;
  //   display: flex;
  //   justify-content: flex-start;
}
.work_summary_form {
  padding: 20px 0;
  .title {
    font-size: 20px;
    font-weight: 500;
    margin: 0 0 30px;
    text-indent: 220px;
  }
  .el-form-item {
    border-bottom: 1px solid #f0f0f0;
    padding: 0 220px 30px;
    &:nth-of-type(7),
    &:nth-of-type(8) {
      border: 0;
    }
  }
  .from_rows {
    font-weight: 500;
  }
}
</style>
<style lang="less">
.work_summary_formCon {
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
}
</style>
