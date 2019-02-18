// page/pack-find/yue-move-search/yue-move-search.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
var areaInfo;
var mTotalNum //总条数
var attrObj
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    bgUrl1: getApp().data.bgUrl1,
    typeIndex: 0,
    filterIndex: 0,
    filterText: '筛选',
    typesOf: '类型',
    filterArray: [{
      id: 2,
      name: '活跃度最高'
    }, {
      id: 1,
      name: '队员数最多'
    }],
    areaIndex: [0, 0, 0],
    areaList: [[], [], []],
    search: {
      keywords: '',
      current_page: 1,
      page_size: 10
    },
    loadData: {
      isFinish: false,
      isMore: true
    },
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无数据'
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
    // this.bindFight();
    try {
      var value = wx.getStorageSync('attrList')
      if (value) {
        // Do something with return value
        attrObj = value
        var typeArray = [[], []]
        typeArray[0] = value['0']
        typeArray[1] = value[typeArray[0].id] || []
        console.log(typeArray)
        that.setData({
          typeArray: typeArray
        })
      } else {
        gettypeArrayList()
      }
    } catch (e) {
      gettypeArrayList()
      // Do something when catch error
    }
    getApp().getAreaData(function (data) {
      areaInfo = JSON.parse(JSON.stringify(data));
      var areaList = toolUtils.areaPickerData2(data, [[], [], []], 0, 0)
      that.setData({
        areaList: areaList
      })
    })
    // that.getData();
  },
  //关注
  followTeam: function (e) {
    var followid = e.currentTarget.dataset.followid;
    var args = {
      group_id: e.currentTarget.dataset.follow
    }
    httpsUtils.followTeam(args, function (res) {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
      })
      var dataList = that.data.dataList;
      if (followid == 1) {
        dataList[e.currentTarget.dataset.index].is_follow = 2;
      } else if (followid == 2) {
        dataList[e.currentTarget.dataset.index].is_follow = 1;
      }
      that.setData({
        dataList: dataList
      })
    })
  },
  // 取消关注
  cancelFollow: function (e) {
    var args = {
      group_id: e.currentTarget.dataset.follow
    }
    httpsUtils.cancelFollow(args, function (res) {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
      })
      var dataList = that.data.dataList;
      dataList[e.currentTarget.dataset.index].is_follow = 1;
      that.setData({
        dataList: dataList
      })
    })
  },
  // 搜索数据
  search(e) {
    let search = that.data.search;
    search.q = e.detail.value
    search.current_page = 1;
    search.page_size = 10
    that.setData({
      search: search
    })
    that.getData()
  },
  cancleBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  getData: function (msg) {
    var search = that.data.search;
    httpsUtils.findMovement(search, function (res) {
      var list = that.data.dataList || []
      if (search.current_page == 1) {
        list = []
      }
      if (res.list.length > 0) {
        if (Math.ceil(res.total_num / res.page_size) == 1) {
          var loadData = {
            isFinish: true,
            isMore: false
          }
        } else {
          var loadData = {
            isFinish: false,
            isMore: true
          }
        }
        that.setData({
          dataList: list.concat(res.list),
          current_page: res.current_page,
          loadData: loadData
        })
      } else {
        var loadData = {
          isFinish: true,
          isMore: false
        }
        that.setData({
          dataList: list,
          loadData: loadData
        })
      }
      wx.stopPullDownRefresh();
    
    }, function (e) {
  
    }, '搜索中...')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * 发约动没队伍时去首页创建
   */
  onTeam: function (e) {
    wx.showModal({
      title: '温馨提示',
      content: '您暂无自己组建的该类型队伍，快去创建一个吧',
      success: function (res) {
        if (res.confirm) {
          toolUtils.pageTo('/page/tabBar/index/index', 3)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 我的队伍
  bindFight(e) {
    httpsUtils.myGroup({ current_page: 1, page_size: 1000, attr_id: 2, is_leader: 1 }, function (res) {
      console.log('res', res)
      if (res.list.length != 0) {
        that.setData({
          show: true,
          chooseData: res.list
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '您暂无自己组建的该类型队伍，快去创建一个吧',
          success: function (res) {
            if (res.confirm) {
              toolUtils.pageTo('/page/tabBar/index/index', 3)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      }
    }, function (e) {

    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var search = that.data.search;
    search.current_page = 1;
    that.setData({
      search: search
    })
    that.getData('加载中...');
  },
  // search() {
  //   toolUtils.pageTo('/page/pack-find/find-team-search/find-team-search')
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var loadData = that.data.loadData;
    if (loadData.isMore) {
      var search = that.data.search;
      search.current_page = search.current_page + 1;
      that.setData({
        search: search
      })
      that.getData();
    }
  },
  //pick-view选择器某一列的值改变时触发 
  bindMultiPickerColumnChange: function (e) {
    var value = e.detail.value
    var column = e.detail.column
    if (column == 0) {
      this.setData({
        ['typeArray[' + 1 + ']']: attrObj[this.data.typeArray[0][value].id] || []
      })
    }
  },
  bindMultiPickerChange: function (e) {
    var value = e.detail.value
    var list = this.data.typeArray[1]
    var attr_id
    var typesOf
    if (list.length == 0) {
      attr_id = this.data.typeArray[0][value[0] || 0].id
      typesOf = this.data.typeArray[0][value[0] || 0].name
    } else {
      attr_id = this.data.typeArray[1][value[1] || 0].id
      typesOf = this.data.typeArray[1][value[1] || 0].name
    }
    var search = that.data.search;
    search.attr_id = attr_id
    search.current_page = 1;
    that.setData({
      search: search,
      typesOf: typesOf
    })
    that.getData('加载中...')
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})

/**
 * 获取队伍分类
 */
function gettypeArrayList() {
  httpsUtils.attr(6, function (res) {
    attrObj = res
    var typeArray = [[], []]
    typeArray[0] = res['0']
    typeArray[1] = res[typeArray[0].id] || []
    that.setData({
      typeArray: typeArray
    })
  }, function (e) {

  })
}