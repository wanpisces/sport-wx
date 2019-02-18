// page/pack-mine/mine-message/mine-message.js
var httpsUtils = require('../../../utils/https-utils.js')
var toolUtils = require("../../../utils/tool-utils.js")
var that
var mPageSize = 10 //每页条数
var mTotalNum //总条数
var mCurrentPage = 1

function getData(msg) {
  var params = {}
  params.current_page = mCurrentPage
  params.page_size = mPageSize
  httpsUtils.systemMessage(params, function (res) {
    mTotalNum = res.total_num
    var list = that.data.dataList
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

  }, msg)
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    dataList: [],
    loadData: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无消息'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    mCurrentPage = 1
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          isLoading: true,
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString()
        })
      }
    })
    getData()
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
    mCurrentPage = 1
    getData("加载中...")
  },
  //跳转页面
  skipHtml: function (e) {
    var message_mini_run = this.data.dataList[e.currentTarget.dataset.index].message_mini_run;
    if (message_mini_run != 0) {
      toolUtils.pageTo(this.data.dataList[e.currentTarget.dataset.index].message_mini_url, 1)
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

})