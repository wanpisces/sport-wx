// page/pack-mine/mine-create/mine-create.js
var httpsUtils = require('../../../utils/https-utils.js')
var toolUtils = require("../../../utils/tool-utils.js")
var startX, endX, startY, endY;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 创建队伍
    loadData: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
    createTeam: [],
    joinTeam: [],
    create_team: {
      current_page: 1,
      page_size: 6,
      total_num: 0
    },
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无我创建的队伍'
    },
    // 加入队伍
    empty1: {
      icon: '/pic/no-content.png',
      txt: '暂无我加入的队伍'
    },
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2,
    user: {},
    detail_tab: {
      currentTab: 0,
      isShow: true
    },
    hotSearchList: [], //活跃推荐
    isLoading: true,
  },

  //tab切换事件
  tabNav: function (e) {
    if (this.data.detail_tab.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var showMode = e.target.dataset.current == 2;
      this.data.detail_tab.currentTab = e.target.dataset.current;
      this.data.detail_tab.isShow = showMode;
      this.setData({
        detail_tab: this.data.detail_tab
      })
    }
  },
  // 滑动开始事件
  touchStart: function (e) {
    startX = e.touches[0].pageX; // 获取触摸时的原点(x轴)
    startY = e.touches[0].pageY; // 获取触摸时的原点(y轴)
  },
  //滑动事件
  touchMove: function (e) {
    var _index = e.currentTarget.dataset.index;
    var currectX = e.changedTouches[0].pageX;
    var currectY = e.changedTouches[0].pageY;
    var angX = currectX - startX;
    var angY = currectY - startY;
    var angle = Math.atan2(angY, angX) * 180 / Math.PI
    var team;
    var teamName;
    if (this.data.detail_tab.currentTab == 0) {
      team = this.data.createTeam
      teamName = 'createTeam'
    } else {
      team = this.data.joinTeam;
      teamName = 'joinTeam'
    }
    var moveLeft = team[_index].moveLeft;
    if (angX < -20 && (angle <= -170 || angle > 170)) {
      //向左滑动
      if (moveLeft <= 0 && moveLeft >= -176) {
        // team[_index].moveLeft -= 20
        team[_index].moveLeft = -176
        this.setData({
          [teamName]: team
        })
      }
    } else if (angX > 20 && angle <= 20) {
      //向右滑动
      if (moveLeft >= -180 && moveLeft < 0) {
        // team[_index].moveLeft += 20
        team[_index].moveLeft = 0
        this.setData({
          [teamName]: team
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var pages = getCurrentPages()
    getApp().userInfo(function (userInfo) {
      if (!userInfo) {
        that.getUserInfoEvt()
      } else {
        that.setData({
          user: userInfo,
          isUserInfo: userInfo.user_avatar && userInfo.user_nickname && true || false,
          isPhone: userInfo.user_phone && true || false,
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          user: that.data.user,
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight
        })
      }
    })
    if (options.currentTab) {
      that.data.detail_tab.currentTab = options.currentTab;
      that.setData({
        detail_tab: that.data.detail_tab
      })
    }
    wx.getStorage({
      key: 'attrList',
      success: function (res) {
        var attrObj = JSON.parse(JSON.stringify(res.data));
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
    that.getCreatTeamData()
    that.getJoinTeamData()
    that.hotSearch()
    that.getMoreTeam();
  },
  //刷新
  refreshData() {
    this.data.create_team.current_page = 1;
    this.setData({
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      create_team: this.data.create_team
    })
    this.getCreatTeamData();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onButShare: function (e) {
    that.setData({
      isColoseShare: !that.data.isColoseShare
    })
  },
  // 立即寻找队伍
  onNewTeam: function (e) {
    toolUtils.pageTo("/page/pack-find/find-team/find-team")
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 返回首页
   */
  goHome: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },
  bindMultiPickerChange: function (e) {
    var value = e.detail.value
    var attr_id = this.data.attrList[0][value || 0].id
    if (attr_id == 2 || attr_id == 3) {
      toolUtils.pageTo("/page/pack-index/pages/organize-team/organize-team?attr_id=" + attr_id)

    } else {
      toolUtils.pageTo("/page/pack-index/pages/currency-organize-team/organize-team?attr_id=" + attr_id)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      var _index = res.target.dataset.index;
      var teamName;
      var team;
      if (that.data.detail_tab.currentTab == 0) {
        teamName = 'createTeam'
        team = that.data.createTeam
      } else {
        teamName = 'joinTeam'
        team = that.data.joinTeam
      }
      var url = `/page/pack-index/pages/team-page/team-page?share=1&group_id= ${team[_index].group_id}`
      return {
        title: `${that.data.user.user_nickname}邀请你参加一个很棒的${team[_index].attr_value}队伍`,
        path: url,
        imageUrl: team[_index].group_badge,
        success: (res) => {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              team[_index].moveLeft = 0;
              that.setData({
                [teamName]: team
              })
            }
          })
        },
        fail: (res) => { }
      }
    } else {
      return {
        title: that.data.detail_tab.currentTab == 0 ? `${that.data.user.user_nickname}创建的队伍` : `${that.data.user.user_nickname}加入的队伍`,
        path: `/page/pack-mine/mine-team/mine-team?currentTab=${that.data.detail_tab.currentTab}`,
      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var create_team = that.data.create_team;
    if (create_team.total_num > create_team.page_size * create_team.current_page) {
      ++create_team.current_page
      that.setData({
        create_team: create_team,
        loadData: {
          searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
      that.getCreatTeamData()
    } else {
      that.setData({
        create_team: create_team,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
  },
  // 获取个人资料
  getUserInfoEvt: function () {
    var that = this;
    httpsUtils.getUserInfo({}, function (res) {
      that.setData({
        user: res,
        isUserInfo: userInfo.user_avatar && userInfo.user_nickname && true || false,
        isPhone: userInfo.user_phone && true || false
      })
    }, function (e) { })
  },
  // 查看更多（队伍广场）
  checkMoreTeam: function () {
    toolUtils.pageTo('/page/pack-find/find-team/find-team', 1)
  },
  //我加入的队伍查看更多
  checkMoreMyTeam: function () {
    toolUtils.pageTo('/page/pack-mine/join-team/join-team', 1)
  },
  //创建队伍
  getCreatTeamData: function (msg) {
    var that = this;
    var create_team = that.data.create_team;
    var params = {}
    params.current_page = create_team.current_page
    params.page_size = create_team.page_size
    httpsUtils.myGroup2(params, function (res) {
      create_team.total_num = res.total_num
      var list = that.data.createTeam
      if (create_team.current_page == 1) {
        list = []
      }
      list = list.concat(res.list)
      list.forEach(msg => {
        msg.moveLeft = 0;
      })
      if (list.length == create_team.total_num) {
        that.setData({
          createTeam: list,
          create_team: create_team,
          loadData: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
          }
        })
      } else {
        that.setData({
          createTeam: list,
          create_team: create_team,
          loadData: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
          }
        })
      }
      wx.stopPullDownRefresh()
    }, function (e) {
      if (create_team.current_page > 1) {
        --create_team.current_page
      }
      that.setData({
        create_team: create_team,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
      wx.stopPullDownRefresh()
    }, msg)
  },
  //加入的队伍
  getJoinTeamData: function (msg) {
    var that = this;
    var params = {}
    params.current_page = 1
    params.page_size = 3
    httpsUtils.myJoinGroup(params, function (res) {
      var list = res.list;
      list.forEach(msg => {
        msg.moveLeft = 0;
      })
      that.setData({
        joinTeam: list
      })
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    }, msg)
  },
  // 热搜推荐
  hotSearch: function () {
    var that = this;
    var params = {}
    params.current_page = 1
    params.page_size = 3
    httpsUtils.recommendGroup(params, function (res) {
      that.setData({
        hotSearchList: res.list
      })
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  // 队伍广场
  getMoreTeam: function (msg) {
    var that = this;
    httpsUtils.findTeam({
      current_page: 1,
      page_size: 3
    }, function (res) {
      that.setData({
        moreTeam: res.list
      })
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    }, msg)
  },
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