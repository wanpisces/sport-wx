// widget/comment-view/comment-view.js
var toolUtils = require("../../utils/tool-utils.js")
var httpsUtils = require('../../utils/https-utils.js')
var mContent
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isHidden: {
      type: Boolean,
      value: true
    },
    isShow: {
      type: Boolean,
      value: true
    },
    //评论参数
    params: {
      type: String,
      value: "{}"
    },
    placeholder: {
      type: String,
      value: "期待你的神评论"
    },
    //是否刷新同页面的其他的此组件
    refresh: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    confirmhold: false,
    mContent : '',
    cursorspacing: 10
  },

  /**
   * 组件的方法列表
   */
  methods: {
    exit: function(e) {
      console.log(3)
      mContent = ''
      this.setData({
        isShow: true,
      })
      var myEventDetail = {}
      var myEventOption = {}
      this.triggerEvent('onCommentBut', myEventDetail, myEventOption)
    },
    send: function(e) {
      putComment(this)
    },
    bindinput: function(e) {
      var strLength = toolUtils.getStrLength(e.detail.value)
      if (strLength > 400) {
        toolUtils.showToast('中文长度不能超过200，英文400！')
        return mContent
      } else {
        mContent = e.detail.value
      }
    }
  }
})
//评论
function putComment(that) {
  if (!mContent) {
    toolUtils.showToast("评论内容不能为空")
    return
  }
  var params = JSON.parse(that.data.params)
  params.comment_content = mContent
  httpsUtils.putComment(params, function(res) {

    var pages = getCurrentPages()
    pages[pages.length - 1].refreshData()
    toolUtils.showToast("评论成功")
    mContent = ''
    that.setData({
      isShow: true
    })
    var myEventDetail = {}
    var myEventOption = {}
    that.triggerEvent('onCommentBut', myEventDetail, myEventOption)
  }, function(e) {
    toolUtils.showToast("评论失败")
    mContent = ''
    that.setData({
      isShow: true
    })
    var myEventDetail = {}
    var myEventOption = {}
    that.triggerEvent('onCommentBut', myEventDetail, myEventOption)
  })
}