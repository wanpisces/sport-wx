var that;
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
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
        })
      }
    })
    if (wx.getStorageSync('userInfo')) {
      wx.switchTab({
        url: '/page/tabBar/about-movement/about-movement',
      })
    } else {
      getApp().getToken(function (token) { })
    }
  },
  // 立即约动
  ydEvt: function () {
    getApp().getRefreshUserInfo(function (userInfo) {
      if (userInfo) {
        wx.switchTab({
          url: '/page/tabBar/about-movement/about-movement',
        })
      }
    })
  },
  // 进入活动详情
  navActiveRule: function () {
    getApp().getRefreshUserInfo(function (userInfo) {
      if (userInfo) {
        wx.navigateTo({
          url: '/page/pack-find/active-detail/active-detail',
        })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})