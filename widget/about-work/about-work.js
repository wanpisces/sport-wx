// widget/found-team/found-team.js
var toolUtils = require("../../utils/tool-utils.js")
var httpsUtils = require('../../utils/https-utils.js')
var attrObj
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    attrList: []
  },
  attached: function () {
    var that = this
    attrObj = ''
    getApp().userInfo(function (userInfo) {
      that.setData({
        isUserInfo: userInfo.user_avatar && userInfo.user_nickname && true || false,
        isPhone: userInfo.user_phone && true || false
      })
    })
    wx.getStorage({
      key: 'attrList',
      success: function (res) {
        attrObj = JSON.parse(JSON.stringify(res.data));
        var attrList = [
          [],
          []
        ]
        attrList[0] = attrObj['0']
        attrList[1] = attrObj[attrList[0].id] || []
        that.setData({
          attrList: attrList
        })
      },
      fail: function (e) {
        getAttrList(that, "")
      }
    })

  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取分类数据
     */
    onGetAttr: function (e) {
      getAttrList(this, "加载中...")
    },
    bindMultiPickerChange: function (e) {
      var value = e.detail.value
      // var list = this.data.attrList[1]
      var attr_id = this.data.attrList[0][value || 0].id
      // if (list.length == 0) {
      //   attr_id = this.data.attrList[0][value[0] || 0].id
      // } else {
      //   attr_id = this.data.attrList[1][value[1] || 0].id
      // }
      toolUtils.pageTo("/page/pack-find/yue-release/yue-release?attr_id=" + attr_id, 1)
    },
    //pick-view选择器某一列的值改变时触发 
    bindMultiPickerColumnChange: function (e) {
      var value = e.detail.value
      var column = e.detail.column
      if (column == 0) {
        this.setData({
          ['attrList[' + 1 + ']']: attrObj[this.data.attrList[0][value].id] || []
        })
      }
    },
  }
})
/**
 * 获取队伍分类
 */
function getAttrList(that, msg) {
  httpsUtils.attr(6, function (res) {
    attrObj = JSON.parse(JSON.stringify(res));
    var attrList = [
      [],
      []
    ]
    attrList[0] = res['0']
    attrList[1] = res[attrList[0].id] || []
    that.setData({
      attrList: attrList
    })
    try {
      wx.setStorage({
        key: 'attrList',
        data: attrObj,
      })
    } catch (e) {

    }
  }, function (e) {

  }, msg)
}