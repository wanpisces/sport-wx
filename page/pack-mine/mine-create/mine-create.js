// page/pack-mine/mine-create/mine-create.js
var httpsUtils = require('../../../utils/https-utils.js')
var toolUtils = require("../../../utils/tool-utils.js")
var that
var mPageSize = 10 //每页条数
var mTotalNum //总条数
var mCurrentPage = 1
var uid
var item

//加入队伍
var page_size = 10 //每页条数
var total_num //总条数
var current_page = 1

//创建队伍
function getCreatTeamData(msg) {
  var params = {}
  params.current_page = mCurrentPage
  params.page_size = mPageSize
  if (uid) {
    params.uid = uid
  }
  httpsUtils.myGroup2(params, function (res) {
    mTotalNum = res.total_num
    var list = that.data.dataList
    if (mCurrentPage == 1) {
      list = []
    }
    list = list.concat(res.list)
    // list = []
    if (list.length == mTotalNum) {
      that.setData({
        dataList: list,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    } else {
      that.setData({
        dataList: list,
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

  }, msg)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ckId: -1,
    isColoseShare: true,
    isLoading: true,
    loadData: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2,
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无我创建的队伍'
    },
    user: {},
    detail_tab: {
      currentTab: 0,
      isShow: true
    },
    //加入队伍
    isLoading1: true,
    visitLoadData: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
    empty1: {
      icon: '/pic/no-content.png',
      txt: '暂无我加入的队伍'
    },
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    var pages = getCurrentPages()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          isLoading: true,
          isLoading1: true,
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight
        })
      }
    })
    uid = options.uid;
    if (uid) {
      that.setData({
        isLoading: true,
        isLoading1: true,
        user_avatar: options.user_avatar || '/pic/default_logo.png',
        user_name: options.user_name,
        isShare: options.isShare && options.isShare == 1 && true || false,
        empty: {
          icon: '/pic/no-content.png',
          txt: '暂无' + options.user_name + '加入的队伍'
        },
      })
    } else {
      that.setData({
        user: pages[pages.length - 2].data.user,
        user_avatar: pages[pages.length - 2].data.user.user_avatar || '/pic/default_logo.png',
        isShare: options.isShare && options.isShare == 1 && true || false
      })
    }
    getCreatTeamData()
    getJoinTeamData()
  },
  refreshData() {
    var mCurrentPage = 1;
    getCreatTeamData();
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

  onCkShare: function (e) {
    item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    that.setData({
      ckId: that.data.ckId == index ? -1 : index
    })
  },
  // onNewTeam: function (e) {
  //   wx.switchTab({
  //     url: '/page/tabBar/index/index'
  //   })
  // },
  onNewTeam: function (e) {
    toolUtils.pageTo("/page/pack-find/find-team/find-team")
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // try {
    //   var value = wx.getStorageSync('userInfo')
    //   if (value) {
    //     that.setData({
    //       user: value.data,
    //     })
    //   } else {
    //   }
    // } catch (e) {
    // }
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
   * 返回首页
   */
  goHome: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      that.setData({
        isColoseShare: true,
        ckId: -1
      })
      var url = '/page/pack-index/pages/team-page/team-page?share=1&group_id=' + item.group_id
      return {
        title: `${that.data.user.user_nickname}邀请你参加一个很棒的${item.attr_value}队伍`,
        path: url,
        imageUrl: item.group_badge,
        success: (res) => {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: (res) => {
          console.log("转发失败", res);
        }
      }
    } else {
      return {
        title: `我的队伍`,
        path: '/page/pack-mine/mine-create/mine-create?uid=' + uid,
      }
    }
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
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
      getCreatTeamData()
    } else {
      that.setData({
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
    //加入的队伍
    if (total_num > page_size * current_page) {
      ++current_page
      that.setData({
        visitLoadData: {
          searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
      getJoinTeamData()
    } else {
      that.setData({
        visitLoadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
  },

})
//加入的队伍
function getJoinTeamData(msg) {
  var params = {}
  params.current_page = current_page
  params.page_size = page_size
  if (uid) {
    params.uid = uid
  }
  httpsUtils.myJoinGroup(params, function (res) {
    total_num = res.total_num
    var list = that.data.joinTeam
    if (current_page == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length == total_num) {
      that.setData({
        joinTeam: list,
        visitLoadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    } else {
      that.setData({
        joinTeam: list,
        visitLoadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
    wx.stopPullDownRefresh()

  }, function (e) {
    if (current_page > 1) {
      --current_page
    }
    that.setData({
      visitLoadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.stopPullDownRefresh()
  }, msg)
}