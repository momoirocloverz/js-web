<template>
  <div class="mapMainCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toHome">首页</el-breadcrumb-item>
          <el-breadcrumb-item>投资一件事</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="masterCon">
      <iframe id="gisI2frame" src="/mapModule/PHJSC_final.html" style="width: 100%; height: 100%; background-color: transparent; border: rgba(255, 255, 255, 0)" key="12"></iframe>
      <div class="firsetLine">
        <!-- <el-input placeholder="请输入地块名称进行搜索" v-model="input3" class="input-with-select resetInput1">
          <el-button slot="append" icon="el-icon-search" class="btnBack"></el-button>
        </el-input> -->
        <el-select v-model="input3" class="resetInput1" filterable remote reserve-keyword placeholder="请输入地块名称进行搜索" :remote-method="remoteMethod" :loading="loading" @change="input3Change">
          <el-option v-for="(item, index) in nameOptions" :key="index" :label="item.properties.小地名" :value="item.properties.小地名"> </el-option>
        </el-select>
        <el-cascader
          class="casCus"
          ref="cascader"
          v-model="areaId"
          :options="areaList"
          placeholder="请选择地区"
          @change="onAddressChange"
          :props="{
            label: 'name',
            value: 'name',
            checkStrictly: true
          }"
        />
        <el-select v-model="value" ref="selectHere" placeholder="请选择面积" @change="areaChange" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <div class="imgHolder" @click="showBig = !showBig">
          <img :src="showBig ? 'https://img.hzanchu.com/acimg/daae508376b9d6a793aceef46204a7ae.png' : 'https://img.hzanchu.com/acimg/ebb80ef4f637c633d1db875c37fedccd.png'" />
        </div>
        <div :class="[showBig ? 'realListCon' : 'hideRealList']">
          <el-form ref="form" :model="form" label-width="80px" v-show="showBig">
            <el-form-item label="投资类型">
              <el-cascader
                clearable
                placeholder="请选择投资类型"
                :style="{ width: '90%' }"
                v-model="firstValue"
                :options="firstArray"
                :props="{
                  label: 'name',
                  value: 'id'
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="政策匹配">
              <el-select v-model="current_search_invest_tag_id" placeholder="请选择活动区域" multiple :style="{ width: '90%' }" @change="secondChange" clearable>
                <el-option v-for="item in secondOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div :class="[showBig ? 'listCon' : 'hideAll']" v-show="showBig">
            <template v-for="(item, index) in masterArray">
              <div class="itemCon" :key="index" @click="checkDetail(item)">
                <div class="itemFirst">
                  <div class="firstLeft">{{ item.title }}</div>
                  <div class="firstRight">{{ item.created_at }}</div>
                </div>
                <div class="itemSecond">
                  <template v-for="(sub, subIndex) in item.tag_list">
                    <div class="tagCon" :key="subIndex">
                      {{ sub.name }}
                    </div>
                  </template>
                </div>
              </div>
            </template>
            <div v-if="!masterArray.length" class="emptyCon">暂无数据</div>
          </div>
          <div :class="[showBig ? 'pagnationCon' : 'hideAll']">
            <el-pagination
              v-show="showBig"
              :class="[showBig ? 'pagHere' : 'hideAll']"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="size"
              layout="prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="slideBack" @click="goBackMap">返回上一级</div>
      <div class="slideLeft">
        <div class="topPart" @click="toNotice">
          <img src="https://img.hzanchu.com/acimg/dec60adf443f9915c2111e28446f8648.png" />
          <div>注意<br />事项</div>
        </div>
        <div class="bottomPart" @click="toProgress">
          <img src="https://img.hzanchu.com/acimg/f37827f4968575949ffed28b8cc4a247.png" />
          <div>办事<br />流程</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import realData from './real.json'
export default {
  layout: 'noBackImg',
  head() {
    return {
      title: '列表',
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
      addonHeight: false,
      showBig: false,
      secondOptions: [],
      firstArray: [],
      form: {
        name: '',
        region: ''
      },
      options: [
        {
          value: '1',
          label: '100亩以下'
        },
        {
          value: '2',
          label: '100亩-200亩'
        },
        {
          value: '3',
          label: '200亩以上'
        }
      ],
      value: '',
      areaList: [],
      areaId: ['江山市'],
      input3: '',
      currentPage: 1,
      keywords: '',
      listArray: [],
      categoryArray: [],
      currentActiveIndex: 0,
      type: 1,
      keywordsList: [],
      showKeywordsList: false,
      firstValue: [],
      current_search_invest_tag_id: [],
      masterArray: [],
      size: 10,
      total: 0,
      currentPage: 1,
      current_search_invest_category_id: '',
      nameOptions: [],
      list: [],
      loading: false,
      theOneId: '',
      currentInfo: {}
    }
  },
  mounted() {
    this.initAction()
    this.getAreaList()
    this.fetchMasterType()
    this.fetchBigList()
    const special = new acol_dea().decodeGeoJson({ data: realData })
    this.list = special.features.filter((ele) => {
      return ele.properties.小地名
    })
    let that = this
    setTimeout(() => {
      function dothis() {
        that.shutDown()
      }
      if (document.all) {
        document.getElementById('gisI2frame').attachEvent('click', dothis)
      } else {
        document.getElementById('gisI2frame').contentWindow.addEventListener('click', dothis, false)
      }
    }, 1000)
  },
  methods: {
    checkDetail(item) {
      const { href } = this.$router.resolve({
        path: '/understand/detail',
        query: {
          id: item.id,
          type: '1'
        }
      })
      window.open(href, '_blank')
    },
    goBackMap() {
      let message = {
        key: 'goBack',
        value: { name: '1' }
      }
      this.sendMessage('gisLayerMessage', message)
    },
    remoteMethod(query) {
      if (query !== '') {
        if (this.theOneId == this.firstValue[0]) {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.nameOptions = this.list.filter((item) => {
              return item.properties.小地名.indexOf(query) > -1
            })
          }, 200)
        } else {
          this.nameOptions = []
        }
      } else {
        this.nameOptions = []
      }
    },
    input3Change() {
      let track = this.list.find((item) => {
        return item.properties.小地名 == this.input3
      })
      if (track) {
        let message = {
          key: 'target',
          value: { obj: track }
        }
        this.sendMessage('gisLayerMessage', message)
      }
    },
    sendMessage(type, data) {
      // 向子页面传递消息
      let iframe = document.getElementById('gisI2frame')
      iframe.contentWindow.postMessage({ type: type, data: data }, '*')
    },
    toNotice() {
      if (this.current_search_invest_category_id) {
        if (this.currentInfo.id) {
          this.$router.push({
            path: '/forMap/notice',
            query: {
              invest_category_id: this.current_search_invest_category_id
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '暂不可查看注意事项/办事流程',
            type: 'warning',
            duration: 3000
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: '请选择投资类型',
          type: 'warning',
          duration: 3000
        })
      }
    },
    toProgress() {
      if (this.current_search_invest_category_id) {
        if (this.currentInfo.id) {
          this.$router.push({
            path: '/forMap/progress',
            query: {
              invest_category_id: this.current_search_invest_category_id
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '暂不可查看注意事项/办事流程',
            type: 'warning',
            duration: 3000
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: '请选择投资类型',
          type: 'warning',
          duration: 3000
        })
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchBigList()
    },
    fetchBigList() {
      let data = {
        page: this.currentPage,
        pagesize: this.size,
        search_invest_category_id: this.current_search_invest_category_id,
        search_invest_tag_ids: this.current_search_invest_tag_id.length ? JSON.stringify(this.current_search_invest_tag_id) : ''
      }
      this.ApiLists.fetchUnderstandPaperList(data)
        .then((res) => {
          if (res && res.code == 0) {
            this.masterArray = res.data.data
            this.total = res.data.total
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    secondChange() {
      this.currentPage = 1
      this.fetchBigList()
    },
    handleChange() {
      console.log('firstValue', this.firstValue)
      if (this.firstValue && this.firstValue.length) {
        if (this.theOneId == this.firstValue[0]) {
          let message = {
            key: 'showData',
            value: { obj: '1' }
          }
          this.sendMessage('gisLayerMessage', message)
          //   const special = new acol_dea().decodeGeoJson({ data: realData })
          //   this.list = special.features.filter((ele) => {
          //     return ele.properties.小地名
          //   })
        } else {
          let message = {
            key: 'showData',
            value: { obj: '0' }
          }
          this.sendMessage('gisLayerMessage', message)
          this.$message.warning('该产业暂无内容')
          //   this.list = []
          this.nameOptions = []
          this.input3 = ''
        }
      }
      if (this.firstValue && this.firstValue.length && this.firstValue[1]) {
        this.fetchSubTag(this.firstValue[1])
        this.current_search_invest_category_id = this.firstValue[1]
        this.current_search_invest_tag_id = []
        this.currentPage = 1
        this.fetchBigList()
        this.fetchHaveInfo(this.firstValue[1])
      } else {
        this.current_search_invest_category_id = ''
        this.current_search_invest_tag_id = []
        this.currentPage = 1
        this.fetchBigList()
        this.fetchHaveInfo('')
      }
    },
    fetchHaveInfo(value) {
      if (value) {
        let data = { invest_category_id: value }
        this.ApiLists.investBsydInfo(data)
          .then((res) => {
            if (res && res.code == 0) {
              this.currentInfo = res.data.info
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        this.currentInfo = {}
      }
    },
    fetchSubTag(value) {
      let data = {
        invest_category_id: value
      }
      this.ApiLists.investTagList(data).then((res) => {
        this.secondOptions = res.data.list
      })
    },
    fetchMasterType() {
      this.ApiLists.investCategoryList().then((res) => {
        // res.data.forEach((ele) => {
        //   ele.children = [{ id: 0, name: '全部' }, ...ele.children]
        // })
        this.firstArray = res.data
        let track = this.firstArray.find((ele) => {
          return ele.name == '养殖业'
        })
        if (track) {
          this.theOneId = track.id
          if (track.children) {
            if (track.children.length) {
              this.firstValue = [track.id, track.children[0].id]
              this.fetchSubTag(this.firstValue[1])
              this.current_search_invest_category_id = this.firstValue[1]
              this.fetchBigList()
              this.fetchHaveInfo(this.firstValue[1])
            } else {
              this.firstValue = [track.id]
              //   this.fetchSubTag(this.firstValue[0])
              this.current_search_invest_category_id = this.firstValue[0]
              this.fetchBigList()
              this.fetchHaveInfo('')
            }
          } else {
            this.firstValue = [track.id]
            // this.fetchSubTag(this.firstValue[0])
            this.current_search_invest_category_id = this.firstValue[0]
            this.fetchBigList()
            this.fetchHaveInfo('')
          }
        }
      })
    },
    shutDown() {
      this.$refs.cascader.dropDownVisible = false
      this.$refs.selectHere.blur()
    },
    onAddressChange(e) {
      this.$refs.cascader.dropDownVisible = false
      if (this.areaId && this.areaId.length) {
        let message
        switch (this.areaId.length) {
          case 0:
            break
          case 1:
            message = {
              key: 'address',
              value: { layer: '1' }
            }
            this.sendMessage('gisLayerMessage', message)
            break
          case 2:
            message = {
              key: 'address',
              value: { layer: '2', townName: e[1] }
            }
            this.sendMessage('gisLayerMessage', message)
            break
          case 3:
            message = {
              key: 'address',
              value: { layer: '3', villageName: e[2], townName: e[1] }
            }
            this.sendMessage('gisLayerMessage', message)
            break
        }
      }
    },
    areaChange() {
      let message = {
        key: 'area',
        value: { select: this.value }
      }
      this.sendMessage('gisLayerMessage', message)
    },
    getAreaList() {
      this.ApiLists.fetchmapAreaList().then((res) => {
        if (res && res.code === 0) {
          res.data.list[0].children.forEach((ele) => {
            delete ele.children
            // ele.children.forEach((sub) => {
            //   sub.name = sub.name + '村'
            // })
          })
          this.areaList = res.data.list
        }
      })
    },
    toHome() {
      this.$router.push({
        path: '/'
      })
    },
    initAction() {
      this.$store.commit('changeMenuActive', '1')
    }
  }
}
</script>
<style lang="less" scoped>
.casCus {
  width: 200px;
  margin-left: 100px;
  margin-right: 20px;
}
.withCursor {
  cursor: pointer;
}
.breadcrumbCon {
  margin-bottom: 20px;
}
.mapMainCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-top: 70px;
  box-sizing: border-box;
  .centerCon {
    width: 1200px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
.masterCon {
  min-height: calc(100vh - 128px);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/img/back.png');
  position: relative;
}
#gisI2frame {
  width: 100%;
  min-height: calc(100vh - 128px);
}
.firsetLine {
  position: absolute;
  top: 24px;
  left: 0;
  right: 0;
  padding-left: 56px;
  box-sizing: border-box;
}
.resetInput1 {
  width: 550px;
}
.btnBack {
  background-color: #0270c3 !important;
  color: #fff !important;
}
.imgHolder {
  cursor: pointer;
  img {
    width: 24px;
    height: 24px;
  }
  right: 36px;
  top: 12px;
  z-index: 10;
  position: absolute;
}
.realListCon {
  transition: all 0s;
  width: 600px;
  background-color: #fff;
  height: 730px;
  border-radius: 3px;
  position: absolute;
  right: 24px;
  top: 0;
  padding: 32px;
  box-sizing: border-box;
}
.hideRealList {
  width: 0;
  height: 0;
  right: 24px;
  top: 0;
  position: absolute;
  transition: all 0s;
}
.hideAll {
  transition: all 0s;
}
.slideBack {
  left: 56px;
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  font-size: 15px;
  top: 130px;
  color: #999;
  cursor: pointer;
}
.slideLeft {
  left: 56px;
  height: 160px;
  width: 52px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 4px;
  padding-right: 4px;
  box-sizing: border-box;
  top: 300px;
  .topPart {
    height: 70px;
    cursor: pointer;
    border-bottom: 1px dashed #dbdbdb;
    img {
      width: 20px;
      height: 20px;
      display: block;
      margin: 0 auto;
    }
    div {
      text-align: center;
      font-size: 14px;
      color: #333;
    }
  }
  .bottomPart {
    height: 70px;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
      display: block;
      margin: 0 auto;
      margin-top: 8px;
    }
    div {
      text-align: center;
      font-size: 14px;
      color: #333;
    }
  }
}

.listCon {
  height: 520px;
  overflow-y: auto;
}
.emptyCon {
  font-size: 16px;
  padding-top: 150px;
  box-sizing: border-box;
  text-align: center;
}
.itemCon {
  border-bottom: 1px solid #f2f2f2;
  padding-top: 16px;
  padding-bottom: 8px;
  box-sizing: border-box;
  cursor: pointer;
}
.itemFirst {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  .firstLeft {
    width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    color: #333;
  }
  .firstRight {
    width: 180px;
    font-size: 14px;
    color: #999;
  }
}
.itemSecond {
  margin-top: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  .tagCon {
    padding-left: 8px;
    padding-right: 8px;
    height: 24px;
    line-height: 24px;
    box-sizing: border-box;
    color: #0270c3;
    background-color: #edf7ff;
    font-size: 12px;
    border-radius: 2px;
    border: 1px solid #0270c3;
    margin-right: 20px;
    margin-bottom: 10px;
  }
}
.pagnationCon {
  width: 100%;
  transition: all 0s;
}
.pagHere {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  width: 100%;
}
</style>
<style lang="less">
.pagHere {
}
</style>
