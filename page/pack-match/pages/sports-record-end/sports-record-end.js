// page/pack-match/pages/sports-record-end/sports-record-end.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js");
var mMatchId, topPage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkLabelIndex: 0,
    labelList: [{
      value: '阵容'
    },
    {
      value: '统计'
    },
    {
      value: '赛况'
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,
      pages = getCurrentPages(),
      item = {};
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
  //切换tab
  bindLabelClick: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      labelItem = that.data.labelList[index];
    that.setData({
      checkLabelIndex: index
    })
    if (index == 1 && !labelItem.list) {
      getMatchStatistics(that)
    }
    if (index == 2 && !labelItem.list) {
      getMatchOuts(that)
    }
  }
})
//获取阵容
function getMatchLineup(that) {
  var params = {};
  params.match_id = mMatchId
  httpsUtils.matchLineup(params, function (res) {
    var labelItem = that.data.labelList[0];
    labelItem.home_group = res.home_group
    labelItem.away_group = res.away_group
    that.setData({
      [`labelList[${0}]`]: labelItem
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
//获取统计
function getMatchStatistics(that) {
  var params = {};
  params.match_id = mMatchId
  httpsUtils.matchStatistics(params, function (res) {
    var labelItem = that.data.labelList[1],
      list = [],
      home_group = res.home_group,
      away_group = res.away_group;
    list.push({
      num1: parseInt(home_group.goal),
      num2: parseInt(away_group.goal),
      perNum: parseInt(home_group.goal) / (parseInt(home_group.goal) + parseInt(away_group.goal)) * 100,
      txt: '进球'
    })
    list.push({
      num1: parseInt(home_group.ball_possession),
      num2: parseInt(away_group.ball_possession),
      perNum: parseInt(home_group.ball_possession) / (parseInt(home_group.ball_possession) + parseInt(away_group.ball_possession)) * 100,
      txt: '控球率'
    })
    list.push({
      num1: parseInt(home_group.shoot),
      num2: parseInt(away_group.shoot),
      perNum: parseInt(home_group.shoot) / (parseInt(home_group.shoot) + parseInt(away_group.shoot)) * 100,
      txt: '射门'
    })
    list.push({
      num1: parseInt(home_group.steals),
      num2: parseInt(away_group.steals),
      perNum: parseInt(home_group.steals) / (parseInt(home_group.steals) + parseInt(away_group.steals)) * 100,
      txt: '传球'
    })
    list.push({
      num1: parseInt(home_group.free_kick),
      num2: parseInt(away_group.free_kick),
      perNum: parseInt(home_group.free_kick) / (parseInt(home_group.free_kick) + parseInt(away_group.free_kick)) * 100,
      txt: '任意球'
    })
    list.push({
      num1: parseInt(home_group.red_card),
      num2: parseInt(away_group.red_card),
      perNum: parseInt(home_group.red_card) / (parseInt(home_group.red_card) + parseInt(away_group.red_card)) * 100,
      txt: '红牌'
    })
    list.push({
      num1: parseInt(home_group.yellow_card),
      num2: parseInt(away_group.yellow_card),
      perNum: parseInt(home_group.yellow_card) / (parseInt(home_group.yellow_card) + parseInt(away_group.yellow_card)) * 100,
      txt: '黄牌'
    })
    list.push({
      num1: parseInt(home_group.foul),
      num2: parseInt(away_group.foul),
      perNum: parseInt(home_group.foul) / (parseInt(home_group.foul) + parseInt(away_group.foul)) * 100,
      txt: '犯规'
    })
    list.push({
      num1: parseInt(home_group.ejection),
      num2: parseInt(away_group.ejection),
      perNum: parseInt(home_group.ejection) / (parseInt(home_group.ejection) + parseInt(away_group.ejection)) * 100,
      txt: '射正'
    })
    list.push({
      num1: parseInt(home_group.offside),
      num2: parseInt(away_group.offside),
      perNum: parseInt(home_group.offside) / (parseInt(home_group.offside) + parseInt(away_group.offside)) * 100,
      txt: '越位'
    })
    list.push({
      num1: parseInt(home_group.ball_corner),
      num2: parseInt(away_group.ball_corner),
      perNum: parseInt(home_group.ball_corner) / (parseInt(home_group.ball_corner) + parseInt(away_group.ball_corner)) * 100,
      txt: '角球'
    })
    labelItem.list = list
    that.setData({
      [`labelList[${1}]`]: labelItem
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
//获取赛况
function getMatchOuts(that) {
  var params = {};
  params.match_id = mMatchId
  httpsUtils.matchOuts(params, function (res) {
    var labelItem = that.data.labelList[2],
      centerIndex = -1;
    for (var i = 0; i < res.length; i++) {
      if (res[i].time > 45) {
        centerIndex = i
        break
      }
    }
    if (centerIndex > 0) {
      res.splice(centerIndex, 0, {
        type: -1,
        time: '中场休息'
      })
    } else {
      res.unshift({
        type: -1,
        time: '中场休息'
      })
    }

    labelItem.list = res
    that.setData({
      [`labelList[${2}]`]: labelItem
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}