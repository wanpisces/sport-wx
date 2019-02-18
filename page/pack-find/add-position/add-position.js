var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
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
  onLoad: function(options) {
    that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          isLoading: false,
        })
      }
    })
    var pages = getCurrentPages();
    this.setData({
      userLocations: pages[pages.length - 2].data.userLocations || []
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.isPut) {
      this.setData({
        isPut: false
      })
      putUserLocation(this, this.data.userLocations.length - 1)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var pages = getCurrentPages();
    pages[pages.length - 2].setData({
      userLocations: this.data.userLocations || []
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  onAdd: function() {
    toolUtils.pageTo('/page/pack-find/position-search/position-search?tag=add_position')
  },
  onDelete: function(e) {
    var index = e.currentTarget.dataset.index,
      userLocations = this.data.userLocations,
      item = userLocations[index];
    userLocations.splice(index, 1)
    this.setData({
      userLocations: userLocations
    })
    putUserLocation(this, index, item)
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})
//常用位置管理
function putUserLocation(that, index, item) {
  httpsUtils.putUserLocation({
    'location_data': JSON.stringify(that.data.userLocations || [])
  }, function(res) {

  }, function(e) {
    toolUtils.showTosat(e.data.msg)
    var userLocations = that.data.userLocations;
    if (item) {
      userLocations.splice(index, 0, item)
    } else {
      userLocations.splice(index, 1)
    }
    that.setData({
      userLocations: userLocations
    })
  })
}