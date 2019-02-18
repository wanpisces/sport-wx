// page/pack-index/pages/organize-team/organize-team.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js")
var that
var mAttrId
var mGroupName
var mGroupPhone
var mGroupDesc
var mVenuesName
var mHomeShirt
var mAwayKit
var mGroupBadge
var tag
var areaInfo
var team_num
var mGroupId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaIndex: [0, 0, 0],
    teamNumIndex: 0,
    areaList: [
      [],
      [],
      []
    ],
    teamNum: '1~199人',
    isViewPicker: false,
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    mGroupName = ''
    mGroupDesc = ''
    mVenuesName = ''
    mHomeShirt = ''
    mAwayKit = ''
    team_num = 199
    mAttrId = options.attr_id
    getColorList()
    getTeamScale()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: toolUtils.getNowFormatDate(),
          isEdit: options.isEdit && true || false,
          attr_id: options.attr_id
        })
        if (that.data.isEdit) {
          mGroupId = options.group_id
          that.setData({
            isLoading: true
          })
          groupDetail()
        } else {
          getTeamImg()
          getUserInfo()
        }
        getApp().getAreaData(function (data) {
          areaInfo = data
          var l = toolUtils.areaPickerData(data, [
            [],
            [],
            []
          ], 0, 0)
          var areaIndex = that.data.areaIndex
          // for (var i = 0, legth = l[0].length; i < legth; i++) {
          //   if ('四川省' == l[0][i].name) {
          //     areaIndex[0] = i
          //     l = toolUtils.areaPickerData(areaInfo, l, 0, i)
          //     for (var j = 0, legth2 = l[1].length; j < legth2; j++) {
          //       if ('成都市' == l[1][j].name) {
          //         l = toolUtils.areaPickerData(areaInfo, l, 1, j)
          //         areaIndex[1] = j
          //         break
          //       }
          //     }
          //     break
          //   }
          // }
          var i = 0,
            j = 0;
          for (i; i < l[0].length; i++) {
            if (510000 == l[0][i].id) {
              break
            }
          }
          var area_list = toolUtils.areaPickerData(areaInfo, l, 0, i)
          for (j; j < area_list[1].length; j++) {
            if (510100 == area_list[1][j].id) {
              break
            }
          }
          var area_list = toolUtils.areaPickerData(areaInfo, area_list, 1, j)

          that.setData({
            areaList: area_list,
            areaIndex: [i, j, 0]
          })
          // that.setData({
          //   areaIndex: areaIndex,
          //   areaList: l
          // })
        })
      }
    })
    getTime()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  bindTeamlogo: function (e) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        httpsUtils.uploadImgs(tempFilePaths, function (res) {
          mGroupBadge = res[0].key
          that.setData({
            group_badge: tempFilePaths[0]
          })
        })
      }
    })
  },

  //选择省市区
  bindAreaPickerChange: function (e) {
    var value = e.detail.value
    var areaList = this.data.areaList
    var province = areaList[0][value[0]]
    var city = areaList[1][value[1]]
    var area = areaList[2][value[2]]
    that.setData({
      address: province.name + '-' + city.name + '-' + area.name,
      addressList: [province.id, city.id, area.id]
    })
  },
  //省市区滚动监听
  bindAreaPickerColumnChange: function (e) {
    var detail = e.detail;
    var areaIndex = that.data.areaIndex
    if (detail.column == 0) {
      areaIndex[0] = detail.value
      areaIndex[1] = 0
      areaIndex[2] = 0
    }
    if (detail.column == 1) {
      areaIndex[1] = detail.value
      areaIndex[2] = 0
    }
    if (detail.column != 2) {
      that.setData({
        areaList: toolUtils.areaPickerData(areaInfo, that.data.areaList, detail.column, detail.value),
        areaIndex: areaIndex
      })
    }
  },
  //选择成立日期
  bindDateChange: function (e) {
    that.setData({
      teamDate: e.detail.value
    })
    console.log(that.data.teamDate)
  },
  //选择队伍规模
  bindScaleChange: function (e) {
    this.setData({
      teamNum: this.data.teamSacle[e.detail.value].name
    })
    team_num = this.data.teamNum.slice(2, -1)

  },
  //自定义picker的返回时间
  bindViewPicker: function (e) {
    this.setData({
      isViewPicker: false
    })

    if ("cancel" == e.detail.id) { } else if ("confirm" == e.detail.id) {
      if (tag == 1) {
        mHomeShirt = e.detail.attr_id || mHomeShirt
        this.setData({
          color1: e.detail.attr_value || that.data.color1
        })
      } else {
        mAwayKit = e.detail.attr_id || mAwayKit
        this.setData({
          color2: e.detail.attr_value || that.data.color2
        })
      }

    }
  },
  //选择球衣颜色
  onColors: function (e) {
    this.setData({
      isViewPicker: true
    })
    switch (e.currentTarget.id) {
      case 'color1': //主队球衣颜色
        tag = 1;
        break
      case 'color2': //客队球衣颜色
        tag = 2
        break
    }
  },
  //球队名字
  onGroupName: function (e) {
    if (e.detail.cursor > 10) {
      toolUtils.showToast("您输入的信息已经超过10个字啦~")
      return mGroupName
    } else if (toolUtils.emojiCharacter(e.detail.value)) {
      toolUtils.showToast("队伍名称不支持输入emoji表情")
      this.setData({
        group_name: mGroupName
      })
      return
    } else {
      mGroupName = e.detail.value
    }

  },
  //联系方式
  onGroupPhone: function (e) {
    mGroupPhone = e.detail.value
  },
  // 队伍介绍
  onGroupDesc: function (e) {
    if (e.detail.cursor > 16) {
      toolUtils.showToast("您输入的信息已经超过16个字啦~")
      return mGroupDesc
    } else {
      mGroupDesc = e.detail.value
    }
  },
  // 常用场馆
  onVenuesName: function (e) {
    if (e.detail.cursor > 16) {
      toolUtils.showToast("您输入的信息已经超过16个字啦~")
      return mVenuesName
    } else {
      mVenuesName = e.detail.value
    }
  },
  //下一步
  onNext: function (e) {
    if (!that.data.isEdit) {
      if (!mGroupBadge) {
        toolUtils.showToast("请上传队徽")
        return
      }
      if (!mGroupName) {
        toolUtils.showToast("请重新输入队伍名称")
        return
      }
      if (!this.data.address) {
        toolUtils.showToast("请选择所在区域")
        return
      }
      if (!this.data.teamDate) {
        toolUtils.showToast("请选择成立时间")
        return
      }
      if (!mHomeShirt) {
        toolUtils.showToast("请选择主场球衣")
        return
      }
      if (!mAwayKit) {
        toolUtils.showToast("请选择客场球衣")
        return
      }
      if (mHomeShirt == mAwayKit) {
        toolUtils.showToast("主场球衣不能与客场相同")
        return
      }
      // if (!mGroupDesc) {
      //   toolUtils.showToast("请输入球队介绍")
      //   return
      // }
      // if (!mVenuesName) {
      //   toolUtils.showToast("请输入常用场馆")
      //   return
      // }
      if (!toolUtils.checkMobilePhone(mGroupPhone)) {
        toolUtils.showToast("请输入正确的手机号码")
        return
      }
      if (!this.data.teamNum) {
        toolUtils.showToast("请选择队伍规模")
        return
      }
      var params = {}
      params.group_badge = mGroupBadge
      params.attr_id = mAttrId
      params.group_name = mGroupName
      params.province_id = this.data.addressList[0]
      params.city_id = this.data.addressList[1]
      params.area_id = this.data.addressList[2]
      params.group_time = this.data.teamDate
      params.group_desc = mGroupDesc
      params.home_shirt = mHomeShirt
      params.away_kit = mAwayKit
      params.venues_name = mVenuesName
      params.group_tel = mGroupPhone
      params.group_scale = team_num
      checkGroupNameUnique(function (res) {
        wx.redirectTo({
          url: '/page/pack-index/pages/improve-personal-information/information?params=' + JSON.stringify(params)
        })
      })
      // toolUtils.pageTo('/page/pack-index/pages/improve-personal-information/information?params=' + JSON.stringify(params))

    } else {
      editGroup()
    }

  }
})
/**
 * 获取球衣颜色
 */
function getColorList() {
  httpsUtils.attr(2, function (res) {
    try {
      if (that.data.isEdit) {
        that.setData({
          colorList: res[0]
        })
      } else {
        mHomeShirt = res[0][0].id
        mAwayKit = res[0][1].id
        that.setData({
          colorList: res[0],
          color1: res[0][0].name,
          color2: res[0][1].name
        })
      }
    } catch (e) {
      that.setData({
        colorList: res[0]
      })
    }

  }, function (e) {

  })
}
//修改队伍资料时，获取队伍详情
function groupDetail() {
  httpsUtils.groupDetail(mGroupId, {}, function (res) {
    mAttrId = res.attr_id
    res.group_scale = '1~' + res.group_scale + '人';
    that.setData(res)
    mGroupName = res.group_name
    mGroupDesc = res.group_desc
    mVenuesName = res.venues_name
    mHomeShirt = res.home_shirt
    mGroupPhone = res.group_tel;
    mAwayKit = res.away_kit
    that.setData({
      color1: res.home_shirt,
      color2: res.away_kit,
      teamNum: res.group_scale,
      teamDate: res.group_time
    })
    team_num = that.data.teamNum.slice(2, -1)
    for (var i = 0; i < that.data.teamSacle.length; i++) {
      if (that.data.teamSacle[i].name == res.group_scale) {
        that.setData({
          teamNumIndex: i
        })
      }
    }
  }, function (e) { })
}
//修改队伍资料
function editGroup() {
  var params = {}
  params.group_id = mGroupId
  if (mGroupBadge) {
    params.group_badge = mGroupBadge
  }
  if (mGroupName) {
    params.group_name = mGroupName
  } else {
    toolUtils.showToast("请输入球队名称")
    return
  }
  if (toolUtils.checkMobilePhone(mGroupPhone)) {
    params.group_tel = mGroupPhone
  } else {
    toolUtils.showToast("请输入正确的手机号码")
    return
  }
  if (that.data.addressList && that.data.addressList.length == 3) {
    params.province_id = that.data.addressList[0]
    params.city_id = that.data.addressList[1]
    params.area_id = that.data.addressList[2]
  }
  if (that.data.teamDate) {
    params.group_time = that.data.teamDate
  }
  if (that.data.teamNum) {
    params.group_scale = team_num
  }
  if (mGroupDesc) {
    params.group_desc = mGroupDesc
  } else {
    params.group_desc = ""
  }
  if (mHomeShirt && mHomeShirt.indexOf('#') < 0) {
    params.home_shirt = mHomeShirt
  }
  if (mAwayKit && mAwayKit.indexOf('#') < 0) {
    params.away_kit = mAwayKit
  }
  if (mVenuesName) {
    params.venues_name = mVenuesName
  } else {
    params.venues_name = ""
  }
  if (that.data.color1 == that.data.color2) {
    toolUtils.showToast("主场球衣不能与客场相同")
    return
  }
  if (Object.keys(params).length == 2) {
    wx.navigateBack({
      delta: 1
    })
    return
  }
  httpsUtils.editGroup(params, function (res) {
    var pages = getCurrentPages()
    pages[pages.length - 3].refreshData()
    pages[pages.length - 2].refreshData()
    wx.navigateBack({
      delta: 1
    })
    toolUtils.showToast("修改成功")
  })

}
/**
 * 检测队伍是否重名
 */
function checkGroupNameUnique(succee) {
  var params = {
    group_name: mGroupName,
    attr_id: mAttrId
  }
  httpsUtils.checkGroupNameUnique(params, function (res) {
    if (res.is_exists == 2) {
      succee(res)
    } else {
      toolUtils.showToast("该队名已存在！")
    }
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
//队伍规模
function getTeamScale() {
  httpsUtils.attr(9, function (res) {
    var teamSacle = res[0];
    for (let i = 0; i < teamSacle.length; i++) {
      teamSacle[i].name = `1~${teamSacle[i].name}人`
    }
    that.setData({
      teamSacle: teamSacle
    })
  }, function (e) { })
}

// 获取队徽
function getTeamImg() {
  var params = {};
  params.type = 3;
  params.current_page = 1;
  params.page_size = 1000;
  httpsUtils.material(params, function (res) {
    var list = res.list;
    var teamLogo;
    for (let i = 0; i < list.length; i++) {
      if (mAttrId == list[i].correlation) {
        teamLogo = list[i].url
        mGroupBadge = list[i].base_url
        that.setData({
          teamLogo: teamLogo
        })
      }
    }
  }, function (e) { })
}

// 获取个人信息
function getUserInfo() {
  httpsUtils.getUserInfo({}, function (res) {
    mGroupPhone = res.user_phone
    that.setData({
      group_tel: res.user_phone || ''
    })
    toolUtils.setMyUserInfo(res)
  }, function (e) { })
}
// 获取当前时间
function getTime() {
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();
  that.setData({
    teamDate: `${year}-${month}-${day}`
  })
}