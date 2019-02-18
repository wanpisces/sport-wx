// page/pack-find/against-record/against-record.js
var httpsUtils = require("../../../utils/https-utils.js");
var toolUtils = require("../../../utils/tool-utils.js")
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    formData:{
      soccer_movement_id:'',
      movement_cancel:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
    var formData = that.data.formData;
    formData.soccer_movement_id = options.soccer_movement_id;
    that.setData({
      formData: formData
    })
    that.getAttr(options.user_role);
    
  },
  radioChange: function (e) {
    var formData = that.data.formData;
    formData.movement_cancel = e.detail.value;
    that.setData({
      formData: formData
    })
  },
  formSubmit:function(e){
    var formData = that.data.formData;
    if (!formData.movement_cancel){
      wx.showToast({
        title: '请选择原因',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    httpsUtils.breakMovement(formData, function (res) {
      wx.showToast({
        title: '取消成功',
        icon: 'none',
        duration: 2000,
        success:function(){
          wx.redirectTo({
            url: '/page/pack-find/yue-sport/yue-sport?soccer_movement_id=' + formData.soccer_movement_id
          })
        }
      })
      
    })
  },
  getAttr: function (user_role){
    var attr_group_id = '';
    if (user_role == 1){
      attr_group_id = 5;
    } else if (user_role == 2){
      attr_group_id = 4;
    }
    httpsUtils.attr(attr_group_id, function (res) {
      that.setData({
        items: res[0]
      })
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