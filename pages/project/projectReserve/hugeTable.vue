<template>
  <div class="implementationPlanCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>项目储备</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="toProjectProgress">我的申报</el-breadcrumb-item>
            <el-breadcrumb-item>材料填写</el-breadcrumb-item>
          </el-breadcrumb>
        </el-breadcrumb>
      </div>
      <div class="contentCon">
        <!-- <helpCom class="setHelpPosition" :name="currentInfo.linkman && currentInfo.linkman.real_name" :phone="currentInfo.linkman && currentInfo.linkman.mobile" /> -->
        <div class="contentTitle spPadding">项目建设分项</div>
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="140px" class="demo-dynamic" :disabled="$route.query.editAble == 2">
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

            <el-table-column label="规格型号" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.spec }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'firstTable.' + scope.$index + '.spec'" :rules="[{ required: true, message: '规格型号不能为空' }]">
                  <el-input maxlength="30" v-model.trim="scope.row.spec"></el-input>
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
                    @input="scheduleFirstAtChange(scope.row.schedule_at, scope.$index)"
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

            <el-table-column label="资金来源" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.fund_source }}</span>
                <el-form-item class="removeMarginItem" :prop="'firstTable.' + scope.$index + '.fund_source'" :rules="[{ required: true, message: '资金来源不能为空' }]" v-else>
                  <el-input maxlength="50" v-model.trim="scope.row.fund_source"></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="setActionColor">
                  <div class="actionCursor" v-if="scope.row.editStatus" @click="scope.row.editStatus = false">编辑</div>
                  <div v-else>
                    <div class="deleteResetBtn" @click="delete1Current(scope)" v-if="$route.query.editAble != 2">
                      <i class="el-icon-delete"></i>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="alignCenter" v-if="$route.query.editAble != 2">
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

            <el-table-column label="规格型号" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.spec }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'secondTable.' + scope.$index + '.spec'" :rules="[{ required: true, message: '规格型号不能为空' }]">
                  <el-input maxlength="30" v-model.trim="scope.row.spec"></el-input>
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
                    @input="scheduleSecondAtChange(scope.row.schedule_at, scope.$index)"
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
            <el-table-column label="资金来源" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.fund_source }}</span>
                <el-form-item class="removeMarginItem" :prop="'secondTable.' + scope.$index + '.fund_source'" :rules="[{ required: true, message: '资金来源不能为空' }]" v-else>
                  <el-input maxlength="50" v-model.trim="scope.row.fund_source"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="setActionColor">
                  <div class="actionCursor" v-if="scope.row.editStatus" @click="scope.row.editStatus = false">编辑</div>
                  <div v-else>
                    <div class="deleteResetBtn" @click="delete2Current(scope)" v-if="$route.query.editAble != 2">
                      <i class="el-icon-delete"></i>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="alignCenter" v-if="$route.query.editAble != 2">
            <!-- <el-button @click="add2Domain" class="deleteResetBtn resetBlue" icon="el-icon-plus" type="primary" size="small">新增</el-button> -->
            <div @click="add2Domain" class="addColors">
              <i class="el-icon-circle-plus-outline"></i>
              <span>新增分项2</span>
            </div>
          </div>
          <div class="contentTitle spPadding">分项3：技术引进推广</div>
          <el-table class="basic-table" :data="dynamicValidateForm.thirdTable">
            <el-table-column label="分项名称" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.name }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'thirdTable.' + scope.$index + '.name'" :rules="[{ required: true, message: '名称不能为空' }]">
                  <el-input v-model="scope.row.name"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="规格型号" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.spec }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'thirdTable.' + scope.$index + '.spec'" :rules="[{ required: true, message: '规格型号不能为空' }]">
                  <el-input maxlength="30" v-model.trim="scope.row.spec"></el-input>
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
                    @input="scheduleThirdAtChange(scope.row.schedule_at, scope.$index)"
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
            <el-table-column label="资金来源" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.fund_source }}</span>
                <el-form-item class="removeMarginItem" :prop="'thirdTable.' + scope.$index + '.fund_source'" :rules="[{ required: true, message: '资金来源不能为空' }]" v-else>
                  <el-input maxlength="50" v-model.trim="scope.row.fund_source"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="setActionColor">
                  <div class="actionCursor" v-if="scope.row.editStatus" @click="scope.row.editStatus = false">编辑</div>
                  <div v-else>
                    <div class="deleteResetBtn" @click="delete3Current(scope)" v-if="$route.query.editAble != 2">
                      <i class="el-icon-delete"></i>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="alignCenter" v-if="$route.query.editAble != 2">
            <div @click="add3Domain" class="addColors">
              <i class="el-icon-circle-plus-outline"></i>
              <span>新增分项3</span>
            </div>
          </div>

          <div class="contentTitle spPadding">分项4：其他</div>
          <el-table class="basic-table" :data="dynamicValidateForm.fourthTable">
            <el-table-column label="分项名称" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.name }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'fourthTable.' + scope.$index + '.name'" :rules="[{ required: true, message: '名称不能为空' }]">
                  <el-input v-model="scope.row.name"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="规格型号" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.spec }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'fourthTable.' + scope.$index + '.spec'" :rules="[{ required: true, message: '规格型号不能为空' }]">
                  <el-input maxlength="30" v-model.trim="scope.row.spec"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="规模（数量）" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.scale }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'fourthTable.' + scope.$index + '.scale'" :rules="[{ required: true, message: '规模不能为空' }]">
                  <el-input maxlength="10" v-model.trim="scope.row.scale"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="投资金额(万元)" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.invest_money }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'fourthTable.' + scope.$index + '.invest_money'" :rules="[{ required: true, message: '投资金额不能为空' }]">
                  <el-input-number class="inputNumberSet" controls-position="right" :min="0" :precision="2" @change="commonChange" v-model="scope.row.invest_money" :step="1"></el-input-number>
                  <!-- <el-input v-model="scope.row.invest_money"></el-input> -->
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="其中财政补助(万元)" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.subsidy_money }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'fourthTable.' + scope.$index + '.subsidy_money'" :rules="[{ required: true, message: '财政补助不能为空' }]">
                  <el-input-number class="inputNumberSet" controls-position="right" :min="0" :precision="2" @change="commonChange" v-model="scope.row.subsidy_money" :step="1"></el-input-number>
                  <!-- <el-input v-model="scope.row.subsidy_money"></el-input> -->
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="进度安排" align="center" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.schedule_at }}</span>
                <el-form-item v-else class="removeMarginItem" :prop="'fourthTable.' + scope.$index + '.schedule_at'" :rules="[{ required: true, message: '进度安排不能为空' }]">
                  <el-date-picker
                    @input="scheduleFourthAtChange(scope.row.schedule_at, scope.$index)"
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
            <el-table-column label="资金来源" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.editStatus">{{ scope.row.fund_source }}</span>
                <el-form-item class="removeMarginItem" :prop="'fourthTable.' + scope.$index + '.fund_source'" :rules="[{ required: true, message: '资金来源不能为空' }]" v-else>
                  <el-input maxlength="50" v-model.trim="scope.row.fund_source"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="setActionColor">
                  <div class="actionCursor" v-if="scope.row.editStatus" @click="scope.row.editStatus = false">编辑</div>
                  <div v-else>
                    <div class="deleteResetBtn" @click="delete4Current(scope)" v-if="$route.query.editAble != 2">
                      <i class="el-icon-delete"></i>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="alignCenter" v-if="$route.query.editAble != 2">
            <div @click="add4Domain" class="addColors">
              <i class="el-icon-circle-plus-outline"></i>
              <span>新增分项4</span>
            </div>
          </div>
          <div class="totalCon">
            <div class="common"></div>
            <div class="common">合计</div>
            <div class="common"></div>
            <div class="common">投资金额</div>
            <div class="common">{{ moneyFormat(invest_moneyTotal) }}万元</div>
            <div class="common">财政补助</div>
            <div class="common">{{ moneyFormat(subsidy_moneyTotal) }}万元</div>
            <div class="common"></div>
          </div>
          <div class="contentTitle spPadding">资金来源说明</div>
          <div class="littleForm">
            <el-form-item
              label="省级补助资金"
              prop="province_amount"
              :rules="{
                required: true,
                message: '省级补助资金不能为空',
                trigger: 'blur'
              }"
            >
              <el-input-number class="inputNumberSet" controls-position="right" :min="0" :precision="2" v-model="dynamicValidateForm.province_amount" :step="1"></el-input-number>
            </el-form-item>
            <el-form-item
              label="地方财政资金整合"
              prop="place_amount"
              :rules="{
                required: true,
                message: '地方财政资金整合不能为空',
                trigger: 'blur'
              }"
            >
              <el-input-number class="inputNumberSet" controls-position="right" :min="0" :precision="2" v-model="dynamicValidateForm.place_amount" :step="1"></el-input-number>
            </el-form-item>
            <el-form-item
              label="自筹资金"
              prop="self_amount"
              :rules="{
                required: true,
                message: '自筹资金不能为空',
                trigger: 'blur'
              }"
            >
              <el-input-number class="inputNumberSet" controls-position="right" :min="0" :precision="2" v-model="dynamicValidateForm.self_amount" :step="1"></el-input-number>
            </el-form-item>
          </div>
          <div class="alignCenter">
            <el-button @click="tempForm('dynamicValidateForm')" size="small" v-if="$route.query.editAble != 2">保存</el-button>
            <el-button type="primary" class="submitBtn resetBlue" @click="submitForm('dynamicValidateForm')" size="small" :disabled="submitDisable" v-if="$route.query.editAble != 2">提交</el-button>
          </div>
        </el-form>
        <div class="alignCenter" v-if="$route.query.editAble == 2">
          <el-button class="cover_btn mb20" @click="goback">返 回</el-button>
        </div>
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
import dayjs from 'dayjs'
export default {
  layout: 'main',
  head() {
    return {
      title: '项目储备',
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
        thirdTable: [],
        fourthTable: [],
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
        build_main_content: '',
        province_amount: '',
        place_amount: '',
        self_amount: ''
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
    goback() {
      this.$router.back()
    },
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
    toProjectProgress() {
      this.$router.push({
        path: '/project/projectReserve'
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
    add1Domain() {
      this.dynamicValidateForm.firstTable.push({
        name: '',
        spec: '',
        scale: '',
        fund_source: '',
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
        spec: '',
        scale: '',
        fund_source: '',
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
        spec: '',
        scale: '',
        fund_source: '',
        invest_money: '',
        subsidy_money: '',
        schedule_start_at: '',
        schedule_end_at: '',
        schedule_at: '',
        editStatus: false
      })
    },
    add4Domain() {
      this.dynamicValidateForm.fourthTable.push({
        name: '',
        spec: '',
        fund_source: '',
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
    delete4Current(scope) {
      var index = scope.$index
      if (index !== -1) {
        this.dynamicValidateForm.fourthTable.splice(index, 1)
        this.$forceUpdate()
        this.calcFunction()
      }
    },
    scheduleFirstAtChange(val, index) {
      if (val && val.length) {
        this.dynamicValidateForm.firstTable[index].schedule_start_at = val[0]
        this.dynamicValidateForm.firstTable[index].schedule_end_at = val[1]
        this.dynamicValidateForm.firstTable[index].schedule_at = val
        this.$set(this.dynamicValidateForm, 'firstTable.' + index + '.schedule_at', val)
        setTimeout(() => {
          this.$forceUpdate()
        }, 300)
      }
      this.$forceUpdate()
    },
    scheduleSecondAtChange(val, index) {
      if (val && val.length) {
        this.dynamicValidateForm.secondTable[index].schedule_start_at = val[0]
        this.dynamicValidateForm.secondTable[index].schedule_end_at = val[1]
        this.dynamicValidateForm.secondTable[index].schedule_at = val
        this.$set(this.dynamicValidateForm, 'secondTable.' + index + '.schedule_at', val)
        setTimeout(() => {
          this.$forceUpdate()
        }, 300)
      }
      this.$forceUpdate()
    },
    scheduleThirdAtChange(val, index) {
      if (val && val.length) {
        this.dynamicValidateForm.thirdTable[index].schedule_start_at = val[0]
        this.dynamicValidateForm.thirdTable[index].schedule_end_at = val[1]
        this.dynamicValidateForm.thirdTable[index].schedule_at = val
        this.$set(this.dynamicValidateForm, 'thirdTable.' + index + '.schedule_at', val)
        setTimeout(() => {
          this.$forceUpdate()
        }, 300)
      }
      this.$forceUpdate()
    },
    scheduleFourthAtChange(val, index) {
      if (val && val.length) {
        this.dynamicValidateForm.fourthTable[index].schedule_start_at = val[0]
        this.dynamicValidateForm.fourthTable[index].schedule_end_at = val[1]
        this.dynamicValidateForm.fourthTable[index].schedule_at = val
        this.$set(this.dynamicValidateForm, 'fourthTable.' + index + '.schedule_at', val)
        setTimeout(() => {
          this.$forceUpdate()
        }, 300)
      }
      this.$forceUpdate()
    },
    normalSet(res) {
      this.dynamicValidateForm = res.data.info
      let track1 = []
      let track2 = []
      let track3 = []
      let track4 = []
      if (res.data.info.part_options) {
        let bridge1 = res.data.info.part_options.find((ele) => {
          return ele.option_name == '基础设施建设'
        })
        track1 = (bridge1 && bridge1.list) || []
        track1.forEach((ele) => {
          if (ele.schedule_start_at) {
            ele.schedule_at = [ele.schedule_start_at, ele.schedule_end_at]
          }
        })
        let bridge2 = res.data.info.part_options.find((ele) => {
          return ele.option_name == '设施设备'
        })
        track2 = (bridge2 && bridge2.list) || []
        track2.forEach((ele) => {
          if (ele.schedule_start_at) {
            ele.schedule_at = [ele.schedule_start_at, ele.schedule_end_at]
          }
        })
        let bridge3 = res.data.info.part_options.find((ele) => {
          return ele.option_name == '技术引进推广'
        })
        track3 = (bridge3 && bridge3.list) || []
        track3.forEach((ele) => {
          if (ele.schedule_start_at) {
            ele.schedule_at = [ele.schedule_start_at, ele.schedule_end_at]
          }
        })
        let bridge4 = res.data.info.part_options.find((ele) => {
          return ele.option_name == '其他'
        })
        track4 = (bridge4 && bridge4.list) || []
        track4.forEach((ele) => {
          if (ele.schedule_start_at) {
            ele.schedule_at = [ele.schedule_start_at, ele.schedule_end_at]
          }
        })
      }
      this.dynamicValidateForm.firstTable = track1
      this.dynamicValidateForm.secondTable = track2
      this.dynamicValidateForm.thirdTable = track3
      this.dynamicValidateForm.fourthTable = track4
      this.$nextTick(() => {
        this.calcFunction()
      })
    },
    initRequest() {
      if (this.$route.query.id) {
        this.ApiLists.projectReserveDetail({
          id: this.$route.query.id
        })
          .then((res) => {
            if (res && res.code == 0) {
              if (res.data.info) {
                this.normalSet(res)
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

      let temp4 = this.dynamicValidateForm.fourthTable.map((ele) => {
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

      let tempMaster = [...temp1, ...temp2, ...temp3, ...temp4]
      let res1 = tempMaster.reduce((acc, current) => {
        return acc + current.invest_money
      }, 0)
      let res2 = tempMaster.reduce((acc, current) => {
        return acc + current.subsidy_money
      }, 0)
      this.invest_moneyTotal = res1
      this.subsidy_moneyTotal = res2
    },
    tempForm() {
      let array = this.dynamicValidateForm.firstTable
      console.log('array1', array)
      let clone1 = array.map((ele) => {
        return {
          spec: ele.spec,
          invest_money: ele.invest_money,
          name: ele.name,
          scale: ele.scale,
          fund_source: ele.fund_source,
          subsidy_money: ele.subsidy_money,
          schedule_start_at: ele.schedule_at ? ele.schedule_at[0] : '',
          schedule_end_at: ele.schedule_at ? ele.schedule_at[1] : ''
        }
      })
      let array2 = this.dynamicValidateForm.secondTable
      console.log('array2', array2)
      let clone2 = array2.map((ele) => {
        return {
          spec: ele.spec,
          invest_money: ele.invest_money,
          name: ele.name,
          scale: ele.scale,
          fund_source: ele.fund_source,
          subsidy_money: ele.subsidy_money,
          schedule_start_at: ele.schedule_at ? ele.schedule_at[0] : '',
          schedule_end_at: ele.schedule_at ? ele.schedule_at[1] : ''
        }
      })

      let array3 = this.dynamicValidateForm.thirdTable
      console.log('array333', array3)
      let clone3 = array3.map((ele) => {
        return {
          spec: ele.spec,
          invest_money: ele.invest_money,
          name: ele.name,
          scale: ele.scale,
          fund_source: ele.fund_source,
          subsidy_money: ele.subsidy_money,
          schedule_start_at: ele.schedule_at ? ele.schedule_at[0] : '',
          schedule_end_at: ele.schedule_at ? ele.schedule_at[1] : ''
        }
      })

      let array4 = this.dynamicValidateForm.fourthTable
      console.log('array4', array4)
      let clone4 = array4.map((ele) => {
        return {
          spec: ele.spec,
          invest_money: ele.invest_money,
          name: ele.name,
          scale: ele.scale,
          fund_source: ele.fund_source,
          subsidy_money: ele.subsidy_money,
          schedule_start_at: ele.schedule_at ? ele.schedule_at[0] : '',
          schedule_end_at: ele.schedule_at ? ele.schedule_at[1] : ''
        }
      })
      let data = {
        ...this.dynamicValidateForm,
        save_type: 'save',
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
            option_name: '技术引进推广',
            option_mark: 'technology_promotion',
            list: clone3
          },
          {
            option_name: '其他',
            option_mark: 'other',
            list: clone4
          }
        ]
      }
      console.log('data', data)
      this.ApiLists.projectReserveAction(data)
        .then((res) => {
          if (res && res.code === 0) {
            this.$message.success('保存成功')
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
    },
    submitForm(formName) {
      this.submitDisable = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let array = this.dynamicValidateForm.firstTable
          console.log('array1', array)
          let clone1 = array.map((ele) => {
            return {
              spec: ele.spec,
              invest_money: ele.invest_money,
              name: ele.name,
              scale: ele.scale,
              fund_source: ele.fund_source,
              subsidy_money: ele.subsidy_money,
              schedule_start_at: ele.schedule_at[0],
              schedule_end_at: ele.schedule_at[1]
            }
          })
          let array2 = this.dynamicValidateForm.secondTable
          console.log('array2', array2)
          let clone2 = array2.map((ele) => {
            return {
              spec: ele.spec,
              invest_money: ele.invest_money,
              name: ele.name,
              scale: ele.scale,
              fund_source: ele.fund_source,
              subsidy_money: ele.subsidy_money,
              schedule_start_at: ele.schedule_at[0],
              schedule_end_at: ele.schedule_at[1]
            }
          })

          let array3 = this.dynamicValidateForm.thirdTable
          console.log('array333', array3)
          let clone3 = array3.map((ele) => {
            return {
              spec: ele.spec,
              invest_money: ele.invest_money,
              name: ele.name,
              scale: ele.scale,
              fund_source: ele.fund_source,
              subsidy_money: ele.subsidy_money,
              schedule_start_at: ele.schedule_at[0],
              schedule_end_at: ele.schedule_at[1]
            }
          })

          let array4 = this.dynamicValidateForm.fourthTable
          console.log('array4', array4)
          let clone4 = array4.map((ele) => {
            return {
              spec: ele.spec,
              invest_money: ele.invest_money,
              name: ele.name,
              scale: ele.scale,
              fund_source: ele.fund_source,
              subsidy_money: ele.subsidy_money,
              schedule_start_at: ele.schedule_at[0],
              schedule_end_at: ele.schedule_at[1]
            }
          })
          console.log('this.dynamicValidateForm', this.dynamicValidateForm)
          let data = {
            ...this.dynamicValidateForm,
            save_type: 'submit',
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
                option_name: '技术引进推广',
                option_mark: 'technology_promotion',
                list: clone3
              },
              {
                option_name: '其他',
                option_mark: 'other',
                list: clone4
              }
            ]
          }
          this.ApiLists.projectReserveAction(data)
            .then((res) => {
              if (res && res.code === 0) {
                this.$message.success('保存成功')
                this.$router.push({
                  path: '/project/projectReserve'
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
.littleForm {
  padding-left: 140px;
  padding-right: 140px;
  box-sizing: border-box;
}
.contentCon {
  margin-top: 20px;
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
  margin-top: 20px;
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
.mb20 {
  margin-bottom: 30px;
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
