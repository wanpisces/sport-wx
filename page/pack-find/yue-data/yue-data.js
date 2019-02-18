// page/pack-find/yue-data/yue-data.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
var mMemberUserId = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLine: "1",
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    that = this
    var pages = getCurrentPages();
    if (getCurrentPages().length > 1) {
      var dataNum = pages[pages.length - 2].data;
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          // date: new Date().toLocaleDateString(),
          isLoading: true,
          soccer_movement_id: options.soccer_movement_id || dataNum.soccer_movement_id,
          bgh: (res.statusBarHeight + 45) * 750 / res.windowWidth + 200,
          isShare: options.share && true || false,
          group_id: options.group_id || dataNum.group_id
        })
        getApp().userInfo(function (userInfo) {
          // 数据获取
          getData(options.soccer_movement_id, '加载中...')
          userInfo = userInfo
          that.setData({
            'but_type': 'share',
            'refreshAuthorizeView': 3,
            'isOneself': !mMemberUserId && true || mMemberUserId == userInfo.user_id
          })
        })
      }

    })
  },
  tabClick(e) {
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        showLine: "1"
      })
    } else {
      this.setData({
        showLine: "2"
      })
    }
  },
  // 刷新
  freshData: function () {
    getData(this.data.soccer_movement_id, '加载中...')
  },

  /**
   * 返回首页
   */
  goHome: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },
  // 编辑
  editEvt: function () {
    wx.navigateTo({
      url: `/page/pack-find/yue-score/yue-score?soccer_movement_id=${that.data.soccer_movement_id}&group_id=${that.data.group_id}&attr_id=${that.data.dataList.attr_id}`,
    })
    // toolUtils.pageTo(`/page/pack-find/yue-score/yue-score?soccer_movement_id=${that.data.soccer_movement_id}&group_id=${that.data.group_id}&attr_id=${that.data.dataList.attr_id}`, 1)
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
  onShareAppMessage: function (res) {
    var url
    var soccer_movement_id = this.data.soccer_movement_id;
    var group_id = this.data.group_id
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    if (this.data.dataList.attr_id == 2) {
      url = "https://img.sport.darongshutech.com/image_201810251736568193.png"
    } else if (this.data.dataList.attr_id == 3) {
      url = "https://img.sport.darongshutech.com/image_201810251735466355.png"
    } else {
      url = "https://img.sport.darongshutech.com/image_201810251737248924.png"
    }
    return {
      title: '约战',
      path: '/page/pack-find/yue-data/yue-data?isShare=1&soccer_movement_id=' + soccer_movement_id + '&group_id=' + group_id
    }
  }

})
//  约动 数据详情
function getData(id, msg) {
  httpsUtils.movementDetail(id, {}, function (res) {
    that.setData({
      dataList: res
    })
  }, function (e) {

  }, msg)
}