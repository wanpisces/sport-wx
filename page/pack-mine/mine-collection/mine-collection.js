// page/pack-mine/mine-collection/mine-collection.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkLabelIndex: 0,
    swiperCurrent: 0,
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无数据'
    },
    labelList: [{
      value: '赛事',
      current_page: 1,
      page_size: 10,
      total_num: 0,
      branch_type: 5,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }, {
      value: '资讯',
      current_page: 1,
      page_size: 10,
      branch_type: 6,
      total_num: 0,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          swiperHeight: res.windowHeight - res.statusBarHeight - 90
        })
      }
    })
    getData(that)
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  //赛事长按
  bindItemLongClick: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否取消收藏？',
      success: function (res) {
        if (res.confirm) {
          putFavorite(that, 5, that.data.labelList[0].list[index].competition_id, index)
        }
      }
    })
  },
  //赛事点击
  bindItemClick: function (e) {
    // if (this.endTime - this.startTime < 350) {
    var that = this,
      index = e.currentTarget.dataset.index,
      item = that.data.labelList[0].list[index];
    console.log(item)
    switch (item.competition_status) {
      case 1: //报名阶段
      case 4: //计划中 
      case 5: //抽签阶段
        toolUtils.pageTo(`/page/pack-match/pages/sport-detail/sport-detail?competition_id=${item.competition_id}`)
        break
      case 2: //进行中
        toolUtils.pageTo(`/page/pack-match/pages/sport-underway/sport-underway?competition_id=${item.competition_id}`)
        // toolUtils.pageTo('/page/pack-match/pages/sport-underway/sport-underway?competition_id=' + item.competition_id)
        break
      case 3: //已结束
        toolUtils.pageTo(`/page/pack-match/pages/sport-summary/sport-summary?competition_id=${item.competition_id}`)
        break
    }
    // }
  },

  //资讯长按
  onLongItem: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      material_id = e.currentTarget.dataset.material_id;
    wx.showModal({
      title: '提示',
      content: '是否取消收藏？',
      success: function (res) {
        if (res.confirm) {
          putFavorite(that, 6, material_id, index)
        }
      }
    })
  },
  //资讯点击
  onItem: function (e) {
    if (this.endTime - this.startTime < 350) {
      var index = e.currentTarget.dataset.index,
        material_id = e.currentTarget.dataset.material_id;
      toolUtils.pageTo(`/page/pages/new-detail/new-detail?news_id=${material_id}`)

    }
  },

  /**
   * 上拉加载
   */
  bindscrolltolower: function () {
    var checkLabelIndex = this.data.checkLabelIndex,
      labelItem = this.data.labelList[checkLabelIndex];
    if (labelItem.total_num > labelItem.page_size * labelItem.current_page) {
      ++labelItem.current_page
      this.setData({
        [`labelList[${checkLabelIndex}].loadData`]: {
          searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
      getData(this)
    } else {
      this.setData({
        [`labelList[${checkLabelIndex}].loadData`]: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
  },
  //点击切换
  bindLabelClick: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    that.setData({
      swiperCurrent: index,
      checkLabelIndex: index
    })
  },
  /**
   * 滚动监听
   */
  bindSwiperChange: function (e) {
    var that = this,
      current = e.detail.current,
      labelItem = this.data.labelList[current];
    that.setData({
      checkLabelIndex: current,
      current_page: 1,
      page_size: 10,
      total_num: 0,
      list: [],
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    if (labelItem.list.length == 0) {
      getData(that)
    }
  },
})

function getData(that) {
  var checkLabelIndex = that.data.checkLabelIndex,
    labelItem = that.data.labelList[checkLabelIndex],
    params = {
      'current_page': labelItem.current_page,
      'page_size': labelItem.page_size,
      'branch_type': labelItem.branch_type
    };
  httpsUtils.myCollect(params, function (res) {
    labelItem.total_num = res.total_num
    if (res.current_page == 1) {
      labelItem.list = []
    }
    labelItem.list = labelItem.list.concat(res.list)
    if (labelItem.list.length == res.total_num) {
      labelItem.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        [`labelList[${checkLabelIndex}]`]: labelItem
      })
    } else {
      labelItem.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        [`labelList[${checkLabelIndex}]`]: labelItem
      })
    }
    wx.stopPullDownRefresh()
  }, function (e) {
    if (labelItem.current_page > 1) {
      --labelItem.current_page
    }
    that.setData({
      [`labelList[${checkLabelIndex}].loadData`]: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.stopPullDownRefresh()
  })
}

//收藏
function putFavorite(that, branch_type, id, index) {
  var params = {},
    labelItem = that.data.labelList[that.data.checkLabelIndex];
  params.branch_type = branch_type
  params.branch_id = id
  httpsUtils.putFavorite(params, function (res) {
    labelItem.list.splice(index, 1)
    labelItem.total_num--
    that.setData({
      [`labelList[${that.data.checkLabelIndex}]`]: labelItem
    })
  }, function (e) {


  })
}