var httpsUtils = require('../../../../utils/https-utils.js');
var toolUtils = require("../../../../utils/tool-utils.js")
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    competition_id: '',
    competition_level: '',
    isLoading: true,
    sport_ranking: [],
    sport_shooter: {},
    sport_attack: {},
    best_goal_group: {},
    lose_goal_group: {},
    sport_data: {
      total: '',
      aver_num: ''
    }
  },
  //获取赛事总结的数据
  sportSummary_init: function () {
    that = this;
    httpsUtils.competitionSummary(that.data.competition_id, {}, function (res) {
      that.data.sport_ranking = res.group_ranking;
      if (that.data.sport_ranking.length == 1) {
        that.data.sport_ranking[0].icon = '/pic/champion.png';
      } else if (that.data.sport_ranking.length == 2) {
        that.data.sport_ranking[0].icon = '/pic/champion.png';
        that.data.sport_ranking[1].icon = '/pic/two.png';
      } else {
        var temp;
        temp = that.data.sport_ranking[0];
        that.data.sport_ranking[0] = that.data.sport_ranking[1];
        that.data.sport_ranking[1] = temp; //第一名和第二名交换位置
        that.data.sport_ranking[0].icon = '/pic/two.png';
        that.data.sport_ranking[1].icon = '/pic/champion.png';
        that.data.sport_ranking[2].icon = '/pic/three.png';
      }
      that.data.sport_data.total = res.goal_total; //进球总数
      that.data.sport_data.aver_num = res.average_goal; //均进球数
      that.setData({
        rank_interval: res.rank_interval,
        sport_ranking: that.data.sport_ranking, //赛事排名
        sport_shooter: res.best_shooter, // 最佳射手
        sport_attack: res.best_assists, //最佳助攻
        sport_data: that.data.sport_data,
        best_goal_group: res.best_goal_group, //最佳进球
        lose_goal_group: res.lose_goal_group //最佳失球
      })
    }, function (e) {
      wx.showToast({
        title: e.data.msg,
        icon: 'none',
        duration: 1000,
        success: function () {
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)
        }
      })
    })
  },
  //相关按钮跳转页面
  sportInfoEvt: function (e) {
    var title = e.currentTarget.dataset.title;
    var competition_id = this.data.competition_id;
    var competition_level = this.data.competition_level;
    switch (title) {
      //跳转赛场资讯
      case 'hotInfo':
        {
          toolUtils.pageTo('/page/pack-match/pages/hot-info/hot-info?competition_id=' + competition_id, 1);
          break
        };
      //跳转更多精彩
      case 'videoInfo':
        {
          toolUtils.pageTo('/page/pack-match/pages/splend/splend?competition_id=' + competition_id, 1);
          break
        };
      //跳转更多数据
      case 'moreNum':
        {
          // /page/pack-match/pages/sports-events/sports-events
          toolUtils.pageTo('/page/pack-match/pages/sport-underway/sport-underway?competition_status=3&competition_id=' + competition_id + '&competition_level=' + competition_level + '&rank_interval=' + this.data.rank_interval, 1);
          break
        }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var sceneCode = getApp().data.sceneCode; //进入场景值
    if ((sceneCode == 1011 || sceneCode == 1012 || sceneCode == 1013) && getCurrentPages().length == 1) {
      that.data.competition_id = options.scene
    } else {
      that.data.competition_id = options.competition_id
    }
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
    that.sportSummary_init();
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
  onShareAppMessage: function () {

  }
})