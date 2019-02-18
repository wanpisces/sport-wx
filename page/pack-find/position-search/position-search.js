var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
const mapUtils = require('../../../utils/map-utils.js')
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
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          isLoading: false,
          tag: options.tag || ''
        })
      }
    })
    wx.getStorage({
      key: 'search_street_history',
      success: function(res) {
        console.log(res)
        if (res.errMsg == "getStorage:ok") {
          that.setData({
            streetHistory: res.data
          })
        } else {}
      }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
  //选择列表
  onItem: function(e) {
    var item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index;
    this.setData({
      index1: index,
      ck_item: item
    })
  },
  //确认选择
  onSubmit: function() {
    if (this.data.index1 < 0) {
      toolUtils.showToast("请选择位置")
      return
    }
    var streetHistory = this.data.streetHistory,
      item = this.data.ck_item,
      app = getApp();
    if (streetHistory == null) {
      streetHistory = []
      streetHistory.unshift(item)
    } else {
      for (var i = 0; i < streetHistory.length; i++) {
        if ((streetHistory[i].title && (streetHistory[i].title == item.title)) || (streetHistory[i].group_name && (streetHistory[i].group_name == item.group_name))) {
          streetHistory.splice(i, 1);
          break;
        }
      }
      if (streetHistory.length > 9) {
        streetHistory.splice(9, 1);
      }
      streetHistory.unshift(item); // 再添加到第一个位置
    }
    wx.setStorage({
      key: 'search_street_history',
      data: streetHistory,
      success: function(res) {

      }
    })
    if ('add_position' == this.data.tag) {
      var pages = getCurrentPages(),
        topPage = pages[pages.length - 2],
        userLocations = topPage.data.userLocations || [],
        isPut = true;
      for (var i = 0; i < userLocations.length; i++) {
        if (userLocations[i].name == item.title && userLocations[i].address == item.address) {
          isPut = false
        }
      }
      if (isPut) {
        userLocations.push({
          "name": item.title, // 位置名称
          "address": item.address, // 详细位置
          "lat": item.location.lat, // 纬度
          "lng": item.location.lng, // 经度
        })
      }
      topPage.setData({
        userLocations: userLocations,
        isPut: isPut
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      app.data.locationInfo = {
        "name": item.title, // 位置名称
        "address": item.address, // 详细位置
        "lat": item.location.lat, // 纬度
        "lng": item.location.lng, // 经度
      }
      app.data.isLoadLocationInfo = true
      wx.switchTab({
        url: '/page/tabBar/about-movement/about-movement'
      })
    }

  },
  // 输入框监听
  bindinput: function(e) {
    var detail = e.detail
    this.setData({
      keyword: detail.value
    })
    if (!detail.value) {
      return
    }
    if (e.detail.value.length > 0) {
      this.setData({
        isCancelView: false
      })
    } else {
      this.setData({
        isCancelView: true
      })
    }
    this.setData({
      index1: -1,
      ck_item: null
    })
    getSearchSuggestion(detail.value, this)
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})
//搜索
function getSearchSuggestion(keyword, that) {
  var app = getApp();
  mapUtils.getSuggestion(keyword, app.data.ad_info && app.data.ad_info.city || '', function(res) {
    that.setData({
      list: res.data
    })
  })
}