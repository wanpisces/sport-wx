// page/pack-mine/mine-modify/mine-modify.js
var toolUtils = require('../../../utils/tool-utils.js')
var httpUtils = require('../../../utils/https-utils.js')
var that
var app = getApp();
var pages = []
var rpxTopx

function modify(args) {
  httpUtils.putUserInfo(args, function (res) {
    that.setData({
      user: res
    })
    toolUtils.setMyUserInfo(res)
    try {
      pages[pages.length - 2].setData({
        user: res
      })
    } catch (e) {

    }
    toolUtils.showToast("修改成功")
  }, function (e) {
    toolUtils.showToast("修改失败")
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {},
    objectArray: ['保密', '男', '女'],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    pages = getCurrentPages()
    wx.getSystemInfo({
      success: function (res) {
        rpxTopx = res.windowWidth / 750
        // var weightList = toolUtils.userWeight()
        // var heightList = toolUtils.userHeight()
        var userInfo = pages[pages.length - 2].data.user
        that.setData({
          statusBarHeight: res.statusBarHeight,
          windowHeight: res.windowHeight,
          user: userInfo,
          date: toolUtils.getNowFormatDate()
          // weightList: weightList,
          // heightList: heightList,
          // heightIndex: toolUtils.selectIndex(heightList, parseInt(userInfo.user_height)),
          // weightIndex: toolUtils.selectIndex(weightList, parseInt(userInfo.user_weight))
        })
      }
    })
    // if (options.avatar) {
    //   modify({ user_avatar: options.avatar })
    // }
    // getData();
    // if (options.name) {
    //   modify({ user_nickname: options.name })
    // }
  },
  // 头像上传
  handleUploadImg() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        // toolUtils.pageTo(`/page/pack-index/pages/upload/upload?redirect=1&width=${rpxTopx * 500}&height=${rpxTopx * 500}&src=${tempFilePaths[0]}`)
        httpUtils.uploadImgs(tempFilePaths, function (res) {
          let user_avatar = res[0].base_url + res[0].key
          console.log(user_avatar)
          modify({ user_avatar: user_avatar });
          var userInfo = wx.getStorageSync('userInfo');
          userInfo.data.user_avatar = res[0].base_url + res[0].key;
          wx.setStorageSync('userInfo', userInfo)
          console.log(res)
        }, function (e) {

        })
      }
    })
  },
  handleUpload(e) {
    let name = e.currentTarget.dataset.name
    let id = e.currentTarget.id

    toolUtils.pageTo(`/page/pack-mine/modify-name/modify-name?id=${id}&name=${name} `, 1)
  },
  // 点击日期组件确定事件  
  bindDateChange: function (e) {
    modify({ user_birth: e.detail.value })
  },
  bindPickerChange(e) {
    modify({ user_gender: e.detail.value })
  },
  // /**
  // * 修改身高
  // */
  // bindPickerChangeHeight(e) {
  //   var height = that.data.heightList[parseInt(e.detail.value)]
  //   var harr = height.split('C')
  //   that.setData({
  //     heightIndex: parseInt(e.detail.value)
  //   })
  //   modify({ user_height: harr[0] })
  // },
  // /**
  //  * 修改体重
  //  */
  // bindPickerChangeWeight(e) {
  //   var weight = that.data.weightList[parseInt(e.detail.value)]
  //   var warr = weight.split('K')
  //   that.setData({
  //     weightIndex: parseInt(e.detail.value)
  //   })
  //   modify({ user_weight: warr[0] })
  // },
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
   * 获取手机号
   */
  getPhoneNumber: function (e) {
    let that = this
    var iv = e.detail.iv
    var encryptedData = e.detail.encryptedData
    if (!iv && !encryptedData) {
      toolUtils.showToast("授权失败")
      return
    }
    getApp().getToken(function (token) {
      var params = {}
      params.token = token
      params.iv = iv
      params.encryptedData = encryptedData
      httpUtils.updateTel(params, function (res) {
        getApp().getRefreshUserInfo(function (userInfo) {
          that.setData({
            user: userInfo
          })
          toolUtils.setMyUserInfo(userInfores)
          try {
            pages[pages.length - 2].setData({
              user: userInfo
            })
          } catch (e) {

          }
          toolUtils.showToast("获取成功")
        })
      }, function (e) {

      })
    })
  }
})