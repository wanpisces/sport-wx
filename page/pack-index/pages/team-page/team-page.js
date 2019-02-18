// page/pack-index/pages/team-page/team-page.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js")
var app = getApp()

//队伍动态
var mPageSize = 10 //每页条数
var mTotalNum //总条数
var mCurrentPage = 1

//成员列表
var mPageSize1 = 4 //每页条数
var mTotalNum1 //总条数
var mCurrentPage1 = 1

var mPageSize2 = 10 //每页条数
var mTotalNum2 //总条数
var mCurrentPage2 = 1

// 活跃榜
var mPageSize3 = 5 //每页条数
var mTotalNum3 //总条数
var mCurrentPage3 = 1

// 队伍参与活动
var mPageSize4 = 3 //每页条数
var mTotalNum4 //总条数
var mCurrentPage4 = 1

// 热门活动
var mPageSize5 = 5 //每页条数
var mTotalNum5 //总条数
var mCurrentPage5 = 1

var isNew
var windowHeight;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    announce: true,
    isCommentShow: true,
    tabids: 2,
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2,
    swiperMore: false,
    peopleState: false, // 更多成员
    activeListState: false, //活跃榜查看更多
    alreadyActiveState: false, //更多参与活动
    // hotActiveState: false, // 更多热门活动
    activeList: [],
    hotActive: [],
    tip: '暂无热门活动',
    materialsShow: true, //物料宣传弹框
    isOrCode: false,
    isInvitingCard: false,
    isShowModule: false,
    movementList: [],
    group_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    getApp().userInfo(function (userInfo) {
      that.setData({
        mineUserId: userInfo.user_id,
      })
      app.data.user_nickname = userInfo.user_nickname
    })
    try {
      var res = wx.getSystemInfoSync()
      windowHeight = res.windowHeight
      that.setData({
        statusBarHeight: res.statusBarHeight,
        minHeight: res.windowHeight - 90 - res.statusBarHeight,
        isShare: options.share && true || false,
        rpxTopx: res.windowWidth / 750
      })
      if (options.avatar) {
        that.setData({
          isInvitingCard: true,
          avatarUrl: options.avatar
        })
      }
      if (options.scene) {
        var scene = decodeURIComponent(options.scene)
        that.setData({
          isShare: true,
          group_id: scene
        })
        getRroupIndex(that, that.data.group_id)
      } else {
        isNew = options.is_new && true || false
        that.setData({
          isShare: options.share && true || false,
          group_id: options.group_id || options.id
        })
        getRroupIndex(that, that.data.group_id)
      }
    } catch (e) { }
    mCurrentPage1 = 1;
    mCurrentPage3 = 1;
    getGroupMemberList(that)
    getActiveList(that)
  },
  //获取二维码
  getCode: function (e) {
    this.setData({
      codeImg: e.detail,
      shareType: 'share'
    })
  },
  //发送给微信好友
  onShareAppMessage: function (res) {
    var url = '/page/pack-index/pages/team-page/team-page?share=1&group_id=' + mGroupId
    var group_name = that.data.group_name;
    if (res.from == 'button') {
      return {
        title: group_name,
        imageUrl: this.data.codeImg,
        path: url,
      }
    }
  },
  //关闭宣传物料弹框
  closeMaterial() {
    this.setData({
      materialsShow: true
    })
  },
  /**
   * 生成队伍二维码
   */
  onOrCode: function (e) {
    this.setData({
      isOrCode: true,
      mGroupId: this.data.group_id,
      materialsShow: true
    })
  },
  //关闭生成二维码的页面
  orExit: function (e) {
    this.setData({
      isOrCode: false
    })
  },
  /**
   * 生成制作邀请卡页面
   */
  onInvitingCard: function (e) {
    this.setData({
      isInvitingCard: true,
      materialsShow: true
    })
  },
  //关闭制作邀请卡页面
  cardExit: function (e) {
    this.setData({
      isInvitingCard: false
    })
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
  //监听约动滚动
  bindSportInfoChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

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
    this.refreshData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 队伍动态上拉加载
    if (that.data.tabids == 1) {
      if (mTotalNum > mPageSize * mCurrentPage) {
        ++mCurrentPage
        that.setData({
          loadData: {
            searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
          }
        })
        feedList(that)
      } else {
        that.setData({
          loadData: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
          }
        })
      }
    }
  },
  /**
   * 数据里的排行榜
   */
  // bindOrderPickerChange: function (e) {
  //   var index = e.detail.value
  //   that.setData({
  //     orderIndex: index
  //   })
  //   mCurrentPage2 = 1
  //   soccerRank()
  // },
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
    toolUtils.pageTo(`/page/pack-index/pages/team-background/team-background?id=${this.data.group_id}`)
    // wx.showActionSheet({
    //   itemList: ['更换背景'],
    //   success: function (res) {
    //     if (res.tapIndex == 0) {
    //       toolUtils.pageTo("/page/pack-index/pages/team-background/team-background?id=" + mGroupId)
    //     }
    //   },
    //   fail: function (res) {
    //     console.log(res.errMsg)
    //   }
    // })
  },
  //更多成员
  teamMore: function () {
    var that = this;
    if (mTotalNum1 > mPageSize1 * mCurrentPage1) {
      ++mCurrentPage1
      that.setData({
        'peopleState': true
      })
      getGroupMemberList(that)
    } else {
      that.setData({
        'peopleState': false
      })
    }
  },
  //更多活跃榜
  activeListEvt: function () {
    var that = this;
    if (mTotalNum3 > mPageSize3 * mCurrentPage3) {
      ++mCurrentPage3
      that.setData({
        'activeListState': true
      })
      getActiveList(that)
    } else {
      that.setData({
        'activeListState': false
      })
    }

  },
  //更多已参与活动
  alreadyActiveEvt: function () {
    var that = this;
    if (mTotalNum4 > mPageSize4 * mCurrentPage4) {
      ++mCurrentPage4
      that.setData({
        'alreadyActiveState': true
      })
      getGroupJoinedActivity(that)
    } else {
      that.setData({
        'alreadyActiveState': false
      })
    }
  },
  // //更多热门活动
  // hotActiveEvt: function () {
  //   if (mTotalNum5 > mPageSize5 * mCurrentPage5) {
  //     ++mCurrentPage5
  //     that.setData({
  //       'hotActiveState': true
  //     })
  //     getHotActivity()
  //   } else {
  //     that.setData({
  //       'hotActiveState': false
  //     })
  //   }
  // },

  // 跳转到活动页面
  navigatorActive: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var title = e.currentTarget.dataset.title;
    var competition_status;
    var competition_id;
    switch (title) {
      //热门活动
      case "hotActive":
        competition_id = that.data.hotActive[index].competition_id;
        competition_status = that.data.hotActive[index].competition_status;
        break
      //已参与活动
      case "joinActive":
        competition_id = that.data.alreadyActive[index].competition_id;
        competition_status = that.data.alreadyActive[index].competition_status;
        break
    }
    switch (competition_status) {
      case 1:
      case 4:
      case 5:
        toolUtils.pageTo('/page/pack-match/pages/sport-detail/sport-detail?competition_id=' + competition_id, 1)
        break;
      case 2:
        toolUtils.pageTo('/page/pack-match/pages/sport-underway/sport-underway?competition_id=' + competition_id, 1)
        break;
      case 3:
        toolUtils.pageTo('/page/pack-match/pages/sport-summary/sport-summary?competition_id=' + competition_id, 1)
        break;
    }
  },
  //找活动
  findActive: function (e) {
    toolUtils.pageTo('/page/tabBar/match/match', 3)
  },
  /**
   * 我的主页（跳转到个人中心）
   */
  personalPage: function (e) {
    var mineUserId = this.data.mineUserId
    var mGroupId = this.data.group_id
    toolUtils.pageTo("/page/pack-index/pages/team-member-info/team-member-info?group_id=" + mGroupId + '&member_user_id=' + mineUserId)
  },
  /**
   * 我的主页2（人员列表对应跳转到个人中心）
   */
  personalPage2: function (e) {
    var item = e.currentTarget.dataset.item
    var mGroupId = this.data.group_id
    toolUtils.pageTo("/page/pack-index/pages/team-member-info/team-member-info?group_id=" + mGroupId + '&member_user_id=' + item.user_id)
  },
  /**
   * 队伍详情 （跳转到队伍详情）
   */
  teamDetail: function (e) {
    var mGroupId = this.data.group_id
    toolUtils.pageTo("/page/pack-find/yue-team-detail/yue-team-detail?group_id=" + mGroupId)
  },
  //邀请队友
  getFriend: function (e) {
    var that = this;
    var group = {
      'group_name': that.data.group_name,
      'attr_id': that.data.attr_id,
      'group_id': that.data.group_id,
      'attr_value': that.data.attr_value
    }
    toolUtils.pageTo("/page/pack-index/pages/invite-friends/invite-friends?group=" + JSON.stringify(group))
  },
  //关注
  follow: function (e) {
    followTeam(this)
  },
  //接受邀请
  accept: function (e) {
    if (this.data.member_state == 0 || this.data.member_state == 3) {
      toolUtils.pageTo(`/page/pack-mine/complete-infomation/complete-infomation?attr_id=${this.data.attr_id}&group_id=${this.data.group_id}`)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var item = res.target.dataset.item
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
    }
  },
  //点击动态
  onItemSS: function (e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    var isNoGroup = 0
    if (this.data.member_state == 2) {
      isNoGroup = 1
    }
    toolUtils.pageTo(`/page/pack-index/pages/personal-dynamics/personal-dynamics?isNoGroup=${isNoGroup}&index=${index}&type=2&feed_id=${item.feed_id}`)
  },
  /**
   * 刷新数据
   */
  refreshData: function () {
    mCurrentPage = 1
    getRroupIndex(this, this.data.group_id)
  },
  onReleaseButs: function (e) {
    var that = this;
    var home_shirt = that.data.home_shirt;
    var home_shirt_id = that.data.home_shirt_id
    var mGroupId = that.data.group_id
    switch (e.currentTarget.id) {
      case 'fyd': //发约动
        // toolUtils.pageTo('/page/pack-find/yue-release/yue-release?group_id=' + mGroupId)
        toolUtils.pageTo('/page/pack-find/yue-release/yue-release?attr_id=' + that.data.attr_id + '&group_id=' + mGroupId + '&color=' + home_shirt + '&home_shirt=' + home_shirt_id)
        break
      case 'fdt': //发动态
        toolUtils.pageTo("/page/pack-index/pages/evaluate/evaluate?group_id=" + mGroupId + '&type=' + 1 + '&is_leader=' + that.data.is_leader)
        break
      case 'cancel': //取消
        break
    }
    that.setData({
      release: false
    })
  },
  //button按钮的点击
  onBut: function (e) {
    var that = this;
    var mGroupId = that.data.group_id
    switch (e.target.id) {
      case "home": //首页
        wx.switchTab({
          url: '/page/tabBar/about-movement/about-movement'
        })
        break
      case "add_ss": //发布说说
        if (that.data.is_leader == 1 || that.data.is_admin == 1) {
          that.setData({
            release: true
          })
        } else {
          toolUtils.pageTo("/page/pack-index/pages/evaluate/evaluate?group_id=" + mGroupId + '&type=' + 1)
        }
        // if (that.data.attr_id == 2) {
        //   if (that.data.is_leader == 1 || that.data.is_admin == 1) {
        //     that.setData({
        //       release: true
        //     })
        //   } else {
        //     toolUtils.pageTo("/page/pack-index/pages/evaluate/evaluate?group_id=" + mGroupId + '&type=' + 1)
        //   }
        // } else {
        //   toolUtils.pageTo("/page/pack-index/pages/evaluate/evaluate?group_id=" + mGroupId + '&type=' + 1)
        // }
        break
      case "find": //运动圈
        wx.switchTab({
          url: '/page/tabBar/movement-circle/movement-circle'
        })
        break
      case "bjdw": //基本信息
        toolUtils.pageTo("/page/pack-find/yue-team-detail/yue-team-detail?group_id=" + mGroupId)
        break
      case "cygl": //成员管理
        toolUtils.pageTo(`/page/pack-index/pages/member-manage/member-manage?attr_id=${that.data.attr_id}&group_id=${mGroupId}&has_message=${that.data.has_message}&is_admin=${that.data.is_admin}`)
        break
      case "fbgg": //发布公告
        that.setData({
          announce: false
        })
        // toolUtils.pageTo('/page/pack-index/pages/announcements/announcements?group_id=' + mGroupId)
        break
      case "wlxc": //邀请管理
        // app.userInfo(function (userInfo) {
        //   app.data.user_nickname = userInfo.user_nickname
        //   toolUtils.pageTo('/page/pack-index/pages/wl-drumbeating/wl-drumbeating?id=' + mGroupId)
        // })
        that.setData({
          materialsShow: false
        })
        break
      // case "team_manage": //队伍管理
      //   toolUtils.pageTo(`/page/pack-index/pages/team-manage/team-manage?attr_id=${that.data.attr_id}&group_id=${mGroupId}&group_name=${that.data.group_name}&has_message=${that.data.has_message}&group_sn=${this.data.group_sn}`)
      //   break
    }
  },
  //tab切换
  onTabs: function (e) {
    var ids
    var that = this;
    switch (e.currentTarget.id) {
      case 'tab1': //动态
        ids = 1;
        getRroupIndex(that, that.data.group_id);
        break
      case 'tab2': //队员
        ids = 2
        mCurrentPage1 = 1;
        mCurrentPage3 = 1;
        getGroupMemberList(that)
        getActiveList(that)
        break
      case 'tab3': //数据
        ids = 3
        mCurrentPage4 = 1
        getGroupJoinedActivity(that)
        getHotActivity(that)
        break
    }
    that.setData({
      tabids: ids
    })
  },
  /**
   * 约动滑动
   */
  bindchange: function (e) {
    var current = e.detail.current
    var that = this;
    if (current == 2 && that.data.movementListLength > 3) {
      if (!that.data.swiperMore) {
        that.setData({
          swiperMore: true
        })
      }
    } else {
      if (that.data.swiperMore) {
        that.setData({
          swiperMore: false
        })
      }
    }
  },

  //获取输入的公告内容
  bindinput: function (e) {
    this.data.noticeMent = e.detail.value;
  },

  // 取消或确认发布公告
  submitBtn: function (e) {
    var that = this;
    var title = e.currentTarget.dataset.title;
    switch (title) {
      case 'cancel':
        that.setData({
          announce: true
        })
        break;
      case 'sure':
        if (!that.data.noticeMent) {
          toolUtils.showToast("公告内容不能为空")
          return
        }
        var params = {
          'notice_content': that.data.noticeMent,
          'group_id': that.data.group_id
        }
        httpsUtils.announcement(params, function (res) {
          toolUtils.showToast("发布成功");
          setTimeout(function () {
            that.setData({
              announce: true
            })
            getRroupIndex(that, that.data.group_id)
          }, 2000)
        })
    }
  },
  //返回上一级
  backBefore() {
    isNew = false;
    wx.navigateBack({
      delta: 1
    });
    var pages = getCurrentPages();
    if (typeof pages[pages.length - 2].refreshData === 'function') {
      pages[pages.length - 2].refreshData()
    }
  },
  //关闭弹窗
  closePopUp() {
    isNew = false;
    this.setData({
      isShowModule: false
    })
  },
  //邀请好友
  inviteFrends() {
    var that = this;
    var group = {
      'group_name': that.data.group_name,
      'attr_id': that.data.attr_id,
      'group_id': that.data.group_id,
      'attr_value': that.data.attr_value
    }
    toolUtils.pageTo("/page/pack-index/pages/invite-friends/invite-friends?group=" + JSON.stringify(group))
    isNew = false;
  },
  /**
   * 更多约动
   */
  movementMore: function (e) {
    toolUtils.pageTo(`/page/pack-find/yue-more/yue-more?group_id=${this.data.group_id}`)
  },
  //预览图片
  lookImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.i // 需要预览的图片http链接列表
    })
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
  //跳转到约动详情
  navigatorIndex: function (e) {
    var _index = e.currentTarget.dataset.index;
    var item = this.data.movementList[_index]
    toolUtils.pageTo(`/page/pack-find/yue-sport/yue-sport?soccer_movement_id=${item.soccer_movement_id}`, 1)
  },
  /**
   * 动态列表点赞
   */
  onStar: function (e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    putStar(item, index, this)
  },
  /**
   * 刷新动态
   */
  refreshStar: function (index) {
    var that = this;
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
//获取队伍主页
function getRroupIndex(that, group_id) {
  var params = {
    'group_id': group_id,
    'scene': 2
  }
  httpsUtils.groupIndex(params, function (res) {
    var feedList = res.feed_list
    if (res.group_soccer) {
      var movementList = [] //队伍约动
      var movement_list = res.group_soccer.movement_list || []
      for (var i = 0; i < movement_list.length; i++) {
        if (i == 3) {
          break
        }
        movementList.push(movement_list[i])
      }
      that.setData({
        movementList: movementList,
        swiperMore: movement_list.length > 3,
      })
    }
    if (res.attr_id == 2 || res.attr_id == 3) {
      that.setData({
        home_shirt: res.home_shirt,
        home_shirt_id: res.home_shirt_id
      })
    }
    that.setData({
      group_id: res.group_id,
      group_name: res.group_name,
      group_pic: res.group_pic || '',
      attr_id: res.attr_id,
      group_badge: res.group_badge,
      member_num: res.member_num,
      atten_num: res.atten_num,
      group_desc: res.group_desc,
      member_state: res.member_state,
      is_atten: res.is_atten,
      is_admin: res.is_admin,
      is_leader: res.is_leader,
      notice: res.notice,
      attr_value: res.attr_value,
      isload: true,
      feedList: feedList,
      has_message: res.has_message,
      isNoGroup: true,
      group_sn: res.group_sn,
      visit_num: res.visit_num,
    })
    app.data.group_name = res.group_name
    //动态
    mCurrentPage = 1
    if (feedList.length >= 10) {
      mTotalNum = 11
    } else {
      mTotalNum = feedList.length
    }
    if (isNew) {
      that.setData({
        isShowModule: true
      })
      // wx.showModal({
      //   title: '恭喜您拥有一支崭新的队伍',
      //   content: '去邀请队员加入队伍吧',
      //   cancelText: '返回上一级',
      //   confirmText: '邀请好友',
      //   success: function (res2) {
      //     if (res2.confirm) {
      //       var group = {
      //         'group_name': res.group_name,
      //         'attr_id': res.attr_id,
      //         'group_id': mGroupId,
      //         'attr_value': res.attr_value
      //       }
      //       toolUtils.pageTo("/page/pack-index/pages/invite-friends/invite-friends?group=" + JSON.stringify(group))
      //       isNew = false
      //     } else if (res2.cancel) {
      //       isNew = false;
      //       toolUtils.pageTo("/page/tabBar/index/index")
      //     }
      //   }
      // })
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

//关注队伍
function followTeam(that) {
  var params = {}
  params.group_id = that.data.group_id
  httpsUtils.followTeam(params, function (res) {
    if (that.data.is_atten == 1) {
      toolUtils.showToast("已取消关注")
    } else {
      toolUtils.showToast("关注成功")
    }
    that.setData({
      is_atten: that.data.is_atten == 1 ? 2 : 1
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}

/**
 * 约动列表  我的队伍动态
 */
function feedList(that) {
  var params = {
    'current_page': mCurrentPage,
    'page_size': mPageSize,
    'group_id': that.data.group_id,
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
function putStar(item, index, that) {
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

//获取队员列表
function getGroupMemberList(that) {
  var params = {
    'current_page': mCurrentPage1,
    'page_size': mPageSize1,
    'group_id': that.data.group_id
  }
  httpsUtils.groupMember(params, function (res) {
    that.setData({
      movement: res.movement || {},
      groupCount: res.statistics
    })
    mTotalNum1 = res.total_num
    var list = that.data.groupMemberList
    if (mCurrentPage1 == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length < mTotalNum1) {
      that.setData({
        groupMemberList: list,
        'peopleState': true
      })
    } else {
      that.setData({
        groupMemberList: list,
        'peopleState': false
      })
    }
    wx.stopPullDownRefresh()
  }, function (e) {
    if (mCurrentPage1 > 1) {
      --mCurrentPage1
    }
    that.setData({
      'peopleState': false
    })
  })
}
//获取数据的排行榜
// function soccerRank() {
//   var params = {
//     'current_page': mCurrentPage2,
//     'page_size': mPageSize2,
//     'group_id': mGroupId,
//     'order': that.data.orderArray[that.data.orderIndex].id
//   }
//   httpsUtils.soccerRank(params, function (res) {
//     mTotalNum2 = res.total_num
//     var list = that.data.rank_list
//     if (mCurrentPage2 == 1) {
//       list = []
//     }
//     list = list.concat(res.list)
//     if (list.length == mTotalNum2) {
//       that.setData({
//         rank_list: list,
//         isShow: true,
//         loadData2: {
//           searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
//           searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
//         }
//       })
//     } else {
//       that.setData({
//         rank_list: list,
//         loadData2: {
//           searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
//           searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
//         }
//       })
//     }
//     wx.stopPullDownRefresh()
//   }, function (e) {
//     if (mCurrentPage2 > 1) {
//       --mCurrentPage2
//     }
//     that.setData({
//       loadData2: {
//         searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
//         searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
//       }
//     })
//     wx.stopPullDownRefresh()
//   })
// }

//队伍参与活动
function getGroupJoinedActivity(that) {
  var params = {};
  params.group_id = that.data.group_id;
  params.current_page = mCurrentPage4;
  params.page_size = mPageSize4
  httpsUtils.groupJoinedActivity(params, function (res) {
    mTotalNum4 = res.total_num
    var list = that.data.alreadyActive
    if (mCurrentPage4 == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length == mTotalNum4) {
      that.setData({
        alreadyActive: list,
        'alreadyActiveState': false
      })
    } else {
      that.setData({
        alreadyActive: list,
        'alreadyActiveState': true
      })
    }
  }, function (e) {
    if (mCurrentPage4 > 1) {
      --mCurrentPage4
    }
    that.setData({
      'alreadyActiveState': false
    })

  })
}
//队伍热门活动
function getHotActivity(that) {
  var params = {};
  params.group_id = that.data.group_id;
  // params.current_page = mCurrentPage5;
  // params.page_size = mPageSize5
  httpsUtils.hotActivity(params, function (res) {
    that.setData({
      hotActive: res.list
    })
    // mTotalNum5 = res.total_num
    // var list = that.data.hotActive
    // if (mCurrentPage5 == 1) {
    //   list = []
    // }
    // list = list.concat(res.list)
    // if (list.length == mTotalNum5) {
    //   that.setData({
    //     hotActive: list,
    //     'hotActiveState': false
    //   })
    // } else {
    //   that.setData({
    //     hotActive: list,
    //     'hotActiveState': true
    //   })
    // }
  }, function (e) {
    // if (mCurrentPage5 > 1) {
    //   --mCurrentPage5
    // }
    // that.setData({
    //   'hotActiveState': false
    // })

  })
}
//活跃榜
function getActiveList(that) {
  var params = {};
  params.group_id = that.data.group_id;
  params.current_page = mCurrentPage3
  params.page_size = mPageSize3
  httpsUtils.activeList(params, function (res) {
    mTotalNum3 = res.total_num
    var list = that.data.activeList
    if (mCurrentPage3 == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length == mTotalNum3) {
      that.setData({
        activeList: list,
        'activeListState': false
      })
    } else {
      that.setData({
        activeList: list,
        'activeListState': true
      })
    }
  }, function (e) {
    if (mCurrentPage3 > 1) {
      --mCurrentPage3
    }
    that.setData({
      'activeListState': false
    })
  })
}