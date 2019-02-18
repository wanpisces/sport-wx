// widget/authorize-view/authorize-view.js
/**\
 * 如果在同一个页面多次引入此控件，请在引入时加入：refresh="{{refreshAuthorizeView}}" user-phone="{{true}}" user-info="{{true}}"
 * 若果需要立即返回请配置：is-immediately-back="{{true}}"
 */
var toolUtils = require("../../utils/tool-utils.js")
var httpsUtils = require("../../utils/https-utils.js")
var isUserInfo = false
var isPhone = false
var isAuthorize = false
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否授权获取个人信息
    userInfo: {
      type: Boolean,
      value: false
    },
    //是否授权获取电话号码
    userPhone: {
      type: Boolean,
      value: false
    },
    //是否刷新同页面的其他的此组件
    refresh: {
      type: Number,
      value: 0
    },
    //bnt本来要处理的open-type
    bntType: {
      type: String,
      value: ''
    },
    //授权成功后是否立即回调
    isImmediatelyBack: {
      type: Boolean,
      value: false
    },
    //需要携带的数据
    itemView: {
      type: Object,
      value: {}
    },
    openType: {
      type: String,
      value: ''
    }
  },

  attached: function () {
    //获取初始化数据
    isUserInfo = false
    isPhone = false
    isAuthorize = false
    try {
      var value = wx.getStorageSync('userInfo')
      if (value) {
        isUserInfo = value.data.user_nickname && true || false
        isPhone = value.data.user_phone && true || false
      } else { }
    } catch (e) { }
    var openType = ""
    console.log(isUserInfo)
    //用户和电话都要授权
    if (this.data.userInfo && this.data.userPhone) {
      if (!isUserInfo) {
        openType = "getUserInfo"
      } else {
        if (!isPhone) {
          openType = "getPhoneNumber"
        } else {
          openType = this.data.bntType
          isAuthorize = true
        }
      }
      //只授权电话
    } else if (this.data.userPhone) {
      if (!isPhone) {
        openType = "getPhoneNumber"
      } else {
        openType = this.data.bntType
        isAuthorize = true
      }
      //只授权获取用户信息
    } else if (this.data.userInfo) {
      if (!isUserInfo) {
        openType = "getUserInfo"
      } else {
        openType = this.data.bntType
        isAuthorize = true
      }
    } else {
      openType = this.data.bntType
      isAuthorize = true
    }
    this.setData({
      openType: openType,
      isAuthorize: isAuthorize
    })
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //授权获取用户信息回调
    getUserInfo: function (e) {
      if (e.detail.errMsg == "getUserInfo:ok") {
        let that = this
        var userInfo = e.detail.userInfo
        var param = {}
        param.user_avatar = userInfo.avatarUrl
        param.user_nickname = userInfo.nickName
        param.user_gender = userInfo.gender
        param.user_city = userInfo.city
        param.user_province = userInfo.province
        param.user_country = userInfo.country
        httpsUtils.putUserInfo(param, function (res1) {
          if (that.data.userPhone) {
            if (!isPhone) {
              var pages = getCurrentPages()
              pages[pages.length - 1].setData({
                refreshAuthorizeView: 1,
                isUserInfo: true
              })
              that.setData({
                openType: "getPhoneNumber"
              })
            } else {
              isAuthorize = true
              that.setData({
                openType: that.data.bntType,
                isAuthorize: isAuthorize
              })
              var pages = getCurrentPages()
              pages[pages.length - 1].setData({
                refreshAuthorizeView: 1
              })

            }
            if (that.data.isImmediatelyBack) {
              var myEventDetail = {
                'typeStr': 'userInfo',
                'userInfo': res1
              }
              var myEventOption = {}
              that.triggerEvent('onBut', myEventDetail, myEventOption)
            }
          } else {
            isAuthorize = true
            that.setData({
              openType: that.data.bntType,
              isAuthorize: isAuthorize
            })
            var pages = getCurrentPages()
            pages[pages.length - 1].setData({
              refreshAuthorizeView: 1,
              isUserInfo: true
            })
            getApp().getRefreshToken(function (token) {
              if (that.data.isImmediatelyBack) {
                var myEventDetail = {
                  'typeStr': 'userInfo',
                  'userInfo': res1
                }
                var myEventOption = {}
                that.triggerEvent('onBut', myEventDetail, myEventOption)
              }
            })
          }
          getApp().getRefreshToken(function (token) {

          })
          toolUtils.showToast("授权获取个人信息成功")
        }, function (e) {
          toolUtils.showToast("授权获取个人信息成功")
        })
      }

    },
    //授权获取用户电话回调
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
        httpsUtils.updateTel(params, function (res) {
          isPhone = true
          isAuthorize = true
          that.setData({
            openType: that.data.bntType,
            isAuthorize: isAuthorize
          })
          var pages = getCurrentPages()
          pages[pages.length - 1].setData({
            refreshAuthorizeView: that.data.userInfo ? 3 : 2,
            isPhone: true
          })
          getApp().getRefreshToken(function (token) {
            if (that.data.isImmediatelyBack) {
              var myEventDetail = {
                'typeStr': 'phone'
              }
              var myEventOption = {}
              that.triggerEvent('onBut', myEventDetail, myEventOption)
            }
          })
        }, function (e) {
        })
      })
    },
    //响应其他事件
    butSubmit: function (e) {
      var myEventDetail = e.detail
      var myEventOption = {}
      toolUtils.setFormId(e.detail.formId)
      this.triggerEvent('onBut', myEventDetail, myEventOption)
    }
  }
})