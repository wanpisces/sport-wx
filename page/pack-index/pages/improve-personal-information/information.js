// page/pack-index/pages/improve-personal-information/information.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js")
var that
var mRoleId
var mUserHeight
var mUserWeight
var mUserNo
var paramsStr
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arraySeat: ['前锋', '中锋', '后卫', '守门员'],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    mRoleId = ''
    mUserHeight = ''
    mUserWeight = ''
    mUserNo = ''
    that = this
    paramsStr = options.params
    console.log(paramsStr)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          date: toolUtils.getNowFormatDate(),
          attr_id: JSON.parse(paramsStr).attr_id
        })
        getApp().userInfo(function (userInfo) {
          mUserHeight = userInfo.user_height || ''
          mUserWeight = userInfo.user_weight || ''
          that.setData({
            mUserHeight: mUserHeight,
            mUserWeight: mUserWeight,
            teamDate: userInfo.user_birth || '',
            isHeight: userInfo.user_height && true || false,
            isWeight: userInfo.user_weight && true || false,
            isBirth: userInfo.user_birth && true || false,
          })
        })
      }
    })

    if (that.data.attr_id == 2) {
      getRoleList()
    } else {
      getBaskList()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

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
  onDisabled: function (e) {
    toolUtils.showToast("请去个人中心修改")
  },
  //身高
  bindHeight: function (e) {
    mUserHeight = e.detail.value
    try {
      var n = parseFloat(mUserHeight)
      if (n <= 0) {
        return 1;
      }
    } catch (e) {
      console.log(e)
    }
  },
  //体重
  bindWeight: function (e) {
    mUserWeight = e.detail.value
    try {
      var n = parseFloat(mUserWeight)
      if (n <= 0) {
        return 1;
      }
    } catch (e) {
      console.log(e)
    }
  },
  //号码
  bindNo: function (e) {
    mUserNo = e.detail.value
    if (mUserNo < 0) {
      return 0
    } else if (mUserNo > 127) {
      mUserNo = 127
      return 127
    }
  },
  //选择您的生日
  bindDateChange: function (e) {
    this.setData({
      teamDate: e.detail.value
    })
  },
  //选择队内位置
  bindPickerSeat: function (e) {
    if (this.data.attr_id == 2) {
      var role = this.data.roleList[e.detail.value]
    } else {
      var role = this.data.BaskList[e.detail.value]
    }
    mRoleId = role.id
    this.setData({
      seat: role.name
    })
  },
  onNext: function (e) {
    if (!mUserHeight) {
      toolUtils.showToast("请输入身高")
      return
    }
    if (!mUserWeight) {
      toolUtils.showToast("请输入体重")
      return
    }
    if (!this.data.teamDate) {
      toolUtils.showToast("请选择您的生日")
      return
    }
    if (!mUserNo) {
      toolUtils.showToast("请输入你的号码")
      return
    }
    if (!mRoleId) {
      toolUtils.showToast("请选择队内位置")
      return
    }
    var params = JSON.parse(paramsStr)
    params.user_height = mUserHeight
    params.user_weight = mUserWeight
    params.user_birth = this.data.teamDate
    params.no = mUserNo
    params.role = mRoleId
    createGroup(params)
  }
})
/**
 * 获取球队中的角色（足球）
 */
function getRoleList() {
  httpsUtils.attr(3, function (res) {
    try {
      that.setData({
        roleList: res[0]
      })
    } catch (e) {
      that.setData({
        roleList: []
      })
    }
  }, function (e) {

  })
}

/**
 * 获取球队中的角色（篮球）
 */
function getBaskList() {
  httpsUtils.attr(10, function (res) {
    try {
      that.setData({
        BaskList: res[0]
      })
    } catch (e) {
      that.setData({
        roleList: []
      })
    }
  }, function (e) {

  })
}
/**
 * 创建球队
 */
function createGroup(params) {
  httpsUtils.createGroup(params, function (res) {
    toolUtils.showToast("创建队伍成功")
    setTimeout(function (e) {
      try {
        var pages = getCurrentPages()
        pages[pages.length - 2].refreshData()
      } catch (e) {

      }
      wx.redirectTo({
        url: `/page/pack-index/pages/team-page/team-page?is_new=1&group_id=${res.group_id}`
      })
    }, 600)
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}