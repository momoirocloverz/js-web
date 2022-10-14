<template>
  <div class="implementationPlanCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toProject">项目办事</el-breadcrumb-item>
          <el-breadcrumb-item class="withCursor" @click.native="toProject">我的申报</el-breadcrumb-item>
          <el-breadcrumb-item class="withCursor" @click.native="toMaterial">申报材料</el-breadcrumb-item>
          <el-breadcrumb-item>材料填写</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon">
        <helpCom class="setHelpPosition" :name="currentInfo.linkman && currentInfo.linkman.real_name" :phone="currentInfo.linkman && currentInfo.linkman.mobile" />
        <div class="contentTitle spPadding">实施方案简表</div>
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="140px" class="demo-dynamic">
          <div class="spPadding">
            <el-form-item
              label="项目名称"
              prop="project_name"
              :rules="{
                required: true,
                message: '项目名称不能为空',
                trigger: 'blur'
              }"
            >
              <el-input maxlength="30" v-model="dynamicValidateForm.project_name" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="项目建设地点">
              <div class="flexDate">
                <span v-for="(item, index) in dynamicValidateForm.area_ids" :key="index">{{ item }}</span>
                <!--                <el-cascader
                  class="resetDateWidth"
                  v-model="dynamicValidateForm.province"
                  @change="provinceChange"
                  :options="options"
                ></el-cascader>
                <el-cascader
                  class="resetDateWidth"
                  v-model="dynamicValidateForm.city"
                  :options="options2"
                  @change="cityChange"
                ></el-cascader>
                <el-cascader
                  class="resetDateWidth"
                  v-model="dynamicValidateForm.area"
                  :options="options3"
                  @change="areaChange"
                ></el-cascader>-->
              </div>
            </el-form-item>
            <el-form-item
              label="详细地址"
              prop="area_detail"
              :rules="{
                required: true,
                message: '详细地址不能为空',
                trigger: 'blur'
              }"
            >
              <el-input maxlength="50" v-model.trim="dynamicValidateForm.area_detail" placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item
              label="建设期限"
              prop="build_at"
              :rules="{
                required: true,
                message: '期限不能为空',
                trigger: 'blur'
              }"
            >
              <el-date-picker
                class="setDate2Picker"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM"
                v-model="dynamicValidateForm.build_at"
                type="monthrange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="建设单位"
              prop="declare_unit"
              :rules="{
                required: true,
                message: '建设单位不能为空',
                trigger: 'blur'
              }"
            >
              <el-input maxlength="30" placeholder="请输入建设单位" v-model.trim="dynamicValidateForm.declare_unit"></el-input>
            </el-form-item>
            <el-form-item
              label="负责人"
              prop="unit_charge_name"
              :rules="{
                required: true,
                message: '负责人不能为空',
                trigger: 'blur'
              }"
            >
              <el-input maxlength="10" placeholder="请输入负责人" v-model="dynamicValidateForm.unit_charge_name"></el-input>
            </el-form-item>
            <el-form-item
              label="联系电话"
              prop="unit_charge_mobile"
              :rules="{
                required: true,
                message: '联系电话不能为空',
                trigger: 'blur'
              }"
            >
              <el-input placeholder="请输入联系电话" v-model.trim="dynamicValidateForm.unit_charge_mobile" maxlength="11"></el-input>
            </el-form-item>
            <!-- <el-form-item label="申报时间">
              <el-input v-model="dynamicValidateForm.project_name"></el-input>
            </el-form-item> -->
            <el-form-item
              label="土地性质或来源"
              prop="land_info"
              :rules="{
                required: true,
                message: '土地性质或来源不能为空',
                trigger: 'blur'
              }"
            >
              <el-input maxlength="30" placeholder="请填写土地性质或来源，30字以内" v-model.trim="dynamicValidateForm.land_info"></el-input>
            </el-form-item>
            <el-form-item
              label="主要建设内容"
              prop="build_main_content"
              :rules="{
                required: true,
                message: '主要建设内容不能为空',
                trigger: 'blur'
              }"
            >
              <el-input type="textarea" rows="5" maxlength="200" placeholder="请填写主要建设内容，200字以内" v-model.trim="dynamicValidateForm.build_main_content"></el-input>
            </el-form-item>
          </div>
          <div class="contentTitle spPadding">分项1：基础设施建设</div>
          <el-table class="basic-table" :data="dynamicValidateForm.firstTable">
            <el-table-column label="分项名称" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.name }}</span>
                <el-form-item class="removeMarginItem" :prop="'firstTable.' + scope.$index + '.name'" :rules="[{ required: true, message: '名称不能为空' }]" v-else>
                  <el-input maxlength="50" v-model.trim="scope.row.name"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="建设地点" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.location }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'firstTable.' + scope.$index + '.location'" :rules="[{ required: true, message: '地点不能为空' }]">
                  <el-input maxlength="30" v-model.trim="scope.row.location"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="建设单位" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.declare_unit }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'firstTable.' + scope.$index + '.declare_unit'" :rules="[{ required: true, message: '单位不能为空' }]">
                  <el-input maxlength="30" v-model.trim="scope.row.declare_unit"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="规模（数量）" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.scale }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'firstTable.' + scope.$index + '.scale'" :rules="[{ required: true, message: '规模不能为空' }]">
                  <el-input maxlength="10" v-model.trim="scope.row.scale"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="投资金额(万元)" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.invest_money }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'firstTable.' + scope.$index + '.invest_money'" :rules="[{ required: true, message: '金额不能为空' }]">
                  <el-input-number class="inputNumberSet" controls-position="right" :min="0" :precision="2" @change="commonChange" v-model="scope.row.invest_money" :step="1"></el-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="其中财政补助(万元)" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.subsidy_money }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'firstTable.' + scope.$index + '.subsidy_money'" :rules="[{ required: true, message: '财政补助不能为空' }]">
                  <el-input-number class="inputNumberSet" controls-position="right" :min="0" :precision="2" @change="commonChange" v-model="scope.row.subsidy_money" :step="1"></el-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="进度安排" align="center" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.schedule_at }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'firstTable.' + scope.$index + '.schedule_at'" :rules="[{ required: true, message: '进度不能为空' }]">
                  <el-date-picker
                    class="setDatePicker"
                    v-model="scope.row.schedule_at"
                    type="monthrange"
                    align="right"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                    :picker-options="pickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="setActionColor">
                  <div class="actionCursor" v-if="scope.row.editStatus" @click="scope.row.editStatus = false">编辑</div>
                  <div v-else>
                    <!-- <div
                      class="actionCursor"
                      @click="scope.row.editStatus = true"
                    >
                      保存
                    </div> -->
                    <!-- <div
                      class="actionCursor"
                      @click="scope.row.editStatus = true"
                    >
                      取消
                    </div> -->
                    <div class="deleteResetBtn" @click="delete1Current(scope)">
                      <i class="el-icon-delete"></i>
                    </div>
                    <!-- <div class="actionCursor" @click="delete1Current(scope)">删除</div> -->
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="alignCenter">
            <div @click="add1Domain" class="addColors">
              <i class="el-icon-circle-plus-outline"></i>
              <span>新增分项1</span>
            </div>
            <!-- <el-button @click="add1Domain" type="primary" class="deleteResetBtn resetBlue" icon="el-icon-plus" size="small">新增</el-button> -->
          </div>
          <div class="contentTitle spPadding">分项2：设施设备</div>
          <el-table class="basic-table" :data="dynamicValidateForm.secondTable">
            <el-table-column label="分项名称" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.name }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'secondTable.' + scope.$index + '.name'" :rules="[{ required: true, message: '名称不能为空' }]">
                  <el-input maxlength="30" v-model.trim="scope.row.name"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="建设地点" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.location }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'secondTable.' + scope.$index + '.location'" :rules="[{ required: true, message: '地点不能为空' }]">
                  <el-input maxlength="30" v-model.trim="scope.row.location"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="建设单位" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.declare_unit }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'secondTable.' + scope.$index + '.declare_unit'" :rules="[{ required: true, message: '单位不能为空' }]">
                  <el-input maxlength="30" v-model.trim="scope.row.declare_unit"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="规模（数量）" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.scale }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'secondTable.' + scope.$index + '.scale'" :rules="[{ required: true, message: '规模不能为空' }]">
                  <el-input maxlength="10" v-model.trim="scope.row.scale"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="投资金额(万元)" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.invest_money }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'secondTable.' + scope.$index + '.invest_money'" :rules="[{ required: true, message: '金额不能为空' }]">
                  <el-input-number class="inputNumberSet" controls-position="right" :min="0" :precision="2" @change="commonChange" v-model="scope.row.invest_money" :step="1"></el-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="其中财政补助(万元)" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.subsidy_money }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'secondTable.' + scope.$index + '.subsidy_money'" :rules="[{ required: true, message: '财政补助不能为空' }]">
                  <el-input-number class="inputNumberSet" controls-position="right" :min="0" :precision="2" @change="commonChange" v-model="scope.row.subsidy_money" :step="1"></el-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="进度安排" align="center" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.schedule_at }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'secondTable.' + scope.$index + '.schedule_at'" :rules="[{ required: true, message: '进度安排不能为空' }]">
                  <el-date-picker
                    class="setDatePicker"
                    v-model="scope.row.schedule_at"
                    type="monthrange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                    :picker-options="pickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="setActionColor">
                  <div class="actionCursor" v-if="scope.row.editStatus" @click="scope.row.editStatus = false">编辑</div>
                  <div v-else>
                    <!-- <div
                      class="actionCursor"
                      @click="scope.row.editStatus = true"
                    >
                      保存
                    </div> -->
                    <!-- <div
                      class="actionCursor"
                      @click="scope.row.editStatus = true"
                    >
                      取消
                    </div> -->
                    <!-- <div class="actionCursor" @click="delete2Current(scope)">删除</div> -->
                    <div class="deleteResetBtn" @click="delete2Current(scope)">
                      <i class="el-icon-delete"></i>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="alignCenter">
            <!-- <el-button @click="add2Domain" class="deleteResetBtn resetBlue" icon="el-icon-plus" type="primary" size="small">新增</el-button> -->
            <div @click="add2Domain" class="addColors">
              <i class="el-icon-circle-plus-outline"></i>
              <span>新增分项2</span>
            </div>
          </div>

          <div class="contentTitle spPadding">分项3：其他</div>
          <el-table class="basic-table" :data="dynamicValidateForm.thirdTable">
            <el-table-column label="分项名称" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.name }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'thirdTable.' + scope.$index + '.name'" :rules="[{ required: true, message: '名称不能为空' }]">
                  <el-input v-model="scope.row.name"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="建设地点" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.location }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'thirdTable.' + scope.$index + '.location'" :rules="[{ required: true, message: '地点不能为空' }]">
                  <el-input maxlength="30" v-model.trim="scope.row.location"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="建设单位" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.declare_unit }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'thirdTable.' + scope.$index + '.declare_unit'" :rules="[{ required: true, message: '单位不能为空' }]">
                  <el-input maxlength="30" v-model.trim="scope.row.declare_unit"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="规模（数量）" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.scale }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'thirdTable.' + scope.$index + '.scale'" :rules="[{ required: true, message: '规模不能为空' }]">
                  <el-input maxlength="10" v-model.trim="scope.row.scale"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="投资金额(万元)" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.invest_money }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'thirdTable.' + scope.$index + '.invest_money'" :rules="[{ required: true, message: '投资金额不能为空' }]">
                  <el-input-number class="inputNumberSet" controls-position="right" :min="0" :precision="2" @change="commonChange" v-model="scope.row.invest_money" :step="1"></el-input-number>
                  <!-- <el-input v-model="scope.row.invest_money"></el-input> -->
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="其中财政补助(万元)" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.subsidy_money }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'thirdTable.' + scope.$index + '.subsidy_money'" :rules="[{ required: true, message: '财政补助不能为空' }]">
                  <el-input-number class="inputNumberSet" controls-position="right" :min="0" :precision="2" @change="commonChange" v-model="scope.row.subsidy_money" :step="1"></el-input-number>
                  <!-- <el-input v-model="scope.row.subsidy_money"></el-input> -->
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="进度安排" align="center" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.schedule_at }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'thirdTable.' + scope.$index + '.schedule_at'" :rules="[{ required: true, message: '进度安排不能为空' }]">
                  <el-date-picker
                    class="setDatePicker"
                    v-model="scope.row.schedule_at"
                    type="monthrange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                    :picker-options="pickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="setActionColor">
                  <div class="actionCursor" v-if="scope.row.editStatus" @click="scope.row.editStatus = false">编辑</div>
                  <div v-else>
                    <!-- <div class="actionCursor">
                      保存
                    </div> -->
                    <!-- <div
                      class="actionCursor"
                      @click="scope.row.editStatus = true"
                    >
                      取消
                    </div> -->
                    <!-- <div class="actionCursor" @click="delete3Current(scope)">删除</div> -->
                    <div class="deleteResetBtn" @click="delete3Current(scope)">
                      <i class="el-icon-delete"></i>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="alignCenter">
            <!-- <el-button @click="add3Domain" class="deleteResetBtn resetBlue" icon="el-icon-plus" type="primary" size="small">新增</el-button> -->
            <div @click="add3Domain" class="addColors">
              <i class="el-icon-circle-plus-outline"></i>
              <span>新增分项3</span>
            </div>
          </div>
          <div class="totalCon">
            <div class="common"></div>
            <div class="common">合计</div>
            <div class="common"></div>
            <div class="common"></div>
            <div class="common">{{ moneyFormat(invest_moneyTotal) }}</div>
            <div class="common">{{ moneyFormat(subsidy_moneyTotal) }}</div>
            <div class="common"></div>
            <div class="common"></div>
          </div>
          <div class="alignCenter">
            <el-button type="primary" class="submitBtn resetBlue" @click="submitForm('dynamicValidateForm')" size="small" :disabled="submitDisable">提交</el-button>
            <!-- <el-button @click="resetForm('dynamicValidateForm')"
                >重置</el-button
              > -->
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog class="uploadDialog" title="上传" width="630px" :before-close="handleCloseForNew" :visible.sync="addVisible" :close-on-click-modal="false">
      <div class="uploadCon"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shutDialog">取 消</el-button>
        <el-button type="primary" @click="startUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import provinceData from '/static/city-data/province.js'
import cityData from '/static/city-data/city.js'
import areaData from '/static/city-data/area.js'
import dayjs from 'dayjs'
export default {
  layout: 'main',
  head() {
    return {
      title: '实施方案简表',
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
      invest_moneyTotal: 0,
      subsidy_moneyTotal: 0,
      // options: provinceData,
      // options2: [],
      // options3: [],
      // track1Index: 0,
      // track2Index: 0,
      // track1Item: {},
      // track2Item: {},
      // track3Item: {},
      pickerOptions: {
        shortcuts: [
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()])
            }
          },
          {
            text: '今年至今',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date().getFullYear(), 0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 6)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      activeName: 'first',
      currentInfo: {},
      addVisible: false,
      project_id: '',
      submitDisable: false,
      submitTimer: null,
      dynamicValidateForm: {
        firstTable: [],
        secondTable: [],
        thirdTable: [
          //   {
          //     name: "",
          //     location: "",
          //     declare_unit: "",
          //     scale: "",
          //     invest_money: "",
          //     subsidy_money: "",
          //     schedule_start_at: "",
          //     schedule_end_at: "",
          //     schedule_at: "",
          //     editStatus: false
          //   }
        ],
        area_detail: '',
        area_ids: [],
        area_ids_store: [],
        build_start_at: '',
        build_end_at: '',
        build_at: '',
        unit_charge_name: '',
        unit_charge_mobile: '',
        declare_unit: '',
        province: '',
        city: '',
        area: '',
        project_name: '',
        land_info: '',
        build_main_content: ''
      }
    }
  },
  mounted() {
    this.initAction()
    this.initRequest()
    this.initHelp()
    const address = decodeURIComponent(this.$route.query.address)
    this.dynamicValidateForm.area_ids = address.split(',')
  },
  methods: {
    initHelp() {
      let data = {
        id: this.$route.query.policy_document_id
      }
      this.ApiLists.fetchPolicyDocumentInfo(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.currentInfo = res.data
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
    toMaterial() {
      this.$router.push({
        path: '/project/material',
        query: {
          policy_document_id: this.$route.query.policy_document_id,
          project_id: this.$route.query.project_id
        }
      })
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
    // provinceChange(value) {
    //   this.options3 = [];
    //   //   this.province = "";
    //   this.city = "";
    //   this.area = "";
    //   let hi = this.options.findIndex(ele => {
    //     return value[0] == ele.value;
    //   });
    //   this.track1Item = this.options[hi];
    //   this.track1Index = hi;
    //   this.options2 = cityData[hi];
    // },
    // cityChange(value) {
    //   this.area = "";
    //   let hi = this.options2.findIndex(ele => {
    //     return value[0] == ele.value;
    //   });
    //   this.track2Item = this.options2[hi];
    //   this.track2Index = hi;
    //   this.options3 = areaData[this.track1Index][hi];
    // },
    // areaChange(value) {
    //   console.log(value);
    //   let hi = this.options3.find(ele => {
    //     return value[0] == ele.value;
    //   });
    //   console.log("h2333i", hi);
    //   this.track3Item = hi;
    // },
    add1Domain() {
      this.dynamicValidateForm.firstTable.push({
        name: '',
        location: '',
        declare_unit: '',
        scale: '',
        invest_money: '',
        subsidy_money: '',
        schedule_start_at: '',
        schedule_end_at: '',
        schedule_at: '',
        editStatus: false
      })
    },
    add2Domain() {
      this.dynamicValidateForm.secondTable.push({
        name: '',
        location: '',
        declare_unit: '',
        scale: '',
        invest_money: '',
        subsidy_money: '',
        schedule_start_at: '',
        schedule_end_at: '',
        schedule_at: '',
        editStatus: false
      })
    },
    add3Domain() {
      this.dynamicValidateForm.thirdTable.push({
        name: '',
        location: '',
        declare_unit: '',
        scale: '',
        invest_money: '',
        subsidy_money: '',
        schedule_start_at: '',
        schedule_end_at: '',
        schedule_at: '',
        editStatus: false
      })
    },
    delete1Current(scope) {
      var index = scope.$index
      if (index !== -1) {
        this.dynamicValidateForm.firstTable.splice(index, 1)
        this.$forceUpdate()
        this.calcFunction()
      }
    },
    delete2Current(scope) {
      var index = scope.$index
      if (index !== -1) {
        this.dynamicValidateForm.secondTable.splice(index, 1)
        this.$forceUpdate()
        this.calcFunction()
      }
    },
    delete3Current(scope) {
      var index = scope.$index
      if (index !== -1) {
        this.dynamicValidateForm.thirdTable.splice(index, 1)
        this.$forceUpdate()
        this.calcFunction()
      }
    },
    fetchPreserveData(res) {
      if (this.$route.query.project_reserve_id > 0) {
        this.ApiLists.projectReserveDetail({ id: this.$route.query.project_reserve_id })
          .then((res) => {
            let shorter = res.data.info
            this.dynamicValidateForm.project_name = shorter.project_name
            this.dynamicValidateForm.build_start_at = shorter.build_start_at
            this.dynamicValidateForm.build_end_at = shorter.build_end_at
            if (shorter.build_start_at && shorter.build_end_at) {
              this.dynamicValidateForm.build_at = [shorter.build_start_at, shorter.build_end_at]
            }
            this.dynamicValidateForm.unit_charge_name = shorter.unit_charge_name
            this.dynamicValidateForm.unit_charge_mobile = shorter.unit_charge_mobile
            this.dynamicValidateForm.declare_unit = shorter.declare_unit
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        console.log('没有选择储备')
        this.normalSet(res)
      }
    },
    normalSet(res) {
      this.dynamicValidateForm.project_name = res.data.info.project_name
      this.dynamicValidateForm.land_info = res.data.info.land_info
      this.dynamicValidateForm.build_main_content = res.data.info.build_main_content

      this.dynamicValidateForm.area_detail = res.data.info.area_detail
      this.dynamicValidateForm.area_ids = res.data.info.area_ids
      this.dynamicValidateForm.area_ids_store = res.data.info.area_ids_store
      this.dynamicValidateForm.build_start_at = res.data.info.build_start_at
      this.dynamicValidateForm.build_end_at = res.data.info.build_end_at
      this.dynamicValidateForm.build_at = [res.data.info.build_start_at, res.data.info.build_end_at]
      this.dynamicValidateForm.unit_charge_name = res.data.info.unit_charge_name
      this.dynamicValidateForm.unit_charge_mobile = res.data.info.unit_charge_mobile
      this.dynamicValidateForm.declare_unit = res.data.info.declare_unit
      let track1 = []
      let track2 = []
      let track3 = []
      if (res.data.info.part_options) {
        let bridge1 = res.data.info.part_options.find((ele) => {
          return ele.option_name == '基础设施建设'
        })
        track1 = (bridge1 && bridge1.list) || []
        track1.forEach((ele) => {
          ele.schedule_at = [ele.schedule_start_at, ele.schedule_end_at]
        })
        let bridge2 = res.data.info.part_options.find((ele) => {
          return ele.option_name == '设施设备'
        })
        track2 = (bridge2 && bridge2.list) || []
        track2.forEach((ele) => {
          ele.schedule_at = [ele.schedule_start_at, ele.schedule_end_at]
        })
        let bridge3 = res.data.info.part_options.find((ele) => {
          return ele.option_name == '其他'
        })
        track3 = (bridge3 && bridge3.list) || []
        track3.forEach((ele) => {
          ele.schedule_at = [ele.schedule_start_at, ele.schedule_end_at]
        })
      }
      this.dynamicValidateForm.firstTable = track1
      this.dynamicValidateForm.secondTable = track2
      this.dynamicValidateForm.thirdTable = track3
      this.$nextTick(() => {
        this.calcFunction()
      })
    },
    fetchAnother() {
      this.ApiLists.fetchProjectDeclarationDetail({
        project_id: this.$route.query.project_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            if (res.data.info.project_name) {
              let shorter = res.data.info
              this.dynamicValidateForm.project_name = shorter.project_name
              this.dynamicValidateForm.build_start_at = shorter.build_start_at
              this.dynamicValidateForm.build_end_at = shorter.build_end_at
              if (shorter.build_start_at && shorter.build_end_at) {
                this.dynamicValidateForm.build_at = [shorter.build_start_at, shorter.build_end_at]
              }
              this.dynamicValidateForm.unit_charge_name = shorter.unit_charge_name
              this.dynamicValidateForm.unit_charge_mobile = shorter.unit_charge_mobile
              this.dynamicValidateForm.declare_unit = shorter.declare_unit
              this.dynamicValidateForm.area_detail = shorter.area_detail
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    initRequest() {
      if (this.$route.query.project_id) {
        this.ApiLists.fetchProjectImplementPlanDetail({
          project_id: this.$route.query.project_id
        })
          .then((res) => {
            if (res && res.code == 0) {
              if (res.data.info && res.data.info.project_name) {
                if (this.$route.query.is_implement_plan_reserve_change == 1) {
                  this.normalSet(res)
                } else {
                  this.fetchPreserveData(res)
                }
                // this.dynamicValidateForm.province =
                //   res.data.info.area_ids_store[0];
                // this.dynamicValidateForm.city = res.data.info.area_ids_store[1];
                // this.dynamicValidateForm.area = res.data.info.area_ids_store[2];
                // let hi = this.options.findIndex(ele => {
                //   return this.dynamicValidateForm.province == ele.value;
                // });
                // this.track1Item = this.options[hi];
                // this.track1Index = hi;
                // this.options2 = cityData[hi];
                // let h2i = this.options2.findIndex(ele => {
                //   return this.dynamicValidateForm.city == ele.value;
                // });
                // this.track2Item = this.options2[h2i];
                // this.track2Index = h2i;
                // this.options3 = areaData[this.track1Index][h2i];
                // let h3i = this.options3.find(ele => {
                //   return this.dynamicValidateForm.area == ele.value;
                // });
                // this.track3Item = h3i;
              } else {
                this.fetchAnother()
              }
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    },
    commonChange() {
      this.calcFunction()
    },
    calcFunction() {
      let temp1 = this.dynamicValidateForm.firstTable.map((ele) => {
        if (!ele.invest_money || !ele.subsidy_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      let temp2 = this.dynamicValidateForm.secondTable.map((ele) => {
        if (!ele.invest_money || !ele.subsidy_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      let temp3 = this.dynamicValidateForm.thirdTable.map((ele) => {
        if (!ele.invest_money || !ele.subsidy_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      let tempMaster = [...temp1, ...temp2, ...temp3]
      let res1 = tempMaster.reduce((acc, current) => {
        return acc + current.invest_money
      }, 0)
      let res2 = tempMaster.reduce((acc, current) => {
        return acc + current.subsidy_money
      }, 0)
      this.invest_moneyTotal = res1
      this.subsidy_moneyTotal = res2
    },
    submitForm(formName) {
      this.submitDisable = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let array = this.dynamicValidateForm.firstTable
          console.log('array1', array)
          //   array.forEach((ele) => {
          //     ele.schedule_start_at = ele.schedule_at && ele.schedule_at[0]
          //     ele.schedule_end_at = ele.schedule_at && ele.schedule_at[1]
          //     // delete ele.editStatus
          //     // delete ele.schedule_at
          //   })

          let clone1 = array.map((ele) => {
            return {
              declare_unit: ele.declare_unit,
              invest_money: ele.invest_money,
              location: ele.location,
              name: ele.name,
              scale: ele.scale,
              subsidy_money: ele.subsidy_money,
              schedule_start_at: ele.schedule_at[0],
              schedule_end_at: ele.schedule_at[1]
            }
          })

          let array2 = this.dynamicValidateForm.secondTable
          console.log('array2', array2)
          //   array2.forEach((ele) => {
          //     ele.schedule_start_at = ele.schedule_at && ele.schedule_at[0]
          //     ele.schedule_end_at = ele.schedule_at && ele.schedule_at[1]
          //     // delete ele.editStatus
          //     // delete ele.schedule_at
          //   })

          let clone2 = array2.map((ele) => {
            return {
              declare_unit: ele.declare_unit,
              invest_money: ele.invest_money,
              location: ele.location,
              name: ele.name,
              scale: ele.scale,
              subsidy_money: ele.subsidy_money,
              schedule_start_at: ele.schedule_at[0],
              schedule_end_at: ele.schedule_at[1]
            }
          })

          let array3 = this.dynamicValidateForm.thirdTable
          console.log('array333', array3)
          //   array3.forEach((ele) => {
          //     ele.schedule_start_at = ele.schedule_at && ele.schedule_at[0]
          //     ele.schedule_end_at = ele.schedule_at && ele.schedule_at[1]
          //     // delete ele.editStatus
          //     // delete ele.schedule_at
          //   })

          let clone3 = array3.map((ele) => {
            return {
              declare_unit: ele.declare_unit,
              invest_money: ele.invest_money,
              location: ele.location,
              name: ele.name,
              scale: ele.scale,
              subsidy_money: ele.subsidy_money,
              schedule_start_at: ele.schedule_at[0],
              schedule_end_at: ele.schedule_at[1]
            }
          })

          let data = {
            save_type: 'submit',
            policy_document_id: this.$route.query.policy_document_id,
            unit_charge_mobile: this.dynamicValidateForm.unit_charge_mobile,
            unit_charge_name: this.dynamicValidateForm.unit_charge_name,
            declare_unit: this.dynamicValidateForm.declare_unit,
            area_detail: this.dynamicValidateForm.area_detail,
            build_end_at: dayjs(this.dynamicValidateForm.build_at[1]).endOf('month').format('YYYY-MM-DD') + ' 23:59:59',
            build_start_at: this.dynamicValidateForm.build_at[0],
            // area_ids: [
            //   this.track1Item.label,
            //   this.track2Item.label,
            //   this.track3Item.label
            // ],
            // area_ids_store: [
            //   this.track1Item.value,
            //   this.track2Item.value,
            //   this.track3Item.value
            // ],
            project_name: this.dynamicValidateForm.project_name,
            land_info: this.dynamicValidateForm.land_info,
            build_main_content: this.dynamicValidateForm.build_main_content,
            part_options: [
              {
                option_name: '基础设施建设',
                option_mark: 'infrastructure_construction',
                list: clone1
              },
              {
                option_name: '设施设备',
                option_mark: 'mechanical_equipment',
                list: clone2
              },
              {
                option_name: '其他',
                option_mark: 'other',
                list: clone3
              }
            ]
          }
          if (this.$route.query.project_id) {
            data.project_id = this.$route.query.project_id
          }
          if (this.$route.query.project_reserve_id > 0) {
            data.project_reserve_id = this.$route.query.project_reserve_id
          }
          this.ApiLists.actionProjectImplementPlan(data)
            .then((res) => {
              if (res && res.code === 0) {
                this.$message.success('保存成功')
                this.$router.replace({
                  path: '/project/material',
                  query: {
                    project_id: res.data.project_id,
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
              this.submitTimer = setTimeout(() => {
                this.submitDisable = false
                clearTimeout(this.submitTimer)
              }, 5000)
            })
        } else {
          console.log('error submit!!')
          this.submitDisable = false
          return false
        }
      })
    },
    remove3Domain(item) {
      var index = this.dynamicValidateForm.doms.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.doms.splice(index, 1)
        this.$forceUpdate()
      }
    },

    handleClick(tab, event) {
      console.log(tab, event)
    },
    shutDialog() {
      this.addVisible = false
    },
    startUpload() {
      this.addVisible = false
    },
    handleCloseForNew(done) {
      done()
    },
    submitAction() {
      console.log()
    },
    initAction() {
      this.$store.commit('changeMenuActive', '3')
    }
  }
}
</script>
<style lang="less" scoped>
.setHelpPosition {
  position: fixed;
  right: 290px;
  bottom: 300px;
  //   right: -70px;
  //   top: 50px;
}
.withCursor {
  cursor: pointer;
}
.inputNumberSet {
  width: 130px;
}
.setDate2Picker {
  width: 400px;
}
.flexDate {
  span {
    color: #666;
    padding-right: 10px;
  }
  //display: flex;
  //justify-content: space-between;
  //align-content: center;
  //align-items: center;
}
.resetDateWidth {
  width: 31%;
}
.setActionColor {
  font-size: 16px;
  color: #0270c3;
  line-height: 32px;
}
.actionCursor {
  cursor: pointer;
}
.resetBlue {
  background-color: #0270c3 !important;
  color: #fff !important;
}
.deleteResetBtn {
  margin-top: 20px;
  margin-bottom: 20px;
  .el-icon-delete {
    font-size: 18px;
    color: #f56c6c;
    cursor: pointer;
  }
}
.setDatePicker {
  width: 190px;
  margin: 0 auto;
}
.submitBtn {
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #0270c3;
  border-color: #0270c3;
}
.common {
  width: 12.5%;
}
.totalCon {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  font-size: 18px;
  margin-top: 30px;
  margin-bottom: 30px;
}
.alignCenter {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.marginItem {
  margin-bottom: 30px;
}
.deleteBtnCon {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.implementationPlanCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
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
.spPadding {
  padding-left: 140px;
  padding-right: 140px;
}
.contentCon {
  margin-top: 20px;
  //   padding: 40px 230px 30px;
  padding-top: 40px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 20px;
}
.contentTitle {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  line-height: 32px;
  margin-bottom: 30px;
}
.submitMaster {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-top: 20px;
}
.answerTrigger {
  font-size: 16px;
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
.fakeBtn {
  background-color: #0270c3;
  color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
}
.coverBtn {
  background-color: #0270c3;
  color: #fff;
}
.tableCon {
}
.tableFirstCon {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-bottom: 20px;
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
  overflow-y: auto;
}
</style>
<style lang="less">
.implementationPlanCon {
  .coverItem {
    .el-form-item__content {
      margin-left: 10px !important;
      margin-right: 10px !important;
    }
  }
  .removeMarginItem {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .padLeft30 {
    padding-left: 130px;
  }
  .addColors {
    color: #1a7ee9;
    font-size: 14px;
    cursor: pointer;
  }
  .uploadDialog {
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
}
</style>
