// page/pack-index/pages/team-page/team-page.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js")
var that
var mGroupId
var mPageSize = 10 //每页条数
var mTotalNum //总条数
var mCurrentPage = 1

var mPageSize1 = 10 //每页条数
var mTotalNum1 //总条数
var mCurrentPage1 = 1

var isNew
var windowHeight;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCommentShow: true,
    tabids: 1,
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    that = this
    getApp().userInfo(function (userInfo) {
      that.setData({
        mineUserId: userInfo.user_id
      })
    })
    try {
      var res = wx.getSystemInfoSync()
      windowHeight = res.windowHeight
      that.setData({
        statusBarHeight: res.statusBarHeight,
        minHeight: res.windowHeight - 90 - res.statusBarHeight
      })
      if (options.scene) {
        that.setData({
          isShare: true
        })
        var scene = decodeURIComponent(options.scene)
        mGroupId = scene
        getRroupIndex(scene)
      } else {
        that.setData({
          isShare: options.share && true || false
        })
        isNew = options.is_new && true || false
        mGroupId = options.group_id
        getRroupIndex(options.group_id)
      }
    } catch (e) {
      // Do something when catch error
    }
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
   * 返回首页
   */
  goHome: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    that.refreshData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    switch (that.data.tabids) {
      case 1:
        if (mTotalNum > mPageSize * mCurrentPage) {
          ++mCurrentPage
          that.setData({
            loadData: {
              searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
              searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
            }
          })
          feedList()
        } else {
          that.setData({
            loadData: {
              searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
              searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
            }
          })
        }
        break
      case 2:
        if (mTotalNum1 > mPageSize1 * mCurrentPage1) {
          ++mCurrentPage1
          that.setData({
            loadData1: {
              searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
              searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
            }
          })
          getGroupMemberList()
        } else {
          that.setData({
            loadData1: {
              searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
              searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
            }
          })
        }
        break
      case 3:
        if (mTotalNum2 > mPageSize2 * mCurrentPage2) {
          ++mCurrentPage2
          that.setData({
            loadData2: {
              searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
              searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
            }
          })
          soccerRank()
        } else {
          that.setData({
            loadData2: {
              searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
              searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
            }
          })
        }
        break
    }

  },
  /**
   * 跳转到队伍有那些功能
   */
  onIntro: function (e) {
    toolUtils.pageTo("/page/pack-index/pages/team-fun-intro/team-fun-info")
  },
  /**
   * 更换球队背景
   */
  onBg: function (e) {
    wx.showActionSheet({
      itemList: ['更换背景'],
      success: function (res) {
        if (res.tapIndex == 0) {
          toolUtils.pageTo("/page/pack-index/pages/team-background/team-background?id=" + mGroupId)
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 我的主页
   */
  personalPage: function (e) {
    toolUtils.pageTo("/page/pack-index/pages/team-member-info/team-member-info?group_id=" + mGroupId)
  },
  /**
   * 我的主页2
   */
  personalPage2: function (e) {
    var item = e.currentTarget.dataset.item
    toolUtils.pageTo("/page/pack-index/pages/team-member-info/team-member-info?group_id=" + mGroupId + '&member_user_id=' + item.user_id)
  },
  /**
   * 队伍详情
   */
  teamDetail: function (e) {
    toolUtils.pageTo("/page/pack-find/yue-team-detail/yue-team-detail?group_id=" + mGroupId)
  },
  //邀请好友
  invitation: function (e) {
    var group = {
      'group_name': that.data.group_name,
      'attr_id': that.data.attr_id,
      'group_id': mGroupId,
      'attr_value': that.data.attr_value
    }
    toolUtils.pageTo("/page/pack-index/pages/invite-friends/invite-friends?group=" + JSON.stringify(group))
  },
  //关注
  follow: function (e) {
    followTeam()
  },
  //接受邀请
  accept: function (e) {
    if (that.data.member_state == 0 || that.data.member_state == 3) {
      toolUtils.pageTo(`/page/pack-mine/complete-infomation/complete-infomation?attr_id=${that.data.attr_id}&group_id=${mGroupId}`)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var item = res.target.dataset.item
      var contents = toolUtils.canvasTxtHandle(item.feed_content || '', 50, 1)
      var img
      if (item.feed_pic && item.feed_pic.length > 0) {
        img = item.feed_pic[0]
      }
      return {
        title: contents[0],
        imageUrl: img || '/pic/comment-share-img.jpg',
        path: '/page/pack-index/pages/personal-dynamics/personal-dynamics?isShare=1&feed_id=' + item.feed_id + '&type=2'
      }
    }
  },
  //点击动态
  onItemSS: function (e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    var isNoGroup = 0
    if (that.data.member_state == 2) {
      isNoGroup = 1
    }
    toolUtils.pageTo(`/page/pack-index/pages/personal-dynamics/personal-dynamics?isNoGroup=${isNoGroup}&index=${index}&type=2&feed_id=${item.feed_id}`)
  },
  /**
   * 刷新数据
   */
  refreshData: function () {
    mCurrentPage = 1
    getRroupIndex(mGroupId)
  },
  //button按钮的点击
  onBut: function (e) {
    switch (e.target.id) {
      case "home": //首页
        wx.switchTab({
          url: '/page/tabBar/about-movement/about-movement'
        })
        break
      case "add_ss": //发布说说
        toolUtils.pageTo("/page/pack-index/pages/evaluate/evaluate?group_id=" + mGroupId + '&type=' + 1 + '&is_leader=' + that.data.is_leader)
        break
      case "find": //运动圈
        wx.switchTab({
          url: '/page/tabBar/movement-circle/movement-circle'
        })
        break
      case "bjdw"://基本信息

        break
      case "cygl"://成员管理
        break
      case "fbgg"://发布公告
        break
      case "wlxc"://邀请管理
        break
        // case "team_manage": //队伍管理
        toolUtils.pageTo(`/page/pack-index/pages/team-manage/team-manage?currency=true&attr_id=${that.data.attr_id}&group_id=${mGroupId}&group_name=${that.data.group_name}&has_message=${that.data.has_message}`)
        break
    }
  },
  //tab切换
  onTabs: function (e) {
    var ids
    switch (e.currentTarget.id) {
      case 'tab1': //动态
        ids = 1
        break
      case 'tab2': //队员
        ids = 2
        break
      case 'tab3': //数据
        ids = 3
        break
    }
    that.setData({
      tabids: ids
    })
  },
  //预览图片
  lookImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.i // 需要预览的图片http链接列表
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
//获取队伍主题
function getRroupIndex(group_id) {
  var params = {
    'group_id': group_id,
    'scene': 2
  }
  httpsUtils.groupIndex(params, function (res) {
    var feedList = res.feed_list
    var groupMemberList = res.group_member
    that.setData({
      group_name: res.group_name,
      group_pic: res.group_pic || '',
      attr_id: res.attr_id,
      group_badge: res.group_badge,
      member_num: res.member_num,
      atten_num: res.atten_num,
      group_desc: res.group_desc,
      member_state: res.member_state,
      is_atten: res.is_atten,
      is_leader: res.is_leader,
      notice: res.notice,
      attr_value: res.attr_value,
      isload: true,
      has_message: res.has_message || 2,
      feedList: feedList,
      isNoGroup: true,
      groupCount: res.group_soccer && res.group_soccer.group_count || {},
      movementList: res.group_soccer && res.group_soccer.movement_list || [],
      groupMemberList: res.group_member
    })
    //动态
    mCurrentPage = 1
    if (feedList.length >= 10) {
      mTotalNum = 11
    } else {
      mTotalNum = feedList.length
    }
    //成员
    mCurrentPage1 = 1
    if (groupMemberList.length >= 10) {
      mTotalNum1 = 11
    } else {
      mTotalNum1 = groupMemberList.length
    }
    if (isNew) {
      wx.showModal({
        title: '恭喜您拥有一支崭新的队伍',
        content: '去邀请队员加入队伍吧',
        cancelText: '待会邀请',
        confirmText: '立即邀请',
        success: function (res2) {
          if (res2.confirm) {
            var group = {
              'group_name': res.group_name,
              'attr_id': res.attr_id,
              'group_id': mGroupId,
              'attr_value': res.attr_value
            }
            toolUtils.pageTo("/page/pack-index/pages/invite-friends/invite-friends?group=" + JSON.stringify(group))
            isNew = false
          } else if (res2.cancel) {
            console.log('用户点击取消')
            isNew = false
          }
        }
      })
    }
    wx.stopPullDownRefresh()

  }, function (e) {
    toolUtils.showToast(e.data.msg)
    wx.stopPullDownRefresh()
    setTimeout(function () {
      that.goHome()
    }, 2000)
  })

}
//获取队员列表
function getGroupMemberList() {
  var params = {
    'current_page': mCurrentPage1,
    'page_size': mPageSize1,
    'group_id': mGroupId
  }
  httpsUtils.groupMember(params, function (res) {
    mTotalNum1 = res.total_num
    var list = that.data.groupMemberList
    if (mCurrentPage1 == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length == mTotalNum1) {
      that.setData({
        groupMemberList: list,
        isShow: true,
        loadData1: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    } else {
      that.setData({
        groupMemberList: list,
        loadData1: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
    wx.stopPullDownRefresh()
  }, function (e) {
    if (mCurrentPage1 > 1) {
      --mCurrentPage1
    }
    that.setData({
      loadData1: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.stopPullDownRefresh()
  })
}
//关注队伍
function followTeam() {
  var params = {}
  params.group_id = mGroupId
  httpsUtils.followTeam(params, function (res) {
    if (that.data.is_atten == 1) {
      toolUtils.showToast("关注成功")
    } else {
      toolUtils.showToast("已取消关注")
    }
    that.setData({
      is_atten: that.data.is_atten == 1 ? 2 : 1
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}

/**
 * 约动列表
 */
function feedList() {
  var params = {
    'current_page': mCurrentPage,
    'page_size': mPageSize,
    'group_id': mGroupId,
    'scene': 2
  }
  httpsUtils.feedList(params, function (res) {
    mTotalNum = res.total_num
    var list = that.data.feedList
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
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    } else {
      that.setData({
        feedList: list,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
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
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
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