// page/tabBar/mine/mine.js
var toolUtils = require('../../../utils/tool-utils.js')
var httpUtils = require('../../../utils/https-utils.js')
var that
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: [],
    follow: '',
    collect: '',
    bgUrl2: 'https://img.sport.darongshutech.com/zu.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          bgh: (res.statusBarHeight + 45) * 750 / res.windowWidth + 260,
          windowHeight: res.windowHeight
        })
      }
    })
    app.userInfo(function (userInfo) {
      that.setData({
        user: userInfo,
      })
    })
  },
  //更换个人中心背景
  onBg: function (e) {
    wx.showActionSheet({
      itemList: ['更换背景'],
      success: function (res) {
        if (res.tapIndex == 0) {
          toolUtils.pageTo("/page/pack-mine/mine-bg/mine-bg")
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //点击需要获取个人信息的栏目处理
  onItemClick: toolUtils.throttle(function (e) {
    var audit_status = this.data.user.audit_status;
    switch (e.currentTarget.id) {
      case "message": //我的消息
        toolUtils.pageTo('/page/pack-mine/mine-message/mine-message', 1)
        break
      case "team": //我的队伍
        // toolUtils.pageTo('/page/pack-mine/mine-create/mine-create', 1)
        toolUtils.pageTo('/page/pack-mine/mine-team/mine-team', 1)
        break
      case "setting": //我的足迹
        toolUtils.pageTo('/page/pack-mine/mine-settings/mine-settings', 1)
        break
      case "feedback": //意见反馈
        toolUtils.pageTo('/page/pack-mine/mine-feedback/mine-feedback', 1)
        break
      case "mine":
        toolUtils.pageTo('/page/pack-mine/mine-modify/mine-modify', 1)
        break
      // case "myAdd": //我加入的队伍
      //   toolUtils.pageTo('/page/pack-mine/mine-add/mine-add', 1)
      //   break
      case "myDt": //我的动态
        toolUtils.pageTo('/page/pack-mine/mine-dynamic/mine-dynamic', 1)
        break
      case "myYd": //我的约动
        toolUtils.pageTo('/page/pack-mine/mine-yue/mine-yue', 1)
        break
      case "myReally": //实名认证
        toolUtils.pageTo('/page/pack-mine/mine-really/mine-really?audit_status=' + audit_status, 1)
        break
      case "myCollect": //收藏
        toolUtils.pageTo('/page/pack-mine/mine-collection/mine-collection', 1)
        break
      case "myFocus": //关注
        toolUtils.pageTo('/page/pack-mine/mine-follow/mine-follow', 1)
        break
      // case "myReally": //实名认证
      //   toolUtils.pageTo('/page/pack-mine/mine-really/mine-really?audit_status=' + audit_status, 1)
      //   break
      case 'getMine':
        // that.setData({
        //   user: e.detail.userInfo
        // })
        break
      case 'onReset':

        break
    }
    // if (e.detail.userInfo) {
    //   that.setData({
    //     user_avatar: e.detail.userInfo.user_avatar || '/pic/default_logo.png',
    //     user: e.detail.userInfo
    //   })
    // }
  }, 1000),

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onReset: function (e) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getData()
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
    if (res.from === 'button') {
      // 来自页面内转发按钮

    }
    return {
      title: "八分钟运动",
      imageUrl: '/pic/comment-share-img.jpg',
      path: '/page/tabBar/about-movement/about-movement'
    }
  },
})
/**
 * 获取个人信息
 */
function getData() {
  httpUtils.getUserInfo({}, function (res) {
    that.setData({
      user_code: res.user_code,
      user_background: res.user_background,
      user_id: res.user_id,
      follow: res.user_follow_num,
      collect: res.user_favorites_num,
      has_message: res.has_message,
      message_count: res.message_count,
      user_avatar: res.user_avatar || '/pic/default_logo.png',
      user: res
    })
    toolUtils.setMyUserInfo(res)
  }, function (e) { })
}