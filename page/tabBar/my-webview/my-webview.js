// page/tabBar/my-webview/my-webview.js
var app = getApp()
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
    if (options.url) {
      var url = decodeURIComponent(options.url)
      this.setData({
        url: url
      })
    } else {
      this.setData({
        url: app.data.url
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function (res) {
    var title
    try {
      var url = res.webViewUrl
      title = url.split('&title=')[1].split('#')[0]
      title = decodeURIComponent(title)
    } catch (e) {
      title = '八分钟运动'
    }
    var url = '/page/tabBar/my-webview/my-webview?url=' + encodeURIComponent(res.webViewUrl)
    return {
      title: title,
      path: url
    }
  }
})