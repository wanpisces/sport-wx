// page/pack-index/pages/invite-friends/invite-friends.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js")
var that, info, ctx, rpxTopx, attr_value;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareImg: '',
    text: '邀请你参加一个很棒的队伍'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    try {
      info = wx.getStorageSync('userInfo')
      if (info) {
        that.setData({
          user_nickname: info.data.user_nickname
        })
      } else {
        toolUtils.showToast("获取用户信息失败")
      }
    } catch (e) {
      toolUtils.showToast("获取用户信息失败")
    }
    ctx = wx.createCanvasContext('canvasimg', that);
    wx.getSystemInfo({
      success: function (res) {
        rpxTopx = res.windowWidth / 750
        var h
        if (res.platform == 'android') {
          h = res.windowHeight - 45
        } else {
          h = res.windowHeight - 45 - res.statusBarHeight
        }
        var g = JSON.parse(options.group)
        attr_value = g.attr_value || '-'
        that.setData({
          statusBarHeight: res.statusBarHeight,
          height: h,
          group: JSON.parse(options.group),
          text: `邀请你参加一个很棒的${attr_value}队伍`
        })
        // that.createNewImg();
        ctx.drawImage('/img/teamShare.jpg', 0, 0, 560 * rpxTopx, 790 * rpxTopx);
        ctx.textAlign = "center";
        ctx.setFillStyle("#000000");
        ctx.setFontSize(14);
        var listStr = toolUtils.canvasTxtHandle(info.data.user_nickname || '', 18, 2)
        var top = 210
        for (var i = 0, l = listStr.length; i < l; i++) {
          ctx.fillText(listStr[i] || '', 280 * rpxTopx, top * rpxTopx);
          top += 38
        }
        ctx.setFillStyle("#999999");
        ctx.setFontSize(10);
        ctx.fillText(that.data.text, 280 * rpxTopx, (top + 4) * rpxTopx);
        ctx.setFillStyle("#000000");
        ctx.setFontSize(14);
        var listStr2 = toolUtils.canvasTxtHandle(that.data.group.group_name || '', 20, 2)
        var top2 = 400
        for (var i = 0, l = listStr.length; i < l; i++) {
          ctx.fillText(listStr2[i] || '', 280 * rpxTopx, top2 * rpxTopx);
          top2 += 42
        }
        ctx.draw();
        //绘制用户头像
        wx.downloadFile({
          url: info.data.user_avatar + '?imageView2/1/w/60/h/60',
          success: function (sres) {
            toolUtils.circleImg(ctx, sres.tempFilePath, 230 * rpxTopx, 80 * rpxTopx, 50 * rpxTopx)
            // ctx.drawImage(sres.tempFilePath, 230 * rpxTopx, 80 * rpxTopx, 100 * rpxTopx, 100 * rpxTopx);
            ctx.draw(true, function () {
              console.log(2222)
              wx.canvasToTempFilePath({
                canvasId: 'canvasimg',
                success: function (res) {
                  var tempFilePath = res.tempFilePath;
                  that.setData({
                    shareImg: tempFilePath
                  })
                  // wx.previewImage({
                  //   current: tempFilePath,
                  //   urls: [tempFilePath]
                  // })
                },
                fail: function (res) {
                  console.log('ERROR');
                  console.log(res);
                }
              });
            });
          }
        })
        //绘制二维码
        createGroupQr()
      }
    })
  },
  savePhoto: function () {
    // wx.saveImageToPhotosAlbum({
    //   filePath: that.data.shareImg,
    //   success(res) {
    //     wx.showToast({
    //       title: '保存成功',
    //       icon: 'success',
    //       duration: 1000
    //     })
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
  createNewImg: function (codeImg) {
    if (codeImg) {
      wx.downloadFile({
        url: codeImg,
        success: function (sres2) {
          ctx.drawImage(sres2.tempFilePath, 130 * rpxTopx, 530 * rpxTopx, 120 * rpxTopx, 120 * rpxTopx);
          ctx.draw(true, function () {
            wx.hideLoading()
            wx.canvasToTempFilePath({
              canvasId: 'canvasimg',
              success: function (res) {
                var tempFilePath = res.tempFilePath;
                that.setData({
                  shareImg: tempFilePath
                })
                // wx.previewImage({
                //   current: tempFilePath,
                //   urls: [tempFilePath]
                // })
              },
              fail: function (res) {
                console.log('ERROR');
                console.log(res);
              }
            });
          });

        },
        fail: function (fres) {
          wx.hideLoading()
        }
      })

    }

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
    // if (that.data.group.attr_id == 2) {
    //   url = '/page/pack-index/pages/team-page/team-page?share=1&group_id=' + that.data.group.group_id
    // } else {
    //   url = '/page/pack-index/pages/currency-team-page/team-page?share=1&group_id=' + that.data.group.group_id
    // }
    var url = '/page/pack-index/pages/team-page/team-page?share=1&group_id=' + that.data.group.group_id
    return {
      title: `${that.data.user_nickname}邀请你参加一个很棒的${attr_value}队伍`,
      path: url,
      imageUrl: that.data.shareImg,
      success: (res) => {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})
//生成队伍二维码
function createGroupQr() {
  var params = {
    'group_id': that.data.group.group_id
  }
  httpsUtils.createGroupQr(params, function (res) {
    console.log(res)
    var codeImg = res.base_url + res.key
    wx.showLoading({
      title: '渲染处理中....',
    })
    that.createNewImg(codeImg)
  }, function (e) {

  })
}