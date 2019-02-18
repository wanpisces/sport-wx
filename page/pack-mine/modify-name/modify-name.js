// page/pack-mine/modify-name/modify-name.js
var toolUtils = require('../../../utils/tool-utils.js')
var httpUtils = require('../../../utils/https-utils.js')
let that
var pages = []
var mInputValue = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    var title
    var t_key
    var tip = ''
    mInputValue = options.name || ''
    switch (options.id) {
      case 'name':
        title = '设置昵称'
        t_key = '姓名'
        break
      case 'height':
        title = '设置身高'
        t_key = '身高'
        tip = 'CM'
        mInputValue = parseInt(mInputValue)
        break
      case 'weight':
        title = '设置体重'
        t_key = '体重'
        tip = 'KG'
        mInputValue = parseInt(mInputValue)
        break

    }
    pages = getCurrentPages()
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          title: title,
          id: options.id,
          t_key: t_key,
          tip: tip,
          name: mInputValue,
          statusBarHeight: res.statusBarHeight,
          windowHeight: res.windowHeight
        })
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
   * 监听input输入
   */
  bindInputValue: function(e) {
  
    if (that.data.id != 'name') {
      mInputValue = e.detail.value
      try{
        var n = parseFloat(mInputValue)
        if (n <= 0) {
          return 1;
        }
      }catch(e){
        console.log(e)
      } 
    }else{
      if (e.detail.cursor > 12) {
        toolUtils.showToast("您输入的姓名已经超过12个字啦~")
        return mInputValue
      } else {
        mInputValue = e.detail.value
      }
    }
  },
  /**
   * 保存
   */
  onSave: function(e) {
    if (!mInputValue) {
      toolUtils.showToast("内容不能为空")
      return
    }
    switch (that.data.id) {
      case 'name':
        modify({
          user_nickname: mInputValue
        })
        break
      case 'height':
        modify({
          user_height: mInputValue
        })
        break
      case 'weight':
        modify({
          user_weight: mInputValue
        })
        break

    }
  }
})

function modify(args) {
  httpUtils.putUserInfo(args, function(res) {
    that.setData({
      user: res
    })
    toolUtils.setMyUserInfo(res)
    toolUtils.showToast("修改成功")
    try {
      pages[pages.length - 2].setData({
        user: res
      })
      pages[pages.length - 3].setData({
        user: res
      })
      setTimeout(function(e) {
        wx.navigateBack({
          delta: 1
        })
      }, 600)
    } catch (e) {

    }

  }, function(e) {
    toolUtils.showToast("修改失败")
  })
}