// page/pack-mine/pages/version-description/version-description.js
var httpsUtils = require("../../../utils/https-utils.js")
var toolutils = require("../../../utils/tool-utils.js")
var configure = require("../../../utils/my-configure.js")
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
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          windowHeight: res.windowHeight,
          version: configure.VERSION
        })
      }
    })
    getVersion(this)
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onItem: function (e) {
    var index = e.currentTarget.dataset.index;
    toolutils.pageTo('/page/pack-mine/update-details/update-details?index=' + index)
  }
})

function getVersion(that) {
  httpsUtils.getVersion({
    'app_type': 1
  }, function (res) {
    that.setData({
      list: res
    })
  }, function (e) {

  })
}