module.exports = {
  circleImg: circleImg, //绘制圆形图片
  canvasTxtHandle: canvasTxtHandle, //canvas的文字处理
  setMyUserInfo: setMyUserInfo, //保存个人信息
  showToast: showToast, //提示框
  useraAuthorize: useraAuthorize, //授权
  pageTo: pageTo, //控制页面跳转
  throttle: throttle, ////防止小程序多次点击跳转解决办法
  setFormId: setFormId, //保存formId
  getFormId: getFormId, //获取formId
  removeStorage: removeStorage, //删除缓存的key
  areaPickerData: areaPickerData, //省市区联动   
  areaPickerData2: areaPickerData2, //省市区联动 
  cityPickerData: cityPickerData, //省市联动 
  userWeight: userWeight, //用户体重数据
  userHeight: userHeight, //用户身高数据
  selectIndex: selectIndex, //查找数组中元素的位置
  getNowFormatDate: getNowFormatDate, //获取当前时间，格式YYYY-MM-DD
  getNowTime: getNowTime, //获取当前时间，格式HH:MM
  timeCompare: timeCompare, //比较时间与当前的大小
  checkMobilePhone: checkMobilePhone, //手机号码校验
  filterChars: filterChars, // 身份证号码验证
  getStrLength: getStrLength, //获取字符串的实际长度
  IdentityCodeValid: IdentityCodeValid, //身份证号码校验
  jumpRules: jumpRules,
  emojiCharacter: emojiCharacter, //验证是否支持emjoy表情,
  compareVersion: compareVersion //版本强制更新
}
/**
 *绘制圆形图片
 */
function circleImg(ctx1, img, x, y, r) {
  ctx1.save();
  var d = 2 * r;
  var cx = x + r;
  var cy = y + r;
  ctx1.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx1.clip();
  ctx1.drawImage(img, x, y, d, d);
  ctx1.restore();
}
/**
 * canvas的文字处理
 * deail:需要处理的文本
 * length:一行文本的长度，中文长度为2，英文长度为1
 * row：行数
 */
function canvasTxtHandle(detail, length, row) {
  let len = 0
  let index = 0
  let content = []
  detail = detail || ''
  for (let i = 0; i < detail.length; i++) {
    // 若未定义则致为 ''
    if (!content[index]) content[index] = ''
    content[index] += detail[i]
    // 中文或者数字占两个长度
    if (detail.charCodeAt(i) > 127 || (detail.charCodeAt(i) >= 48 && detail.charCodeAt(i) <= 57)) {
      len += 2;
    } else {
      len++;
    }
    if (len >= length || (row - index == 1 && len >= length - 2)) {
      len = 0
      index++
    }
    if (index === row) {
      content[index - 1] += '...'
      break
    }
  }
  return content
}
//保存个人信息
function setMyUserInfo(userInfo) {
  getApp().data.isUserAuth = userInfo.user_avatar && userInfo.user_nickname && true || false
  wx.getStorage({
    key: 'userInfo',
    success: function (res) {
      var datas = res.data
      datas.data = userInfo
      wx.setStorage({
        key: "userInfo",
        data: datas
      })
    },
    fail: function (e) { }
  })
}
//失败弹出框
function showToast(title, isImg) {
  wx.showToast({
    title: title,
    icon: isImg ? 'none' : 'none'
  })
}
//授权
function useraAuthorize(type, _success) {
  var scope
  switch (type) {
    case 1: //用户信息
      scope = "scope.userInfo"
      break
    case 2: //通讯地址
      scope = "scope.address"
      break
    case 3: //发票抬头
      scope = "scope.invoiceTitle"
      break
  }
  wx.getSetting({
    success(res) {
      if (!res.authSetting[scope]) {
        wx.openSetting({
          success: (res) => {
            console.log(res)
          }
        })
        return
      }
      _success()
    }
  })
}
// 控制页面跳转
function pageTo(url, type, _success, _fail) {
  if (typeof (type) == "undefined") {
    var type = 1
  }
  switch (type) {
    case 1:
      wx.navigateTo({
        url: url,
        success: function (res) {
          typeof (_success) == 'function' && _success(res)
        },
        fail: function (e) {
          typeof (_fail) == 'function' && _fail(e)
        }
      })
      break
    case 2:
      wx.redirectTo({
        url: url,
        success: function (res) {
          typeof (_success) == 'function' && _success(res)
        },
        fail: function (e) {
          typeof (_fail) == 'function' && _fail(e)
        }
      })
      break
    case 3:
      wx.switchTab({
        url: url,
        success: function (res) {
          typeof (_success) == 'function' && _success(res)
        },
        fail: function (e) {
          typeof (_fail) == 'function' && _fail(e)
        }
      })
      break
  }
}
//防止小程序多次点击跳转解决办法
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}
//保存formId
function setFormId(id) {
  wx.getStorage({
    key: 'formIdList',
    success: function (res) {
      var list = res.data
      if (list.length > 19) {
        list.pop();
        list.unshift(id)
      } else {
        list.unshift(id)
      }
      wx.setStorage({
        key: "formIdList",
        data: list
      })
    },
    fail(e) {
      var list = []
      list.push(id)
      wx.setStorage({
        key: "formIdList",
        data: list
      })
    }
  })
}
//获取保存的formId
function getFormId() {
  try {
    var value = wx.getStorageSync('formIdList')
    if (value) {
      return value
    } else {
      return null
    }
  } catch (e) {
    console.log("获取保存的formId失败")
    return null
  }

}
//删除缓存的key
function removeStorage(key) {
  wx.removeStorage({
    key: key,
    success: function (res) {
      console.log(res)
    }
  })
}
//省市区联动，数据组装
function areaPickerData(data, list, lineId, index) {
  console.log("areaPickerData")
  if (list[0].length == 0) {
    list[0] = data['0']
    list[1] = data[list[0][0].id]
    list[2] = data[list[1][0].id]
    return list
  } else {
    if (lineId == 0) {
      list[1] = data[list[0][index].id]
      console.log(data[list[1][0].id])
      list[2] = (data[list[1][0].id] || [])
      return list
    } else if (lineId == 1) {
      list[2] = data[list[1][index].id]
      return list
    }
    return list
  }

}

//省市区联动，数据组装
function areaPickerData2(data, list, lineId, index) {
  if (list[0].length == 0) {
    list[0] = data['0']
    // list[1] = data[list[0][0].id]
    // list[2] = (data[list[1][0].id] || [])
    // return list
  } else {
    if (lineId == 0) {
      if (list[0][index].id > 0) {
        list[1] = data[list[0][index].id]
        if (list[1][0].id > 0) {
          list[2] = (data[list[1][0].id] || [])
        } else {
          list[2] = (data[list[1][1].id] || [])
        }
      } else {
        list[1] = [{
          id: 0,
          name: "全部"
        }];
        list[2] = [{
          id: 0,
          name: "全部"
        }]
      }
      // return list
    } else if (lineId == 1) {
      if (list[1][index].id > 0) {
        list[2] = (data[list[1][index].id] || [])
      } else {
        list[2] = [{
          id: 0,
          name: "全部"
        }]
      }
      // return list
    }
    // return list
  }
  if (list[0][0].id != 0) {
    list[0].unshift({
      id: 0,
      name: "全部"
    });
  }
  if (list[1].length == 0 || list[1][0].id != 0) {
    list[1].unshift({
      id: 0,
      name: "全部"
    });
  }
  if (list[2].length == 0 || list[2][0].id != 0) {
    list[2].unshift({
      id: 0,
      name: "全部"
    });
  }
  return list
}
//省市联动，数据组装
function cityPickerData(data, list, lineId, index) {
  if (list[0].length == 0) {
    list[0] = data['0']
    // list[1] = data[list[0][0].id]
    // return list
  } else {
    if (lineId == 0) {
      if (list[0][index].id > 0) {
        list[1] = data[list[0][index].id]
      } else {
        list[1] = []
      }
    }
  }
  if (list[0][0].id != 0) {
    list[0].unshift({
      id: 0,
      name: "全部"
    });
  }
  if (list[1].length == 0 || list[1][0].id != 0) {
    list[1].unshift({
      id: 0,
      name: "全部"
    });
  }
  return list
}
/**
 * 初始化体重数据
 */
function userWeight() {
  var weights = []
  for (var minWeight = 30, maxWeight = 151; minWeight < maxWeight; minWeight++) {
    weights.push(minWeight + 'KG')
  }
  return weights
}
/**
 * 初始化身高数据
 */
function userHeight() {
  var heights = []
  for (var minHeight = 140, maxHeight = 250; minHeight < maxHeight; minHeight++) {
    heights.push(minHeight + 'CM')
  }
  return heights
}
/**
 * 查找数组中元素的位置
 */
function selectIndex(arr, str) {
  for (var i = 0, length = arr.length; i < length; i++) {
    if (arr[i].indexOf(str) == 0) {
      return i
    }
  }
  return 0
}
//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
//获取当前时间，格式HH:MM
function getNowTime() {
  var date = new Date();
  return date.getHours() + ':' + date.getMinutes();
}
//比较时间是否大于现在大小
function timeCompare(time) {
  console.log(time)
  time = time.replace(/\-/g, "/"); //替换字符，变成标准格式  
  var d2 = new Date(); //取今天的日期  
  var d1 = new Date(Date.parse(time));
  if (d1 > d2) {
    return true
  }
  return false
}
//手机号码校验
function checkMobilePhone(str) {
  var re = /^1\d{10}$/
  if (re.test(str)) {
    return true
  } else {
    return false
  }
}
//过滤常见字符
function filterChars(str) {
  // var re = /^[\"\\-%&_+`~!@#$^*()<>=|{}':;',\\[\\]""\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]$/
  // if (re.test(str)) {
  //   return false
  // } else {
  //   return true
  // }
}

//验证输入判断是否输入emoji表情
function emojiCharacter(substring) {
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
        hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
        hs == 0x2b50) {
        return true;
      }
    }
  }
}
/**
 * 获取字符串的实际长度
 */
function getStrLength(str) {
  return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
}

/**
 * 首页的banner
 * tag->1:banner;
 * run:0不跳转 1原生  2H5  3小程序
 * url:小程序跳转参数
 * name:名称
 * params:可额外携带参数
 */
function jumpRules(tag, run, url, name, params) {
  var app = getApp()
  try {
    switch (run) {
      case "1": //原生跳转
      case 1: //原生跳转
        if (!url) {
          showToast("跳转地址错误：url=" + url)
          return
        }
        if (url.indexOf("?") >= 0) {
          if (url.indexOf("title") < 0 && name) {
            url = url + '&title=' + (name || '')
          }
        } else {
          if (url.indexOf("title") < 0 && name) {
            url = url + '?title=' + (name || '')
          }

        }
        if (url.indexOf("?") >= 0) {
          url = url + "&param=" + JSON.stringify(params)
        } else {
          url = url + "?param=" + JSON.stringify(params)
        }
        url = url
        pageTo(url, 1)
        break;
      case "4": //赛事
      case 4: //赛事
        switch (params.competition_status) {
          case 1: //报名阶段
          case 4: //计划中 
          case 5: //抽签阶段
            pageTo(`/page/pack-match/pages/sport-detail/sport-detail?competition_id=${url}`)
            break
          case 2: //进行中
            pageTo(`/page/pack-match/pages/sport-underway/sport-underway?competition_id=${url}`)
            // toolUtils.pageTo('/page/pack-match/pages/sport-underway/sport-underway?competition_id=' + item.competition_id)
            break
          case 3: //已结束
            pageTo(`/page/pack-match/pages/sport-summary/sport-summary?competition_id=${url}`)
            break
        }
        break
      case "2": //h5跳转
      case 2: //h5跳转
        if (!url) {
          showToast("跳转地址错误：url=" + url)
          return
        }
        if (url.indexOf('https://') == 0) {
          var wechatRedirect = '#wechat_redirect'
          var parameter = ''
          //处理地址有#的参数
          if (url.indexOf("#wechat_redirect") >= 0) {
            var urls = url.split("#wechat_redirect")
            url = urls[0]
            wechatRedirect = ''
            for (var i = 1, length = urls.length; i < length; i++) {
              wechatRedirect = wechatRedirect + '#wechat_redirect' + urls[i]
            }
          }
          //拆分url的参数
          if (url.indexOf("?") >= 0) {
            var urls = url.split("?")
            url = urls[0]
            for (var i = 1, length = urls.length; i < length; i++) {
              if (i > 1) {
                parameter = parameter + '?'
              } else {
                if (urls[i].indexOf("token=") >= 0) {
                  parameter = '?'
                } else {
                  parameter = '&'
                }
              }
              parameter = parameter + urls[i]
            }
          }
          //获取token组装参数带过去,如果有token就不覆盖保持原样
          if (parameter.indexOf("?token=") >= 0 || parameter.indexOf("&token=") >= 0) {
            url = url + parameter + wechatRedirect
            app.data.url = url
            pageTo("/page/tabBar/my-webview/my-webview", 1)
          } else {
            app.getToken(function (token) {
              url = url + '?token=' + token + parameter + wechatRedirect
              app.data.url = url
              pageTo("/page/tabBar/my-webview/my-webview", 1)
            })
          }
        } else {
          showToast("不能打开非https地址！url=" + url)
        }
        break
      default:
        if (tag != 1 && tag != 4) {
          showToast("暂未开通，敬请期待")
        }
    }
  } catch (e) {
    showToast(e.message)
  }

}
/**
 * 身份证号码校验
 */
function IdentityCodeValid(code) {
  var city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外 "
  };
  var tip = "";
  var pass = true;

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    tip = "身份证号格式错误";
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = "地址编码错误";
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (parity[sum % 11] != code[17]) {
        tip = "校验位错误";
        pass = false;
      }
    }
  }
  if (!pass) console.log(tip);
  return pass;
}
// 版本更新
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}