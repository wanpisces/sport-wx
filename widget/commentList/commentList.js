// page/widget/commentList/commentList.js\
var toolutils = require('../../utils/tool-utils.js')
var httpUtils = require('../../utils/https-utils.js')
var app = getApp()
console.log(app)
var that
var fpage
var top2Page
var comment
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentList: {
      type: Array,
      value: []
    },
    branchId: {
      type: String,
      value: '0'
    },
    isCollect: {
      type: Number,
      value: 0
    },
    userPhone: {
      type: String,
      value: null
    },
    // tag: {
    //   type: Number,//0表示资讯，2表示服务随手拍，没有收藏和分享
    //   value: ''
    // },
    refresh: {
      type: Number,
      value: 0
    },
    commentNum: {
      type: Number,
      value: 0
    },
    params: {
      type: Object,
      value: {}
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    focus: false,
    isHuifu: false
    // commentList: [{ isZan: true }, { isZan: false }, { isZan: true }],
  },
  attached: function () {
    that = this
    // httpUtils.selectAuthorze("scope.userInfo", function (isAuthorze) {
    //   that.setData({
    //     isAuthorzeUserInfo: isAuthorze
    //   })
    // })
    fpage = getCurrentPages()[getCurrentPages().length - 1]
    top2Page = getCurrentPages()[getCurrentPages().length - 2]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //更多回复
    formSubmit: toolutils.throttle(function (e) {
      var index = e.detail.target.dataset.index
      // toolutils.pageTo('/page/pack-index/pages/reply-more/reply-more?index=' + index + '&tag=' + that.data.tag)
    }),
    zan: function (e) {
      var index = e.currentTarget.dataset.index
      putStar(index)
    },
    //回复
    huifu: function (e) {
      //如果输入框已经获取焦点就中断执行
      if (that.data.isHuifu) {
        that.setData({
          isHuifu: false,
        })
        return
      }
      var item = e.detail.target.dataset.item
      // if (item.user_id == app.data.userID) {
      //   toolutils.showToast("自己不能回复自己")
      //   return
      // }

      that.setData({
        isFocus: true,
        pCommentId: item.comment_id,
        pCommentUserId: item.user_id,
        isHuifu: true,
        userName: '',
        isAt: 2
      })


    },
    //输入框获得焦点
    bindfocus: function (e) {
      this.setData({
        isFocus: true
      })
    },
    //输入框失去焦点
    bindblur: function (e) {
      this.setData({
        isFocus: false,
        userName: '',
        inputValue: ''
      })
    },
    bindinput: function (e) {
      // console.log(e)
      comment = e.detail.value
    },
    //输入完成
    bindconfirm: function (e) {


    },
    //收藏
    collect: function (e) {

    },
    bntCollect: function (e) {
      putFavorite()
    },
    butSubmit2: function (e) {
      console.log(e)
      if (!!comment) {
        if (that.data.isHuifu) {
          putHuifu(comment)
        } else {
          putComment(comment)
        }
      } else {
        toolutils.showToast("内容不能为空")
      }
      comment = ''
    },
    //二次回复
    onItem: function (e) {
      //如果输入框已经获取焦点就中断执行
      if (that.data.isHuifu) {
        return
      }
      var item = e.currentTarget.dataset.item
      var pitem = e.currentTarget.dataset.pitem

      // if (item.user_id == app.data.userID) {
      //   toolutils.showToast("自己不能回复自己")
      //   return
      // }
      that.setData({
        isFocus: true,
        userName: item.user_name,
        pCommentId: pitem.comment_id,
        pCommentUserId: item.user_id,
        isHuifu: true,
        isAt: 1
      })
    }
  }
})
//评论
function putComment(comment_content) {
  if (!comment_content) {
    toolutils.showToast("评论内容不能为空")
    return
  }
  var params = {}
  params.branch_type = 6
  if (that.data.branchId <= 0) {
    toolutils.showToast("branchId错误")
    return
  }
  params.branch_id = that.data.branchId
  params.level = 1
  params.comment_content = comment_content
  that.setData({
    inputValue: "",
    isHuifu: false
  })
  httpUtils.putComment(params, function (res) {
    fpage.setData({
      currentPage: 1
    })
    fpage.getCommentList()
    if (top2Page.route == "page/pack-mine/pages/mine-comment/mine-comment") {
      top2Page.setData({
        isRefresh: true
      })
    } else if (top2Page.route == "page/pack-service/pages/casual-photo/casual-photo") {
      top2Page.setData({
        isRefresh: true
      })
    }
    fpage.setData({
      comment_num: ++fpage.data.comment_num
    })
    toolutils.showToast("评论成功")
  }, function (e) {
    toolutils.showToast("评论失败")
  })
}
//回复
function putHuifu(comment_content) {
  if (!comment_content) {
    toolutils.showToast("回复内容不能为空")
    return
  }
  var params = {}
  params.branch_type = 6
  if (that.data.branchId <= 0) {
    toolutils.showToast("branchId错误")
    return
  }
  params.branch_id = that.data.branchId
  params.level = 2
  params.comment_content = comment_content
  params.top_id = that.data.pCommentId
  params.is_at = that.data.isAt
  params.comment_user_id = that.data.pCommentUserId
  that.setData({
    isHuifu: false,
    inputValue: ""
  })
  httpUtils.putComment(params, function (res) {
    toolutils.showToast("回复成功")
    fpage.setData({
      currentPage: 1
    })
    fpage.getCommentList()
  }, function (e) {
    toolutils.showToast("回复失败")
  })
}
//收藏
function putFavorite() {
  var params = {}
  params.branch_type = 6 //1代表资讯
  params.branch_id = that.data.branchId
  //点下禁用按钮
  that.setData({
    favoritesing: true,
    isCollect: that.data.isCollect == 1 ? 2 : 1
  })
  fpage.setData({
    favorite_num: that.data.isCollect == 1 ? ++fpage.data.favorite_num : --fpage.data.favorite_num
  })
  httpUtils.putFavorite(params, function (res) {
    toolutils.showToast(that.data.isCollect == 1 ? "收藏成功" : "取消收藏成功")
    that.setData({
      favoritesing: false
    })
    if (top2Page.route == "page/pack-mine/pages/mine-collection/mine-collection") {
      top2Page.setData({
        isRefresh: that.data.isCollect == 1 ? false : true
      })
    }
  }, function (e) {
    toolutils.showToast(that.data.isCollect == 1 ? "收藏失败" : "取消收藏失败")
    that.setData({
      favoritesing: false,
      isCollect: that.data.isCollect == 1 ? 2 : 1
    })
    fpage.setData({
      favorite_num: that.data.isCollect == 2 ? --fpage.data.favorite_num : ++fpage.data.favorite_num
    })

  })
}
//评论点赞
function putStar(index) {

  console.log(that.data.commentList[index])
  var params = {}
  params.branch_type = 4 //评论点赞

  //点下禁用按钮和数量加一
  var refreshItemValue = that.data.commentList[index]
  params.branch_id = refreshItemValue.comment_id
  if (refreshItemValue.is_star == 2) {
    --refreshItemValue.star_num
  } else {
    ++refreshItemValue.star_num
  }
  refreshItemValue.is_star = refreshItemValue.is_star == 2 ? 1 : 2
  that.setData({
    staring: true,
    ['commentList[' + index + ']']: refreshItemValue
  })
  httpUtils.putStar(params, function (res) {
    toolutils.showToast(refreshItemValue.is_star == 2 ? "点赞成功" : "取消点赞成功")
    that.setData({
      staring: false
    })
  }, function (e) {
    toolutils.showToast(refreshItemValue.is_star == 2 ? "点赞失败" : "取消点赞失败")
    if (refreshItemValue.is_star == 2) {
      --refreshItemValue.star_num
    } else {
      ++refreshItemValue.star_num
    }
    refreshItemValue.is_star = refreshItemValue.is_star == 2 ? 1 : 2
    that.setData({
      staring: false,
      ['commentList[' + index + ']']: refreshItemValue
    })
  })
}