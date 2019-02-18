// widget/or-code/or-code.js
var toolUtils = require("../../utils/tool-utils.js")
var httpsUtils = require("../../utils/https-utils.js")
var that
var rpxTopx
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
    shareTpye: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    share: true
  },
  attached: function () {
    that = this
    rpxTopx = this.data.rpxTopx
    createGroupQr()
    // ctx.draw(false, function () {
    //   createGroupQr()
    // })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    exit: function (e) {
      var that2 = this
      var myEventDetail = e.currentTarget
      var myEventOption = {}
      that2.triggerEvent('exit', myEventDetail, myEventOption)
    },
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

    getCodeEvt: function () {
      this.triggerEvent('onCode', this.data.shareImg)
    }
  }
})
//生成队伍二维码
function createGroupQr() {
  var params = { 'group_id': that.data.groupId }
  httpsUtils.createGroupQr(params, function (res) {
    var codeImg = res.base_url + res.key
    wx.showLoading({
      title: '渲染中....',
    })
    wx.downloadFile({
      url: codeImg,
      success: function (sres2) {
        var ctx = wx.createCanvasContext('canvas-or', that)
        ctx.setFillStyle("#000");
        ctx.setFontSize(16);
        ctx.setTextAlign('center');
        ctx.setLineWidth()
        ctx.fillText('扫码直达队伍主页' || '', 300 * rpxTopx, 90 * rpxTopx);
        ctx.drawImage(sres2.tempFilePath, 180 * rpxTopx, 180 * rpxTopx, rpxTopx * 250, rpxTopx * 250)
        ctx.draw(false, function () {
          wx.canvasToTempFilePath({
            canvasId: 'canvas-or',
            success: function (res) {
              var tempFilePath = res.tempFilePath;
              that.setData({
                shareImg: tempFilePath
              })
              // wx.previewImage({
              //   current: tempFilePath,
              //   urls: [tempFilePath]
              // })

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
  }, function (e) {

  })
}