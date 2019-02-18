// page/pack-index/pages/personal-dynamics/personal-dynamics.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js")
var mFeedId
var that
var mPageSize = 10 //每页条数
var mTotalNum //总条数
var mCurrentPage = 1
var mType //1队伍 2动态 3资讯 4评论
var indexList
var myUserInfo
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNoGroup: true,
    isLoading: true,
    isCommentShow: true,
    params:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    getApp().userInfo(function(myUserInfo1) {
      myUserInfo = myUserInfo1
      that.setData({
        mineUserId: myUserInfo.user_id
      })
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          isNoGroup: options.isNoGroup && true || false,
          isShare: options.isShare && options.isShare == 1 && true || false
        })
      }
    })
    indexList = options.index || -1
    mType = options.type
    console.log(mType)
    mFeedId = options.feed_id
    getData()

    that.setData({
      params: JSON.stringify({
        'branch_id': mFeedId,
        'branch_type': mType,
        'level': 1
      })
    })
    // mCurrentPage == 1
    // getCommentList()
  },
  onCommentBut:function(e){
    console.log(e)
    that.setData({
      isCommentShow: true,
      placeholder:'',
      params: JSON.stringify({
        'branch_id': mFeedId,
        'branch_type': mType,
        'level': 1
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    getData()
    mCurrentPage == 1
    getCommentList()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (that.data.refresh) {
      that.setData({
        refresh: false
      })
      mCurrentPage = 1
      getCommentList()
    }
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
  /**
   * 返回首页
   */
  goHome: function() {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },
  /**
   * 刷新数据
   */
  refreshData: function() {
    mCurrentPage = 1
    getCommentList()
  },
  //预览图片
  lookImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.i // 需要预览的图片http链接列表
    })
  },
  //跳转队伍主页
  onTeamDetail: function(e) {
    var id = e.currentTarget.dataset.id
    if (that.data.data.group_info.attr_id == 2) {
      toolUtils.pageTo("/page/pack-index/pages/team-page/team-page?group_id=" + id)
    } else {
      toolUtils.pageTo("/page/pack-index/pages/currency-team-page/team-page?group_id=" + id)
    }

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (mTotalNum > mPageSize * mCurrentPage) {
      ++mCurrentPage
      that.setData({
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '动态详情',
      path: '/page/pack-index/pages/personal-dynamics/personal-dynamics?isShare=1&feed_id=' + mFeedId + '&type=' + mType
    }

  },
  onClick: function(e) {
    switch (e.currentTarget.id) {
      case "accessment":
        // var params = {
        //   'branch_id': mFeedId,
        //   'branch_type': mType,
        //   'level': 1
        // }
        // toolUtils.pageTo("/page/pack-index/pages/comment/comment?params=" + JSON.stringify(params))
        break
      case "zan":
        putStar()
        break
      case "share":
        break
    }
  },
  /**
   * 删除
   */
  onDelete: function(e) {
    wx.showModal({
      title: '提示',
      content: '是否删除当前动态？',
      success: function(res) {
        if (res.confirm) {
          var params = {
            feed_id: that.data.data.feed_id
          }
          var pages = getCurrentPages()
          httpsUtils.deleteFeed(params, function(res) {
            try {
              var p = pages[pages.length - 2]
              var fl = p.data.feedList
              fl.splice(indexList, 1)
              p.setData({
                feedList: fl
              })
            } catch (e) {
              console.log(e)
            }
            wx.navigateBack({
              delta: 1
            })
            toolUtils.showToast("删除成功")
          }, function(e) {
            toolUtils.showToast(e.data.msg)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //回复点赞
  plZan: function(e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    putStar2(index)
  },
  /**
   * 回复
   */
  huifu: function(e) {
    var index = e.currentTarget.dataset.index
    var item = e.currentTarget.dataset.item
    // var params = {
    //   'branch_id': mFeedId,
    //   'top_id': item.comment_id,
    //   'comment_user_id': item.user_id,
    //   'branch_type': 2,
    //   'is_at': 2,
    //   'level': 2
    // }
    // toolUtils.pageTo("/page/pack-index/pages/comment/comment?params=" + JSON.stringify(params) + '&comment_user_name=' + item.user_name)
    that.setData({
      isCommentShow: false,
      params: JSON.stringify({
        'branch_id': mFeedId,
        'top_id': item.comment_id,
        'comment_user_id': item.user_id,
        'branch_type': 2,
        'is_at': 2,
        'level': 2
      }),
      placeholder: '回复：' + item.user_name
    })
   
  },
  /**
   * 回复回复的人
   */
  onHuiFuChild: function(e) {
    console.log(e)
    var item = e.currentTarget.dataset.item
    var pitem = e.currentTarget.dataset.pitem
    that.setData({
      isCommentShow: false,
      params: JSON.stringify({
        'branch_id': mFeedId,
        'top_id': pitem.comment_id,
        'comment_user_id': item.user_id,
        'branch_type': 2,
        'is_at': 1,
        'level': 2
      }),
      placeholder: '回复：' + item.comment_user_name
    })
    // wx.showActionSheet({
    //   itemList: ['回复'],
    //   success: function(res) {
    //     if (res.tapIndex == 0) {
    //       var params = {
    //         'branch_id': mFeedId,
    //         'top_id': pitem.comment_id,
    //         'comment_user_id': item.user_id,
    //         'branch_type': 2,
    //         'is_at': 1,
    //         'level': 2
    //       }
    //       toolUtils.pageTo("/page/pack-index/pages/comment/comment?params=" + JSON.stringify(params) + '&comment_user_name=' + item.comment_user_name)
    //     }
    //   },
    //   fail: function(res) {
    //     console.log(res.errMsg)
    //   }
    // })
  },
  //查看更多回复
  lookMore: function(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    toolUtils.pageTo('/page/pack-index/pages/reply-more/reply-more?index=' + index)
  }
})
//获取动态详情
function getData() {
  httpsUtils.feedDetails(mFeedId, {}, function(res) {
    mFeedId = res.feed_id
    var dataList = res.comment_list
    mCurrentPage = 1
    if (dataList.length >= 10) {
      mTotalNum = 11
    } else {
      mTotalNum = dataList.length
    }
    that.setData({
      data: res,
      dataList: dataList,
      star_list: res.star_list,
      is_star: res.is_star,
      star_num: res.star_num,
      comment_num: res.comment_num
    })

  }, function(e) {

  })
}
//动态点赞
function putStar() {
  var params = {}
  params.branch_type = mType
  params.branch_id = that.data.data.feed_id
  httpsUtils.putStar(params, function(res) {
    var is_star = that.data.is_star
    var list = []
    var star_list = that.data.star_list || []
    var star_num = parseInt(that.data.star_num)
    if (is_star == 1) {
      for (var i = 0; i < star_list.length; i++) {
        if (star_list[i].user_id != myUserInfo.user_id) {
          list.push(star_list[i])
        }
      }
      that.setData({
        is_star: is_star == 1 ? 2 : 1,
        star_list: list,
        star_num: --star_num
      })
    } else {
      var u = {
        user_id: myUserInfo.user_id,
        user_avatar: myUserInfo.user_avatar
      }
      star_list.push(u)
      that.setData({
        is_star: is_star == 1 ? 2 : 1,
        star_list: star_list,
        star_num: ++star_num
      })
    }
    try {
      console.log(indexList)
      if (indexList != -1) {
        var pages = getCurrentPages()
        pages[pages.length - 2].refreshStar(indexList)
      }
    } catch (e) {

    }
  })
}

//评论点赞
function putStar2(index) {
  var params = {}
  params.branch_type = 4 //评论点赞

  //点下禁用按钮和数量加一
  var refreshItemValue = that.data.dataList[index]
  params.branch_id = refreshItemValue.comment_id
  if (refreshItemValue.is_star == 2) {
    --refreshItemValue.star_num
  } else {
    ++refreshItemValue.star_num
  }
  refreshItemValue.is_star = refreshItemValue.is_star == 2 ? 1 : 2
  that.setData({
    staring: true,
    ['dataList[' + index + ']']: refreshItemValue
  })
  httpsUtils.putStar(params, function(res) {
    toolUtils.showToast(refreshItemValue.is_star == 2 ? "点赞成功" : "取消点赞成功")
    that.setData({
      staring: false
    })
  }, function(e) {
    toolUtils.showToast(refreshItemValue.is_star == 2 ? "点赞失败" : "取消点赞失败")
    if (refreshItemValue.is_star == 2) {
      --refreshItemValue.star_num
    } else {
      ++refreshItemValue.star_num
    }
    refreshItemValue.is_star = refreshItemValue.is_star == 2 ? 1 : 2
    that.setData({
      staring: false,
      ['dataList[' + index + ']']: refreshItemValue
    })
  })
}

//获取评论列表
function getCommentList() {
  var params = {
    'branch_type': mType,
    'branch_id': mFeedId,
    'current_page': mCurrentPage,
    'page_size': mPageSize
  }
  httpsUtils.getCommentList(params, function(res) {
    mTotalNum = res.total_num
    var list = that.data.dataList
    if (mCurrentPage == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length == mTotalNum) {
      that.setData({
        dataList: list,
        comment_num: mTotalNum,
        isShow: true,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    } else {
      that.setData({
        dataList: list,
        comment_num: mTotalNum,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
    wx.stopPullDownRefresh()
    try {
      var pages = getCurrentPages()
      var p = pages[pages.length - 2]
      var l = p.data.feedList
      if (!l) {
        p = pages[pages.length - 3]
        l = p.data.feedList
      }
      var index = parseInt(indexList)
      var item = l[index]
      item.comment_num = mTotalNum
      p.setData({
        [`feedList[${index}]`]: item
      })
    } catch (e) {
      console.log(e)
    }
  }, function(e) {
    if (mCurrentPage > 1) {
      --mCurrentPage
    }
    that.setData({
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.stopPullDownRefresh()
  })
}