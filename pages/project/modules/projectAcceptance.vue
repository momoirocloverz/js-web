<template>
  <div class="projectAcceptance">
    <div class="el_table_box" v-if="recordData.length">
      <p class="title">操作记录</p>
      <el-table :data="recordData" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="name" label="操作类型" align="center">
          <template slot-scope="scope">
            {{ status[scope.row.action_type] }}
          </template>
        </el-table-column>
        <el-table-column prop="action_username" label="操作人" align="center" />
        <el-table-column prop="created_at" label="操作时间" align="center" />
        <el-table-column prop="action_content" label="备注" align="center" />
      </el-table>
    </div>
    <div class="el_table_box">
      <p class="title">验收材料</p>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="name" label="名称" />
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.id">{{ scope.row.type === 1 ? '未填写' : '未上传' }}</span>
            <img v-else src="https://img.hzanchu.com/acimg/ede9046559cf614c5486464ca99781d4.png" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="toEdit(scope.row, 'form')">{{ scope.row.type === 1 ? '编辑' : '上传' }}</el-button>
            <el-button type="text" @click="toEdit(scope.row, 'table')" v-if="scope.row.id">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="submit">
        <el-button type="primary" @click="submitAll" :disabled="disableBtn">全部提交</el-button>
      </div>
    </div>
    <el-dialog class="uploadDialog" width="630px" :before-close="handleCloseForNew" :visible.sync="addVisible" :close-on-click-modal="false">
      <div class="uploadCon">
        <!-- :action="action" -->
        <!-- action="" -->
        <el-upload
          :headers="headers"
          ref="upload"
          :on-success="successFile"
          :on-error="failedFile"
          action=""
          :show-file-list="true"
          :with-credentials="true"
          :file-list="fileList"
          :auto-upload="false"
          :before-upload="beforeUpload"
          :data="extraParams"
          :limit="40"
          accept=".doc,.docx,.jpg,.jpeg,.png,.pdf,.zip,.rar"
          :on-remove="handleRemoveFile"
          :on-exceed="handleExceed"
          :http-request="httpRequest"
        >
          <!-- :http-request="httpRequest" -->
          <el-button size="small" type="primary" v-if="!fileList.length < 20">点击上传</el-button>
          <div class="el-upload__tip" slot="tip">支持上传文件格式：doc，docx，jpg，jpeg，png，pdf，zip，rar单个文件大小在50M以内。</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="startUpload">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="uploadDialog" title="预览" width="780px" :visible.sync="previewVisible" :close-on-click-modal="false">
      <div class="previewDialogCon">
        <template v-for="(item, index) in filesArray">
          <div :key="index" class="previewCon">
            <div class="previewImg" :style="{ backgroundImage: imgIconFilter(item) }"></div>
            <div class="previewName" :title="item.origin_name">{{ item.origin_name }}</div>
            <i class="el-icon-close delete_btn" @click="removeFile(item, index)"></i>
          </div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OSS from 'ali-oss'
const OSSLINK = 'https://jiangshan-tzyjs-img.zjsszxc.com/'
export default {
  data() {
    return {
      tableData: [
        { name: '局财政支农项目验收申请书', id: 0, type: 1, detailPage: '', apply: 1 },
        { name: '项目实施工作总结（提纲）', id: 0, type: 1, detailPage: '', apply: 2 },
        { name: '完成情况对比表', id: 0, type: 1, detailPage: '', apply: 3 },
        { name: '竣工验收示意图', id: 0, type: 3, detailPage: '', apply: 4, router: '' },
        { name: '实施前后对照图片', id: 0, type: 3, detailPage: '', apply: 5, router: '' },
        { name: '项目审计报告', id: 0, type: 2, which_type: 16 },
        {
          name: '财务凭证复印件（发票除农民工工资外，其余必须为国税或地税等认可的发票；包括工程招投标材料、工程建设合同及工程验收材料、预算决算书、有关票据等；按建设内容分项归类）',
          id: 0,
          type: 2,
          which_type: 17
        },
        { name: '项目其他相关材料', id: 0, type: 2, which_type: 18 }
      ],
      docIcon: 'https://img.hzanchu.com/acimg/18b4db2f0a34e503869c5ea5e515f24b.png',
      docxIcon: 'https://img.hzanchu.com/acimg/baf327802e8e5536d75a619da1e41703.png',
      pdfIcon: 'https://img.hzanchu.com/acimg/55b8d7dceaca8e5d8526f32dc8c8d603.png',
      rarIcon: 'https://img.hzanchu.com/acimg/21f96594470ebf4190f90b7a313207f1.png',
      zipIcon: 'https://img.hzanchu.com/acimg/35fc02369154eb26c99f0dac911c850b.png',
      recordData: [],
      status: {
        1: '材料提交',
        2: '通过',
        3: '驳回'
      },
      addVisible: false,
      previewVisible: false,
      extraParams: {
        project_id: '',
        which_type: ''
      },
      fileList: [],
      filesArray: [],
      headers: {
        Authorization: localStorage.getItem('loginToken')
      },
      action: '/web/web/project_ys/project_ys_upload_materials',
      client: {},
      disableBtn: false,
      disableTimer: null
    }
  },
  created() {
    if (process.env.NODE_ENV === 'development') {
      this.action = '/web/web/project_ys/project_ys_upload_materials'
    } else {
      this.action = '/web/project_ys/project_ys_upload_materials'
    }
    this.getOss()
    this.initData()
    this.getRecordList()
    this.extraParams['project_id'] = this.$route.query.project_id
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
    initData() {
      this.ApiLists.acceptDetail({ project_id: this.$route.query.project_id }).then((res) => {
        this.tableData[0].id = res.data.info.ys_finance_application_id
        this.tableData[1].id = res.data.info.ys_work_summary_id
        this.tableData[2].id = res.data.info.ys_complete_compare_id
        this.tableData[3].id = res.data.info.ys_completed_sketch_id
        this.tableData[4].id = res.data.info.ys_comparison_pic_id
        this.tableData[5].id = res.data.info.ys_audit_report_status
        this.tableData[6].id = res.data.info.ys_financial_status
        this.tableData[7].id = res.data.info.ys_other_materials_status
        this.tableData.forEach((item) => {
          if (item.type === 2) {
            this.initDetail(item)
          }
        })
      })
    },
    initDetail(item) {
      const params = {
        project_id: this.$route.query.project_id,
        which_type: item.which_type
      }
      this.ApiLists.acceptanceWhichDetail(params).then((res) => {
        item.fileList = res.data.list
      })
    },
    submitAll() {
      this.disableBtn = true
      this.ApiLists.acceptanceSubmitAll({ project_id: this.$route.query.project_id })
        .then((res) => {
          if (res && res.code === 0) {
            this.$message.success('提交成功')
            this.getRecordList()
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
    getRecordList() {
      const params = {
        project_id: this.$route.query.project_id,
        record_type: 3
      }
      this.ApiLists.fetchDeclarationRecordList(params).then((res) => {
        this.recordData = res.data.list
      })
    },
    toEdit(item, type) {
      if (item.type === 1) {
        this.$router.push({
          path: '/project/projectAcceptance/projectAcceptance',
          query: {
            id: item.id === 0 ? '' : item.id,
            project_id: this.$route.query.project_id,
            policy_document_id: this.$route.query.policy_document_id,
            active: this.$route.query.active,
            apply: item.apply,
            type: type
          }
        })
      } else if (item.type === 2 && type === 'form') {
        this.extraParams['which_type'] = item.which_type
        this.addVisible = true
        let list = item.fileList?.map((item) => {
          return { id: item.id, url: item.src, name: item.origin_name }
        })
        this.fileList = list
      } else if (item.type === 2 && type === 'table') {
        if (item.fileList.length) {
          this.filesArray = item.fileList
          this.previewVisible = true
        } else {
          this.$message.warning('暂无可查看的文件')
        }
      } else if (item.type === 3 && type === 'form') {
        if (item.apply == 4) {
          this.$router.push({
            path: '/project/projectAcceptance/modules/sketchForm',
            query: {
              id: item.id === 0 ? '' : item.id,
              project_id: this.$route.query.project_id,
              policy_document_id: this.$route.query.policy_document_id,
              active: this.$route.query.active,
              apply: item.apply,
              type: type
            }
          })
        } else {
          this.$router.push({
            path: '/project/projectAcceptance/modules/contrastForm',
            query: {
              id: item.id === 0 ? '' : item.id,
              project_id: this.$route.query.project_id,
              policy_document_id: this.$route.query.policy_document_id,
              active: this.$route.query.active,
              apply: item.apply,
              type: type
            }
          })
        }
      } else if (item.type === 3 && type === 'table') {
        if (item.apply == 4) {
          this.$router.push({
            path: '/project/projectAcceptance/modules/sketchDetail',
            query: {
              id: item.id === 0 ? '' : item.id,
              project_id: this.$route.query.project_id,
              policy_document_id: this.$route.query.policy_document_id,
              active: this.$route.query.active,
              apply: item.apply,
              type: type
            }
          })
        } else {
          this.$router.push({
            path: '/project/projectAcceptance/modules/contrastDetail',
            query: {
              id: item.id === 0 ? '' : item.id,
              project_id: this.$route.query.project_id,
              policy_document_id: this.$route.query.policy_document_id,
              active: this.$route.query.active,
              apply: item.apply,
              type: type
            }
          })
        }
      }
    },
    imgIconFilter(ele) {
      let part =
        ele.suffix.toUpperCase() === 'PNG' || ele.suffix.toUpperCase() === 'JPG' || ele.suffix.toUpperCase() === 'JPEG'
          ? ele.src
          : ele.suffix.toUpperCase() === 'ZIP'
          ? this.zipIcon
          : ele.suffix.toUpperCase() === 'RAR'
          ? this.rarIcon
          : ele.suffix.toUpperCase() === 'PDF'
          ? this.pdfIcon
          : ele.suffix.toUpperCase() === 'DOC'
          ? this.docIcon
          : ele.suffix.toUpperCase() === 'DOCX'
          ? this.docxIcon
          : ''
      let obj = 'url(' + part + ')'
      return obj
    },
    startUpload() {
      this.addVisible = false
      this.$refs.upload.submit()
    },
    handleCloseForNew(done) {
      this.fileList = []
      done()
    },
    removeFile(file, index) {
      this.ApiLists.projectRemoveMaterials({ materials_id: file.id }).then((res) => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.filesArray.splice(index, 1)
          this.initData()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleRemoveFile(file, fileList) {
      if (file.id) {
        this.ApiLists.projectRemoveMaterials({ materials_id: file.id }).then((res) => {
          if (res && res.code == 0) {
            this.$message.success('删除成功')
            setTimeout(() => {
              this.initData()
            }, 500)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
      this.fileList = fileList
      this.$forceUpdate()
    },
    beforeUpload(file) {
      let splitRes = file.name.split('.')
      let fileName = ''
      if (splitRes && splitRes.length) {
        fileName = splitRes[splitRes.length - 1]
        fileName = fileName.toUpperCase()
      }
      const isWord = file.type == 'application/msword' || file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      const isPDF = file.type === 'application/pdf'
      const isZIP = file.type === 'application/zip' || file.type === 'application/x-zip' || file.type === 'application/x-zip-compressed' || file.type === 'multipart/x-zip'
      const isRAR =
        file.type === 'application/x-rar' ||
        file.type === 'application/octet-stream' ||
        file.type === 'application/x-compress' ||
        file.type === 'application/x-compressed' ||
        (fileName && fileName == 'RAR')
      const isLt50M = file.size / 1024 / 1024 < 50
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLegal = isWord || isPDF || isZIP || isRAR || isJPG || isPNG
      if (!isLegal) {
        this.$message.error('请上传doc、docx、pdf、zip、rar、jpeg、png格式')
        return false
      }
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB')
        return false
      }
    },
    failedFile() {
      this.$message.error('文件上传失败')
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
      this.client
        .multipartUpload(url, file)
        .then((res) => {
          let newUrl = OSSLINK + res.name
          var newParams = {
            fileOriginName: filename,
            fileUrl: newUrl,
            which_type: String(this.extraParams.which_type),
            project_id: this.$route.query.project_id
          }
          this.ApiLists.projectYSUploadMaterialsZLB(newParams)
            .then((res) => {
              if (res && res.code == 0) {
                this.showVideoMask = false
                this.initData()
              }
            })
            .catch((err) => {
              console.log('err', err)
            })
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    successFile(res, file) {
      if (res && res.code == 0) {
        this.showVideoMask = false
        this.initData()
      } else {
        this.$message.error(res.msg)
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多上传40个文件')
    }
  }
}
</script>

<style scoped lang="less">
.el_table_box {
  &:nth-of-type(2) {
    margin-top: 90px;
  }
  .title {
    font-size: 20px;
    font-weight: 600;
    margin: 30px 0;
  }
  img {
    width: 28px;
    height: 28px;
  }
  .submit {
    margin-top: 30px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 40px;
    span {
      color: #0270c3;
    }
  }
}
.previewName {
  z-index: 100;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  overflow: hidden;
  width: 120px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.previewDialogCon {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  .previewCon {
    position: relative;
    .previewImg {
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      width: 120px;
      height: 160px;
    }
    .delete_btn {
      position: absolute;
      top: -10px;
      right: -10px;
      background: red;
      color: #fff;
      width: 26px;
      height: 26px;
      text-align: center;
      font-size: 24px;
      line-height: 26px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
