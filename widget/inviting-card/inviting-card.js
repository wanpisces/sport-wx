// widget/inviting-card/inviting-card.js
var rpxTopx
var toolUtils = require("../../utils/tool-utils.js")
var httpsUtils = require("../../utils/https-utils.js")
var that
var mPageSize = 10//每页条数
var mTotalNum //总条数
var mCurrentPage = 1
var listBg
var index
var ctx
var isFirst
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rpxTopx: {
      type: Number,
      value: 0.5
    },
    groupId: {
      type: String,
      value: 0
    },
    avatarUrl: {
      type: String,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached: function () {
    that = this
    rpxTopx = this.data.rpxTopx
    isFirst = true
    mCurrentPage = 1
    ctx = wx.createCanvasContext('canvas_code', that)
    index = 0
    material()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    exit: function (e) {
      var myEventDetail = e.currentTarget
      var myEventOption = {}
      this.triggerEvent('exit', myEventDetail, myEventOption)
    },
    //保存图片到相册
    save: function (e) {
      var that2 = this
      // wx.saveImageToPhotosAlbum({
      //   filePath: that.data.shareImg,
      //   success(res) {
      //     wx.showToast({
      //       title: '保存成功',
      //       icon: 'success',
      //       duration: 1000
      //     })
      //     var myEventDetail = e.currentTarget
      //     var myEventOption = {}
      //     that2.triggerEvent('exit', myEventDetail, myEventOption)
      //   }
      // })
      wx.saveImageToPhotosAlbum({
        filePath: that.data.shareImg,
        success: function (res) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          })
          var myEventDetail = e.currentTarget
          var myEventOption = {}
          that2.triggerEvent('exit', myEventDetail, myEventOption)
        },
        fail: function (res) {
          console.log(res)
          if (res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
            console.log("打开设置窗口");
            wx.openSetting({
              success(settingdata) {
                console.log(settingdata)
                if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                  console.log("获取权限成功，再次点击图片保存到相册")
                } else {
                  console.log("获取权限失败")
                }
              }
            })
          }
        }
      })
    },
    //随机图片
    onRandom: function (e) {
      if (that.data.avatarUrl) {
        that.setData({
          avatarUrl: null
        })
      } else {
        ++index
      }
      if (index < 10 && index < listBg.length) {
        canvasBg(listBg[index].url, 2)
      } else {
        if (mTotalNum > mPageSize * mCurrentPage) {
          ++mCurrentPage
          index = 0
          material()
        } else {
          mCurrentPage = 1
          index = 0
          material()
        }
      }
    },
    uploadImg: function (res) {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          // that.setData({
          //   group_badge: tempFilePaths[0]
          // })

          toolUtils.pageTo(`/page/pack-index/pages/upload/upload?redirect=1&src=${tempFilePaths[0]}&id=${that.data.groupId}`)
        }
      })
    }
  }
})
/**
 * 获取素材
 */
function material() {
  var params = {
    'type': 2,
    'from': 1,
    'current_page': mCurrentPage,
    'page_size': mPageSize
  }
  httpsUtils.material(params, function (res) {
    mTotalNum = res.total_num
    var list = that.data.listData
    if (mCurrentPage == 1) {
      list = []
    }
    listBg = shuffle(res.list)
    if (that.data.avatarUrl) {
      canvasImage(listBg[index].url, 1)
    } else {
      canvasImage(listBg[index].url, 2)
    }
    list = list.concat(res.list)
    if (list.length == mTotalNum) {
      that.setData({
        listData: list
      })
    } else {
      that.setData({
        listData: list
      })
    }
  }, function (e) {
    if (mCurrentPage > 1) {
      --mCurrentPage
    }
  })
}
/**
 * 打乱数组
 */
function shuffle(array) {
  var tmp, current, top = array.length;
  if (top) while (--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  console.log(array)
  return array;
}
/**
 * 绘图
 */
function canvasImage(imgUrl, tag) {
  wx.showLoading({
    title: '渲染中....',
  })
  if (tag == 2) {
    wx.downloadFile({
      url: imgUrl + '?imageView2/1/w/280/h/265',
      success: function (sres2) {
        console.log(sres2)
        ctx.drawImage(sres2.tempFilePath, 0, 0, rpxTopx * 560, rpxTopx * 533)
        if (isFirst) {
          ctx.drawImage('/pic/xuanchuanbg.png', 0, rpxTopx * 533, rpxTopx * 560, rpxTopx * 263)
          ctx.setFillStyle("#000");
          ctx.setFontSize(16);
          var listTxt = toolUtils.canvasTxtHandle(app.data.group_name, 16, 2)
          var top = 583
          for (var i = 0, l = listTxt.length; i < l; i++) {
            ctx.fillText(listTxt[i] || '', 215 * rpxTopx, top * rpxTopx);
            top += 38
          }
          ctx.setFillStyle("#999999");
          ctx.setFontSize(10);
          var listTxt2 = toolUtils.canvasTxtHandle(app.data.user_nickname, 18, 2)
          for (var i = 0, l = listTxt.length; i < l; i++) {
            if (i == 0) {
              ctx.fillText(`我是${listTxt2[i]}` || '', 215 * rpxTopx, top * rpxTopx);
            } else {
              ctx.fillText(listTxt2[i] || '', 215 * rpxTopx, top * rpxTopx);
            }
            top += 30
          }
          ctx.fillText('邀请你一起来运动' || '', 215 * rpxTopx, (top + 4) * rpxTopx);
        }
        ctx.draw(!isFirst, function () {
          wx.canvasToTempFilePath({
            canvasId: 'canvas_code',
            success: function (res) {
              var tempFilePath = res.tempFilePath;
              that.setData({
                shareImg: tempFilePath
              })
              isFirst = false
              wx.hideLoading()
            }
            , fail: function (res) {
              console.log('ERROR');
              console.log(res);
              wx.hideLoading()
            }
          }, that);

        })
      }
    })
  } else {
    ctx.drawImage(that.data.avatarUrl, 0, 0, rpxTopx * 560, rpxTopx * 533)
    if (isFirst) {
      ctx.drawImage('/pic/xuanchuanbg.png', 0, rpxTopx * 533, rpxTopx * 560, rpxTopx * 263)
      ctx.setFillStyle("#000");
      ctx.setFontSize(16);
      ctx.fillText(app.data.group_name || '', 215 * rpxTopx, 583 * rpxTopx, 300 * rpxTopx);
      ctx.setFillStyle("#999999");
      ctx.setFontSize(10);
      ctx.fillText(`我是${app.data.user_nickname}` || '', 215 * rpxTopx, 623 * rpxTopx, 300 * rpxTopx);
      ctx.fillText('邀请你一起来运动' || '', 215 * rpxTopx, 663 * rpxTopx);
    }
    ctx.draw(!isFirst, function () {
      wx.hideLoading()
      wx.canvasToTempFilePath({
        canvasId: 'canvas_code',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            shareImg: tempFilePath
          })
          isFirst = false
        }
        , fail: function (res) {
          console.log('ERROR');
          console.log(res);
        }
      }, that);
    })
  }


}
/**
 * 绘制背景
 */
function canvasBg(imgUrl, tag) {
  wx.showLoading({
    title: '渲染中....',
  })
  if (tag == 2) {
    wx.downloadFile({
      url: imgUrl + '?imageView2/1/w/280/h/265',
      success: function (sres2) {
        console.log(sres2)
        ctx.drawImage(sres2.tempFilePath, 0, 0, rpxTopx * 560, rpxTopx * 533)
        ctx.draw(true, function () {
          wx.hideLoading()
          wx.canvasToTempFilePath({
            canvasId: 'canvas_code',
            success: function (res) {
              var tempFilePath = res.tempFilePath;
              that.setData({
                shareImg: tempFilePath
              })
            }
            , fail: function (res) {
              console.log('ERROR');
              console.log(res);
            }
          }, that);
        })
      }
    })
  } else {
    ctx.drawImage(that.data.avatarUrl, 0, 0, rpxTopx * 560, rpxTopx * 533)
    ctx.draw(true, function () {
      wx.hideLoading()
      wx.canvasToTempFilePath({
        canvasId: 'canvas_code',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            shareImg: tempFilePath
          })
        }
        , fail: function (res) {
          console.log('ERROR');
          console.log(res);
        }
      }, that);
    })
  }
}
