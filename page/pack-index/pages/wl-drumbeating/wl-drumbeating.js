// page/pack-index/pages/wl-drumbeating/wl-drumbeating.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOrCode: false,
    isInvitingCard: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          rpxTopx: res.windowWidth / 750,
          groupId: options.id,
          avatarUrl: options.avatar || null,
          isInvitingCard: options.avatar && true || false
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
  onShow: function () { },

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
  //获取二维码
  getCode: function (e) {
    this.setData({
      codeImg: e.detail,
      shareType: 'share'
    })
  },
  //发送给微信好友
  onShareAppMessage: function (res) {
    var url = '/page/pack-index/pages/team-page/team-page?share=1&group_id=' + this.data.groupId
    var pages = getCurrentPages();
    var Page = pages[pages.length - 2];//当前页
    var group_name = Page.data.group_name;
    if (res.from == 'button') {
      return {
        title: group_name,
        imageUrl: this.data.codeImg,
        path: url,
      }
    }
  },

  /**
   * 生成队伍二维码
   */
  onOrCode: function (e) {
    this.setData({
      isOrCode: true
    })
  },
  //关闭生成二维码的页面
  orExit: function (e) {
    this.setData({
      isOrCode: false
    })
  },
  /**
   * 生成制作邀请卡页面
   */
  onInvitingCard: function (e) {
    this.setData({
      isInvitingCard: true
    })
  },
  //关闭制作邀请卡页面
  cardExit: function (e) {
    this.setData({
      isInvitingCard: false
    })
  }
})