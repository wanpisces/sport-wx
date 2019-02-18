// page/pack-mine/mine-follow/mine-follow.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    search: {
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
    that.getData();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          isLoading: true,
          statusBarHeight: res.statusBarHeight
        })
      }
    })
  },
  getData: function (msg) {
    var search = that.data.search;
    httpsUtils.myFollow(search, function (res) {
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

    }, msg)
  },

  //加入
  joinFollow: function (e) {
    var attr_id = this.data.dataList[e.currentTarget.dataset.index].attr_id;
    var group_id = this.data.dataList[e.currentTarget.dataset.index].branch_id
    toolUtils.pageTo(`/page/pack-mine/complete-infomation/complete-infomation?attr_id=${attr_id}&group_id=${group_id}`)
  },
  //取消关注
  cancelFollow: function (e) {
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
      dataList.splice(e.currentTarget.dataset.index, 1);
      that.setData({
        dataList: dataList
      })
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
    var search = that.data.search;
    search.current_page = 1;
    that.setData({
      search: search
    })
    that.getData("加载中...");
  },

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})