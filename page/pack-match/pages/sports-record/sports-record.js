// page/pack-match/pages/sports-record/sports-record.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js");
var mMatchId, topPage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkLabelIndex: 0,
    recordTable: {
      group_name: '球队',
      score: '积分',
      win_num: '胜',
      fail_num: '负',
      tie_num: '平',
      goal_num: '进/失球',
      red_card: '红牌',
      yellow_card: '黄牌'
    },
    labelList: [{
      value: '阵容'
    },
    {
      value: '数据对比'
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, pages = getCurrentPages(), item = {};
    if (pages.length > 1) {
      topPage = pages[pages.length - 2]
      item = topPage.data.next_page_data
    } else {
      toolUtils.showToast("初始化数据失败")
      return
    }
    // 联赛数据处理
    item.match_turn = item.match_turn || item.match_info.match_turn
    item.match_type = item.match_type || 1


    mMatchId = item.match_id || item.match_info.match_id

    wx.getSystemInfo({
      success: function (res) {
        var rpxTopx = res.windowWidth / 750
        that.setData({
          statusBarHeight: res.statusBarHeight,
          recordHeight: res.screenHeight - res.statusBarHeight - 45 - 400 * rpxTopx,
          item: item
        })
      }
    })
    getMatchLineup(that)
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  bindLabelClick: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    that.setData({
      checkLabelIndex: index
    })
    if (!that.data.labelList[1].list) {
      getMatchData(that)
    }
  }
})
//获取阵容
function getMatchLineup(that) {
  var params = {};
  params.match_id = mMatchId
  httpsUtils.matchLineup(params, function (res) {
    console.log('赛程阵容', res)
    var labelItem = that.data.labelList[0];
    labelItem.home_group = res.home_group.starter
    labelItem.away_group = res.away_group.starter
    that.setData({
      [`labelList[${0}]`]: labelItem
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}

//获取数据对比
function getMatchData(that) {
  var params = {};
  params.match_id = mMatchId
  httpsUtils.matchData(params, function (res) {
    var labelItem = that.data.labelList[1];
    labelItem.list = res
    that.setData({
      [`labelList[${1}]`]: labelItem
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}