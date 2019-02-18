// page/pack-index/pages/evaluate/evaluate.js
var toolUtils = require('../../../../utils/tool-utils.js')
var httpsUtils = require('../../../../utils/https-utils.js')
var that
var mFeedContent
var mGroupId, mType, isLeader
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    imgs: [""]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    mFeedContent = ''
    mGroupId = options.group_id;
    mType = options.type
    isLeader = options.is_leader || 0
    if (isLeader == 1) {
      that.setData({
        array: [{ id: 1, name: "全部可见" }, { id: 3, name: "仅自己可见" }]
      })

    } else {
      that.setData({
        array: [{ id: 1, name: "全部可见" }, { id: 2, name: "队长可见" }, { id: 3, name: "仅自己可见" }]
      })

    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          isloading: false,
          mType: options.type
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
    var strLength = toolUtils.getStrLength(e.detail.value)
    if (strLength > 600) {
      toolUtils.showToast('中文长度不能超过300，英文600！')
      return mFeedContent
    } else {
      mFeedContent = e.detail.value
    }
  },
  onClicks: function (e) {
    var that = this;
    var images = that.data.imgs;
    switch (e.currentTarget.id) {
      case 'addImgs':
        var num = 9 - images.length + 1;
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
            console.log(images)
            // console.log(tempFilePaths)
            that.setData({
              imgs: images
            })
          }
        })
        break;
      case 'cancelImg':
        images.splice(e.currentTarget.dataset.index, 1)
        that.setData({
          imgs: images
        })
        break;
    }

  },
  //选择位置
  onAddress: function (e) {
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          lat: res.latitude,
          lng: res.longitude,
          address: res.address
        })
      }, fail: function (e) {
        that.setData({
          address: ''
        })
        if (e.errMsg != "chooseLocation:fail cancel") {
          wx.showModal({
            title: '温馨提示',
            content: '请授权获取地理位置，可以更精准的提供街道选择',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userLocation"] == true) {

                    } else {
                    }
                  }
                })
              } else if (res.cancel) {
              }
            }
          })
        }

      }
    }
    )
  },
  //谁可以看
  bindPickerChange: function (e) {
    var index = e.detail.value
    that.setData({
      whoLook: that.data.array[index].name,
      index: index,
      allow_visit_id: that.data.array[index].id
    })
  }

})
function evaluate() {
  if (!!mFeedContent || that.data.imgs.length > 1) {
    var params = {}
    if (mType == 1) {
      params.group_id = mGroupId
      params.feed_content = mFeedContent
      params.lat = that.data.lat
      params.lng = that.data.lng
      params.address = that.data.address
      params.allow_visit = parseInt(that.data.allow_visit_id),
        params.feed_type = 1
    } else if (mType == 2) {
      params.feed_content = mFeedContent
      params.lat = that.data.lat
      params.lng = that.data.lng
      params.address = that.data.address,
        params.feed_type = 2
    }
    that.setData({
      isloading: true
    })
    console.log(params)
    if (that.data.imgs.length <= 1) {
      httpsUtils.createFeed(params, function (res) {
        toolUtils.showToast("发布成功")

        setTimeout(function (e) {
          try {
            var pages = getCurrentPages();
            if (mType == 1) {
              pages[pages.length - 2].refreshData()
              wx.navigateBack({
                delta: 1
              })
            } else if (mType == 2) {
              pages[pages.length - 2].refreshData()
              wx.navigateBack({
                delta: 1
              })
            }
          } catch (e) {

          }
        }, 600)

      }, function (e) {
        toolUtils.showToast("发布失败")

      })
      return
    }
    httpsUtils.uploadImgs(that.data.imgs, function (res) {
      var img_arr = []
      for (var i = 0; i < res.length; i++) {
        img_arr.push(res[i].key)
      }
      params.feed_pic = img_arr
      httpsUtils.createFeed(params, function (res) {
        var pages = getCurrentPages()
        if (mType == 1) {
          pages[pages.length - 2].refreshData()
          wx.navigateBack({
            delta: 1
          })
        } else if (mType == 2) {
          pages[pages.length - 2].refreshData()
          wx.navigateBack({
            delta: 1
          })
        }
        toolUtils.showToast("发布成功")

      }, function (e) {
        toolUtils.showToast(e.data.msg)

      })
    })
    return;
  } else {
    toolUtils.showToast("请添加文字或照片")
  }
}