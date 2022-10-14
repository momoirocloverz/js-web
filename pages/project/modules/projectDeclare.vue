<template>
  <!--  <div class="projectPageCon">-->
  <!--    <div class="centerCon">-->
  <!--      <div class="contentCon">-->
  <div class="progressCon">
    <div class="firstTopLine">
      <div class="firstTopTitleCon">
        <div class="firstTopTitle">项目申报进度</div>
        <div>
          <div class="submitMaster">
            <el-button class="coverBtn" @click="checkMyMaterial">查看我的材料</el-button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="progressBarCon">
        <div
          class="popoverCon"
          :class="{
            onePointFivePopPosition: onePointFivePopPositionAble,
            secondPopPosition: secondPopPositionAble,
            thirdPopPosition: thirdPopPositionAble,
            fourthPopPosition: fourthPopPositionAble,
            fifthPopPosition: fifthPopPositionAble,
            sixthPopPosition: sixthPopPositionAble
          }"
        >
          <div class="resetZIndex">
            <div>{{ statusText }}</div>
            <div class="smallaprial" v-if="statusText == '文件下达'">下达资金:{{ this.progressInfo.order_amount || 0 }}万元</div>
            <div class="popoverBetween" v-if="showDuration && durationDay">
              <div>耗时：{{ durationDay }}天</div>
            </div>
          </div>
        </div>
        <div class="progressBody">
          <div
            class="progressPoint"
            :class="{
              progressSuccess: firstSuccess,
              progressFailed: firstFailed
            }"
          >
            <div class="progressOkCon" v-if="firstDotShow">
              <img class="progressOk" :src="firstCircleImg" />
            </div>
            <div class="DotCon" v-else>
              <div class="Dot"></div>
            </div>
            <div class="commonProgressWidth infoFirstLineGrey">材料递交</div>
            <div class="commonProgressWidth infoFirstLineGrey" v-if="showFirstName"></div>
          </div>
          <!-- <div
                        class="progressPoint"
                        :class="{
                            progressSuccess: onePointFiveSuccess,
                            progressFailed: onePointFiveFailed
                        }"
                    >
                        <div class="progressOkCon" v-if="onePointFiveDotShow">
                            <img class="progressOk" :src="onePointFiveImg" />
                        </div>
                        <div class="DotCon" v-else>
                            <div class="Dot"></div>
                        </div>
                        <div class="commonProgressWidth infoFirstLineGrey">乡镇审核</div>
                        <div
                            class="commonProgressWidth infoFirstLineGrey"
                            v-if="showOnePointFiveName"
                        ></div>
                    </div> -->
          <div
            class="progressPoint"
            :class="{
              progressSuccess: secondSuccess,
              progressFailed: secondFailed
            }"
          >
            <div class="progressOkCon" v-if="secondDotShow">
              <img class="progressOk" :src="secondCircleImg" />
            </div>
            <div class="DotCon" v-else>
              <div class="Dot"></div>
            </div>
            <div class="commonProgressWidth infoFirstLineGrey">材料审核</div>
            <div class="commonProgressWidth infoFirstLineGrey" v-if="showSecondName">
              {{ progressInfo.audit_admin_info && progressInfo.audit_admin_info.username }}
            </div>
          </div>
          <div
            class="progressPoint"
            :class="{
              progressSuccess: thirdSuccess,
              progressFailed: thirdFailed
            }"
          >
            <div class="progressOkCon" v-if="thirdDotShow">
              <img class="progressOk" :src="thirdCircleImg" />
            </div>
            <div class="DotCon" v-else>
              <div class="Dot"></div>
            </div>
            <div class="commonProgressWidth infoFirstLineGrey">评审</div>
            <div class="commonProgressWidth infoFirstLineGrey" v-if="showThirdName">
              {{ progressInfo.review_admin_info && progressInfo.review_admin_info.username }}
            </div>
          </div>
          <div
            class="progressPoint"
            :class="{
              progressSuccess: fourthSuccess,
              progressFailed: fourthFailed
            }"
          >
            <div class="progressOkCon" v-if="fourthDotShow">
              <img class="progressOk" :src="fourthCircleImg" />
            </div>
            <div class="DotCon" v-else>
              <div class="Dot"></div>
            </div>
            <div class="commonProgressWidth infoFirstLineGrey">联审</div>
            <div class="commonProgressWidth infoFirstLineGrey" v-if="showFourthName">
              {{ progressInfo.unit_admin_info && progressInfo.unit_admin_info.username }}
            </div>
            <div class="commonProgressWidth checkEditInfo" @click="popEditInfo" v-if="haveNew">查看修改意见</div>
          </div>
          <div
            class="progressPoint"
            :class="{
              progressSuccess: fifthSuccess,
              progressFailed: fifthFailed
            }"
          >
            <div class="progressOkCon" v-if="fifthDotShow">
              <img class="progressOk" :src="fifthCircleImg" />
            </div>
            <div class="DotCon" v-else>
              <div class="Dot"></div>
            </div>
            <div class="commonProgressWidth infoFirstLineGrey">公示</div>
            <div class="commonProgressWidth infoFirstLineGrey" v-if="showFifthName">
              {{ progressInfo.pass_admin_info && progressInfo.pass_admin_info.username }}
            </div>
          </div>
          <div class="progressPoint">
            <div class="progressOkCon" v-if="sixthDotShow">
              <img class="progressOk" :src="sixthCircleImg" />
            </div>
            <div class="DotCon" v-else>
              <div class="Dot"></div>
            </div>
            <div class="commonProgressWidth infoFirstLineGrey">
              <div>文件下达</div>
              <div class="fileContainer" v-if="file_issued_attachment && file_issued_attachment.length">
                <a v-for="(item, i) in file_issued_attachment" :key="i" :href="item.url" target="_blank">{{ item.name }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="firstMiddleLine">
      <div class="firstTopTitle firstMiddleBottom">申报记录</div>
      <div class="firstTableCon">
        <el-table class="basic-table" :data="basicTable">
          <el-table-column label="序号" align="center" type="index"></el-table-column>
          <el-table-column label="操作类型" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.action_type">{{ actionTypeMap[scope.row.action_type] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作人" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.action_username">{{ scope.row.action_username }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" align="center" prop="updated_at"></el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.action_content">{{ scope.row.action_content }}</div>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--            <div class="pagination-footer" v-if="total > 0">-->
      <!--              <el-pagination-->
      <!--                @current-change="handleCurrentChange"-->
      <!--                :current-page.sync="currentPage"-->
      <!--                :page-size="pageSize"-->
      <!--                layout="prev, pager, next, jumper"-->
      <!--                :total="total"-->
      <!--                class="pagination-info"-->
      <!--              ></el-pagination>-->
      <!--            </div>-->
    </div>
    <el-dialog :visible="infoVisivle" class="setMiddleDialog dialogInfo" width="50%" title="信息" @close="closeDialog">
      <div class="dialogScroll">
        <el-descriptions title="">
          <el-descriptions-item label="项目名称">{{ haveNew ? progressInfo.project_baseinfo_backup_info.project_name : progressInfo.project_name }}</el-descriptions-item>
          <el-descriptions-item label="项目详细地点">{{ haveNew ? progressInfo.project_baseinfo_backup_info.area_detail : progressInfo.area_detail }}</el-descriptions-item>
          <el-descriptions-item label="建设期限"
            >{{ haveNew ? Dayjs(progressInfo.project_baseinfo_backup_info.build_start_at).format('YYYY-MM') : Dayjs(progressInfo.build_start_at).format('YYYY-MM') }}至{{
              haveNew ? Dayjs(progressInfo.project_baseinfo_backup_info.build_end_at).format('YYYY-MM') : Dayjs(progressInfo.build_end_at).format('YYYY-MM')
            }}</el-descriptions-item
          >
          <el-descriptions-item label="建设单位"> {{ haveNew ? progressInfo.project_baseinfo_backup_info.declare_unit : progressInfo.declare_unit }} </el-descriptions-item>
          <el-descriptions-item label="负责人">{{ haveNew ? progressInfo.project_baseinfo_backup_info.unit_charge_name : progressInfo.unit_charge_name }} </el-descriptions-item>
          <el-descriptions-item label="联系电话"> {{ haveNew ? progressInfo.project_baseinfo_backup_info.unit_charge_mobile : progressInfo.unit_charge_mobile }} </el-descriptions-item>
          <el-descriptions-item label="主要建设内容"> {{ haveNew ? progressInfo.project_baseinfo_backup_info.build_main_content : progressInfo.unit_charge_mobile }} </el-descriptions-item>

          <el-descriptions-item v-if="haveNew" label="新项目名称">{{ progressInfo.project_name }}</el-descriptions-item>
          <el-descriptions-item v-if="haveNew" label="新项目详细地点">{{ progressInfo.area_detail }}</el-descriptions-item>
          <el-descriptions-item v-if="haveNew" label="新建设期限"
            >{{ Dayjs(progressInfo.build_start_at).format('YYYY-MM') }}至{{ Dayjs(progressInfo.build_end_at).format('YYYY-MM') }}</el-descriptions-item
          >
          <el-descriptions-item v-if="haveNew" label="新建设单位"> {{ progressInfo.declare_unit }} </el-descriptions-item>
          <el-descriptions-item v-if="haveNew" label="新负责人">{{ progressInfo.unit_charge_name }} </el-descriptions-item>
          <el-descriptions-item v-if="haveNew" label="新联系电话"> {{ progressInfo.unit_charge_mobile }} </el-descriptions-item>

          <el-descriptions-item v-if="haveNew" label="新主要建设内容"> {{ newbuild_main_content }} </el-descriptions-item>
        </el-descriptions>
        <el-descriptions v-if="oldArray && oldArray.length" title="分项一：基础设施建设"></el-descriptions>
        <template v-for="(ele, index) in oldArray">
          <el-descriptions title="">
            <el-descriptions-item label="分项名称"> {{ ele.name }} </el-descriptions-item>
            <el-descriptions-item label="建设地点"> {{ ele.location }} </el-descriptions-item>
            <el-descriptions-item label="建设单位"> {{ ele.declare_unit }} </el-descriptions-item>
            <el-descriptions-item label="规模(数量)"> {{ ele.scale }} </el-descriptions-item>
            <el-descriptions-item label="投资金额(万元)"> {{ ele.invest_money }} </el-descriptions-item>
            <el-descriptions-item label="其中财政补助(万元)"> {{ ele.subsidy_money }} </el-descriptions-item>
            <el-descriptions-item label="进度安排"> {{ Dayjs(ele.schedule_start_at).format('YYYY-MM') }}至{{ Dayjs(ele.schedule_end_at).format('YYYY-MM') }}</el-descriptions-item>
          </el-descriptions>
        </template>
        <el-descriptions v-if="oldArray2 && oldArray2.length" :title="oldArray && oldArray.length ? '分项二：设施设备' : '分项一：设施设备'"></el-descriptions>
        <template v-for="(ele, index) in oldArray2">
          <el-descriptions title="">
            <el-descriptions-item label="分项名称"> {{ ele.name }} </el-descriptions-item>
            <el-descriptions-item label="建设地点"> {{ ele.location }} </el-descriptions-item>
            <el-descriptions-item label="建设单位"> {{ ele.declare_unit }} </el-descriptions-item>
            <el-descriptions-item label="规模(数量)"> {{ ele.scale }} </el-descriptions-item>
            <el-descriptions-item label="投资金额(万元)"> {{ ele.invest_money }} </el-descriptions-item>
            <el-descriptions-item label="其中财政补助(万元)"> {{ ele.subsidy_money }} </el-descriptions-item>
            <el-descriptions-item label="进度安排"> {{ Dayjs(ele.schedule_start_at).format('YYYY-MM') }}至{{ Dayjs(ele.schedule_end_at).format('YYYY-MM') }}</el-descriptions-item>
          </el-descriptions>
        </template>
        <el-descriptions
          v-if="oldArray3 && oldArray3.length"
          :title="oldArray2 && oldArray2.length ? (oldArray && oldArray.length ? '分项三：其他' : '分项二：其他') : oldArray && oldArray.length ? '分项二：其他' : '分项一：其他'"
        ></el-descriptions>
        <template v-for="(ele, index) in oldArray3">
          <el-descriptions title="">
            <el-descriptions-item label="分项名称"> {{ ele.name }} </el-descriptions-item>
            <el-descriptions-item label="建设地点"> {{ ele.location }} </el-descriptions-item>
            <el-descriptions-item label="建设单位"> {{ ele.declare_unit }} </el-descriptions-item>
            <el-descriptions-item label="规模(数量)"> {{ ele.scale }} </el-descriptions-item>
            <el-descriptions-item label="投资金额(万元)"> {{ ele.invest_money }} </el-descriptions-item>
            <el-descriptions-item label="其中财政补助(万元)"> {{ ele.subsidy_money }} </el-descriptions-item>
            <el-descriptions-item label="进度安排"> {{ Dayjs(ele.schedule_start_at).format('YYYY-MM') }}至{{ Dayjs(ele.schedule_end_at).format('YYYY-MM') }}</el-descriptions-item>
          </el-descriptions>
        </template>
        <el-descriptions title="合计" v-if="(oldArray && oldArray.length) || (oldArray2 && oldArray2.length) || (oldArray3 && oldArray3.length)">
          <el-descriptions-item label="计划总投资金额(万元)"> {{ moneyFormat(originTotal1) }} </el-descriptions-item>
          <el-descriptions-item label="计划财政补助总金额(万元)"> {{ moneyFormat(originTotal2) }} </el-descriptions-item>
        </el-descriptions>
        <el-descriptions v-if="newArray && newArray.length" title="新分项一：基础设施建设"> </el-descriptions>
        <template v-for="(ele, index) in newArray">
          <el-descriptions title="">
            <el-descriptions-item label="分项名称"> {{ ele.name }} </el-descriptions-item>
            <el-descriptions-item label="建设地点"> {{ ele.location }} </el-descriptions-item>
            <el-descriptions-item label="建设单位"> {{ ele.declare_unit }} </el-descriptions-item>
            <el-descriptions-item label="规模(数量)"> {{ ele.scale }} </el-descriptions-item>
            <el-descriptions-item label="投资金额(万元)"> {{ ele.invest_money }} </el-descriptions-item>
            <el-descriptions-item label="其中财政补助(万元)"> {{ ele.subsidy_money }} </el-descriptions-item>
            <el-descriptions-item label="进度安排"> {{ Dayjs(ele.schedule_start_at).format('YYYY-MM') }}至{{ Dayjs(ele.schedule_end_at).format('YYYY-MM') }}</el-descriptions-item>
          </el-descriptions>
        </template>
        <el-descriptions v-if="newArray2 && newArray2.length" :title="newArray && newArray.length ? '新分项二：设施设备' : '新分项一：设施设备'"></el-descriptions>
        <template v-for="(ele, index) in newArray2">
          <el-descriptions title="">
            <el-descriptions-item label="分项名称"> {{ ele.name }} </el-descriptions-item>
            <el-descriptions-item label="建设地点"> {{ ele.location }} </el-descriptions-item>
            <el-descriptions-item label="建设单位"> {{ ele.declare_unit }} </el-descriptions-item>
            <el-descriptions-item label="规模(数量)"> {{ ele.scale }} </el-descriptions-item>
            <el-descriptions-item label="投资金额(万元)"> {{ ele.invest_money }} </el-descriptions-item>
            <el-descriptions-item label="其中财政补助(万元)"> {{ ele.subsidy_money }} </el-descriptions-item>
            <el-descriptions-item label="进度安排"> {{ Dayjs(ele.schedule_start_at).format('YYYY-MM') }}至{{ Dayjs(ele.schedule_end_at).format('YYYY-MM') }}</el-descriptions-item>
          </el-descriptions>
        </template>
        <el-descriptions
          v-if="newArray3 && newArray3.length"
          :title="newArray2 && newArray2.length ? (newArray && newArray.length ? '新分项三：其他' : '新分项二：其他') : newArray && newArray.length ? '新分项二：其他' : '新分项一：其他'"
        ></el-descriptions>
        <template v-for="(ele, index) in newArray3">
          <el-descriptions title="">
            <el-descriptions-item label="分项名称"> {{ ele.name }} </el-descriptions-item>
            <el-descriptions-item label="建设地点"> {{ ele.location }} </el-descriptions-item>
            <el-descriptions-item label="建设单位"> {{ ele.declare_unit }} </el-descriptions-item>
            <el-descriptions-item label="规模(数量)"> {{ ele.scale }} </el-descriptions-item>
            <el-descriptions-item label="投资金额(万元)"> {{ ele.invest_money }} </el-descriptions-item>
            <el-descriptions-item label="其中财政补助(万元)"> {{ ele.subsidy_money }} </el-descriptions-item>
            <el-descriptions-item label="进度安排"> {{ Dayjs(ele.schedule_start_at).format('YYYY-MM') }}至{{ Dayjs(ele.schedule_end_at).format('YYYY-MM') }}</el-descriptions-item>
          </el-descriptions>
        </template>
        <el-descriptions title="新合计" v-if="(newArray && newArray.length) || (newArray2 && newArray2.length) || (newArray3 && newArray3.length)">
          <el-descriptions-item label="计划总投资金额(万元)"> {{ moneyFormat(newTotal1) }} </el-descriptions-item>
          <el-descriptions-item label="计划财政补助总金额(万元)"> {{ moneyFormat(newTotal2) }} </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>
<script>
export default {
  layout: 'main',
  head() {
    return {
      title: '项目申报进度',
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
      oldArray: [],
      oldArray2: [],
      oldArray3: [],
      newArray: [],
      newArray2: [],
      newArray3: [],
      originTotal1: 0,
      originTotal2: 0,
      newTotal2: 0,
      newTotal1: 0,
      haveNew: false,
      infoVisivle: false,
      showDuration: true,
      firstSuccess: false,
      firstFailed: false,
      onePointFiveSuccess: false,
      onePointFiveFailed: false,
      secondSuccess: false,
      secondFailed: false,
      thirdSuccess: false,
      thirdFailed: false,
      fourthSuccess: false,
      fourthFailed: false,
      blueCircle: 'https://img.hzanchu.com/acimg/6930491d509f6d6ae770865444b07295.png',
      redCircle: 'https://img.hzanchu.com/acimg/f3eea8456c0a4770b04d306530d42e7d.png',
      yellowCircle: 'https://img.hzanchu.com/acimg/1903e9542bc5a34a2c8bcbd37f7042b9.png',
      firstCircleImg: '',
      onePointFiveImg: '',
      secondCircleImg: '',
      thirdCircleImg: '',
      fourthCircleImg: '',
      fifthCircleImg: '',
      firstDotShow: false,

      fifthSuccess: false,
      fifthFailed: false,
      sixthDotShow: false,
      sixthCircleImg: '',
      sixthPopPositionAble: false,

      onePointFiveDotShow: false,
      secondDotShow: false,
      thirdDotShow: false,
      fourthDotShow: false,
      fifthDotShow: false,
      onePointFivePopPositionAble: false,

      secondPopPositionAble: false,
      thirdPopPositionAble: false,
      fourthPopPositionAble: false,
      fifthPopPositionAble: false,
      showOnePointFiveName: false,
      showFirstName: false,
      showSecondName: false,
      showThirdName: false,
      showFourthName: false,
      showFifthName: false,
      durationDay: 0,
      keywords: '',
      basicTable: [],
      currentPage: 1,
      pageSize: 999,
      total: 0,
      activeName: 'first',
      progressInfo: {},
      statusText: '',
      actionTypeMap: {
        1: '材料提交',
        2: '已驳回',
        3: '项目通过乡镇评审',
        4: '已驳回',
        5: '通过材料审核',
        59: '已驳回',
        6: '已驳回',
        7: '通过项目评审',
        8: '已驳回',
        9: '通过项目联审',
        10: '公示',
        11: '已驳回'
      },
      file_issued_attachment: [], // 文件下达的文件列表
      newbuild_main_content: ''
    }
  },
  mounted() {
    this.initAction()
    this.initRecord()
    this.initRequest()
  },
  methods: {
    popEditInfo() {
      this.infoVisivle = true
    },
    closeDialog() {
      this.infoVisivle = false
    },
    toProject() {
      this.$router.push({
        path: '/project'
      })
    },
    urgeAction() {
      console.log()
    },
    initRecord() {
      let data = {
        project_id: this.$route.query.project_id,
        page: this.currentPage,
        pagesize: this.pageSize,
        record_type: 1
      }
      this.ApiLists.fetchDeclarationRecordList(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.basicTable = res.data.list
            // this.total = res.data.total;
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    checkMyMaterial() {
      this.$router.push({
        path: '/project/material',
        query: {
          policy_document_id: this.$route.query.policy_document_id,
          project_id: this.$route.query.project_id
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleCurrentChange(e) {
      this.currentPage = e
      this.initRecord()
    },
    initAction() {
      this.$store.commit('changeMenuActive', '3')
    },
    moneyFormat(value) {
      if (value || value == 0) {
        if (value === 0) {
          return 0
        } else {
          let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2)
          return fix
        }
      }
    },
    initRequest() {
      let data = {
        project_id: this.$route.query.project_id
      }
      this.ApiLists.fetchProjectSchedule(data)
        .then((res) => {
          if (res && res.code === 0) {
            let x, y
            this.progressInfo = res.data.info
            this.haveNew = res.data.info && res.data.info.project_baseinfo_backup_info && res.data.info.project_baseinfo_backup_info.project_name ? true : false
            if (this.progressInfo.project_baseinfo_backup_info && this.progressInfo.project_baseinfo_backup_info.project_id) {
              this.ApiLists.fetchProjectImplementPlanDetail({
                project_id: this.progressInfo.project_baseinfo_backup_info.project_id
              })
                .then((res) => {
                  if (res && res.code == 0) {
                    let shorter = res.data.info
                    this.newbuild_main_content = shorter.build_main_content
                    let array3 = shorter.part_options.find((ele) => {
                      return ele.option_name == '基础设施建设'
                    })
                    let array4 = shorter.part_options.find((ele) => {
                      return ele.option_name == '设施设备'
                    })
                    if (array3 && array3.list && array3.list.length) {
                      this.newArray = array3.list
                    }
                    if (array4 && array4.list && array4.list.length) {
                      this.newArray2 = array4.list
                    }
                    let array5 = shorter.part_options.find((ele) => {
                      return ele.option_name == '其他'
                    })
                    if (array5 && array5.list && array5.list.length) {
                      this.newArray3 = array5.list
                    }
                    let count5 = 0
                    let temp5 = this.newArray.map((ele) => {
                      if (!ele.invest_money) {
                        return {
                          ...ele,
                          invest_money: ele.invest_money ? ele.invest_money : 0
                        }
                      } else {
                        return {
                          ...ele
                        }
                      }
                    })
                    if (temp5) {
                      let res1 = temp5.reduce((acc, current) => {
                        return acc + current.invest_money
                      }, 0)
                      count5 = res1
                    }
                    let count6 = 0
                    let temp6 = this.newArray2.map((ele) => {
                      if (!ele.invest_money) {
                        return {
                          ...ele,
                          invest_money: ele.invest_money ? ele.invest_money : 0
                        }
                      } else {
                        return {
                          ...ele
                        }
                      }
                    })
                    if (temp6) {
                      let res1 = temp6.reduce((acc, current) => {
                        return acc + current.invest_money
                      }, 0)
                      count6 = res1
                    }
                    let count10 = 0
                    let temp10 = this.newArray3.map((ele) => {
                      if (!ele.invest_money) {
                        return {
                          ...ele,
                          invest_money: ele.invest_money ? ele.invest_money : 0
                        }
                      } else {
                        return {
                          ...ele
                        }
                      }
                    })
                    if (temp10) {
                      let res1 = temp10.reduce((acc, current) => {
                        return acc + current.invest_money
                      }, 0)
                      count10 = res1
                    }
                    this.newTotal1 = count5 + count6 + count10
                    let count7 = 0
                    let temp7 = this.newArray.map((ele) => {
                      if (!ele.subsidy_money) {
                        return {
                          ...ele,
                          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                        }
                      } else {
                        return {
                          ...ele
                        }
                      }
                    })
                    if (temp7) {
                      let res1 = temp7.reduce((acc, current) => {
                        return acc + current.subsidy_money
                      }, 0)
                      count7 = res1
                    }
                    let count8 = 0
                    let temp8 = this.newArray2.map((ele) => {
                      if (!ele.subsidy_money) {
                        return {
                          ...ele,
                          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                        }
                      } else {
                        return {
                          ...ele
                        }
                      }
                    })
                    if (temp8) {
                      let res1 = temp8.reduce((acc, current) => {
                        return acc + current.subsidy_money
                      }, 0)
                      count8 = res1
                    }
                    let count11 = 0
                    let temp11 = this.newArray3.map((ele) => {
                      if (!ele.subsidy_money) {
                        return {
                          ...ele,
                          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                        }
                      } else {
                        return {
                          ...ele
                        }
                      }
                    })
                    if (temp11) {
                      let res1 = temp11.reduce((acc, current) => {
                        return acc + current.subsidy_money
                      }, 0)
                      count11 = res1
                    }
                    this.newTotal2 = count7 + count8 + count11
                  }
                })
                .catch((err) => {
                  console.log('err', err)
                })
              let array1 = this.progressInfo.project_baseinfo_backup_info.part_options.find((ele) => {
                return ele.option_name == '基础设施建设'
              })
              let array2 = this.progressInfo.project_baseinfo_backup_info.part_options.find((ele) => {
                return ele.option_name == '设施设备'
              })
              let array6 = this.progressInfo.project_baseinfo_backup_info.part_options.find((ele) => {
                return ele.option_name == '其他'
              })
              if (array1 && array1.list && array1.list.length) {
                this.oldArray = array1.list
              }
              if (array2 && array2.list && array2.list.length) {
                this.oldArray2 = array2.list
              }
              if (array6 && array6.list && array6.list.length) {
                this.oldArray3 = array6.list
              }
              let count1 = 0
              let temp1 = this.oldArray.map((ele) => {
                if (!ele.invest_money) {
                  return {
                    ...ele,
                    invest_money: ele.invest_money ? ele.invest_money : 0
                  }
                } else {
                  return {
                    ...ele
                  }
                }
              })
              if (temp1) {
                let res1 = temp1.reduce((acc, current) => {
                  return acc + current.invest_money
                }, 0)
                count1 = res1
              }
              let count2 = 0
              let temp2 = this.oldArray2.map((ele) => {
                if (!ele.invest_money) {
                  return {
                    ...ele,
                    invest_money: ele.invest_money ? ele.invest_money : 0
                  }
                } else {
                  return {
                    ...ele
                  }
                }
              })
              if (temp2) {
                let res1 = temp2.reduce((acc, current) => {
                  return acc + current.invest_money
                }, 0)
                count2 = res1
              }
              let count7 = 0
              let temp7 = this.oldArray3.map((ele) => {
                if (!ele.invest_money) {
                  return {
                    ...ele,
                    invest_money: ele.invest_money ? ele.invest_money : 0
                  }
                } else {
                  return {
                    ...ele
                  }
                }
              })
              if (temp7) {
                let res1 = temp7.reduce((acc, current) => {
                  return acc + current.invest_money
                }, 0)
                count7 = res1
              }
              this.originTotal1 = count2 + count1 + count7
              let count3 = 0
              let temp3 = this.oldArray.map((ele) => {
                if (!ele.subsidy_money) {
                  return {
                    ...ele,
                    subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                  }
                } else {
                  return {
                    ...ele
                  }
                }
              })
              if (temp3) {
                let res1 = temp3.reduce((acc, current) => {
                  return acc + current.subsidy_money
                }, 0)
                count3 = res1
              }
              let count4 = 0
              let temp4 = this.oldArray2.map((ele) => {
                if (!ele.subsidy_money) {
                  return {
                    ...ele,
                    subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                  }
                } else {
                  return {
                    ...ele
                  }
                }
              })
              if (temp4) {
                let res1 = temp4.reduce((acc, current) => {
                  return acc + current.subsidy_money
                }, 0)
                count4 = res1
              }
              let count8 = 0
              let temp8 = this.oldArray3.map((ele) => {
                if (!ele.subsidy_money) {
                  return {
                    ...ele,
                    subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                  }
                } else {
                  return {
                    ...ele
                  }
                }
              })
              if (temp8) {
                let res1 = temp8.reduce((acc, current) => {
                  return acc + current.subsidy_money
                }, 0)
                count8 = res1
              }
              this.originTotal2 = count3 + count4 + count8
            }
            // res.data.info.status = 45
            switch (res.data.info.status) {
              case 0:
                this.showFirstName = true
                this.statusText = '材料未全部提交'
                break
              case 1:
                this.showOnePointFiveName = true
                this.onePointFivePopPositionAble = true
                this.durationDay = duration
                this.statusText = '乡镇审核中'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.firstSuccess = true
                break
              case 3:
                this.showOnePointFiveName = true
                this.onePointFivePopPositionAble = true
                this.durationDay = duration
                this.statusText = '乡镇审核—不通过'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.yellowCircle
                this.firstSuccess = true
                break
              case 9:
                this.showOnePointFiveName = true
                this.onePointFivePopPositionAble = true
                this.durationDay = duration
                this.statusText = '乡镇审核不通过'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.redCircle
                this.firstSuccess = true
                // this.onePointFiveFailed = true
                break
              case 10:
                this.showSecondName = true
                this.secondPopPositionAble = true
                y = this.Dayjs(this.progressInfo.start_declare_at)
                x = this.Dayjs(Date.now())
                var duration = this.Dayjs.duration(x.diff(y)).format('D')
                this.durationDay = duration
                this.statusText = '材料审核中'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.secondDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.secondCircleImg = this.blueCircle
                this.firstSuccess = true
                this.onePointFiveSuccess = true
                break
              case 11:
                this.showSecondName = true
                this.secondPopPositionAble = true
                y = this.Dayjs(this.progressInfo.declare_notice_at)
                x = this.Dayjs(Date.now())
                var duration = this.Dayjs.duration(x.diff(y)).format('D')
                this.durationDay = duration
                this.statusText = '材料审核--不通过'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.secondDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.secondCircleImg = this.yellowCircle
                this.firstSuccess = true
                this.onePointFiveSuccess = true
                break
              case 20:
                this.showThirdName = true
                this.thirdPopPositionAble = true
                y = this.Dayjs(this.progressInfo.start_review_at)
                x = this.Dayjs(Date.now())
                var duration = this.Dayjs.duration(x.diff(y)).format('D')
                this.durationDay = duration
                this.statusText = '评审中'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.secondDotShow = true
                this.thirdDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.secondCircleImg = this.blueCircle
                this.thirdCircleImg = this.blueCircle
                this.firstSuccess = true
                this.onePointFiveSuccess = true
                this.secondSuccess = true
                break
              case 21:
                this.showThirdName = true
                this.thirdPopPositionAble = true
                y = this.Dayjs(this.progressInfo.review_notice_at)
                x = this.Dayjs(Date.now())
                var duration = this.Dayjs.duration(x.diff(y)).format('D')
                this.durationDay = duration
                this.statusText = '评审--不通过'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.secondDotShow = true
                this.thirdDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.secondCircleImg = this.blueCircle
                this.thirdCircleImg = this.yellowCircle
                this.firstSuccess = true
                this.onePointFiveSuccess = true
                this.secondSuccess = true
                break
              case 29:
                this.showThirdName = true
                this.thirdPopPositionAble = true
                y = this.Dayjs(this.progressInfo.review_nopass_at)
                x = this.Dayjs(Date.now())
                var duration = this.Dayjs.duration(x.diff(y)).format('D')
                this.durationDay = duration
                this.statusText = '评审--不通过'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.secondDotShow = true
                this.thirdDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.secondCircleImg = this.blueCircle
                this.thirdCircleImg = this.redCircle
                this.firstFailed = true
                this.onePointFiveFailed = true
                this.secondFailed = true
                break
              case 30:
                this.showFourthName = true
                this.fourthPopPositionAble = true
                y = this.Dayjs(this.progressInfo.start_unit_at)
                x = this.Dayjs(Date.now())
                var duration = this.Dayjs.duration(x.diff(y)).format('D')
                this.durationDay = duration
                this.statusText = '联审中'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.secondDotShow = true
                this.thirdDotShow = true
                this.fourthDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.secondCircleImg = this.blueCircle
                this.thirdCircleImg = this.blueCircle
                this.fourthCircleImg = this.blueCircle
                this.firstSuccess = true
                this.onePointFiveSuccess = true
                this.secondSuccess = true
                this.thirdSuccess = true
                break
              case 31:
                this.showFourthName = true
                this.fourthPopPositionAble = true
                y = this.Dayjs(this.progressInfo.unit_notice_at)
                x = this.Dayjs(Date.now())
                var duration = this.Dayjs.duration(x.diff(y)).format('D')
                this.durationDay = duration
                this.statusText = '联审--不通过'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.secondDotShow = true
                this.thirdDotShow = true
                this.fourthDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.secondCircleImg = this.blueCircle
                this.thirdCircleImg = this.blueCircle
                this.fourthCircleImg = this.yellowCircle
                this.firstSuccess = true
                this.onePointFiveSuccess = true
                this.secondSuccess = true
                this.thirdSuccess = true
                break
              case 39:
                this.showFourthName = true
                this.fourthPopPositionAble = true
                y = this.Dayjs(this.progressInfo.unit_nopass_at)
                x = this.Dayjs(Date.now())
                var duration = this.Dayjs.duration(x.diff(y)).format('D')
                this.durationDay = duration
                this.statusText = '联审--不通过'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.secondDotShow = true
                this.thirdDotShow = true
                this.fourthDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.secondCircleImg = this.blueCircle
                this.thirdCircleImg = this.blueCircle
                this.fourthCircleImg = this.redCircle
                this.firstFailed = true
                this.onePointFiveFailed = true
                this.secondFailed = true
                this.thirdFailed = true
                break
              case 40:
                this.showFifthName = true
                this.fifthPopPositionAble = true
                y = this.Dayjs(this.progressInfo.pass_at)
                x = this.Dayjs(Date.now())
                var duration = this.Dayjs.duration(x.diff(y)).format('D')
                this.durationDay = duration
                this.statusText = '公示中'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.secondDotShow = true
                this.thirdDotShow = true
                this.fourthDotShow = true
                this.fifthDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.secondCircleImg = this.blueCircle
                this.thirdCircleImg = this.blueCircle
                this.fourthCircleImg = this.blueCircle
                this.fifthCircleImg = this.blueCircle
                this.firstSuccess = true
                this.onePointFiveSuccess = true
                this.secondSuccess = true
                this.thirdSuccess = true
                this.fourthSuccess = true
                this.showDuration = false

                break
              case 43:
                this.showFifthName = true
                this.fifthPopPositionAble = true
                y = this.Dayjs(this.progressInfo.pass_at)
                x = this.Dayjs(Date.now())
                var duration = this.Dayjs.duration(x.diff(y)).format('D')
                this.durationDay = duration
                this.statusText = '公示不通过'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.secondDotShow = true
                this.thirdDotShow = true
                this.fourthDotShow = true
                this.fifthDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.secondCircleImg = this.blueCircle
                this.thirdCircleImg = this.blueCircle
                this.fourthCircleImg = this.blueCircle
                this.fifthCircleImg = this.redCircle
                this.firstSuccess = true
                this.onePointFiveSuccess = true
                this.secondSuccess = true
                this.thirdSuccess = true
                this.fourthSuccess = true
                this.showDuration = false
                break
              case 45:
              case 50:
              case 51:
              case 52:
              case 59:
              case 60:
              case 61:
              case 62:
              case 69:
              case 70:
              case 71:
              case 72:
              case 73:
              case 74:
              case 79:
                this.$emit('showTabs', true)
                this.showFifthName = true
                this.sixthPopPositionAble = true
                y = this.Dayjs(this.progressInfo.pass_at)
                x = this.Dayjs(Date.now())
                var duration = this.Dayjs.duration(x.diff(y)).format('D')
                this.durationDay = duration
                this.statusText = '文件下达'
                this.firstDotShow = true
                this.onePointFiveDotShow = true
                this.secondDotShow = true
                this.thirdDotShow = true
                this.fourthDotShow = true
                this.fifthDotShow = true
                this.firstCircleImg = this.blueCircle
                this.onePointFiveImg = this.blueCircle
                this.secondCircleImg = this.blueCircle
                this.thirdCircleImg = this.blueCircle
                this.fourthCircleImg = this.blueCircle
                this.fifthCircleImg = this.blueCircle
                this.firstSuccess = true
                this.onePointFiveSuccess = true
                this.secondSuccess = true
                this.thirdSuccess = true
                this.fourthSuccess = true
                this.showDuration = false
                this.fifthSuccess = true
                this.sixthDotShow = true
                this.sixthCircleImg = this.blueCircle
                break
            }
            this.file_issued_attachment = res.data.info.file_issued_attachment
          }
        })
        .catch((err) => {
          console.log('er', err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.withCursor {
  cursor: pointer;
}
.urgeTrigger {
  color: #0270c3;
  cursor: pointer;
}
.progressBody {
  width: 95%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: center;
}
.infoFirstLineGrey {
  font-size: 14px;
  font-weight: bold;
  color: #666;
}
.dialogScroll {
}
::v-deep .setMiddleDialog {
  .el-dialog {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto !important;
  }
}
::v-deep .dialogInfo {
  .el-dialog {
    height: 500px;
  }
  .el-dialog__body {
    height: 380px;
    overflow-y: scroll;
  }
}
.checkEditInfo {
  border: 1px solid #0270c3;
  padding: 5px;
  border-radius: 4px;
  box-sizing: border-box;
  color: #0270c3;
  font-size: 14px;
  cursor: pointer;
}
.DotCon {
  box-sizing: border-box;
  padding-top: 10px;
  margin-bottom: 10px;
  width: 150px;
  background-color: #fff;
  z-index: 5;
  position: relative;
}
.popoverBetween {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #666;
  margin-top: 10px;
}
.progressOkCon {
  width: 150px;
  background-color: #fff;
  z-index: 5;
  margin-bottom: 10px;
  position: relative;
}
.commonProgressWidth {
  width: 150px;
  text-align: center;
}
.progressOk {
  height: 30px;
  width: 30px;
}
.Dot {
  background-color: #ccc;
  height: 10px;
  width: 10px;
  border-radius: 5px;
  margin: 0 auto;
}
.progressPoint {
  text-align: center;
  position: relative;
  overflow-x: hidden;
  flex: 1;

  &:after {
    top: 13px;
    position: absolute;
    content: ' ';
    width: 888px;
    z-index: 2;
    height: 3px;
    left: 0;
    background-color: #ccc;
    border-radius: 2px;
  }

  &:first-child {
    &:after {
      left: 70px;
    }
  }

  &:last-child {
    flex: none;

    &:after {
      width: 70px;
    }
  }
}
.progressSuccess {
  &:after {
    background-color: #0270c3 !important;
  }
}

.progressFailed {
  &:after {
    background-color: #0270c3 !important;
    //background-color: #ca3102 !important;
  }
}
.projectPageCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
}
.centerCon {
  width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  box-sizing: border-box;
}
.contentCon {
  //margin-top: 20px;
  //padding: 20px 30px 30px;
  box-sizing: border-box;
  background-color: #fff;
  //margin-bottom: 20px;
}
.submitMaster {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
}
.answerTrigger {
  font-size: 16px;
  color: #0270c3;
  line-height: 32px;
  margin-right: 30px;
  cursor: pointer;
}
.progressBarCon {
  padding-top: 100px;
  position: relative;
}
.popoverCon {
  width: 220px;
  padding: 10px;
  box-sizing: border-box;
  position: absolute;
  height: 80px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  z-index: 10;
  top: 10px;
  left: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.onePointFivePopPosition {
  left: calc(1 * 14%) !important;
}
.secondPopPosition {
  // left: calc(2 * 14%) !important;
  left: calc(2 * 8%) !important;
}
.thirdPopPosition {
  // left: calc(3 * 14%) !important;
  left: calc(3 * 11%) !important;
}
.fourthPopPosition {
  // left: calc(3.8 * 14%) !important;
  left: calc(3.8 * 13%) !important;
}
.fifthPopPosition {
  // left: calc(4.8 * 14%) !important;
  left: calc(5 * 13%) !important;
}
.sixthPopPosition {
  left: calc(5.8 * 14%) !important;
}
.resetZIndex {
  z-index: 11;
}
.smallaprial {
  font-size: 14px;
  margin-top: 5px;
}
.firstTopTitle {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}
.firstMiddleBottom {
  margin-bottom: 30px;
}
.firstTableCon {
}
.progressCon {
  .firstTopLine {
    margin-top: 20px;
    .firstTopTitleCon {
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
    }
  }
  .firstMiddleLine {
    margin-top: 44px;
  }
}
.limitSearch {
  width: 484px;
  margin-right: 20px;
}
.searchCon {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  margin-bottom: 22px;
}
.coverBtn {
  border-color: #0270c3;
  color: #0270c3;
}
.title {
  font-size: 16px;
  color: #333;
}
.tableCon {
}
.operateBtn {
  color: #0270c3;
  cursor: pointer;
}
.pagination-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  margin-top: 20px;
  .pagination-info {
    margin-bottom: 0px;
    margin-right: 1%;
  }
}

.fileContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  a {
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    color: #0270c3;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
