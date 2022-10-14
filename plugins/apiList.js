import axios from 'axios'
import Vue from 'vue'
// console.log(process.env.NODE_ENV);
const instance = axios.create({
  baseURL: '/web',
  timeout: 60000,
  withCredentials: true
})
instance.interceptors.request.use(
  (config) => {
    const loginToken = localStorage.getItem('loginToken') ? localStorage.getItem('loginToken') : ''
    if (loginToken) {
      config.headers.Authorization = loginToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 返回状态判断
instance.interceptors.response.use(
  (res) => {
    if (res && res.data && res.data.code == 21001) {
      if (window) {
        window.location.replace('/login')
      }
    }
    return res.data
  },
  (error) => {
    return Promise.reject(error)
  }
)
let bridge = ''
if (process.env.NODE_ENV == 'development') {
  bridge = '/web'
}
let apiLists = {
  //   fetchList: data => {
  //     return instance.post(
  //       `/admin/lists`,
  //       data
  //     );
  //   },
  //   fetchList: params => {
  //     return instance.get(`/todos/1`, { params });
  //   },

  userLogin: (data) => {
    return instance.post(`${bridge}/user/login`, data)
  },
  userLoginSms: (data) => {
    return instance.post(`${bridge}/user/login_mobile_code`, data)
  },
  getUserInfo: (data) => {
    return instance.post(`${bridge}/user/get_user_info`, data)
  },
  modifyPassword: (data) => {
    return instance.post(`${bridge}/user/modify_password`, data)
  },
  forgetPassword: (data) => {
    return instance.post(`${bridge}/user/recover_password`, data)
  },
  logout: (data) => {
    return instance.post(`${bridge}/user/logout`, data)
  },
  register: (data) => {
    return instance.post(`${bridge}/user/register`, data)
  },
  sendSms: (data) => {
    return instance.post(`${bridge}/sms/send`, data)
  },
  fetchHomePage: (data) => {
    return instance.post(`${bridge}/home_page`, data)
  },
  fetchNoticeList: (data) => {
    return instance.post(`${bridge}/notice_board/list`, data)
  },
  fetchNoticeDetail: (data) => {
    return instance.post(`${bridge}/notice_board/info`, data)
  },
  fetchNoticeCategory: (data) => {
    return instance.post(`${bridge}/notice_board/category_list`, data)
  },
  fetchAttractCategoryList: (data) => {
    return instance.post(`${bridge}/attract_category/list`, data)
  },
  fetchAttractInvestmentList: (data) => {
    return instance.post(`${bridge}/attract_investment/list`, data)
  },
  fetchAttractInvestmentInfo: (data) => {
    return instance.post(`${bridge}/attract_investment/info`, data)
  },
  fetchUnderstandCategoryList: (data) => {
    return instance.post(`${bridge}/understand_category/list`, data)
  },
  fetchUnderstandPaperList: (data) => {
    return instance.post(`${bridge}/understand_paper/list`, data)
  },
  fetchUnderstandPaperInfo: (data) => {
    return instance.post(`${bridge}/understand_paper/info`, data)
  },
  fetchPolicyCategoryList: (data) => {
    return instance.post(`${bridge}/policy_category/list`, data)
  },
  fetchPolicyDocumentList: (data) => {
    return instance.post(`${bridge}/policy_document/list`, data)
  },
  fetchPolicyDocumentInfo: (data) => {
    return instance.post(`${bridge}/policy_document/info`, data)
  },
  fetchProjectList: (data) => {
    return instance.post(`${bridge}/project/get_list`, data)
  },
  projectRemove: (data) => {
    return instance.post(`${bridge}/project/remove`, data)
  },
  fetchProjectSchedule: (data) => {
    return instance.post(`${bridge}/project/project_schedule`, data)
  },
  fetchProjectMaterialsDetail: (data) => {
    return instance.post(`${bridge}/project/project_materials_detail`, data)
  },
  projectUploadMaterials: (data) => {
    return instance.post(`${bridge}/project/project_upload_materials`, data)
  },
  projectRemoveMaterials: (data) => {
    return instance.post(`${bridge}/project/remove_project_materials`, data)
  },
  fetchProjectDeclarationDetail: (data) => {
    return instance.post(`${bridge}/project/project_declaration_detail`, data)
  },
  actionProjectDeclaration: (data) => {
    return instance.post(`${bridge}/project/action_project_declaration`, data)
  },
  submitProjectAction: (data) => {
    return instance.post(`${bridge}/project/submit_project`, data)
  },

  changeUserName: (data) => {
    return instance.post(`${bridge}/user/modify_user_real_name`, data)
  },
  changePassword: (data) => {
    return instance.post(`${bridge}/user/modify_password`, data)
  },
  changeMobile: (data) => {
    return instance.post(`${bridge}/user/modify_mobile`, data)
  },
  deleteAccount: (data) => {
    return instance.post(`${bridge}/user/cancel_account`, data)
  },
  getAreaList: (data) => {
    return instance.post(`${bridge}/area/get_area_list`, data)
  },
  getOssInfo: (data) => {
    return instance.post(`${bridge}/zhelb/get_oss_info`, data)
  },
  changeProjectReserveSyncForm: (data) => {
    return instance.post(`${bridge}/project/change_project_reserve_sync_form`, data)
  },
  projectUploadMaterialsZLB: (data) => {
    return instance.post(`${bridge}/project/project_upload_materials_zlb`, data)
  },
  projectYSUploadMaterialsZLB: (data) => {
    return instance.post(`${bridge}/project_ys/project_ys_upload_materials_zlb`, data)
  },
  setPorjectArea: (data) => {
    return instance.post(`${bridge}/project/action_project_area`, data)
  },

  progressList: (data) => {
    return instance.post(`${bridge}/project_report/list`, data)
  },
  addProgressList: (data) => {
    return instance.post(`${bridge}/project_report/add`, data)
  },

  feedbackCode: (data) => {
    return instance.post(`${bridge}/feedback/code`, data)
  },
  addFeedback: (data) => {
    return instance.post(`${bridge}/feedback/add`, data)
  },

  projectApplyList: (data) => {
    return instance.post(`${bridge}/amount_apply/list`, data)
  },
  projectApplyDetail: (data) => {
    return instance.post(`${bridge}/amount_apply/info`, data)
  },
  addPayApply: (data) => {
    return instance.post(`${bridge}/amount_apply/add`, data)
  },
  editPayApply: (data) => {
    return instance.post(`${bridge}/amount_apply/edit`, data)
  },
  amountApplySummarInfo: (data) => {
    return instance.post(`${bridge}/amount_apply/get_project_amount_apply_summar_info`, data)
  },
  downloadPayApply: (data) => {
    return instance({
      url: `${bridge}/amount_apply/download`,
      method: 'post',
      responseType: 'blob',
      data
    })
  },

  acceptDetail: (data) => {
    return instance.post(`${bridge}/project_ys/project_ys_detail`, data)
  },
  acceptDetailInfo: (data) => {
    return instance.post(`${bridge}/project_ys/project_ys_finance_application_detail`, data)
  },
  editAcceptDetail: (data) => {
    return instance.post(`${bridge}/project_ys/action_project_ys_finance_application`, data)
  },
  acceptanceSubmitAll: (data) => {
    return instance.post(`${bridge}/project_ys/submit_project_ys`, data)
  },
  acceptanceWhichDetail: (data) => {
    return instance.post(`${bridge}/project_ys/project_ys_materials_detail`, data)
  },
  workSummaryDetail: (data) => {
    return instance.post(`${bridge}/project_ys/project_ys_work_summary_detail`, data)
  },
  editWorkSummary: (data) => {
    return instance.post(`${bridge}/project_ys/action_project_ys_work_summary`, data)
  },
  comparisonDetail: (data) => {
    return instance.post(`${bridge}/project_ys/project_ys_comparison_pic_detail`, data)
  },
  editComparison: (data) => {
    return instance.post(`${bridge}/project_ys/action_project_ys_comparison_pic`, data)
  },
  editSketch: (data) => {
    return instance.post(`${bridge}/project_ys/action_project_ys_completed_sketch`, data)
  },
  sketchDetail: (data) => {
    return instance.post(`${bridge}/project_ys/project_ys_completed_sketch_detail`, data)
  },
  editCompare: (data) => {
    return instance.post(`${bridge}/project_ys/action_project_ys_complete_compare`, data)
  },
  compareDetail: (data) => {
    return instance.post(`${bridge}/project_ys/project_ys_complete_compare_detail`, data)
  },
  downloadAcceptance: (data) => {
    return instance({
      url: `${bridge}/project_ys/download_project_ys`,
      method: 'post',
      responseType: 'blob',
      data
    })
  },

  projectChangeList: (data) => {
    return instance.post(`${bridge}/change_apply/list`, data)
  },
  addProjectChange: (data) => {
    return instance.post(`${bridge}/change_apply/add`, data)
  },
  editProjectChange: (data) => {
    return instance.post(`${bridge}/change_apply/edit`, data)
  },
  projectChangeDetail: (data) => {
    return instance.post(`${bridge}/change_apply/info`, data)
  },
  downloadChange: (data) => {
    return instance({
      url: `${bridge}/change_apply/download`,
      method: 'post',
      responseType: 'blob',
      data
    })
  },

  fetchProjectImplementPlanDetail: (data) => {
    return instance.post(`${bridge}/project/project_implement_plan_detail`, data)
  },
  actionProjectImplementPlan: (data) => {
    return instance.post(`${bridge}/project/action_project_implement_plan`, data)
  },
  fetchProjectFacilityDetail: (data) => {
    return instance.post(`${bridge}/project/project_facility_list_detail`, data)
  },
  actionProjectFacilityList: (data) => {
    return instance.post(`${bridge}/project/action_project_facility_list`, data)
  },
  fetchDeclarationRecordList: (data) => {
    return instance.post(`${bridge}/project/project_declaration_record_list`, data)
  },
  downloadProjectFacilityList: (data) => {
    return instance({
      url: `${bridge}/project/download_project_facility_list`,
      method: 'post',
      responseType: 'blob',
      data
    })
  },
  downloadAttractInvestment: (data) => {
    return instance({
      url: `${bridge}/attract_investment/download_attract_investment`,
      method: 'post',
      responseType: 'blob',
      data
    })
  },
  downloadUnderstandPaper: (data) => {
    return instance({
      url: `${bridge}/understand_paper/download_understand_paper`,
      method: 'post',
      responseType: 'blob',
      data
    })
  },
  downloadPolicyDocument: (data) => {
    return instance({
      url: `${bridge}/policy_document/download_policy_document`,
      method: 'post',
      responseType: 'blob',
      data
    })
  },
  downloadProjectDeclaration: (data) => {
    return instance({
      url: `${bridge}/project/download_project_declaration`,
      method: 'post',
      responseType: 'blob',
      data
    })
  },
  downloadProjectImplementPlan: (data) => {
    return instance({
      url: `${bridge}/project/download_project_implement_plan`,
      method: 'post',
      responseType: 'blob',
      data
    })
  },
  fetchProjectReserveList: (data) => {
    return instance.post(`${bridge}/project_reserve/get_list`, data)
  },
  projectReserveAction: (data) => {
    return instance.post(`${bridge}/project_reserve/action`, data)
  },
  projectReserveDetail: (data) => {
    return instance.post(`${bridge}/project_reserve/detail`, data)
  },
  projectCancel: (data) => {
    return instance.post(`${bridge}/project/cancel`, data)
  },
  projectResetveRemove: (data) => {
    return instance.post(`${bridge}/project_reserve/remove`, data)
  },
  checkCanApply: (data) => {
    return instance.post(`${bridge}/project/check_can_apply`, data)
  },
  // 生成粮油补贴id
  getLySubsidyId: (data) => {
    return instance.post(`${bridge}/project_sub_ly/get_project_id`, data)
  },
  // 新建、保存粮油补贴id
  applyLySubsidy: (data) => {
    return instance.post(`${bridge}/project_sub_ly/action`, data)
  },
  // 粮油-查看
  getLySubsidy(data) {
    return instance.post(`${bridge}/project_sub_ly/get_info`, data)
  },
  getYjfSubsidyId(data) {
    return instance.post(`${bridge}/manure/get_project_id`, data)
  },
  getYjfSubsidy(data) {
    return instance.post(`${bridge}/manure/find`, data)
  },
  applyYjfSubsidy(data) {
    return instance.post(`${bridge}/manure/edit`, data)
  },
  getShhSubsidy(data) {
    return instance.post(`${bridge}/society/find`, data)
  },
  getShhSubsidyId(data) {
    return instance.post(`${bridge}/society/get_project_id`, data)
  },
  applyShhSubsidy(data) {
    return instance.post(`${bridge}/society/edit`, data)
  },
  getJgSubsidy(data) {
    return instance.post(`${bridge}/straw/find`, data)
  },
  getJgSubsidyId(data) {
    return instance.post(`${bridge}/straw/get_project_id`, data)
  },
  applyJgSubsidy(data) {
    return instance.post(`${bridge}/straw/edit`, data)
  },
  getNjSubsidy(data) {
    return instance.post(`${bridge}/agricultural/find`, data)
  },
  getNjSubsidyId(data) {
    return instance.post(`${bridge}/agricultural/get_project_id`, data)
  },
  applyNjSubsidy(data) {
    return instance.post(`${bridge}/agricultural/edit`, data)
  },
  getHySubsidy(data) {
    return instance.post(`${bridge}/hy/find`, data)
  },
  getHySubsidyId(data) {
    return instance.post(`${bridge}/hy/get_project_id`, data)
  },
  applyHySubsidy(data) {
    return instance.post(`${bridge}/hy/edit`, data)
  },
  getWhhSubsidy(data) {
    return instance.post(`${bridge}/innocuity/find_innocuity_project`, data)
  },
  getWhhSubsidyId(data) {
    return instance.post(`${bridge}/innocuity/get_project_id`, data)
  },
  applyWhhSubsidy(data) {
    return instance.post(`${bridge}/innocuity/apply_innocuity_project`, data)
  },
  getWhhFinalSubsidyDetail(data) {
    return instance.post(`${bridge}/innocuity/find_collect_list`, data)
  },
  getWhhFinalSubsidy(data) {
    return instance.post(`${bridge}/innocuity/find_innocuity`, data)
  },
  applyWhhFinalSubsidy(data) {
    return instance.post(`${bridge}/innocuity/apply_innocuity`, data)
  },
  getSysSingleConfig(data) {
    return instance.post(`${bridge}/config/get_single_info`, data)
  },
  // 问答专区
  submitQuestion(data) {
    return instance.post(`${bridge}/section_question/submit_question`, data)
  },
  submitAnswer(data) {
    return instance.post(`${bridge}/section_question/submit_answer`, data)
  },
  questionList(data) {
    return instance.post(`${bridge}/section_question/get_list`, data)
  },
  execLike(data) {
    return instance.post(`${bridge}/section_question/exec_like`, data)
  },
  questionInfo(data) {
    return instance.post(`${bridge}/section_question/get_info`, data)
  },
  // 获取政策分类层级列表--v2.15.0
  getPolicyCategoryTabList(data) {
    return instance.post(`${bridge}/policy_category/get_all_list`, data)
  },
  // 搜索--搜索词列表(搜索次数前10)
  getSearchKeywords(data) {
    return instance.post(`${bridge}/search/get_top_list`, data)
  },
  submitConsultAdvise(data) {
    return instance.post(`${bridge}/consult_advise/submit`, data)
  },
  investCategoryList(data) {
    return instance.post(`${bridge}/invest_category/get_list`, data)
  },
  investTagList(data) {
    return instance.post(`${bridge}/invest_tag/get_list`, data)
  },
  investBsydInfo(data) {
    return instance.post(`${bridge}/invest_bsyd/get_info`, data)
  },
  downloadInvestBsydPdf: (data) => {
    return instance({
      url: `${bridge}/invest_bsyd/download_pdf`,
      method: 'post',
      responseType: 'blob',
      data
    })
  },
  fetchmapAreaList(data) {
    return instance.post(`${bridge}/area/get_map_area_list`, data)
  }
}
Vue.prototype.ApiLists = apiLists
