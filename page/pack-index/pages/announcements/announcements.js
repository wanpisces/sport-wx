// page/pack-index/pages/announcements/announcements.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js")
var mNoticeContent
var mGroupId
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
    let that = this
    mNoticeContent = ''
    mGroupId = options.group_id
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString()
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
  bindinput:function(e){
    mNoticeContent = e.detail.value
  },
  submit:function(e){
    announcement()
  }
})
/**
 * 发布公告
 */
function announcement(){
  if(!mNoticeContent){
    toolUtils.showToast("公告内容不能为空")
    return
  }
  var params = {
    'notice_content':mNoticeContent,
    'group_id':mGroupId
  }
  httpsUtils.announcement(params,function(res){
    var pages = getCurrentPages()
    pages[pages.length - 3].refreshData()
    wx.navigateBack({
      delta:2
    })
    toolUtils.showToast("发布成功")
  })
}