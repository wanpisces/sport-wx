// page/pack-find/yue-more/yue-more.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require('../../../utils/https-utils.js')
var that
var mPageSize = 5 //每页条数
var mTotalNum //总条数
var mCurrentPage = 1

function getData() {
  var params = {}
  params.current_page = mCurrentPage
  params.page_size = mPageSize;
  params.group_id = that.data.group_id;
  params.movement_state = that.data.movement_state;
  // if (that.data.current != 1) {
  //   params.movement_state = that.data.current - 1
  // }
  httpsUtils.movementList(params, function (res) {
    mTotalNum = res.total_num
    var list = that.data.dataList || []
    if (mCurrentPage == 1) {
      list = []
    }
    list = list.concat(res.list)
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
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2,
    current: "",
    movement_state: "",
    currentData: [{
      id: '',
      name: '全部'
    },
    {
      id: 1,
      name: '等待应约'
    },
    {
      id: 2,
      name: '约战成功'
    },
    {
      id: 3,
      name: '约战完结'
    },
    {
      id: 6,
      name: '约战进行时'
    }
    ],
    // dataList: [],
    loadData: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无数据'
    }
  },
  // 找约动
  findYdEvt: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          group_id: options.group_id
        })
        getData();
      }
    })

  },
  // tab切换
  bindTabChange(e) {
    that.setData({
      movement_state: e.currentTarget.dataset.id,
      current: e.currentTarget.dataset.id
    })
    delete that.data["dataList"];
    mCurrentPage = 1
    getData();
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
    mCurrentPage = 1,
      that.setData({
        dataList: []
      })
    getData();
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
      console.log(that.data.loadData)
      getData()
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
  onShareAppMessage: function () {

  }
})