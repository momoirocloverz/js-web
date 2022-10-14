<template>
  <div class="projectEquipmentCon">
    <div class="centerCon">
      <div class="breadcrumbCon">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="withCursor" @click.native="toProject"
            >项目办事</el-breadcrumb-item
          >
          <el-breadcrumb-item class="withCursor" @click.native="toProject"
            >我的申报</el-breadcrumb-item
          >
          <el-breadcrumb-item class="withCursor" @click.native="toMaterial"
            >申报材料</el-breadcrumb-item
          >
          <el-breadcrumb-item>材料查看</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="contentCon">
        <div class="formCon">
          <div class="displayArea" ref="htmlTarget">
            <div class="contentTitle">
              项目购置设备设施清单
            </div>
            <div class="table-box">
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="table-one"
              >
                <tbody>
                  <tr>
                    <th>设备名称</th>
                    <th>数量</th>
                    <th>单价</th>
                    <th>金额</th>
                  </tr>
                  <template
                    v-for="(item, index) in dynamicValidateForm.domains"
                  >
                    <tr :key="index">
                      <td>{{ item.name }}</td>
                      <td>{{ item.number }}</td>
                      <td>{{ item.money }}</td>
                      <td>{{ moneyFormat(item.money * item.number) }}</td>
                    </tr>
                  </template>
                  <tr>
                    <td colspan="3">合计</td>
                    <td>{{ moneyFormat(total_money) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="operationArea">
            <el-button
              v-if="projectStatus != 40"
              type="primary"
              size="small"
              class="coverBtn"
              @click="toEdit"
              >编辑</el-button
            >
            <el-button
              type="primary"
              size="small"
              class="coverBtn"
              @click="triggerDownload"
              >下载</el-button
            >
            <el-button
              type="primary"
              size="small"
              class="coverBtn"
              @click="toPrint"
              >打印</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: "main",
  head() {
    return {
      title: "项目购置设备设施清单预览",
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: "江山农业项目投资一件事"
        },
        {
          hid: "description",
          name: "description",
          content: "江山农业项目投资一件事"
        }
      ]
    };
  },
  data() {
    return {
      projectStatus: 0,
      total_money: 0,
      storeProject_id: "",
      dynamicValidateForm: {
        domains: [
          {
            name: "",
            number: 1,
            money: 0
          }
        ]
      }
    };
  },
  mounted() {
    this.initAction();
    this.fetchCurrent();
  },
  methods: {
    toProject() {
      this.$router.push({
        path: "/project"
      });
    },
    toMaterial() {
      this.$router.push({
        path: "/project/material",
        query: {
          policy_document_id: this.$route.query.policy_document_id,
          project_id: this.$route.query.project_id
        }
      });
    },
    toPrint() {
      this.$Print(this.$refs.htmlTarget);
    },
    toEdit() {
      this.$router.push({
        path: "/project/projectEquipment",
        query: {
          project_id: this.$route.query.project_id,
          policy_document_id: this.$route.query.policy_document_id
        }
      });
    },
    triggerDownload() {
      let data = {
        project_id: this.$route.query.project_id
      };
      this.ApiLists.downloadProjectFacilityList(data)
        .then(res => {
          const content = res;
          const blob = new Blob([content]);
          const fileName = "项目购置设备设施清单" + Date.now() + ".pdf";
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    moneyFormat(value) {
      if (value || value == 0) {
        let fix = (Math.round(+value + "e" + 2) / Math.pow(10, 2)).toFixed(2);
        return fix;
      }
    },
    fetchCurrent() {
      if (this.$route.query.project_id) {
        let data = {
          project_id: this.$route.query.project_id
        };
        this.ApiLists.fetchProjectSchedule(data)
          .then(res => {
            if (res && res.code == 0) {
              if (res.data.info) {
                this.projectStatus = res.data.info.status;
              }
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            console.log("er", err);
          });
      }
      let data = {
        project_id: this.$route.query.project_id
      };
      this.ApiLists.fetchProjectFacilityDetail(data)
        .then(res => {
          if (res && res.code === 0) {
            if (
              res.data &&
              res.data.list &&
              res.data.list.facility_list &&
              res.data.list.facility_list.length
            ) {
              this.dynamicValidateForm.domains = res.data.list.facility_list;
            }
            if (res.data.total_money) {
              this.total_money = res.data.total_money;
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    initAction() {
      this.$store.commit("changeMenuActive", "3");
    },
    initRequest() {}
  }
};
</script>
<style lang="less" scoped>
.withCursor {
  cursor: pointer;
}
@page {
  margin: 0;
  margin-top: 50px;
  margin-bottom: 50px;
}
.table-box table {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid black;
}

.table-box table td {
  border: 1px solid black;
  padding: 20px;
}

.table-box table .table-title {
  font-size: 16px;
  text-align: center;
  font-weight: bold;
}
.table-box table th {
  border: 1px solid black;
  padding: 20px;
  background-color: #eee;
}
.projectEquipmentCon {
  background-color: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40px;
  min-height: calc(100vh - 370px);
}
.displayArea {
}
.operationArea {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-top: 30px;
}
.centerCon {
  width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  box-sizing: border-box;
}
.contentCon {
  margin-top: 20px;
  padding: 40px 100px 30px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 20px;
}
.contentTitle {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  line-height: 32px;
  margin-bottom: 20px;
}
.formCon {
  margin-top: 30px;
}
.coverBtn {
  background-color: #0270c3;
  color: #fff;
}
</style>
