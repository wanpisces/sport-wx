//app.js
var that
const httpsUtils = require('/utils/https-utils.js');
App({
  data: {
    user_nickname: '',
    group_name: '',
    token: '',
    bgUrl1: 'https://img.sqydt.darongshutech.com/image_201805291247163866.png',
    bgUrl2: 'https://img.sqydt.darongshutech.com/image_201805291247163866.png'
  },
  onLaunch: function (options) {
    this.data.sceneCode = options.scene || -1 //进入场景值
    try {
      // wx.removeStorageSync('userInfo')
    } catch (e) {

    }
  },
  onShow: function () {
    that = this
  },

  //获取用户信息
  userInfo: function (_res) {
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        that.data.token = res.data.token
        _res(res.data.data)
      },
      fail: function (e) {
        myLogin(function (res) {
          _res(res.data)
        })
      }
    })
  },
  //获取token
  getToken: function (_success) {
    wx.checkSession({
      success: function (res) {
        if (that.data.token || '') {
          _success(that.data.token)
        } else {
          wx.getStorage({
            key: 'userInfo',
            success: function (res) {
              that.data.token = res.data.token
              _success(res.data.token)
            },
            fail: function (e) {
              myLogin(function (res) {
                _success(res.token)
              })
            }
          })
        }
      },
      fail: function (res) {
        myLogin(function (res) {
          _success(res.token)
        })
      }
    })

  },
  //刷新token
  getRefreshToken: function (_success) {
    myLogin(function (res) {
      _success(res.token)
    })
  },
  //刷新用户信息
  getRefreshUserInfo: function (_success) {
    myLogin(function (res) {
      _success(res.data)
    })
  },
  //获取区域数据
  getAreaData: function (_success) {
    wx.getStorage({
      key: 'areaInfo',
      complete: function (e) {
        if (e.data) {
          _success(e.data)
        } else {
          httpsUtils.areaAll(function (res) {
            _success(res)
            wx.setStorage({
              key: "areaInfo",
              data: res,
              success: function (res) {
                wx.setStorage({
                  key: "isAreaInfo",
                  data: true,
                  success: function (res) {

                  }
                })
              }
            })
          }, function (e) {

          })
        }
      }
    })
  }
})
//登录
function myLogin(_success) {
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      // console.log(res)
      // return
      var params = {};
      params.code = res.code;
      params.scene_code = that.data.sceneCode;
      httpsUtils.loginByCode(params, function (res) {
        that.data.token = res.token
        that.data.isUserInfo = res.data.user_avatar && res.data.user_nickname && true || false
        that.data.isPhone = res.data.user_phone && true || false
        typeof (_success) == 'function' && _success(res)
        wx.setStorage({
          key: "userInfo",
          data: res
        })
      }, function (e) {
        console.log('获取token失败')
      })
    },
    fail: e => {
      console.log('获取code失败')
    }
  })
}
//获取区域数据
function getArea() {
  wx.getStorage({
    key: 'isAreaInfo',
    complete: function (e) {
      if (!e.data) {
        httpsUtils.areaAll(function (res) {
          wx.setStorage({
            key: "areaInfo",
            data: res,
            success: function (res) {
              wx.setStorage({
                key: "isAreaInfo",
                data: true,
                success: function (res) {

                }
              })
            }
          })

        }, function (e) { })
      }
    }
  })
}