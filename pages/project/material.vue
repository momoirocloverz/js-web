<template>
  <div class="projectPageCon projectMaterialPageCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toProject">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item class="withCursor" @click.native="toMyProject">我的申报</el-breadcrumb-item>
          <el-breadcrumb-item>申报材料</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon">
        <helpCom class="setHelpPosition" :name="currentInfo.linkman && currentInfo.linkman.real_name" :phone="currentInfo.linkman && currentInfo.linkman.mobile" />
        <!--        <el-tabs v-model="activeName" @tab-click="handleClick">-->
        <!--          <el-tab-pane label="项目申报" name="first"></el-tab-pane>-->
        <!--          <el-tab-pane label="项目实施" disabled name="second"></el-tab-pane>-->
        <!--          <el-tab-pane label="项目验收" disabled name="third"></el-tab-pane>-->
        <!--        </el-tabs>-->
        <div class="tableCon" v-if="activeName == 'first'">
          <div class="tableFirstCon">
            <div class="select-area">
              <span>申报地区：</span>
              <el-cascader
                :style="{ width: '200px' }"
                v-model="areaId"
                :disabled="projectStatus != 0 && $route.query.project_id > 0"
                size="small"
                :options="areaList"
                @change="onAddressChange"
                :props="{
                  label: 'name',
                  value: 'id'
                }"
              />
              <!-- <el-button 
														size="small" 
														type="primary" 
														style="margin-left:20px;" 
														@click="onAddressChange(areaId)"
													> 确 定 </el-button> -->
            </div>
            <div class="reserveCon">
              <i class="del-btn el-icon-circle-close" v-if="preserveName" @click="cancelProjectReserve()"></i>
              <el-button @click="popPreserve" v-if="reserveOptions && reserveOptions.length" :type="preserveName ? 'plain' : 'primary'">{{
                preserveName ? '已关联储备项目:' + preserveName : '关联储备项目'
              }}</el-button>
              <el-button class="checkSource" @click="goToSource" plain>查看相关政策文件</el-button>
            </div>
          </div>
          <div class="tableOuter">
            <el-table class="basic-table" :data="basicTable" v-loading="loading">
              <el-table-column width="80" label="序号" type="index"></el-table-column>
              <el-table-column label="名称" width="400" align="center" prop="title"></el-table-column>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.status">
                    <img class="statusDoneImg" v-if="scope.row.status == '1'" src="https://img.hzanchu.com/acimg/ede9046559cf614c5486464ca99781d4.png" />
                    <div v-else>{{ scope.row.status }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div class="operateMasterCon">
                    <div v-if="scope.row.operate && scope.row.operate.length" class="operateCon">
                      <!-- <div class="fakeBtn" v-if="scope.row.operate[0] && projectStatus != 40" :style="{ background: $route.query.project_id ? '#0270c3' : '#ccc' }" @click="typeAction(scope.row)">
                        {{ scope.row.operate[0].type }}
                      </div> -->
                      <el-button
                        type="primary"
                        class="fakeCopyBtn"
                        v-if="scope.row.operate[0] && projectStatus != 40"
                        @click="typeAction(scope.row)"
                        :disabled="complicateAble() || !$route.query.project_id"
                      >
                        {{ scope.row.operate[0].type }}
                      </el-button>
                      <div
                        class="fakeBtn"
                        v-if="scope.row.operate[1] && scope.row.status == '1'"
                        :style="{ background: $route.query.project_id ? '#0270c3' : '#ccc' }"
                        @click="previewAction(scope.row)"
                      >
                        {{ scope.row.operate[1].type }}
                      </div>
                    </div>
                    <div class="markAlert" v-if="scope.row.special">项目有变更</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="submitMaster">
            <!-- <div class="coverBtn" @click="submitAll()" :style="{ background: $route.query.project_id ? '#0270c3' : '#ccc' }" >全部提交</div> -->
            <el-button type="primary" class="coverBtn" @click="submitAll()" :disabled="!$route.query.project_id || disableBtn">全部提交</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="uploadDialog" title="上传" width="630px" :before-close="handleCloseForNew" :visible.sync="addVisible" :close-on-click-modal="false">
      <div class="uploadCon">
        <!-- :action="action" -->
        <!-- action="" -->
        <el-upload
          action=""
          multiple
          :headers="headers"
          ref="upload"
          :on-success="successFile"
          :on-error="failedFile"
          :with-credentials="true"
          :file-list="fileList"
          :auto-upload="false"
          accept=".doc,.docx,.jpg,.jpeg,.png,.pdf,.XLS,.XLSX,.csv,.wps,.zip,.rar"
          :before-upload="beforeUpload"
          :data="extraParams"
          :on-preview="handlePictureCardPreview"
          :limit="40"
          :on-progress="uploadVideoProcess"
          :on-change="handleChange"
          :on-remove="handleRemoveFile"
          :on-exceed="handleExceed"
          :http-request="httpRequest"
        >
          <!-- :http-request="httpRequest" -->
          <el-button size="small" class="resetBtnColor" type="primary" v-if="!fileList.length < 20">点击上传</el-button>
          <div class="el-upload__tip" slot="tip">支持上传文件格式：doc，docx，jpg，jpeg，png，pdf，xls，xlsx，csv，wps，zip，rar单个文件大小在50M以内。</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shutDialog">取 消</el-button>
        <el-button type="primary" @click="startUpload" class="resetBtnColor">确 定</el-button>
      </span>
    </el-dialog>
    <div class="video1Mask" v-if="deleteMask" v-loading="deleteMask" element-loading-text="处理中，请耐心等待" element-loading-spinner="el-icon-loading"></div>
    <el-dialog class="uploadDialog" title="预览" width="780px" :before-close="handleCloseForPreview" :visible.sync="previewVisible" :close-on-click-modal="false">
      <div class="previewDialogCon">
        <template v-for="(item, index) in filesArray">
          <div :key="index" class="previewCon" @click="checkDetail(item, filesArray)">
            <div
              class="previewImg"
              :style="{
                backgroundImage: imgIconFilter(item)
              }"
            ></div>
            <div class="previewName">
              <span>{{ item.origin_name }}</span>
            </div>
            <div class="deleteBtn" v-if="projectStatus != 40" @click.stop="deleteAction(item, index)">删除</div>
          </div>
        </template>
      </div>
    </el-dialog>
    <viewer :images="images" :options="options" @inited="inited" class="viewerCus" ref="viewer" v-show="false">
      <img v-for="(src, index) in images" :src="src" :key="index" />
    </viewer>
    <div class="videoMask" v-if="showVideoMask" v-loading="showVideoMask" element-loading-text="文件上传中，请耐心等待" element-loading-spinner="el-icon-loading"></div>
    <el-dialog class="preserveDialog" title="关联项目储备" width="500px" :visible.sync="preserveVisible" :close-on-click-modal="false">
      <!-- clearable -->
      <el-select v-model="reserveValue" placeholder="关联储备项目" class="selectCon" @change="selectChange(reserveValue)">
        <el-option v-for="item in reserveOptions" :key="item.id" :label="item.project_name" :value="item.id"> </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmPreserve" class="resetBtnColor">确定</el-button>
        <el-button @click="preserveVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" width="600px">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import OSS from 'ali-oss'
const OSSLINK = 'https://jiangshan-tzyjs-img.zjsszxc.com/'
export default {
  layout: 'main',
  head() {
    return {
      title: '项目申报材料',
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: '江山农业项目投资一件事'
        },
        {
          hid: 'description',
          name: 'description',
          content: '江山农业项目投资一件事'
        }
      ]
    }
  },
  data() {
    return {
      disableBtn: false,
      disableTimer: null,
      preserveVisible: false,
      addressVisible: true,
      fileNameDynamic: '',
      loading: false,
      projectStatus: 1,
      showVideoMask: false,
      options: {
        initialViewIndex: 0
      },
      images: [],
      filesArray: [],
      basicTable: [],
      activeName: 'first',
      currentInfo: {},
      addVisible: false,
      previewVisible: false,
      headers: {},
      action: '/web/web/project/project_upload_materials',
      fileList: [],
      extraParams: {
        policy_document_id: this.$route.query.policy_document_id,
        which_type: ''
      },
      project_id: '',
      areaList: [],
      areaId: [],
      god: [],
      godFlag: 0,
      areaName: [],
      progressInfo: {},
      docIcon: 'https://img.hzanchu.com/acimg/18b4db2f0a34e503869c5ea5e515f24b.png',
      docxIcon: 'https://img.hzanchu.com/acimg/baf327802e8e5536d75a619da1e41703.png',
      rarIcon: 'https://img.hzanchu.com/acimg/21f96594470ebf4190f90b7a313207f1.png',
      pdfIcon: 'https://img.hzanchu.com/acimg/55b8d7dceaca8e5d8526f32dc8c8d603.png',
      zipIcon: 'https://img.hzanchu.com/acimg/35fc02369154eb26c99f0dac911c850b.png',
      xlsxIcon: 'https://img.hzanchu.com/acimg/2850bd929723576ff53afd3315b5fd40.png',
      xlsIcon: 'https://img.hzanchu.com/acimg/2d28f8877e8b0a3194b4f2fcfcbcfac2.png',
      wpsIcon: 'https://img.hzanchu.com/acimg/744ca05e5f8b341d2199be5c8aa3896b.png',
      csvIcon: 'https://img.hzanchu.com/acimg/8e0f2b1cd0de448ca444d0af1c3b35eb.png',
      reserveOptions: [],
      reserveValue: '',
      dialogImageUrl: '',
      dialogVisible: false,
      client: {},
      paramForPreserve: {},
      preserveName: '',
      deleteMask: false
    }
  },
  mounted() {
    if (!this.$route.query.project_id) this.addressVisible = true
    if (process.env.NODE_ENV === 'development') {
      this.action = '/web/web/project/project_upload_materials'
    } else {
      this.action = '/web/project/project_upload_materials'
    }
    this.getOss()
    this.getAreaList()
    this.initAction()
    this.getReserveList()
  },
  methods: {
    handlePictureCardPreview(file) {
      let after = file.name.split('.')
      let type = after[after.length - 1]
      let isPIC = type.toUpperCase() == 'PNG' || type.toUpperCase() == 'JPG' || type.toUpperCase() == 'JPEG'
      if (isPIC) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      } else {
        window.open(file.url)
      }
    },
    popPreserve() {
      this.preserveVisible = true
    },
    setPreserve() {
      this.ApiLists.changeProjectReserveSyncForm({
        project_id: this.$route.query.project_id,
        project_reserve_id: this.reserveValue || 0
      })
        .then((res) => {
          if (res && res.code === 0) {
            this.basicTable = []
            if (this.progressInfo.project_reserve_id == this.reserveValue) {
              this.initRequest()
            } else {
              this.initRequest('redmark')
            }
            this.preserveVisible = false
            // let data = {
            //   project_id: this.$route.query.project_id
            // }
            // this.ApiLists.fetchProjectSchedule(data)
            //   .then((res) => {
            //     if (res && res.code == 0) {
            //       if (res.data.info) {
            //         this.projectStatus = res.data.info.status
            //         this.progressInfo = res.data.info
            //         console.log(this.progressInfo.project_reserve_id)
            //       }
            //     }
            //   })
            //   .catch((err) => {
            //     console.log('err', err)
            //   })
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    confirmPreserve() {
      if (this.$route.query.project_id) {
        // this.preserveVisible = false
        // this.setPreserve()
        let track = this.reserveOptions.find((ele) => {
          return ele.id == this.reserveValue
        })
        if (track) {
          this.$confirm(`此操作将更换储备项目为“${this.preserveName}”, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.preserveName = track.project_name
              this.setPreserve()
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        }
      } else {
        this.$message.error('请先选择申报地区')
      }
    },
    selectChange(val) {
      console.log('val', val)
      if (val) {
        // this.ApiLists.projectReserveDetail({ id: val })
        //   .then((res) => {
        //     let shorter = res.data.info
        //     const params = {
        //       project_id: this.$route.query.project_id || null,
        //       policy_document_id: this.$route.query.policy_document_id || null,
        //       city_id: shorter.city_id,
        //       town_id: shorter.town_id,
        //       village_id: shorter.village_id
        //     }
        //     this.paramForPreserve = params
        //   })
        //   .catch((err) => {
        //     console.log('err', err)
        //   })
      }
    },
    getReserveList() {
      let params = {
        search_project_name: '',
        page: 1,
        search_status: 2,
        pagesize: 999999
      }
      this.ApiLists.fetchProjectReserveList(params)
        .then((res) => {
          if (res && res.code == 0) {
            this.reserveOptions = res.data.data
            this.initRequest()
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    toProject() {
      this.$router.push({
        path: '/project'
      })
    },
    toMyProject() {
      this.$router.push({
        path: '/project'
      })
    },
    uploadVideoProcess(event, file, fileList) {
      this.showVideoMask = true
    },
    checkDetail(ele, array) {
      if (ele.suffix.toUpperCase() == 'PNG' || ele.suffix.toUpperCase() == 'JPG' || ele.suffix.toUpperCase() == 'JPEG') {
        let newArray = array.filter((ele) => {
          return ele.suffix.toUpperCase() == 'PNG' || ele.suffix.toUpperCase() == 'JPG' || ele.suffix.toUpperCase() == 'JPEG'
        })
        let index = newArray.findIndex((sub) => {
          return ele.src == sub.src
        })
        this.images = newArray.map((ele) => {
          return ele.src
        })
        this.options.initialViewIndex = index
        setTimeout(() => {
          this.$viewer.show()
        }, 400)
      }
    },
    inited(viewer) {
      this.$viewer = viewer
    },
    imgIconFilter(ele) {
      let part =
        ele.suffix.toUpperCase() == 'PNG' || ele.suffix.toUpperCase() == 'JPG' || ele.suffix.toUpperCase() == 'JPEG'
          ? ele.src
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
      let obj = 'url(' + part + ')'
      return obj
    },
    handleCloseForPreview() {
      this.previewVisible = false
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    onAddressChange(e) {
      if (!e || e.length === 0) {
        this.$message.error('请选择地址')
        return
      }
      const params = {
        project_id: this.$route.query.project_id || null,
        policy_document_id: this.$route.query.policy_document_id || null,
        city_id: e[0],
        town_id: e[1],
        village_id: e[2]
      }
      this.ApiLists.setPorjectArea(params).then((res) => {
        if (res && res.code === 0) {
          this.$router.replace({
            path: '/project/material',
            query: {
              project_id: res.data.project_id,
              policy_document_id: this.$route.query.policy_document_id
            }
          })
          this.addressVisible = false
          this.afterCreateProject(res.data.project_id)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    afterCreateProject(e) {
      this.ApiLists.fetchProjectSchedule({ project_id: e }).then((res) => {
        if (res && res.code == 0) {
          if (res.data.info) {
            this.projectStatus = res.data.info.status
            this.areaId = res.data.info.area_ids_store ? JSON.parse(res.data.info.area_ids_store) : []
            this.progressInfo = res.data.info
            this.reserveValue = this.progressInfo.project_reserve_id || ''
            // this.progressInfo.project_reserve_id

            let track = this.reserveOptions.find((ele) => {
              return ele.id == this.progressInfo.project_reserve_id
            })
            console.log(track)
            if (track) {
              console.log(track.project_name)
              this.preserveName = track.project_name
            }
          }
        } else {
          this.$message.error(res.msg)
        }
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
    getAreaList() {
      this.ApiLists.getAreaList().then((res) => {
        if (res && res.code === 0) {
          res.data.list[0].children.forEach((ele) => {
            ele.children = [{ id: 0, name: '本级', town_id: 0 }, ...ele.children]
          })
          this.areaList = res.data.list
        }
      })
    },
    shutDialog() {
      this.addVisible = false
      this.fileList = []
    },
    handleChange(file, fileList) {
      console.log('handleChange', file, fileList)
      //   this.extraParams = {
      //     policy_document_id: this.$route.query.id,
      //     which_type: 4
      //   };
      //   this.fileList = fileList.slice(-3);
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
      // return console.log(filename, url)
      // console.log('file', file)
      this.client
        // .multipartUpload(filename, file)
        .multipartUpload(url, file)
        .then((res) => {
          let newUrl = OSSLINK + res.name
          // console.log('newUrl', newUrl)
          var newParams = {
            fileOriginName: filename,
            fileUrl: newUrl,
            which_type: String(this.extraParams.which_type),
            policy_document_id: this.$route.query.policy_document_id,
            project_id: this.$route.query.project_id
          }
          this.ApiLists.projectUploadMaterialsZLB(newParams)
            .then((res) => {
              if (res && res.code == 0) {
                this.god.splice(0, 1)
                this.showVideoMask = false
                if (this.god.length === 0) {
                  this.basicTable = []
                  this.initRequest()
                }
                if (!this.$route.query.project_id) {
                  this.extraParams.project_id = res.data.project_id
                  this.$router.replace({
                    path: '/project/material',
                    query: {
                      project_id: res.data.project_id,
                      policy_document_id: this.$route.query.policy_document_id
                    }
                  })
                }
              } else {
                this.$message.error(res.msg)
                setTimeout(() => {
                  this.showVideoMask = false
                }, 400)
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
    startUpload() {
      this.addVisible = false
      this.$refs.upload.submit()
    },
    handleCloseForNew(done) {
      this.fileList = []
      done()
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多上传40个文件')
    },
    deleteAction(item, index) {
      if (item.id) {
        if (!this.deleteMask) {
          this.deleteMask = true
          let data = {
            materials_id: item.id
          }
          this.ApiLists.projectRemoveMaterials(data)
            .then((res) => {
              if (res && res.code == 0) {
                this.$message.success('删除成功')
                this.filesArray.splice(index, 1)
                // setTimeout(() => {
                this.basicTable = []
                this.initRequest()
                // }, 500);
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch((err) => {
              console.log('err', err)
            })
            .finally((ele) => {
              this.deleteMask = false
            })
        }
      }
    },
    handleRemoveFile(file, fileList) {
      if (file.id) {
        let data = {
          materials_id: file.id
        }
        this.ApiLists.projectRemoveMaterials(data)
          .then((res) => {
            if (res && res.code == 0) {
              this.$message.success('删除成功')
              // setTimeout(() => {
              this.basicTable = []
              this.initRequest()
              // }, 500);
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
      this.fileList = fileList
      this.$forceUpdate()
    },
    beforeUpload(file) {
      // console.log('beforeUpload', file)
      let splitRes = file.name.split('.')
      let fileName = ''
      if (splitRes && splitRes.length) {
        fileName = splitRes[splitRes.length - 1]
        fileName = fileName.toUpperCase()
      }
      const isLt50M = file.size / 1024 / 1024 < 50
      const isWord = file.type == 'application/msword' || file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      const isPDF = file.type === 'application/pdf'
      const isZIP = file.type === 'application/zip' || file.type === 'application/x-zip' || file.type === 'application/x-zip-compressed' || file.type === 'multipart/x-zip'
      const isRAR =
        file.type === 'application/x-rar' ||
        file.type === 'application/octet-stream' ||
        file.type === 'application/x-compress' ||
        file.type === 'application/x-compressed' ||
        (fileName && fileName == 'RAR')
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isExcel = ['application/vnd.ms-excel', '.csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)
      const isWps = file.type === 'application/kswps'
      const isLegal = isWord || isPDF || isZIP || isRAR || isJPG || isPNG || isExcel || isWps
      //   if (!isLegal) {
      //     this.$message.error('请上传doc，docx，jpg，jpeg，png，pdf，xls，xlsx，csv，wps，zip，rar格式')
      //     return false
      //   }
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB')
        return false
      }
      this.god.push(file)
    },
    failedFile() {
      this.$message.error('文件上传失败')
      setTimeout(() => {
        this.showVideoMask = false
      }, 400)
    },
    successFile(res, file) {
      if (res && res.code == 0) {
        this.god.splice(0, 1)
        this.showVideoMask = false
        if (this.god.length === 0) {
          this.basicTable = []
          this.initRequest()
        }
        if (!this.$route.query.project_id) {
          this.extraParams.project_id = res.data.project_id
          this.$router.replace({
            path: '/project/material',
            query: {
              project_id: res.data.project_id,
              policy_document_id: this.$route.query.policy_document_id
            }
          })
        }
      } else {
        this.$message.error(res.msg)
        setTimeout(() => {
          this.showVideoMask = false
        }, 400)
      }
    },
    previewAction(row) {
      switch (row.index) {
        case '1':
          //jump
          this.$router.push({
            path: '/project/projectRePreview',
            query: {
              project_id: this.$route.query.project_id,
              policy_document_id: this.$route.query.policy_document_id
            }
          })
          break
        case '2':
          this.$router.push({
            path: '/project/implePlanPreview',
            query: {
              project_id: this.$route.query.project_id,
              policy_document_id: this.$route.query.policy_document_id
            }
          })
          //jump
          break
        case '3':
          this.extraParams.which_type = 3
          if (this.$route.query.project_id) {
            this.extraParams.project_id = this.$route.query.project_id
          }
          this.fileNameDynamic = '营业执照'
          if (row.files) {
            this.filesArray = row.files
          }
          this.previewVisible = true
          break
        case '4':
          this.extraParams.which_type = 4
          if (this.$route.query.project_id) {
            this.extraParams.project_id = this.$route.query.project_id
          }
          this.fileNameDynamic = '流转协议'
          if (row.files) {
            this.filesArray = row.files
          }
          this.previewVisible = true
          break
        case '5':
          this.$router.push({
            path: '/project/projectEquiPreview',
            query: {
              project_id: this.$route.query.project_id,
              policy_document_id: this.$route.query.policy_document_id
            }
          })
          //jump
          break
        case '6':
          this.extraParams.which_type = 6
          if (this.$route.query.project_id) {
            this.extraParams.project_id = this.$route.query.project_id
          }
          this.fileNameDynamic = '佐证材料'
          if (row.files) {
            this.filesArray = row.files
          }
          this.previewVisible = true
          break
        case '7':
          this.extraParams.which_type = 7
          if (this.$route.query.project_id) {
            this.extraParams.project_id = this.$route.query.project_id
          }
          this.fileNameDynamic = '其他材料'
          if (row.files) {
            this.filesArray = row.files
          }
          this.previewVisible = true
          break
        case '8':
          this.extraParams.which_type = 8
          if (this.$route.query.project_id) {
            this.extraParams.project_id = this.$route.query.project_id
          }
          this.fileNameDynamic = '农用地备案'
          if (row.files) {
            this.filesArray = row.files
          }
          this.previewVisible = true
          break
        case '9':
          this.extraParams.which_type = 9
          if (this.$route.query.project_id) {
            this.extraParams.project_id = this.$route.query.project_id
          }
          this.fileNameDynamic = '近二年各级财政资金扶持情况'
          if (row.files) {
            this.filesArray = row.files
          }
          this.previewVisible = true
          break
        case '10':
          this.extraParams.which_type = 10
          if (this.$route.query.project_id) {
            this.extraParams.project_id = this.$route.query.project_id
          }
          this.fileNameDynamic = '布置示意图及区域现状照片'
          if (row.files) {
            this.filesArray = row.files
          }
          this.previewVisible = true
          break
      }
    },
    typeAction(row) {
      this.fileList = []
      if (!this.areaId || this.areaId.length === 0) {
        this.$message.error('请先选择申报地区')
        return
      }
      if (+row.index === 1 || +row.index === 2 || +row.index === 5) {
        this.$router.push({
          path: +row.index === 1 ? '/project/projectReport' : +row.index === 2 ? '/project/implementationPlan' : '/project/projectEquipment',
          query: {
            project_id: this.$route.query.project_id,
            policy_document_id: this.$route.query.policy_document_id,
            address: encodeURIComponent(this.progressInfo.area_ids),
            project_reserve_id: this.progressInfo.project_reserve_id,
            is_declaration_reserve_change: this.progressInfo.is_declaration_reserve_change,
            is_implement_plan_reserve_change: this.progressInfo.is_implement_plan_reserve_change
          }
        })
      } else {
        // 3, 4, 6, 7, 8

        this.extraParams.which_type = +row.index

        if (row.index == 7) {
          this.extraParams.which_type = 10
        }

        if (row.index == 10) {
          this.extraParams.which_type = 7
        }

        if (this.$route.query.project_id) {
          this.extraParams.project_id = this.$route.query.project_id
        }
        var source = this.basicTable.find((ele) => {
          return ele.index === row.index
        })
        if (source.files) {
          let bridge = source.files.map((ele) => {
            return {
              id: ele.id,
              url: ele.src,
              name: ele.origin_name
            }
          })
          this.fileList = bridge
        }
        this.addVisible = true
      }
      // switch (row.index) {
      //   case "1":
      //     this.$router.push({
      //       path: "/project/projectReport",
      //       query: {
      //         project_id: this.$route.query.project_id,
      //         policy_document_id: this.$route.query.policy_document_id
      //       }
      //     });
      //     break;
      //   case "2":
      //     this.$router.push({
      //       path: "/project/implementationPlan",
      //       query: {
      //         project_id: this.$route.query.project_id,
      //         policy_document_id: this.$route.query.policy_document_id,
      //         address: encodeURIComponent(this.progressInfo.area_ids)
      //       }
      //     });
      //     //jump
      //     break;
      //   case "3":
      //     this.extraParams.which_type = 3;
      //     if (this.$route.query.project_id) {
      //       this.extraParams.project_id = this.$route.query.project_id;
      //     }
      //     //   console.log(  this.basicTable  )
      //     var source = this.basicTable.find(ele => {
      //       return ele.index == "3";
      //     });
      //     if (source.files) {
      //       let bridge = source.files.map(ele => {
      //         return {
      //           id: ele.id,
      //           url: ele.src,
      //           name: ele.origin_name
      //         };
      //       });
      //       this.fileList = bridge;
      //     }
      //     this.addVisible = true;
      //     break;
      //   case "4":
      //     this.extraParams.which_type = 4;
      //     if (this.$route.query.project_id) {
      //       this.extraParams.project_id = this.$route.query.project_id;
      //     }
      //     var source = this.basicTable.find(ele => {
      //       return ele.index == "4";
      //     });
      //     if (source.files) {
      //       let bridge = source.files.map(ele => {
      //         return {
      //           id: ele.id,
      //           url: ele.src,
      //           name: ele.origin_name
      //         };
      //       });
      //       this.fileList = bridge;
      //     }
      //     this.addVisible = true;
      //     break;
      //   case "5":
      //     this.$router.push({
      //       path: "/project/projectEquipment",
      //       query: {
      //         project_id: this.$route.query.project_id,
      //         policy_document_id: this.$route.query.policy_document_id
      //       }
      //     });
      //     //jump
      //     break;
      //   case "6":
      //     this.extraParams.which_type = 6;
      //     if (this.$route.query.project_id) {
      //       this.extraParams.project_id = this.$route.query.project_id;
      //     }
      //     var source = this.basicTable.find(ele => {
      //       return ele.index == "6";
      //     });
      //     if (source.files) {
      //       let bridge = source.files.map(ele => {
      //         return {
      //           id: ele.id,
      //           url: ele.src,
      //           name: ele.origin_name
      //         };
      //       });
      //       this.fileList = bridge;
      //     }
      //     this.addVisible = true;
      //     break;
      //   case "7":
      //     this.extraParams.which_type = 7;
      //     if (this.$route.query.project_id) {
      //       this.extraParams.project_id = this.$route.query.project_id;
      //     }
      //     var source = this.basicTable.find(ele => {
      //       return ele.index == "7";
      //     });
      //     if (source.files) {
      //       let bridge = source.files.map(ele => {
      //         return {
      //           id: ele.id,
      //           url: ele.src,
      //           name: ele.origin_name
      //         };
      //       });
      //       this.fileList = bridge;
      //     }
      //     this.addVisible = true;
      //     break;
      //   case "8":
      //     this.extraParams.which_type = 8;
      //     if (this.$route.query.project_id) {
      //       this.extraParams.project_id = this.$route.query.project_id;
      //     }
      //     var source = this.basicTable.find(ele => {
      //       return ele.index == "8";
      //     });
      //     if (source.files) {
      //       let bridge = source.files.map(ele => {
      //         return {
      //           id: ele.id,
      //           url: ele.src,
      //           name: ele.origin_name
      //         };
      //       });
      //       this.fileList = bridge;
      //     }
      //     this.addVisible = true;
      //     break;
      // }
    },
    goToSource() {
      const { href } = this.$router.resolve({
        path: '/policy/detail',
        query: {
          id: this.$route.query.policy_document_id
        }
      })
      window.open(href, '_blank')
    },
    submitAll() {
      if (this.projectStatus === 0) {
        this.$confirm('请确认项目建设所在地区，提交后将不可修改！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitAction()
        })
      } else if (this.projectStatus !== 0 && this.projectStatus !== 40) {
        this.submitAction()
      }
    },
    submitAction() {
      if (this.$route.query.project_id) {
        this.disableBtn = true
        let data = {
          project_id: this.$route.query.project_id
        }
        this.ApiLists.submitProjectAction(data)
          .then((res) => {
            if (res && res.code == 0) {
              this.$message.success('提交成功')
              this.$router.replace({
                path: '/project/progress',
                query: {
                  project_id: this.$route.query.project_id,
                  policy_document_id: this.$route.query.policy_document_id
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
          .finally(() => {
            this.disableTimer = setTimeout(() => {
              this.disableBtn = false
              clearTimeout(this.disableTimer)
            }, 5000)
          })
      } else {
        this.$message.error('请上传相关资料')
      }
    },
    initAction() {
      this.$store.commit('changeMenuActive', '3')
      this.headers = {
        Authorization: localStorage.getItem('loginToken')
      }
    },
    complicateAble() {
      if (this.progressInfo.is_draft) {
        if (this.currentInfo && this.currentInfo.project_can_apply != 1) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    initRequest(redmark) {
      this.basicTable = []
      console.log('this.$route.query.project_id', this.$route.query.project_id)
      if (this.$route.query.project_id) {
        let data = {
          project_id: this.$route.query.project_id
        }
        this.loading = true
        this.ApiLists.fetchProjectSchedule(data)
          .then((res) => {
            if (res && res.code == 0) {
              if (res.data.info) {
                this.projectStatus = res.data.info.status
                this.areaId = res.data.info.area_ids_store ? JSON.parse(res.data.info.area_ids_store) : []
                this.progressInfo = res.data.info
                this.reserveValue = this.progressInfo.project_reserve_id || ''

                let track = this.reserveOptions.find((ele) => {
                  return ele.id == this.progressInfo.project_reserve_id
                })
                // console.log(track)
                if (track) {
                  console.log(track.project_name)
                  this.preserveName = track.project_name
                }

                this.ApiLists.fetchPolicyDocumentInfo({ id: this.$route.query.policy_document_id })
                  .then((res) => {
                    if (res && res.code === 0) {
                      // console.log(this.progressInfo.declaration_id)
                      this.currentInfo = res.data
                      if (this.currentInfo.is_declaration == 2) {
                        if (this.$route.query.project_id) {
                          this.ApiLists.fetchProjectDeclarationDetail({
                            project_id: this.$route.query.project_id
                          }).then((res) => {
                            if (res && res.code == 0) {
                              this.basicTable.push({
                                index: '1',
                                title: '项目申报书',
                                status: this.progressInfo.declaration_id > 0 ? '1' : '未填写',
                                special: redmark ? '1' : undefined,
                                operate: [
                                  {
                                    type: ' 编 辑 '
                                  },
                                  {
                                    type: ' 查 看 '
                                  }
                                ]
                              })
                            } else {
                              this.$message.error(res.msg)
                            }
                          })
                        } else {
                          this.basicTable.push({
                            index: '1',
                            title: '项目申报书',
                            status: '未填写',
                            special: redmark ? '1' : undefined,
                            operate: [
                              {
                                type: ' 编 辑 '
                              },
                              {
                                type: ' 查 看 '
                              }
                            ]
                          })
                        }
                      }
                      if (this.currentInfo.is_scheme == 2) {
                        if (this.$route.query.project_id) {
                          this.ApiLists.fetchProjectImplementPlanDetail({
                            project_id: this.$route.query.project_id
                          }).then((res) => {
                            if (res && res.code == 0) {
                              this.basicTable.push({
                                index: '2',
                                title: '项目实施方案简表',
                                special: redmark ? '1' : undefined,
                                status: this.progressInfo.implement_plan_id > 0 ? '1' : '未填写',
                                operate: [
                                  {
                                    type: ' 编 辑 '
                                  },
                                  {
                                    type: ' 查 看 '
                                  }
                                ]
                              })
                            } else {
                              this.$message.error(res.msg)
                            }
                          })
                        } else {
                          this.basicTable.push({
                            index: '2',
                            title: '项目实施方案简表',
                            special: redmark ? '1' : undefined,
                            status: '未填写',
                            operate: [
                              {
                                type: ' 编 辑 '
                              },
                              {
                                type: ' 查 看 '
                              }
                            ]
                          })
                        }
                      }
                      if (this.currentInfo.is_business_license == 2) {
                        if (this.$route.query.project_id) {
                          this.ApiLists.fetchProjectMaterialsDetail({
                            project_id: this.$route.query.project_id,
                            which_type: 3
                          }).then((res) => {
                            if (res && res.code == 0) {
                              this.basicTable.push({
                                index: '3',
                                title: '营业执照复印件',
                                status: res.data.list.length ? '1' : '未上传',
                                files: res.data.list,
                                operate: [
                                  {
                                    type: ' 上 传 '
                                  },
                                  {
                                    type: ' 查 看 '
                                  }
                                ]
                              })
                            } else {
                              this.$message.error(res.msg)
                            }
                          })
                        } else {
                          this.basicTable.push({
                            index: '3',
                            title: '营业执照复印件',
                            status: '未上传',
                            operate: [
                              {
                                type: ' 上 传 '
                              },
                              {
                                type: ' 查 看 '
                              }
                            ]
                          })
                        }
                      }
                      if (this.currentInfo.is_land == 2) {
                        if (this.$route.query.project_id) {
                          this.ApiLists.fetchProjectMaterialsDetail({
                            project_id: this.$route.query.project_id,
                            which_type: 4
                          }).then((res) => {
                            if (res && res.code == 0) {
                              this.basicTable.push({
                                index: '4',
                                title: '土地流转协议等用地手续',
                                status: res.data.list.length ? '1' : '未上传',
                                files: res.data.list,
                                operate: [
                                  {
                                    type: ' 上 传 '
                                  },
                                  {
                                    type: ' 查 看 '
                                  }
                                ]
                              })
                            } else {
                              this.$message.error(res.msg)
                            }
                          })
                        } else {
                          this.basicTable.push({
                            index: '4',
                            title: '土地流转协议等用地手续',
                            status: '未上传',
                            operate: [
                              {
                                type: ' 上 传 '
                              },
                              {
                                type: ' 查 看 '
                              }
                            ]
                          })
                        }
                      }
                      if (this.currentInfo.is_device_list == 2) {
                        if (this.$route.query.project_id) {
                          this.ApiLists.fetchProjectFacilityDetail({
                            project_id: this.$route.query.project_id
                          }).then((res) => {
                            if (res && res.code == 0) {
                              this.basicTable.push({
                                index: '5',
                                title: '项目购置设备设施清单（包括型号、预估价）',
                                status: res.data.list.id ? '1' : '未填写',
                                operate: [
                                  {
                                    type: ' 编 辑 '
                                  },
                                  {
                                    type: ' 查 看 '
                                  }
                                ]
                              })
                            } else {
                              this.$message.error(res.msg)
                            }
                          })
                        } else {
                          this.basicTable.push({
                            index: '5',
                            title: '项目购置设备设施清单（包括型号、预估价）',
                            status: '未填写',
                            operate: [
                              {
                                type: ' 编 辑 '
                              },
                              {
                                type: ' 查 看 '
                              }
                            ]
                          })
                        }
                      }
                      if (this.currentInfo.is_engineering_design == 2) {
                        if (this.$route.query.project_id) {
                          this.ApiLists.fetchProjectMaterialsDetail({
                            project_id: this.$route.query.project_id,
                            which_type: 6
                          })
                            .then((res) => {
                              if (res && res.code == 0) {
                                this.basicTable.push({
                                  index: '6',
                                  title: '项目有关工程设计及投资情况佐证材料',
                                  status: res.data.list.length ? '1' : '未上传',
                                  files: res.data.list,
                                  operate: [
                                    {
                                      type: ' 上 传 '
                                    },
                                    {
                                      type: ' 查 看 '
                                    }
                                  ]
                                })
                              } else {
                                this.$message.error(res.msg)
                              }
                            })
                            .catch((err) => {
                              console.log('err', err)
                            })
                        } else {
                          this.basicTable.push({
                            index: '6',
                            title: '项目有关工程设计及投资情况佐证材料',
                            status: '未上传',
                            operate: [
                              {
                                type: ' 上 传 '
                              },
                              {
                                type: ' 查 看 '
                              }
                            ]
                          })
                        }
                      }
                      if (this.currentInfo.is_facility === 2) {
                        if (this.$route.query.project_id) {
                          this.ApiLists.fetchProjectMaterialsDetail({
                            project_id: this.$route.query.project_id,
                            which_type: 8
                          })
                            .then((res) => {
                              if (res && res.code == 0) {
                                this.basicTable.push({
                                  index: '8',
                                  title: '涉及生产设施用房建设的需提供设施用地审批材料',
                                  status: res.data.list.length ? '1' : '未上传',
                                  files: res.data.list,
                                  operate: [
                                    {
                                      type: '上 传'
                                    },
                                    {
                                      type: '查 看'
                                    }
                                  ]
                                })
                              } else {
                                this.$message.error(res.msg)
                              }
                            })
                            .catch((err) => {
                              console.log('err', err)
                            })
                        } else {
                          this.basicTable.push({
                            index: '8',
                            title: '涉及生产设施用房建设的需提供设施用地审批材料',
                            status: '未上传',
                            operate: [
                              {
                                type: ' 上 传 '
                              },
                              {
                                type: ' 查 看 '
                              }
                            ]
                          })
                        }
                      }
                      if (this.currentInfo.is_other_material == 2) {
                        if (this.$route.query.project_id) {
                          this.ApiLists.fetchProjectMaterialsDetail({
                            project_id: this.$route.query.project_id,
                            which_type: 7
                          })
                            .then((res) => {
                              if (res && res.code == 0) {
                                this.basicTable.push({
                                  index: '10',
                                  title: '根据项目建设需要提供的其他材料',
                                  status: res.data.list.length ? '1' : '未上传',
                                  files: res.data.list,
                                  operate: [
                                    {
                                      type: ' 上 传 '
                                    },
                                    {
                                      type: ' 查 看 '
                                    }
                                  ]
                                })
                              } else {
                                this.$message.error(res.msg)
                              }
                            })
                            .catch((err) => {
                              console.log('err', err)
                            })
                        } else {
                          this.basicTable.push({
                            index: '10',
                            title: '根据项目建设需要提供的其他材料',
                            status: '未上传',
                            operate: [
                              {
                                type: ' 上 传 '
                              },
                              {
                                type: ' 查 看 '
                              }
                            ]
                          })
                        }
                      }

                      if (this.currentInfo.is_financial_support == 2) {
                        if (this.$route.query.project_id) {
                          this.ApiLists.fetchProjectMaterialsDetail({
                            project_id: this.$route.query.project_id,
                            which_type: 9
                          })
                            .then((res) => {
                              if (res && res.code == 0) {
                                this.basicTable.push({
                                  index: '9',
                                  title: '项目建设区域内近二年各级财政资金扶持情况',
                                  status: res.data.list.length ? '1' : '未上传',
                                  files: res.data.list,
                                  operate: [
                                    {
                                      type: ' 上 传 '
                                    },
                                    {
                                      type: ' 查 看 '
                                    }
                                  ]
                                })
                              } else {
                                this.$message.error(res.msg)
                              }
                            })
                            .catch((err) => {
                              console.log('err', err)
                            })
                        } else {
                          this.basicTable.push({
                            index: '9',
                            title: '项目建设区域内近二年各级财政资金扶持情况',
                            status: '未上传',
                            operate: [
                              {
                                type: ' 上 传 '
                              },
                              {
                                type: ' 查 看 '
                              }
                            ]
                          })
                        }
                      }

                      if (this.currentInfo.is_regional_photo == 2) {
                        if (this.$route.query.project_id) {
                          this.ApiLists.fetchProjectMaterialsDetail({
                            project_id: this.$route.query.project_id,
                            which_type: 10
                          })
                            .then((res) => {
                              if (res && res.code == 0) {
                                this.basicTable.push({
                                  index: '7',
                                  title: '项目建设内容布置示意图及区域现状照片',
                                  status: res.data.list.length ? '1' : '未上传',
                                  files: res.data.list,
                                  operate: [
                                    {
                                      type: ' 上 传 '
                                    },
                                    {
                                      type: ' 查 看 '
                                    }
                                  ]
                                })
                              } else {
                                this.$message.error(res.msg)
                              }
                            })
                            .catch((err) => {
                              console.log('err', err)
                            })
                        } else {
                          this.basicTable.push({
                            index: '7',
                            title: '项目建设内容布置示意图及区域现状照片',
                            status: '未上传',
                            operate: [
                              {
                                type: ' 上 传 '
                              },
                              {
                                type: ' 查 看 '
                              }
                            ]
                          })
                        }
                      }

                      setTimeout(() => {
                        let hi = this.basicTable.sort((a, b) => {
                          return +a.index - +b.index
                        })
                        this.$forceUpdate()
                        this.loading = false
                      }, 2500)
                    }
                  })
                  .catch((err) => {
                    console.log('er', err)
                  })
              }
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch((err) => {
            console.log('er', err)
          })
      } else {
        this.ApiLists.fetchPolicyDocumentInfo({ id: this.$route.query.policy_document_id }).then((res) => {
          if (res && res.code === 0) {
            this.currentInfo = res.data
            if (this.currentInfo.is_declaration == 2) {
              if (this.$route.query.project_id) {
                this.ApiLists.fetchProjectDeclarationDetail({
                  project_id: this.$route.query.project_id
                }).then((res) => {
                  if (res && res.code == 0) {
                    this.basicTable.push({
                      index: '1',
                      title: '项目申报书',
                      special: redmark ? '1' : undefined,
                      status: this.progressInfo.declaration_id ? '1' : '未填写',
                      operate: [
                        {
                          type: ' 编 辑 '
                        },
                        {
                          type: ' 查 看 '
                        }
                      ]
                    })
                  } else {
                    this.$message.error(res.msg)
                  }
                })
              } else {
                this.basicTable.push({
                  index: '1',
                  title: '项目申报书',
                  special: redmark ? '1' : undefined,
                  status: '未填写',
                  operate: [
                    {
                      type: ' 编 辑 '
                    },
                    {
                      type: ' 查 看 '
                    }
                  ]
                })
              }
            }
            if (this.currentInfo.is_scheme == 2) {
              if (this.$route.query.project_id) {
                this.ApiLists.fetchProjectImplementPlanDetail({
                  project_id: this.$route.query.project_id
                }).then((res) => {
                  if (res && res.code == 0) {
                    this.basicTable.push({
                      index: '2',
                      title: '项目实施方案简表',
                      status: this.progressInfo.implement_plan_id ? '1' : '未填写',
                      special: redmark ? '1' : undefined,
                      operate: [
                        {
                          type: ' 编 辑 '
                        },
                        {
                          type: ' 查 看 '
                        }
                      ]
                    })
                  } else {
                    this.$message.error(res.msg)
                  }
                })
              } else {
                this.basicTable.push({
                  index: '2',
                  title: '项目实施方案简表',
                  special: redmark ? '1' : undefined,
                  status: '未填写',
                  operate: [
                    {
                      type: ' 编 辑 '
                    },
                    {
                      type: ' 查 看 '
                    }
                  ]
                })
              }
            }
            if (this.currentInfo.is_business_license == 2) {
              if (this.$route.query.project_id) {
                this.ApiLists.fetchProjectMaterialsDetail({
                  project_id: this.$route.query.project_id,
                  which_type: 3
                }).then((res) => {
                  if (res && res.code == 0) {
                    this.basicTable.push({
                      index: '3',
                      title: '营业执照复印件',
                      status: res.data.list.length ? '1' : '未上传',
                      files: res.data.list,
                      operate: [
                        {
                          type: ' 上 传 '
                        },
                        {
                          type: ' 查 看 '
                        }
                      ]
                    })
                  } else {
                    this.$message.error(res.msg)
                  }
                })
              } else {
                this.basicTable.push({
                  index: '3',
                  title: '营业执照复印件',
                  status: '未上传',
                  operate: [
                    {
                      type: ' 上 传 '
                    },
                    {
                      type: ' 查 看 '
                    }
                  ]
                })
              }
            }
            if (this.currentInfo.is_land == 2) {
              if (this.$route.query.project_id) {
                this.ApiLists.fetchProjectMaterialsDetail({
                  project_id: this.$route.query.project_id,
                  which_type: 4
                }).then((res) => {
                  if (res && res.code == 0) {
                    this.basicTable.push({
                      index: '4',
                      title: '土地流转协议等用地手续',
                      status: res.data.list.length ? '1' : '未上传',
                      files: res.data.list,
                      operate: [
                        {
                          type: ' 上 传 '
                        },
                        {
                          type: ' 查 看 '
                        }
                      ]
                    })
                  } else {
                    this.$message.error(res.msg)
                  }
                })
              } else {
                this.basicTable.push({
                  index: '4',
                  title: '土地流转协议等用地手续',
                  status: '未上传',
                  operate: [
                    {
                      type: ' 上 传 '
                    },
                    {
                      type: ' 查 看 '
                    }
                  ]
                })
              }
            }
            if (this.currentInfo.is_device_list == 2) {
              if (this.$route.query.project_id) {
                this.ApiLists.fetchProjectFacilityDetail({
                  project_id: this.$route.query.project_id
                }).then((res) => {
                  if (res && res.code == 0) {
                    this.basicTable.push({
                      index: '5',
                      title: '项目购置设备设施清单（包括型号、预估价）',
                      status: res.data.list.id ? '1' : '未填写',
                      operate: [
                        {
                          type: ' 编 辑 '
                        },
                        {
                          type: ' 查 看 '
                        }
                      ]
                    })
                  } else {
                    this.$message.error(res.msg)
                  }
                })
              } else {
                this.basicTable.push({
                  index: '5',
                  title: '项目购置设备设施清单（包括型号、预估价）',
                  status: '未填写',
                  operate: [
                    {
                      type: ' 编 辑 '
                    },
                    {
                      type: ' 查 看 '
                    }
                  ]
                })
              }
            }
            if (this.currentInfo.is_engineering_design == 2) {
              if (this.$route.query.project_id) {
                this.ApiLists.fetchProjectMaterialsDetail({
                  project_id: this.$route.query.project_id,
                  which_type: 6
                })
                  .then((res) => {
                    if (res && res.code == 0) {
                      this.basicTable.push({
                        index: '6',
                        title: '项目有关工程设计及投资情况佐证材料',
                        status: res.data.list.length ? '1' : '未上传',
                        files: res.data.list,
                        operate: [
                          {
                            type: ' 上 传 '
                          },
                          {
                            type: ' 查 看 '
                          }
                        ]
                      })
                    } else {
                      this.$message.error(res.msg)
                    }
                  })
                  .catch((err) => {
                    console.log('err', err)
                  })
              } else {
                this.basicTable.push({
                  index: '6',
                  title: '项目有关工程设计及投资情况佐证材料',
                  status: '未上传',
                  operate: [
                    {
                      type: ' 上 传 '
                    },
                    {
                      type: ' 查 看 '
                    }
                  ]
                })
              }
            }
            if (this.currentInfo.is_facility === 2) {
              if (this.$route.query.project_id) {
                this.ApiLists.fetchProjectMaterialsDetail({
                  project_id: this.$route.query.project_id,
                  which_type: 8
                })
                  .then((res) => {
                    if (res && res.code == 0) {
                      this.basicTable.push({
                        index: '8',
                        title: '涉及生产设施用房建设的需提供设施用地审批材料',
                        status: res.data.list.length ? '1' : '未上传',
                        files: res.data.list,
                        operate: [
                          {
                            type: ' 上 传 '
                          },
                          {
                            type: ' 查 看 '
                          }
                        ]
                      })
                    } else {
                      this.$message.error(res.msg)
                    }
                  })
                  .catch((err) => {
                    console.log('err', err)
                  })
              } else {
                this.basicTable.push({
                  index: '8',
                  title: '涉及生产设施用房建设的需提供设施用地审批材料',
                  status: '未上传',
                  operate: [
                    {
                      type: ' 上 传 '
                    },
                    {
                      type: ' 查 看 '
                    }
                  ]
                })
              }
            }
            if (this.currentInfo.is_other_material == 2) {
              if (this.$route.query.project_id) {
                this.ApiLists.fetchProjectMaterialsDetail({
                  project_id: this.$route.query.project_id,
                  which_type: 7
                })
                  .then((res) => {
                    if (res && res.code == 0) {
                      this.basicTable.push({
                        index: '10',
                        title: '根据项目建设需要提供的其他材料',
                        status: res.data.list.length ? '1' : '未上传',
                        files: res.data.list,
                        operate: [
                          {
                            type: ' 上 传 '
                          },
                          {
                            type: ' 查 看 '
                          }
                        ]
                      })
                    } else {
                      this.$message.error(res.msg)
                    }
                  })
                  .catch((err) => {
                    console.log('err', err)
                  })
              } else {
                this.basicTable.push({
                  index: '10',
                  title: '根据项目建设需要提供的其他材料',
                  status: '未上传',
                  operate: [
                    {
                      type: ' 上 传 '
                    },
                    {
                      type: ' 查 看 '
                    }
                  ]
                })
              }
            }

            if (this.currentInfo.is_financial_support == 2) {
              if (this.$route.query.project_id) {
                this.ApiLists.fetchProjectMaterialsDetail({
                  project_id: this.$route.query.project_id,
                  which_type: 9
                })
                  .then((res) => {
                    if (res && res.code == 0) {
                      this.basicTable.push({
                        index: '9',
                        title: '项目建设区域内近二年各级财政资金扶持情况',
                        status: res.data.list.length ? '1' : '未上传',
                        files: res.data.list,
                        operate: [
                          {
                            type: ' 上 传 '
                          },
                          {
                            type: ' 查 看 '
                          }
                        ]
                      })
                    } else {
                      this.$message.error(res.msg)
                    }
                  })
                  .catch((err) => {
                    console.log('err', err)
                  })
              } else {
                this.basicTable.push({
                  index: '9',
                  title: '项目建设区域内近二年各级财政资金扶持情况',
                  status: '未上传',
                  operate: [
                    {
                      type: ' 上 传 '
                    },
                    {
                      type: ' 查 看 '
                    }
                  ]
                })
              }
            }

            if (this.currentInfo.is_regional_photo == 2) {
              if (this.$route.query.project_id) {
                this.ApiLists.fetchProjectMaterialsDetail({
                  project_id: this.$route.query.project_id,
                  which_type: 10
                })
                  .then((res) => {
                    if (res && res.code == 0) {
                      this.basicTable.push({
                        index: '7',
                        title: '项目建设内容布置示意图及区域现状照片',
                        status: res.data.list.length ? '1' : '未上传',
                        files: res.data.list,
                        operate: [
                          {
                            type: ' 上 传 '
                          },
                          {
                            type: ' 查 看 '
                          }
                        ]
                      })
                    } else {
                      this.$message.error(res.msg)
                    }
                  })
                  .catch((err) => {
                    console.log('err', err)
                  })
              } else {
                this.basicTable.push({
                  index: '7',
                  title: '项目建设内容布置示意图及区域现状照片',
                  status: '未上传',
                  operate: [
                    {
                      type: ' 上 传 '
                    },
                    {
                      type: ' 查 看 '
                    }
                  ]
                })
              }
            }
            setTimeout(() => {
              let hi = this.basicTable.sort((a, b) => {
                return +a.index - +b.index
              })
              this.$forceUpdate()
              this.loading = false
            }, 2500)
          }
        })
      }
    },
    // 取消关联项目储备
    cancelProjectReserve() {
      this.reserveValue = 0
      this.setPreserve()
      this.preserveName = ''
    }
  }
}
</script>

<style lang="less" scoped>
.tableOuter {
  .operateMasterCon {
    position: relative;
    .markAlert {
      position: absolute;
      color: #f00;
      z-index: 999;
      top: 3px;
      font-size: 14px;
      right: 0;
    }
  }
}
.withCursor {
  cursor: pointer;
}
.video1Mask {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  z-index: 3000;
  bottom: 0;
}
.videoMask {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  z-index: 3000;
  bottom: 0;
}
.projectPageCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
}
.previewCon {
  margin-right: 20px;
  margin-top: 10px;
  position: relative;
}
.deleteBtn {
  position: absolute;
  right: 0px;
  top: 0;
  color: #fff;
  line-height: 18px;
  border-radius: 4px;
  font-size: 14px;
  width: 40px;
  height: 18px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
}
.previewImg {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}
.previewDialogCon {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  align-content: flex-start;
  height: 400px;
  overflow-y: auto;
}
.previewName {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  overflow: hidden;
  span {
    width: 100px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.statusDoneImg {
  width: 23px;
  height: 24px;
  vertical-align: bottom;
}
.centerCon {
  width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  box-sizing: border-box;
}
.contentCon {
  margin-top: 20px;
  padding: 20px 30px 30px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 20px;
  position: relative;
}
.setHelpPosition {
  //   position: absolute;
  //   right: -70px;
  //   top: 50px;
  position: fixed;
  right: 290px;
  bottom: 300px;
}
.submitMaster {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-top: 20px;
}
.answerTrigger {
  font-size: 14px;
  color: #0270c3;
  line-height: 32px;
  margin-right: 30px;
  cursor: pointer;
}
.operateCon {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
.fakeCopyBtn {
  padding: 0 14px;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 10px;
  height: 26px;
  line-height: 26px;
}
.fakeBtn {
  color: #fff;
  padding: 0 14px;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 10px;
  height: 26px;
  line-height: 26px;
  &:last-child {
    margin-right: 0;
  }
}
.coverBtn {
  //   color: #fff;
  padding: 10px 14px;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  //   height: 30px;
  //   line-height: 30px;
}
.tableFirstCon {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  margin-bottom: 20px;
  .select-area {
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
      color: #333;
    }
  }
  .reserveCon {
    display: flex;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
  }
  .selectCon {
    margin-right: 20px;
  }
}
.checkSource {
  color: #0270c3;
  border-color: #0270c3;
}
.operateBtn {
  color: #0270c3;
  cursor: pointer;
}
.uploadCon {
  height: 320px;
  //   overflow-y: auto;
}
.resetBtnColor {
  background-color: #0270c3;
}
.del-btn {
  font-size: 26px;
  color: #0270c3;
  margin-right: 5px;
  cursor: pointer;
}
</style>
<style lang="less">
.viewer-fixed {
  z-index: 3000 !important;
}
.projectPageCon {
  .uploadDialog {
    .el-upload-list {
      height: 270px;
      overflow-y: auto;
    }
    .el-dialog {
      height: 500px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto !important;
    }
  }
  .preserveDialog {
    .el-dialog {
      height: 230px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto !important;
    }
  }
}
.projectMaterialPageCon {
  .fakeCopyBtn.is-disabled {
    background-color: #ccc;
    color: #fff;
    border-color: #ccc;
  }
  .coverBtn.is-disabled {
    background-color: #ccc;
    color: #fff;
    border-color: #ccc;
  }
}
</style>
