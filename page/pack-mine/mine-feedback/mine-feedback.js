// page/pack-mine/mine-feedback/mine-feedback.js
// page/pack-index/pages/evaluate/evaluate.js
var toolUtils = require('../../../utils/tool-utils.js')
var httpsUtils = require('../../../utils/https-utils.js')
var that
var mFeedContent
var mGroupId
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: ["全部可见", "队长可见", "仅自己可见"],
    index: 0,
    imgs: [""]
  },
  //单选
  radioChange: function (e) {
    this.setData({
      select: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    mFeedContent = ''
    mGroupId = options.group_id;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          select: 1
        })
      }
    })
  },

  submit: function (e) {
    evaluate()
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
  bindinput: function (e) {
    mFeedContent = e.detail.value
  },
  onClicks: function (e) {
    var that = this;
    var images = that.data.imgs;
    switch (e.currentTarget.id) {
      case 'addImgs':
        var num = 9 - images.length + 1;
        console.log(num)
        wx.chooseImage({
          count: num, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths
            images.pop();
            Array.prototype.push.apply(images, tempFilePaths);
            var length = images.length
            if (length < 9) {
              images.push('')
            }
            that.setData({
              imgs: images
            })
          }
        })
        break;
      case 'cancelImg':
        images.splice(e.currentTarget.dataset.index, 1)
        if (images.length < 9 && images.indexOf('') < 0) {
          images.push('')
        }
        that.setData({
          imgs: images
        })
        break;
    }

  },
})

function evaluate() {
  if (!mFeedContent) {
    toolUtils.showToast("请输入反馈内容")
    return;
  }
  // if (that.data.imgs.length <= 1) {
  //   toolUtils.showToast("请添加照片")
  //   return;
  // }
  if (that.data.imgs.length <= 1) {
    var params = {}
    params.feedback_content = mFeedContent
    params.feedback_type = that.data.select
    httpsUtils.feedback(params, function (res) {
      toolUtils.showToast("反馈成功")
      setTimeout(function (res) {
        wx.navigateBack({
          delta: 1
        })
      }, 500)
    }, function (e) {
      toolUtils.showToast("反馈失败")
    })
  } else {
    var params = {}
    params.feedback_content = mFeedContent
    httpsUtils.uploadImgs(that.data.imgs, function (res) {
      var img_arr = []
      for (var i = 0; i < res.length; i++) {
        img_arr.push(res[i].key)
      }
      params.feedback_images = JSON.stringify(img_arr)
      httpsUtils.feedback(params, function (res) {
        toolUtils.showToast("反馈成功")
        setTimeout(function (res) {
          wx.navigateBack({
            delta: 1
          })
        }, 500)
      }, function (e) {
        toolUtils.showToast("反馈失败")
      })
    })
  }

}