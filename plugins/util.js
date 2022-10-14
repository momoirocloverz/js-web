/**
 *
 * @param accAdd    加
 * @param accSubtr  减
 * @param accMul    乘
 * @param accDiv    除
 * @returns
 */
export function accAdd(arg1, arg2) {
  let r1
  let r2
  let m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

export function accSubtr(arg1, arg2) {
  let r1
  let r2
  let m
  let n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  // 动态控制精度长度
  n = r1 >= r2 ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

export function accMul(arg1, arg2) {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}

// 阿拉伯数字转汉字
export function num2Char(val) {
  let chin_list = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'] //所有的数值对应的汉字
  let sn = parseInt(val) + 1 //这里由于我的后台是从0开始排序
  if (sn <= 10) {
    return chin_list[sn - 1]
  } else if (sn <= 100) {
    if (sn < 20) return '十' + chin_list[(sn % 10) - 1]
    if (sn % 10 == 0) return chin_list[Math.floor(sn / 10) - 1] + '十'
    else return chin_list[Math.floor(sn / 10) - 1] + '十' + chin_list[(sn % 10) - 1]
  } else {
    // 一百以上暂不支持
  }
}

export function changeNumMoneyToChinese(money) {
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖') //汉字的数字
  var cnIntRadice = new Array('', '拾', '佰', '仟') //基本单位
  var cnIntUnits = new Array('', '万', '亿', '兆') //对应整数部分扩展单位
  var cnDecUnits = new Array('角', '分', '毫', '厘') //对应小数部分单位
  var cnInteger = '整' //整数金额时后面跟的字符
  var cnIntLast = '圆' //整型完以后的单位
  var maxNum = 999999999999999.9999 //最大处理的数字
  var IntegerNum //金额整数部分
  var DecimalNum //金额小数部分
  var ChineseStr = '' //输出的中文金额字符串
  var parts //分离金额后用的数组，预定义
  var Symbol = '' //正负值标记
  if (money == '') {
    return ''
  }

  money = parseFloat(money)
  if (money >= maxNum) {
    alert('超出最大处理数字')
    return ''
  }
  if (money == 0) {
    ChineseStr = cnNums[0] + cnIntLast + cnInteger
    return ChineseStr
  }
  if (money < 0) {
    money = -money
    Symbol = '负 '
  }
  money = money.toString() //转换为字符串
  if (money.indexOf('.') == -1) {
    IntegerNum = money
    DecimalNum = ''
  } else {
    parts = money.split('.')
    IntegerNum = parts[0]
    DecimalNum = parts[1].substr(0, 4)
  }
  if (parseInt(IntegerNum, 10) > 0) {
    //获取整型部分转换
    var zeroCount = 0
    var IntLen = IntegerNum.length
    for (var i = 0; i < IntLen; i++) {
      var n = IntegerNum.substr(i, 1)
      var p = IntLen - i - 1
      var q = p / 4
      var m = p % 4
      if (n == '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0]
        }
        zeroCount = 0 //归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q]
      }
    }
    ChineseStr += cnIntLast
    //整型部分处理完毕
  }
  if (DecimalNum != '') {
    //小数部分
    var decLen = DecimalNum.length
    for (var i = 0; i < decLen; i++) {
      var n = DecimalNum.substr(i, 1)
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (ChineseStr == '') {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (DecimalNum == '') {
    ChineseStr += cnInteger
  }
  ChineseStr = Symbol + ChineseStr

  return ChineseStr
}
