// page/pack-mine/mine-yue/mine-yue.js
var httpsUtils = require('../../../utils/https-utils.js')
var toolUtils = require("../../../utils/tool-utils.js")
var that
var attrObj;
var item;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ckId: -1,
    isColoseShare: true,
    isPicker: true,
    filterText: '筛选',
    typesOf: '类型',
    filterArray: [{
      id: '',
      name: '全部'
    }, {
      id: 1,
      name: '等待应约'
    }, {
      id: 2,
      name: '约战成功'
    }, {
      id: 3,
      name: '约战完结'
    }, {
      id: 4,
      name: '正常取消'
    }, {
      id: 5,
      name: '违约取消'
    }, {
      id: 6,
      name: '约战进行中'
    }],
    isLoading: true,
    loadData: {
      isFinish: false,
      isMore: true
    },
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2,
    user: {},
    search: {
      attr_id: '',
      movement_state: '',
      page_size: 5,
      current_page: 1,
      total_num: 0
    },
    dataList1: [],
    user_avatar: '',
    user: null,
    detail_tab: {
      currentTab: 0,
      isShow: true
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    var pages = getCurrentPages();
    that.setData({
      user: pages[pages.length - 2].data.user,
      user_avatar: pages[pages.length - 2].data.user.user_avatar || '/pic/default_logo.png'
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          isLoading: true,
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight
        })
      }
    })
    //约战类型
    wx.getStorage({
      key: 'attrList',
      success: function(res) {
        attrObj = JSON.parse(JSON.stringify(res.data));
        attrObj[0].unshift({
          id: '',
          name: '全部'
        })
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
      fail: function(e) {
        getAttrList(that, "")
      }
    })
    getMyOrganization();
  },
  freshData(){
    that.setData({
      search: {
        attr_id: '',
        movement_state: '',
        page_size: 5,
        current_page: 1,
        total_num: 0
      },
      dataList1: [],
      dataList: [],
      loadData: {
        isFinish: false,
        isMore: true
      }
    })
    getMyOrganization();
  },
  onButShare: function(e) {
    that.setData({
      isColoseShare: !that.data.isColoseShare
    })
  },
  onCkShare: function(e) {
    console.log(e)
    item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    that.setData({
      ckId: that.data.ckId == index ? -1 : index
    })
  },
  //tab切换事件
  tabNav: function(e) {
    if (this.data.detail_tab.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var showMode = e.target.dataset.current == 2;
      this.data.detail_tab.currentTab = e.target.dataset.current;
      this.data.detail_tab.isShow = showMode;
      var search = that.data.search;
      search.current_page = 1;
      search.attr_id = "";
      search.movement_state = "";
      this.setData({
        detail_tab: this.data.detail_tab,
        search: search,
        typesOf: '类型',
        filterText: '筛选',
        // isLoading: true,
        loadData: {
          isFinish: false,
          isMore: true
        },
      })
      if (e.target.dataset.current == 0) {
        getMyOrganization();
      } else {
        getData();
      }
    }
  },
  //选择队伍类型
  bindTypePickerChange: function(e) {
    var index = e.detail.value;
    var item = this.data.attrList[0];
    that.data.search.attr_id = item[index].id;
    this.setData({
      typesOf: item[index].name,
      search: that.data.search
    })
    getData('加载中...');
  },
  //筛选
  bindFilterChange: function(e) {
    var that = this;
    var item = that.data.filterArray[e.detail.value];
    that.data.search.movement_state = item.id;
    that.setData({
      filterText: item.name,
      search: that.data.search
    })
    getData('加载中...');
  },
  // 找约战
  findYdEvt: function() {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    // console.log(res)
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    // if (that.data.isShare && uid) {
    //   return {
    //     title: that.data.user_name + '创建的队伍',
    //     path: `/page/pack-mine/mine-create/mine-create?isShare=1&uid=${uid}&user_avatar=${that.data.user_avatar}&user_name=${that.data.user_name}`
    //   }

    // } else {
    //   var userInfo = that.data.user
    //   return {
    //     title: userInfo.user_nickname + '创建的队伍',
    //     path: `/page/pack-mine/mine-create/mine-create?isShare=1&uid=${userInfo.user_id}&user_avatar=${userInfo.user_avatar}&user_name=${userInfo.user_nickname}`
    //   }

    // }
    that.setData({
      isColoseShare: true,
      ckId: -1
    })
    var url = '/page/pack-organizer/yd-detail/yd-detail?movement_id=' + item.movement_id
    // if (item.attr_id == 2 || item.attr_id == "2") {
    //   url = '/page/pack-index/pages/team-page/team-page?share=1&group_id=' + item.group_id
    // } else {
    //   url = '/page/pack-index/pages/currency-team-page/team-page?share=1&group_id=' + item.group_id
    // }
    var imageUrl = "";
    if (item.attr_id == 2) {
      imageUrl = "https://img.sport.darongshutech.com/image_201810251736568193.png"
    } else if (item.attr_id == 3) {
      imageUrl = "https://img.sport.darongshutech.com/image_201810251735466355.png"
    } else {
      imageUrl = "https://img.sport.darongshutech.com/image_201810251737248924.png"
    }
    return {
      title: `${that.data.user.user_nickname}邀请你参加${item.movement_name}约战`,
      path: url,
      imageUrl: imageUrl,
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (that.data.search.total_num > that.data.search.page_size * that.data.search.current_page) {
      ++that.data.search.current_page
      that.setData({
        loadData: {
          isFinish: false,
          isMore: true
        },
        search: that.data.search
      })
      if (that.data.detail_tab.currentTab == 0) {
        getMyOrganization();
      } else {
        getData();
      }

    } else {
      that.setData({
        loadData: {
          isFinish: true,
          isMore: false
        },
        search: that.data.search
      })
    }
  }
})

//我的组织者约战
function getMyOrganization(msg) {
  var params = {
    current_page: that.data.search.current_page,
    page_size: that.data.search.page_size,
  }
  httpsUtils.myOrganization(params, function(res) {
    that.data.search.total_num = res.total_num
    var list = that.data.dataList1
    if (that.data.search.current_page == 1) {
      list = [];
    }
    if (res.current_page == 1 && res.list.length == 0) {
      var detail_tab = that.data.detail_tab;
      detail_tab.currentTab = 1;
      that.setData({
        detail_tab: detail_tab
      })
      getData();
    } else {
      list = list.concat(res.list)
      if (list.length == that.data.search.total_num) {
        that.setData({
          dataList1: list,
          search: that.data.search,
          loadData: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
          }
        })
      } else {
        that.setData({
          dataList1: list,
          search: that.data.search,
          loadData: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
          }
        })
      }
    }

    wx.stopPullDownRefresh()

  }, function(e) {
    if (that.data.search.current_page > 1) {
      --that.data.search.current_page
    }
    that.setData({
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      search: that.data.search
    })
    wx.stopPullDownRefresh()
  }, msg)
}

function getData(msg) {
  var params = {}
  params.current_page = that.data.search.current_page
  params.page_size = that.data.search.page_size
  params.attr_id = that.data.search.attr_id
  params.movement_state = that.data.search.movement_state
  httpsUtils.myMovement(params, function(res) {
    that.data.search.total_num = res.total_num
    var list = that.data.dataList
    if (that.data.search.current_page == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length == that.data.search.total_num) {
      that.setData({
        dataList: list,
        search: that.data.search,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    } else {
      that.setData({
        dataList: list,
        search: that.data.search,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
    wx.stopPullDownRefresh()

  }, function(e) {
    if (that.data.search.current_page > 1) {
      --that.data.search.current_page
    }
    that.setData({
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      search: that.data.search
    })
    wx.stopPullDownRefresh()
  }, msg)
}
/**
 * 获取队伍分类
 */
function getAttrList(that, msg) {
  httpsUtils.attr(6, function(res) {
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
  }, function(e) {

  }, msg)
}