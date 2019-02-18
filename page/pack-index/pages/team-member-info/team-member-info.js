// page/pack-index/pages/team-member-info/team-member-info.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js")
var mGroupId
var mMemberUserId
var that
var userInfo
var mPageSize = 10//每页条数
var mTotalNum //总条数
var mCurrentPage = 1
var uid
var windowHeight;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCommentShow: true,
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    mGroupId = options.group_id
    mMemberUserId = options.member_user_id || ""
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight
        that.setData({
          statusBarHeight: res.statusBarHeight,
          isShare: options.isShare && options.isShare == 1 && true || false
        })
        getApp().userInfo(function (userInfo) {
          getData()
          userInfo = userInfo
          if (mMemberUserId) {
            uid = mMemberUserId
          } else {
            uid = userInfo.user_id
          }
          that.setData({
            'but_type': 'share',
            'isOneself': !mMemberUserId && true || mMemberUserId == userInfo.user_id,
            mineUserId: userInfo.user_id
          })
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
     * 评论
     */
  onComment: function (e) {
    var that = this
    var client = e.changedTouches[0]
    var socrollY = client.pageY - windowHeight + 45
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    console.log(e)
    if (socrollY > 0) {
      wx.pageScrollTo({
        scrollTop: socrollY,
        duration: 150
      })
    }
    setTimeout(function () {
      var params = {
        'branch_id': item.feed_id,
        'branch_type': 2,
        'level': 1
      }
      that.setData({
        isCommentShow: false,
        params: JSON.stringify(params)
      })
    }, 300)
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
 * 刷新数据
 */
  refreshData: function () {
    mCurrentPage = 1
    getData()
  },
  /**
   * 拨打电话
   */
  onCallPhone: function (e) {
    var phone = e.currentTarget.dataset.phone
    if (!phone) {
      toolUtils.showToast("电话号码不能为空")
      return
    }
    wx.makePhoneCall({
      phoneNumber: phone + ''
    })
  },
  /**
  * 返回首页
  */
  goHome: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },
  //点击动态
  onItemSS: function (e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    toolUtils.pageTo(`/page/pack-index/pages/personal-dynamics/personal-dynamics?index=${index}&type=2&feed_id=${item.feed_id}`)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (mTotalNum > mPageSize * mCurrentPage) {
      ++mCurrentPage
      that.setData({
        loadData: {
          searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
        }
      })
      feedList()
    } else {
      that.setData({
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true  //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var item = res.target.dataset.item
      if (item) {
        var contents = toolUtils.canvasTxtHandle(item.feed_content, 50, 1)
        var img
        if (item.feed_pic && item.feed_pic.length > 0) {
          img = item.feed_pic[0]
        }
        return {
          title: contents[0],
          imageUrl: img || '/pic/comment-share-img.jpg',
          path: '/page/pack-index/pages/personal-dynamics/personal-dynamics?isShare=1&feed_id=' + item.feed_id + '&type=2'
        }
      } else {
        return {
          title: that.data.user_nickname || '' + '的主页',
          path: '/page/pack-index/pages/team-member-info/team-member-info?isShare=1&group_id=' + mGroupId + '&member_user_id=' + mMemberUserId || userInfo.user_id
        }
      }
    }
  },

  //预览图片
  lookImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.i// 需要预览的图片http链接列表
    })
  },
  /**
 * 动态列表点赞
 */
  onStar: function (e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    putStar(item, index)
  },
  onLongTag: function (e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '是否删除当前动态？',
      success: function (res) {
        if (res.confirm) {
          var params = {
            feed_id: item.feed_id
          }
          httpsUtils.deleteFeed(params, function (res) {
            var fl = that.data.feedList
            fl.splice(index, 1)
            that.setData({
              feedList: fl
            })
            toolUtils.showToast("删除成功")
          }, function (e) {
            toolUtils.showToast(e.data.msg)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
 * 刷新动态
 */
  refreshStar: function (index) {
    var item = that.data.feedList[index]
    if (item.is_star == 1) {
      item.is_star = 2
    } else {
      item.is_star = 1
    }
    var star_num = item.star_num
    if (item.is_star == 1) {
      item.star_num = ++star_num
    } else {
      item.star_num = --star_num
    }
    that.setData({
      [`feedList[${index}]`]: item
    })
  }
})
//获取个人主页数据
function getData() {
  var params = {}
  params.group_id = mGroupId
  if (mMemberUserId) {
    params.member_user_id = mMemberUserId
  }
  params.scene = 3
  httpsUtils.groupMemberIndex(params, function (res) {
    that.setData(res)
    if (res.feed_list.length >= 10) {
      mTotalNum = 11
    } else {
      mTotalNum = res.feed_list.length
    }
    that.setData({
      feedList: res.feed_list
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
//获取我的动态列表
function feedList() {
  var params = {
    'current_page': mCurrentPage,
    'page_size': mPageSize,
    'uid': uid,
    'scene': 3
  }
  httpsUtils.feedList(params, function (res) {
    mTotalNum = res.total_num
    var list = that.data.feed_lfeedListist
    if (mCurrentPage == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length == mTotalNum) {
      that.setData({
        feedList: list,
        isShow: true,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true  //“没有数据”的变量，默认false，隐藏  
        }
      })
    } else {
      that.setData({
        feedList: list,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
    wx.stopPullDownRefresh()
  }, function (e) {
    if (mCurrentPage > 1) {
      --mCurrentPage
    }
    that.setData({
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.stopPullDownRefresh()
  })
}
//动态点赞
function putStar(item, index) {
  var params = {}
  params.branch_type = 2
  params.branch_id = item.feed_id
  httpsUtils.putStar(params, function (res) {
    var is_star = item.is_star
    item.is_star = is_star == 1 ? 2 : 1
    var star_num = item.star_num
    if (item.is_star == 1) {
      item.star_num = ++star_num
    } else {
      item.star_num = --star_num
    }
    that.setData({
      [`feedList[${index}]`]: item
    })
  })
}