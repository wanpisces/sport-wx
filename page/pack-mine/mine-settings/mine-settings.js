// page/pack-mine/mine-settings/mine-settings.js
var configure = require("../../../utils/my-configure.js")
var toolUtils = require("../../../utils/tool-utils.js")
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
  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: '028-87750193',
      success: function (res) {

      },
      fail: function (e) {

      }
    })
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
  onProtocol: function (e) {
    getApp().data.url = 'https://h5.sport.darongshutech.com/agreement/index.html'
    toolUtils.pageTo('/page/tabBar/my-webview/my-webview')
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 授权回调
   */
  bindopensetting: function (res) {
    if ("openSetting:ok" == res.detail.errMsg) {
      if (res.detail.authSetting["scope.userLocation"] == true) {
        getApp().data.refreshLocation = true
      }
    }
  },
})