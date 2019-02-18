// page/pack-mine/complete-infomation/complete-infomation.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js")
var that
var mRoleId
var mGroupId
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    mRoleId = ''
    mGroupId = options.group_id
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          attr_id: options.attr_id,
          date: toolUtils.getNowFormatDate()
        })
        getApp().userInfo(function (userInfo) {
          var mUserHeight = userInfo.user_height || ''
          var mUserWeight = userInfo.user_weight || ''
          that.setData({
            mUserHeight: mUserHeight,
            mUserWeight: mUserWeight,
            user_phone: userInfo.user_phone || '',
            teamDate: userInfo.user_birth || '',
            isHeight: userInfo.user_height && true || false,
            isWeight: userInfo.user_weight && true || false,
            isBirth: userInfo.user_birth && true || false
          })
        })
      }
    })
    if (that.data.attr_id == 2) {
      getRoleList()
    } else if (that.data.attr_id == 3) {
      getBaskList()
    }

  },
  //号码
  bindNo: function (e) {
    var mUserNo = e.detail.value
    if (mUserNo < 0) {
      return 0
    } else if (mUserNo > 127) {
      mUserNo = 127
      return 127
    }
  },
  formSubmit: function (e) {
    var params = e.detail.value
    if (that.data.attr_id == 2 || that.data.attr_id == 3) {
      if (!mGroupId) {
        toolUtils.showToast("队伍id不能为空")
        return
      }

      if (!params.no) {
        toolUtils.showToast("请输入队员号码")
        return
      }
      if (!mRoleId) {
        toolUtils.showToast("请输入队伍位置")
        return
      }
      if (!params.user_height) {
        toolUtils.showToast("请输入队伍身高")
        return
      }
      if (!params.user_weight) {
        toolUtils.showToast("请输入队伍体重")
        return
      }
      if (!params.user_birth) {
        toolUtils.showToast("生日不能为空")
        return
      }
      if (!params.user_phone) {
        toolUtils.showToast("联系方式不能为空")
        return
      }
      if (!toolUtils.checkMobilePhone(params.user_phone)) {
        toolUtils.showToast("请输入正确的手机号")
        return
      }
      try {
        var n = parseFloat(params.user_height)
        if (n <= 0) {
          toolUtils.showToast("请输入正确身高")
          return
        }
        var n1 = parseFloat(params.user_weight)
        if (n1 <= 0) {
          toolUtils.showToast("请输入正确体重")
          return
        }
      } catch (e) {
        console.log(e)
      }
    }
    // if (!params.apply_remark) {
    //   toolUtils.showToast("请输入队伍备注")
    //   return
    // }

    joinTeam(params)
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
  //选择您的生日
  bindDateChange: function (e) {
    this.setData({
      teamDate: e.detail.value
    })
  },
  onDisabled: function (e) {
    toolUtils.showToast("请去个人中心修改")
  },
  //选择队内位置
  bindPickerSeat: function (e) {
    var role = this.data.roleList[e.detail.value]
    mRoleId = role.id
    this.setData({
      seat: role.name
    })
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
 * 获取球队中的角色（足球）
 */
function getBaskList() {
  httpsUtils.attr(10, function (res) {
    console.log(res)
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
//提交申请
function joinTeam(params) {
  params.group_id = mGroupId
  params.role = mRoleId
  params.user_birth = that.data.teamDate
  httpsUtils.joinTeam(params, function (res) {
    try {
      var pages = getCurrentPages()
      if (pages.length > 1) {
        typeof (pages[pages.length - 2].refreshData()) == 'function' && pages[pages.length - 2].refreshData()
      }
    } catch (e) {

    }
    wx.navigateBack({
      delta: 1
    })
    toolUtils.showToast("提交申请成功")
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}