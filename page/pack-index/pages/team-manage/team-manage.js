// page/pack-index/pages/team-manage/team-manage.js
var toolUtils = require("../../../../utils/tool-utils.js")
var mGroupId
var app = getApp()
var that
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
    console.log(options)
    mGroupId = options.group_id
    app.data.group_name = options.group_name
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          isCurrency: options.currency && true || false,
          group_name: options.group_name,
          has_message: options.has_message || 2,
          group_id: options.group_id,
          group_sn: options.group_sn,
          attr_id: options.attr_id
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
   * botton点击事件
   */
  onClick: function (e) {
    toolUtils.setFormId(e.detail.formId)
    switch (e.detail.target.id) {
      case 'bjdw'://编辑队伍详情
        if (this.data.isCurrency) {
          toolUtils.pageTo('/page/pack-index/pages/currency-organize-team/organize-team?isEdit=1&group_id=' + mGroupId)
        } else {
          toolUtils.pageTo('/page/pack-index/pages/organize-team/organize-team?isEdit=1&group_id=' + mGroupId)
        }
        break
      case 'cygl'://成员管理
        toolUtils.pageTo(`/page/pack-index/pages/member-manage/member-manage?attr_id=${that.data.attr_id}&group_id=${mGroupId}&has_message=${that.data.has_message}`)
        break
      case 'wlxc'://物料宣传
        app.userInfo(function (userInfo) {
          app.data.user_nickname = userInfo.user_nickname
          toolUtils.pageTo('/page/pack-index/pages/wl-drumbeating/wl-drumbeating?id=' + mGroupId)
        })
        break
      case 'fbgg'://发布公告
        toolUtils.pageTo('/page/pack-index/pages/announcements/announcements?group_id=' + mGroupId)
        break
      case 'fbyd'://发布约动
        toolUtils.pageTo('/page/pack-find/yue-release/yue-release?group_id=' + mGroupId)
        break
    }
  }
})