// page/pack-index/pages/reply-more/reply-more.js
var toolutils = require('../../../../utils/tool-utils.js')
var httpUtils = require('../../../../utils/https-utils.js')
var app = getApp()
var that
var mPageSize = 20
var mTotalNum = 0
var mPuserID
var mPpage //上级页面对象
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,
    list: [],
    loadData: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
    isReply: false,
    staring: false,
    isCommentShow: true,
    params: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          isLoading: true,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString()
        })
      }
    })
    var index = options.index
    mPpage = getCurrentPages()[getCurrentPages().length - 2]
    var oData = mPpage.data.dataList[index]
    that.setData({
      userName: oData.user_name,
      commentContent: oData.comment_content,
      isStar: oData.is_star,
      branchID: mPpage.data.data.feed_id,
      commentID: oData.comment_id,
      star_num: oData.star_num,
      user_avatar: oData.user_avatar,
      create_time: oData.create_time,
    })
    mPuserID = oData.user_id
    that.getCommentDetail()
    that.setData({
      params: JSON.stringify({
        'branch_id': that.data.branchID,
        'top_id': that.data.commentID,
        'comment_user_id': mPuserID,
        'branch_type': 2,
        'is_at': 2,
        'level': 2
      }),
      placeholder: '回复：' + (that.data.user_name||'游客')
    })
  },
  onCommentBut: function(e) {
    console.log(e)
    that.setData({
      isCommentShow: true,
      params: JSON.stringify({
        'branch_id': that.data.branchID,
        'top_id': that.data.commentID,
        'comment_user_id': mPuserID,
        'branch_type': 2,
        'is_at': 2,
        'level': 2
      }),
      placeholder: '回复：' + (that.data.user_name || '游客')
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  //点赞
  zan: function(e) {
    console.log(e)
    putStar()
  },
  /**
   * 刷新数据
   */
  refreshData: function() {
    this.data.currentPage = 1
    this.getCommentDetail()
  },
  //回复
  reply: function(e) {
    // if (mPuserID == app.data.userID) {
    //   toolutils.showFailToast("自己不能回复自己")
    //   return
    // }
    // var params = {
    //   'branch_id': that.data.branchID,
    //   'top_id': that.data.commentID,
    //   'comment_user_id': mPuserID,
    //   'branch_type': 2,
    //   'is_at': 2,
    //   'level': 2
    // }
    // toolutils.pageTo("/page/pack-index/pages/comment/comment?params=" + JSON.stringify(params) + '&comment_user_name=' + that.data.userName)
  },
  //回复二级
  onItem: function(e) {
    var item = e.currentTarget.dataset.item
    // if(item.user_id == app.data.userID){
    //   toolutils.showFailToast("自己不能回复自己")
    //   return
    // }
    that.setData({
      isCommentShow: false,
      params: JSON.stringify({
        'branch_id': that.data.branchID,
        'top_id': that.data.commentID,
        'comment_user_id': item.user_id,
        'branch_type': 2,
        'is_at': 1,
        'level': 2
      }),
      placeholder: '回复：' + item.comment_user_name
    })
    // wx.showActionSheet({
    //   itemList: ['回复'],
    //   success: function (res) {
    //     if (res.tapIndex == 0) {
    //       var params = {
    //         'branch_id': that.data.branchID,
    //         'top_id': that.data.commentID,
    //         'comment_user_id': item.user_id,
    //         'branch_type': 2,
    //         'is_at': 1,
    //         'level': 2
    //       }
    //       toolutils.pageTo("/page/pack-index/pages/comment/comment?params=" + JSON.stringify(params) + '&comment_user_name=' + item.comment_user_name)
    //     }
    //   },
    //   fail: function (res) {
    //     console.log(res.errMsg)
    //   }
    // })

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {
    if (mTotalNum > mPageSize * that.data.currentPage) {
      that.setData({
        currentPage: ++that.data.currentPage,
        loadData: {
          searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
      getCommentList()
    } else {
      that.setData({
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
  },
  //获取评论列表
  getCommentDetail: function() {
    var params = {}
    params.current_page = that.data.currentPage
    params.page_size = mPageSize
    httpUtils.getCommentDetail(that.data.commentID, params, function(res) {
      mTotalNum = res.total_num
      var list = that.data.list
      if (res.current_page == 1) {
        list = []
      }
      list = list.concat(res.list)
      if (list.length == mTotalNum) {
        that.setData({
          list: list,
          loadData: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
          }
        })
      } else {
        that.setData({
          list: list,
          loadData: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
          }
        })
      }


    }, function(e) {
      toolutils.showFailToast("获取评论列表失败")
      that.setData({
        currentPage: --that.data.currentPage,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
    })
  }
})
//评论点赞
function putStar() {
  var params = {}
  params.branch_type = 4 //评论点赞
  params.branch_id = that.data.commentID
  //点下禁用按钮和数量加一
  that.setData({
    staring: true,
    star_num: that.data.isStar == 1 ? ++that.data.star_num : --that.data.star_num,
    isStar: that.data.isStar == 1 ? 2 : 1
  })
  httpUtils.putStar(params, function(res) {
    toolutils.showToast(that.data.isStar == 2 ? "点赞成功" : "取消点赞成功")
    that.setData({
      staring: false
    })
    if (!mPpage.data.refresh) {
      mPpage.setData({
        refresh: true
      })
    }
  }, function(e) {
    toolutils.showToast(that.data.isStar == 2 ? "点赞失败" : "取消点赞失败")
    that.setData({
      staring: false,
      star_num: that.data.isStar == 2 ? --that.data.star_num : ++that.data.star_num,
      isStar: that.data.isStar == 2 ? 1 : 2
    })
  })
}