var httpsUtils = require('../../../../utils/https-utils.js')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    hotInfo: [],
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无资讯内容'
    },
    hotInfoList: {
      current_page: 1,
      page_size: 5,
      total_num: 0,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
    }
  },
  //获取更多资讯列表
  hotInfo_init: function (that) {
    that = this;
    var params = {
      type: 1,
      current_page: that.data.hotInfoList.current_page,
      page_size: that.data.hotInfoList.page_size,

    }
    console.log(that.data.competition_id)
    httpsUtils.competitionMaterial(that.data.competition_id, params, function (res) {
      that.data.hotInfoList.current_page = res.current_page;
      that.data.hotInfoList.page_size = res.page_size;
      that.data.hotInfoList.total_num = res.total_num;
      if (res.current_page == 1) {
        that.data.hotInfo = [];
      }
      that.data.hotInfo = that.data.hotInfo.concat(res.list);
      if (that.data.hotInfo.length == res.total_num) {
        that.data.hotInfoList.loadData = {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
        that.setData({
          hotInfo: that.data.hotInfo,
          hotInfoList: that.data.hotInfoList
        })
      } else {
        that.data.hotInfoList.loadData = {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
        that.setData({
          hotInfo: that.data.hotInfo,
          hotInfoList: that.data.hotInfoList
        })
      }
      wx.stopPullDownRefresh()
    }, function (e) {
      if (that.data.hotInfoList.current_page > 1) {
        --that.data.hotInfoList.current_page
      }
      that.data.hotInfoList.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        hotInfoList: that.data.hotInfoList
      })
      wx.stopPullDownRefresh()
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
          isLoading: true,
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          competition_id: options.competition_id
        })
      }
    })
    that.hotInfo_init(that);
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
    if (this.data.hotInfoList.total_num > this.data.hotInfoList.page_size * this.data.hotInfoList.current_page) {
      ++this.data.hotInfoList.current_page
      this.data.hotInfoList.loadData = {
        searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
      this.setData({
        hotInfoList: this.data.hotInfoList
      })
      this.hotInfo_init(this)
    } else {
      this.data.hotInfoList.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
      }
      this.setData({
        hotInfoList: this.data.hotInfoList
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})