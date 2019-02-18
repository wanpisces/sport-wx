// page/pack-index/pages/comment/comment.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js")
var mContent
var that
var params
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentStr:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    mContent = ''
    params = JSON.parse(options.params)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          comment_user_name:options.comment_user_name||'',
          isloading: false
        })
      }
    })
    wx.getStorage({
      key: 'comment' + params.branch_type,
      success: function (res) {
        mContent = res.data
        that.setData({
          commentStr: mContent
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
 * 评论内容
 */
  bindinput: function (e) {
    mContent = e.detail.value
  },
  /**
   * 取消评论
   */
  cancel:function(e){
    if (mContent) {
      wx.showModal({
        title: '提示',
        content: '是否保存评论？',
        success: function (res) {
          if (res.confirm) {
            wx.setStorage({
              key: 'comment' + params.branch_type,
              data: mContent,
              complete: function (e) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else if (res.cancel) {
            wx.removeStorage({
              key: 'comment' + params.branch_type,
              complete: function (e) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
           
          }
        }
      })
      return
    }
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 发布评论
   */
  comment:function(e){
    putComment()
  }
})
//评论
function putComment() {
  if (!mContent) {
    toolUtils.showToast("评论内容不能为空")
    return
  }
  params.comment_content = mContent
  that.setData({
    isloading: true
  })
  httpsUtils.putComment(params, function (res) {
    wx.removeStorage({
      key: 'comment' + params.branch_type,
      complete: function (e) {
        var pages = getCurrentPages()
        pages[pages.length - 2].refreshData()
        if (pages.length>=3) {
          pages[pages.length - 3].setData({
            refresh: true
          })
        }
        toolUtils.showToast("评论成功")
  
        setTimeout(function (res) {
          wx.navigateBack({
            delta: 1
          })
        }, 500)
      }
    })
  }, function (e) {
    toolUtils.showToast("评论失败")

  })
}