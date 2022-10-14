<template>
  <div class="homePageCon">
    <div class="mainContent">
      <div class="topContent">
        <div class="thirdOne">
          <div class="topOne">
            <div class="topTitle">
              <div class="topTitleText">惠农政策申报</div>
              <div class="topTitleMore" @click="toPolicy">更多>></div>
            </div>
            <div class="dynamicOne">
              <div class="mainImgEntrance" @click="toTheOne">
                <div class="mainTextEntrance">竞争性财政支农项目在线申报>></div>
              </div>
              <template v-for="(item, index) in policyArray">
                <div :key="index" class="mainItem" @click="toPolicyItem(item)">
                  <img class="arrawImg" src="https://img.hzanchu.com/acimg/ef27c855f4f10b4d6e566184fdab1828.png" />
                  <div class="dynamicOneTitle">{{ item.title }}</div>
                  <div class="dynamicOneFulfill">
                    申请
                    <!-- {{
                      item.category_name == "竞争性财政支农项目"
                        ? "申请"
                        : "详情"
                    }} -->
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="thirdOne">
          <div class="topOne">
            <div class="topTitle">
              <div class="topTitleText">明白纸</div>
              <div class="topTitleMore" @click="toUnderstand(1)">更多>></div>
            </div>
            <div class="dynamicTwo">
              <template v-for="(item, index) in understandArray">
                <div :key="index" class="understandItem" @click="toUnderstandItem(item, 1)">
                  <img class="arrawImg" src="https://img.hzanchu.com/acimg/ef27c855f4f10b4d6e566184fdab1828.png" />
                  <div class="dynamicTwoTitle">{{ item.title }}</div>
                  <div class="dynamicTwoTime">
                    {{ item.created_at ? Dayjs(item.created_at).format('YYYY-MM-DD') : '' }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="thirdOne">
          <div class="topOne">
            <div class="topTitle">
              <div class="topTitleText">公示公告栏</div>
              <div class="topTitleMore" @click="toUnderstand(2)">更多>></div>
            </div>
            <div class="dynamicTwo">
              <template v-for="(item, index) in noticeArray">
                <div :key="index" class="understandItem" @click="toUnderstandItem(item, 2)">
                  <img class="arrawImg" src="https://img.hzanchu.com/acimg/ef27c855f4f10b4d6e566184fdab1828.png" />
                  <div class="dynamicTwoTitle">{{ item.title }}</div>
                  <div class="dynamicTwoTime">
                    {{ item.created_at ? Dayjs(item.created_at).format('YYYY-MM-DD') : '' }}
                  </div>
                </div>
              </template>
            </div>
          </div>
          <!-- <div class="topOne">
          <div class="topTitle">
            <div class="topTitleText">招商推介</div>
            <div class="topTitleMore" @click="toAttract">更多>></div>
          </div>
          <div class="dynamicThree">
            <template v-for="(item, index) in attractArray">
              <div
                :key="index"
                class="blueItemEntrance"
                @click="toAttractItem(item)"
              >
                {{ item.title }}>>
              </div>
            </template>
          </div>
                    </div>-->
        </div>
      </div>
      <div class="middleContent">
        <div class="wholeContainer">
          <div class="middleTitle">
            <div class="middleTitleText">招商推介</div>
          </div>
          <div class="middleTitleMore" @click="toAttract">更多>></div>
        </div>
        <div class="middleDivide">
          <template v-for="(item, index) in attractArray">
            <div class="thirdOne middleItemCon" :key="index" @click="toAttractItem(item)">
              <img :src="item.src" />
              <div class="middleItemtext">{{ item.title }}</div>
            </div>
          </template>
          <!-- <div class="thirdOne middleItemCon">
            <img
              src="https://img.hzanchu.com/acimg/d05b915ec4ac69a3a83896c006b19728.png"
            />
            <div class="middleItemtext">生猪养殖循环生态农牧示范园项目</div>
          </div>
          <div class="thirdOne middleItemCon">
            <img
              src="https://img.hzanchu.com/acimg/7c07bf46e84b64cf961d5a76de89e09b.png"
            />
            <div class="middleItemtext">江山高端油茶及系列产品开发项目</div>
          </div>
          <div class="thirdOne middleItemCon">
            <img
              src="https://img.hzanchu.com/acimg/31c05c8248a48d9fa14815bcf70a2740.png"
            />
            <div class="middleItemtext">顶尖大闸蟹产业示范项目</div>
                    </div>-->
        </div>
      </div>
      <div class="bottomContent">
        <div class="bottomOne">
          <div class="bottomTitle">
            <div class="bottomTitleText">项目备案</div>
          </div>
          <a
            href="https://tzxm.zjzwfw.gov.cn/myProjectDeclareAction.do?method=goApprtProject&AUDIT_TYPE=03&IS_FOREIGN=0&IS_CAR=0&isBigJw=0&porject_apply_type=0"
            target="_blank"
            class="removeA"
            rel="noopener noreferrer"
          >
            <div class="bottomBackGround bottomBackOne">
              <div class="bottomBackTitle">投资项目和十四五重大建设项目</div>
              <div class="bottomBackCheckDetail">查看详情</div>
            </div>
          </a>
        </div>
        <div class="bottomOne">
          <div class="bottomTitle">
            <div class="bottomTitleText">用地审批</div>
          </div>
          <a href="https://www.zjzwfw.gov.cn/zjservice/item/detail/index.do?localInnerCode=ff03b7a3-7baa-4432-9454-19fbcc37dc8b" target="_blank" class="removeA" rel="noopener noreferrer">
            <div class="bottomBackGround bottomBackTwo">
              <div class="bottomBackTitle">2021年度国有建设用地供应计划</div>
              <div class="bottomBackCheckDetail">查看详情</div>
            </div>
          </a>
        </div>
        <div class="bottomOne">
          <div class="bottomTitle">
            <div class="bottomTitleText">我要报固投</div>
          </div>
          <a href="http://lwzbdr.tjj.zj.gov.cn/dr/queryLoginInfo.do" target="_blank" class="removeA" rel="noopener noreferrer">
            <div class="bottomBackGround bottomBackThree">
              <div class="bottomBackTitle">建设工程电梯设备采购及安装工程</div>
              <div class="bottomBackCheckDetail">查看详情</div>
            </div>
          </a>
        </div>
      </div>
      <div class="bottom1Content">
        <!-- <div class="bottomSubContent"> -->
        <div class="bottomOne" @click="toReserve">
          <div class="bottomTitle">
            <div class="bottomTitleText">项目储备</div>
          </div>
          <div class="bottomBackGround bottomBackFour">
            <div class="bottomBackTitle">完善储备项目库建设</div>
            <div class="bottomBackCheckDetail">查看详情</div>
          </div>
        </div>

        <div class="bottomOne" @click="toMap">
          <div class="bottomTitle">
            <div class="bottomTitleText">投资一件事</div>
          </div>
          <div class="bottomBackGround bottomBackFive">
            <div class="bottomBackTitle">投资一件事</div>
            <div class="bottomBackCheckDetail">查看详情</div>
          </div>
        </div>

        <div class="bottomOne">
          <!-- <div class="bottomTitle">
            <div class="bottomTitleText">项目储备</div>
          </div> -->
          <!-- bottomBackFour -->
          <div class="bottomBackFakeGround">
            <!-- <div class="bottomBackTitle">完善储备项目库建设</div>
            <div class="bottomBackCheckDetail">查看详情</div> -->
          </div>
        </div>
        <!-- </div>
        <div class="bottomOne"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'main',
  data() {
    return {
      littleArrow: 'https://img.hzanchu.com/acimg/ef27c855f4f10b4d6e566184fdab1828.png',
      attractArray: [],
      understandArray: [],
      policyArray: [],
      noticeArray: []
    }
  },
  mounted() {
    this.initAction()
    this.initRequest()
    this.getNoticeList()
  },
  methods: {
    toMap() {
      const { href } = this.$router.resolve({
        path: '/forMap'
      })
      window.open(href, '_blank')
    },
    toReserve() {
      const { href } = this.$router.resolve({
        path: '/project/projectReserve'
      })
      window.open(href, '_blank')
    },
    toPolicyItem(item) {
      const { href } = this.$router.resolve({
        path: '/policy/detail',
        query: {
          id: item.id
        }
      })
      window.open(href, '_blank')
    },
    toAttractItem(item) {
      const { href } = this.$router.resolve({
        path: '/attract/detail',
        query: {
          id: item.id
        }
      })
      window.open(href, '_blank')
    },
    toUnderstandItem(item, type) {
      const { href } = this.$router.resolve({
        path: '/understand/detail',
        query: {
          id: item.id,
          type: type
        }
      })
      window.open(href, '_blank')
    },
    toAttract() {
      this.$router.push('/attract')
    },
    toUnderstand(type) {
      this.$router.push({
        path: '/understand',
        query: {
          type: type
        }
      })
    },
    toPolicy() {
      this.$router.push('/policy')
    },
    toTheOne() {
      const { href } = this.$router.resolve({
        path: '/policy',
        query: {
          tabIndex: '1'
        }
      })
      window.open(href, '_blank')
    },
    initAction() {
      this.$store.commit('changeMenuActive', '1')
    },
    getNoticeList() {
      this.ApiLists.fetchNoticeList().then((res) => {
        if (res && res.code === 0) {
          this.noticeArray = res.data.data.slice(0, 9)
        }
      })
    },
    initRequest() {
      this.ApiLists.fetchHomePage()
        .then((res) => {
          if (res && res.code == 0) {
            this.attractArray = res.data.attract_investment.slice(0, 3)
            this.attractArray[0].src = 'https://img.hzanchu.com/acimg/d05b915ec4ac69a3a83896c006b19728.png'
            this.attractArray[1].src = 'https://img.hzanchu.com/acimg/d08841b05e58a3aadfa7aed04466ad6e.png'
            this.attractArray[2].src = 'https://img.hzanchu.com/acimg/cbf19ab0d7f87bc64e4e6278eac982ac.png'
            this.understandArray = res.data.understand_paper.slice(0, 9)
            this.policyArray = res.data.policy_document.slice(0, 5)
          } else {
            this.$message.error(res.msg)
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
.removeA {
  text-decoration: none;
}
.homePageCon {
  background-color: #fff;
}
.arrawImg {
  width: 8px;
  height: 8px;
}
.topContent {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.middleContent {
  margin-top: 48px;
  margin-bottom: 25px;
  .wholeContainer {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    border-bottom: 1px solid #ebebeb;
    margin-bottom: 27px;
  }
}
.middleDivide {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  img {
    width: 360px;
    height: 100px;
    position: absolute;
  }
}
.middleItemCon {
  position: relative;
  cursor: pointer;
  height: 100px;
}
.middleItemtext {
  position: absolute;
  width: 165px;
  font-size: 20px;
  color: #fff;
  left: 12px;
  top: 22px;
}
.bottomContent {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.bottom1Content {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.bottomSubContent {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.mainContent {
  width: 1200px;
  padding-top: 45px;
  box-sizing: border-box;
  margin: 0 auto;
}
.thirdOne {
  width: 360px;
}
.bottomOne {
  margin-bottom: 40px;
  .bottomTitle {
    margin-top: 46px;
    margin-bottom: 20px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    height: 37px;
    width: 360px;
    background-image: url('https://img.hzanchu.com/acimg/e8dc957ec254071bf37ceba80d1492f8.png');
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    .bottomTitleText {
      width: 184px;
      line-height: 22px;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      color: #fefefe;
    }
  }
  .bottomBackOne {
    background-image: url('https://img.hzanchu.com/acimg/fccea5d109a1b423429faafb66ccbd72.png');
  }
  .bottomBackTwo {
    background-image: url('https://img.hzanchu.com/acimg/875c2c25c42665cb709abe52e6e9679a.png');
  }
  .bottomBackFakeGround {
    height: 174px;
    width: 360px;
    padding-top: 63px;
    box-sizing: border-box;
  }
  .bottomBackGround {
    cursor: pointer;
    height: 174px;
    width: 360px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    padding-top: 63px;
    box-sizing: border-box;
    .bottomBackTitle {
      line-height: 20px;
      font-size: 20px;
      text-align: center;
      color: #fff;
    }
    .bottomBackCheckDetail {
      border-radius: 3px;
      width: 86px;
      height: 22px;
      margin: 0 auto;
      margin-top: 20px;
      line-height: 20px;
      box-sizing: border-box;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      border: 1px solid #fff;
      color: #fff;
    }
  }
  .bottomBackThree {
    background-image: url('https://img.hzanchu.com/acimg/5c4778c761e2bc607205e1f61f8f793a.png');
  }
  .bottomBackFour {
    background-image: url('https://img.hzanchu.com/acimg/81c695127292339b6b1cdac9d22638e7.png');
  }
  .bottomBackFive {
    background-image: url('https://img.hzanchu.com/acimg/efc12e10d92ddf2b102290f6125620c1.png');
  }
}
.topTitle {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 37px;
  width: 360px;
  margin-bottom: 15px;
  background-image: url('https://img.hzanchu.com/acimg/e8dc957ec254071bf37ceba80d1492f8.png');
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  .topTitleText {
    width: 184px;
    line-height: 22px;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    color: #fefefe;
  }
  .topTitleMore {
    margin-top: 10px;
    line-height: 14px;
    font-size: 14px;
    text-align: center;
    color: #999999;
    letter-spacing: 0px;
    cursor: pointer;
  }
}
.middleTitle {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 37px;
  width: 360px;
  background-image: url('https://img.hzanchu.com/acimg/245eea9994c24ac5d87be486e89d1d55.png');
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  .middleTitleText {
    width: 184px;
    line-height: 22px;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    color: #fefefe;
  }
}
.middleTitleMore {
  margin-top: 10px;
  line-height: 14px;
  font-size: 14px;
  text-align: center;
  color: #999999;
  letter-spacing: 0px;
  cursor: pointer;
}
.dynamicOne {
  height: 300px;
  .mainItem {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    border-bottom: 2px dashed #f7f7f7;
    height: 34px;
    box-sizing: border-box;
    cursor: pointer;
    &:last-child {
      border-bottom: none;
    }
    .dynamicOneTitle {
      width: 280px;
      margin-left: 11px;
      font-size: 16px;
      font-weight: bold;
      color: #666;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
    }
    .dynamicOneFulfill {
      width: 54px;
      height: 16px;
      background-color: #0270c3;
      text-align: center;
      line-height: 16px;
      color: #fff;
      border-radius: 2px;
      margin-left: 10px;
      font-size: 12px;
      font-weight: bold;
      color: #fefefe;
    }
  }
}
.mainImgEntrance {
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 128px;
  width: 360px;
  background-image: url('https://img.hzanchu.com/acimg/924277a496b22f37410f880d0845f8fb.png');
  box-sizing: border-box;
  padding-top: 98px;
}
.mainTextEntrance {
  width: 100%;
  line-height: 22px;
  font-size: 22px;
  font-weight: 500;
  text-align: center;
  color: #fefefe;
}
.dynamicTwo {
  height: 300px;
  .understandItem {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    border-bottom: 2px dashed #f7f7f7;
    height: 33px;
    box-sizing: border-box;
    cursor: pointer;
    &:last-child {
      border-bottom: none;
    }
  }
  .dynamicTwoTitle {
    width: 200px;
    margin-left: 11px;
    font-size: 16px;
    font-weight: bold;
    color: #666;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden;
  }
  .dynamicTwoTime {
    width: 126px;
    margin-left: 10px;
    line-height: 16px;
    font-size: 16px;
    font-weight: 400;
    text-align: right;
    color: #333;
    line-height: 23px;
  }
}
.dynamicThree {
  height: 300px;
}
.blueItemEntrance {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 88px;
  width: 360px;
  margin-bottom: 16px;
  background-image: url('https://img.hzanchu.com/acimg/1d05fb0f9d80878a796b5afd4b603430.png');
  text-align: center;
  line-height: 88px;
  font-size: 20px;
  font-weight: bold;
  color: #fefefe;
  cursor: pointer;
}
</style>
