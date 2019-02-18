// page/pages/load-page/load-page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('userInfo')) {
      console.log('本地')
      wx.switchTab({
        url: '/page/tabBar/about-movement/about-movement',
      })
    } else {
      console.log('请求')
      getApp().getToken(function (token) {
        
        wx.switchTab({
          url: '/page/tabBar/about-movement/about-movement',
        })
      })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})