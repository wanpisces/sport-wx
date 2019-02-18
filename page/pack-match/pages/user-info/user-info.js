var toolUtils = require('../../../../utils/tool-utils.js')
var httpUtils = require('../../../../utils/https-utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    genderList: [{
      sex: '男',
      value: '1',
      checked: true
    }, {
      sex: '女',
      value: '2',
      checked: false
    }],
    schoolList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          competition_id: options.competition_id,
          is_enlist: options.is_enlist
        })
      }
    })
    getApp().userInfo(function (userInfo) {
      if (userInfo) {
        that.initSex(userInfo.user_gender)
        that.setData({
          user_nickname: userInfo.user_nickname,
          user_gender: userInfo.user_gender,
          user_phone: userInfo.user_phone,
          ataver: userInfo.user_avatar || '/pic/header-ataver.png'
        })
      } else {
        that.getUserInfo()
      }
    })
    if (options.is_enlist == 1) { // is_enlist为1，已报名状态，为2为初次完善个人信息并报名
      that.getPersonInfo()
    }
    that.getMatchSchool()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

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

  },
  //选择学校
  bindSchoolChange: function (e) {
    var _index = e.detail.value;
    this.setData({
      education_id: this.data.schoolList[_index].education_id,
      education_name: this.data.schoolList[_index].education_name
    })
  },
  //获取个人报名信息
  getPersonInfo() {
    var that = this;
    httpUtils.competitionPersonal({}, function (res) {
      var userInfo = wx.getStorageSync('userInfo');
      userInfo.data.user_nickname = res.user_nickname;
      userInfo.data.user_avatar = res.user_avatar;
      userInfo.data.user_phone = res.user_phone;
      // wx.setStorageSync('userInfo', userInfo)
      wx.setStorage({
        key: 'userInfo',
        data: userInfo
      })
      that.initSex(res.user_gender)
      that.setData({
        user_nickname: res.user_nickname,
        user_avatar: res.user_avatar,
        user_phone: res.user_phone,
        user_gender: res.user_gender,
        education_name: res.education_name,
        education_id: res.education_id,
        college: res.college,
        major: res.major,
        student_id: res.student_id,
        isLoading: true
      })
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  //初始状态的性别
  initSex: function (sex) {
    this.data.genderList.forEach(msg => {
      msg.checked = msg.value == sex ? true : false
    })
    this.setData({
      genderList: this.data.genderList,
      user_gender: sex
    })
  },
  //点击修改头像
  editHeaderImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const tempFilePaths = res.tempFilePaths
        httpUtils.uploadImgs(tempFilePaths, function (res) {
          var user_avatar = res[0].base_url + res[0].key
          var userInfo = wx.getStorageSync('userInfo');
          userInfo.data.user_avatar = user_avatar;
          // wx.setStorageSync('userInfo', userInfo)
          wx.setStorage({
            key: 'userInfo',
            data: userInfo,
          })
          that.setData({
            ataver: user_avatar,
            ataver_key: res[0].key
          })
        }, function (e) {
          toolUtils.showToast(e.data.msg)
        })
      }
    })
  },
  // 获取用户信息
  getUserInfo: function () {
    var that = this;
    httpUtils.getUserInfo({}, function (res) {
      that.initSex(res.user_gender)
      that.setData({
        user_nickname: res.user_nickname,
        user_gender: res.user_gender,
        user_phone: res.user_phone,
        ataver: res.user_avatar || '/pic/header-ataver.png'
      })
    }, function (e) { })
  },
  // 获取用户填写信息
  getInfo: function (e) {
    var _title = e.currentTarget.dataset.title;
    var _value = e.detail.value
    this.setData({
      [_title]: _value
    })
  },
  // 改变单选框的选项(性别)
  radioChange: function (e) {
    var _value = e.detail.value;
    this.data.genderList.forEach(_data => {
      _data.checked = _data.value == _value ? true : false
    })
    this.setData({
      genderList: this.data.genderList,
      user_gender: _value
    })
  },
  // 提交用户信息
  submitUserInfo: function (e) {
    if (!this.data.user_nickname) {
      toolUtils.showToast('请输入姓名')
      return
    }
    if (!this.data.education_id) {
      toolUtils.showToast('请输入学校')
      return
    }
    if (!this.data.student_id) {
      toolUtils.showToast('请输入学号')
      return
    }
    if (!toolUtils.checkMobilePhone(this.data.user_phone)) {
      toolUtils.showToast('请输入正确的手机号码')
      return
    }
    var params = {
      user_nickname: this.data.user_nickname,
      user_gender: this.data.user_gender,
      education_id: this.data.education_id,
      college: this.data.college,
      student_id: this.data.student_id,
      major: this.data.major,
      user_phone: this.data.user_phone,
      user_avatar: this.data.ataver_key || '',
    }
    if (this.data.is_enlist == 2) {
      params.need_enlist = 1;
      params.competition_id = this.data.competition_id
    }
    httpUtils.competitionPersonalInfo(params, function (res) {
      toolUtils.showToast("报名成功");
      var pages = getCurrentPages();
      pages[pages.length - 2].refreshData(); //上一页
      setTimeout(function () {
        wx.navigateBack({
          delta: 1,
        })
      }, 500)
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  // 获取赛事学校
  getMatchSchool: function () {
    var that = this;
    httpUtils.competitonEducation({}, function (res) {
      that.setData({
        schoolList: res,
      })
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  }
})