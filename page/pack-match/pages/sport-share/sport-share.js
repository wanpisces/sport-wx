var httpsUtils = require('../../../../utils/https-utils.js')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    material_id: '',
    share: {}
  },

  getSportShare: function (that) {
    that = this;
    httpsUtils.competitionMaterialInfo(that.data.material_id, {}, function (res) {
      that.setData({
        share: res
      })
      wx.setNavigationBarTitle({
        title: res.material_title
      })
    }, function (e) { })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          isLoading: true,
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString()
        })
      }
    })
    that.data.material_id = options.material_id;
    that.getSportShare(that)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})