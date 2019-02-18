// page/pack-match/pages/sports-events/sports-events.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js");
var rpxTopx, mCompetitionId, mCompetitionLevel, mGroupNo = 1,
  mCompetitionStatus;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    competition_id: '', //赛事ID
    competition_level: '', //赛事级别
    imgUrls: [], //赛事封面图
    competition_name: '', //赛事名称
    focusState: false, //是否关注
    collectState: false, //是否收藏
    sportSplend: [], //精彩瞬间
    splendTip: {}, //弹窗数据
    hotInfo: [], //资讯
    current: 0,
    splendStatus: true, //精彩瞬间弹窗状态
    sportInfo: [{}], //赛程信息

    tabId: 'tab2', //  tab2 排行  tab3 动态

    swiperCurrent: 0, //赛程或排行所在的swiper当前页

    'groupMatchRanking': { //排位赛
      "list": [{
        "user_id": 1,    // 用户ID
        "user_name": "name",    // 用户名
        "user_avatar": "https://wx.qlogo.cn/mmopen/vi_32/s7sX2S6vpJS8pqlSt6zwKzfQVZWJ4v80mBF0MaoEiceibvlt29ffIjQP1uOmcUbPA7qiaX1fHibgiah2jrBic390PfpQ/132",    // 用户头像
        "match_record": "00:10:10",    // 比赛用时
        "rand_no": 1    // 排名
      }, {
        "user_id": 1,    // 用户ID
        "user_name": "name",    // 用户名
        "user_avatar": "https://wx.qlogo.cn/mmopen/vi_32/s7sX2S6vpJS8pqlSt6zwKzfQVZWJ4v80mBF0MaoEiceibvlt29ffIjQP1uOmcUbPA7qiaX1fHibgiah2jrBic390PfpQ/132",    // 用户头像
        "match_record": "00:10:10",    // 比赛用时
        "rand_no": 2    // 排名
      }]
    },
    rankingsLabel: [], //排行榜
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无数据'
    },
    empty2: {
      icon: '/pic/no-content.png',
      empty_txt: '暂未生成'
    },
    isScoreboardTable: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,
      tabId = options.tab_id || 'tab2'
    mCompetitionId = options.competition_id || '494924108350357504'
    mCompetitionLevel = 1
    // options.competition_level || -1
    mCompetitionStatus = options.competition_status || -1
    var sceneCode = getApp().data.sceneCode; //进入场景值
    if (getCurrentPages().length == 1) {
      that.data.competition_id = options.scene
    } else {
      that.data.competition_id = options.competition_id
    }
    wx.getSystemInfo({
      success: function (res) {
        rpxTopx = res.windowWidth / 750
        var swiperTop
        if (tabId == 'tab2') {
          swiperTop = res.statusBarHeight + 254 * rpxTopx + 400 * rpxTopx
        }
        that.setData({
          videoState: false,
          competition_id: that.data.competition_id,
          statusBarHeight: res.statusBarHeight,
          swiperTop: swiperTop,
          swiperHeight: res.screenHeight - swiperTop,
          windowHeight: res.screenHeight,
          competition_level: mCompetitionLevel,
          competition_status: mCompetitionStatus,
          rank_interval: options.rank_interval || 0,
          tabId: tabId
        })
      }
    })
    // tab2 排行
    if (tabId == 'tab2') {
      getRankings(that)
    }
    that.competitionIndex();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

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
  //禁止swiper滑动
  catchTouchMove: function (e) {

  },

  /**
   * 用户点击右上角分享
   */

  onShareAppMessage: function (res) {
    if (res.from == 'button') {
      if (this.data.splendTip.material_type == 2 || this.data.splendTip.material_type == 3) { //视频
        // 视频和动图转发成功
        var params = {}
        params.branch_type = 6
        params.branch_id = this.data.splendTip.material_id
        httpsUtils.shareBtn(params, function (res) { }, function (e) { })
        return {
          title: this.data.splendTip.material_title,
          imageUrl: this.data.splendTip.material_pic,
          path: `/page/pack-match/pages/sport-share/sport-share?material_id=${this.data.splendTip.material_id}`
        }
      }
    } else {
      // 微信自带转发功能
      var params = {}
      params.branch_type = 5
      params.branch_id = mCompetitionId
      httpsUtils.shareBtn(params, function (res) { }, function (e) { })
      return {
        title: this.data.competition_name,
        path: `/page/pack-match/pages/sport-underway/sport-underway?scene=${mCompetitionId}&competition_status=${mCompetitionStatus}&competition_level=${mCompetitionLevel}`,
      }
    }
  },


  //切换到排行
  bindTabClick: function (e) {
    var that = this,
      id = e.currentTarget.id,
      swiperTop = that.data.swiperTop,
      swiperHeight = that.data.swiperHeight,
      statusBarHeight = that.data.statusBarHeight,
      windowHeight = that.data.windowHeight;
    if ('tab2' == id) {
      swiperTop = statusBarHeight + 254 * rpxTopx + 400 * rpxTopx
      swiperHeight = windowHeight - swiperTop
    }
    that.setData({
      tabId: id,
      swiperTop: swiperTop,
      swiperHeight: swiperHeight,
      swiperCurrent: 0,
    })
    if ('tab2' == id) {
      if (that.data.rankingsLabel.length == 0) {
        getRankings(that)
      }
    } else {
      that.competitionIndex()
    }
  },
  //swiper回调监听
  bindSwiperChange: function (e) {
    var that = this,
      id = that.data.tabId,
      current = e.detail.current,
      swiperTop = that.data.swiperTop,
      swiperHeight = that.data.swiperHeight,
      statusBarHeight = that.data.statusBarHeight,
      windowHeight = that.data.windowHeight;
    if ('tab2' == id) { //排行
      var rankingsLabelItem = that.data.rankingsLabel
      swiperTop = statusBarHeight + 254 * rpxTopx + 400 * rpxTopx
      swiperHeight = windowHeight - swiperTop
      that.setData({
        swiperTop: swiperTop,
        swiperHeight: swiperHeight
      })
      if (rankingsLabelItem.length == 0) {
        getRankings(that)
      }
    }
  },


  /**
   * 动态
   */

  //获取赛程信息，精彩瞬间和资讯信息
  competitionIndex: function () {
    var that = this;
    httpsUtils.competitionIndex(that.data.competition_id, {}, function (res) {
      if (res.is_atten == 1) {
        that.setData({
          focusState: true
        })
      } else {
        that.setData({
          focusState: false
        })
      }
      if (res.is_favorites == 1) {
        that.setData({
          collectState: true
        })
      } else {
        that.setData({
          collectState: false
        })
      }
      that.data.imgUrls[0] = res.competition_pic;
      that.setData({
        competition_id: res.competition_id,
        competition_level: res.competition_level || 1,
        competition_name: res.competition_name,
        imgUrls: that.data.imgUrls,
        competition_name: res.competition_name,
        sportInfo: res.match_list,
        sportSplend: res.moment,
        hotInfo: res.news,
        rank_interval: res.rank_interval
      })
    }, function (e) { })
  },
  //跳转赛事信息
  sportInfoEvt: function (e) {
    toolUtils.pageTo(`/page/pack-match/pages/sport-detail/sport-detail?competition_id=${this.data.competition_id}`)
  },
  //关注
  focusEvt: function () {
    var that = this;
    var params = {
      branch_type: 5,
      branch_id: this.data.competition_id
    }
    if (that.data.focusState) {
      httpsUtils.putFollow(params, function (res) {
        toolUtils.showToast('取消关注成功');
        that.setData({
          focusState: false
        })
      }, function (e) {
        toolUtils.showToast('取消关注失败');
      })
    } else {
      httpsUtils.putFollow(params, function (res) {
        toolUtils.showToast('关注成功');
        that.setData({
          focusState: true
        })
      }, function (e) {
        toolUtils.showToast('关注失败');
      })
    }
  },
  //收藏
  collectEvt: function () {
    var that = this;
    var params = {
      branch_type: 5,
      branch_id: this.data.competition_id
    }
    if (that.data.collectState) {
      httpsUtils.putFavorite(params, function (res) {
        toolUtils.showToast('取消收藏成功');
        that.setData({
          collectState: false
        })
      }, function (e) {
        toolUtils.showToast('取消收藏失败');
      })
    } else {
      httpsUtils.putFavorite(params, function (res) {
        toolUtils.showToast('收藏成功');
        that.setData({
          collectState: true
        })
      }, function (e) {
        toolUtils.showToast('收藏失败');
      })
    }
  },
  //点击精彩瞬间，播放视频或动图
  splendVideoEvt: function (e) {
    var _index = e.currentTarget.dataset.index;
    this.setData({
      splendTip: this.data.sportSplend[_index],
      splendStatus: false,
      videoState: true
    })
  },
  //点击图标，关闭弹窗
  tipIconEvt: function () {
    this.setData({
      splendStatus: true,
      videoState: false
    })
  },
  //banner跳转赛事报名管理页面（队长和队员）
  bannerEvt: function () {
    var competition_id = this.data.competition_id
    toolUtils.pageTo('/page/pack-match/pages/match-sign-up/match-sign-up?competition_id=' + competition_id, 1)
  },
})


/**
 * 排行榜（杯赛）
 */
function getRankings(that) {
  var params = {},
    rankingsLabelItem = that.data.rankingsLabel;
  params.competition_id = mCompetitionId

  // // 模拟接口数据
  // that.setData({
  //   rankingsLabel: that.data.groupMatchRanking.list
  // })
  httpsUtils.commonMatchRace(params, function (res) {
    console.log(res)
    var httpList = res.list || []
    rankingsLabelItem.total_num = httpList.length
    // if (params.current_page == 1) {
    rankingsLabelItem = []
    // }
    rankingsLabelItem = rankingsLabelItem.concat(httpList)
    // if (rankingsLabelItem.list.length == rankingsLabelItem.total_num) {
    rankingsLabelItem.loadData = {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
    }
    that.setData({
      rankingsLabel: rankingsLabelItem
    })
    wx.stopPullDownRefresh()
  }, function (e) {
    wx.stopPullDownRefresh()
  })

}
