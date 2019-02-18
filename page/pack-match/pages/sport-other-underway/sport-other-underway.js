// page/pack-match/pages/sports-events/sports-events.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js");
var rpxTopx, mCompetitionId, mCompetitionLevel, mcompetitionTag, mGroupNo = 1,
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
    tabId: 'tab1', //tab1 赛程  tab2 排行  tab3 动态
    checkLabelIndex: 0, //赛程 0 小组赛 1 淘汰赛
    swiperCurrent: 0, //赛程或排行所在的swiper当前页
    checkLabelIndex2: 0, //淘汰赛
    checkLabelIndex3: 0, //排行榜（0 积分榜 1 射手榜 2助攻榜 3红黄牌）
    checkLabelIndex4: 0, //红黄牌 （0 停赛榜 1球员累计 2球队累计 ）
    groupNumList: [], //小组赛的组数
    courseLabel: [{ //赛程（小组赛）
      current_page: 1,
      page_size: 10,
      total_num: 0,
      match_turn: 1, //轮次
      match_count: 0,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }, { //淘汰赛
      current_page: 1,
      page_size: 10,
      total_num: 0,
      match_turn: 1, //轮次
      match_count: 0,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }],
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
      tabId = options.tab_id || 'tab1'
    mCompetitionId = options.competition_id || '494924108350357504'
    mCompetitionLevel = options.competition_level || -1
    mcompetitionTag = options.competition_tag || -1
    mCompetitionStatus = options.competition_status || -1
    var sceneCode = getApp().data.sceneCode; //进入场景值
    console.log('mCompetitionLevel', mCompetitionLevel)
    if (getCurrentPages().length == 1) {
      that.data.competition_id = options.scene
    } else {
      that.data.competition_id = options.competition_id
    }
    wx.getSystemInfo({
      success: function (res) {
        rpxTopx = res.windowWidth / 750
        var swiperTop
        if (tabId == 'tab1') {
          swiperTop = mCompetitionLevel == 1 ? res.statusBarHeight + 46 + 296 * rpxTopx + 72 * rpxTopx + 400 * rpxTopx : res.statusBarHeight + 46 + 216 * rpxTopx + 400 * rpxTopx;
        } else {
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
          competition_tag: mcompetitionTag,
          competition_status: mCompetitionStatus,
          rank_interval: options.rank_interval || 0,
          tabId: tabId
        })
      }
    })

    // tab1 赛程  tab2 排行
    if (mCompetitionLevel == 1) { //杯赛
      if (tabId == 'tab1') {
        getcommanMatch(this) //小组
      } else if (tabId == 'tab2') {
        getRankings(that)
      }
    } else { //联赛
      if (tabId == 'tab1') {
        getLeagueCompetitionMatch(that)
      } else if (tabId == 'tab2') {
        getLeagueRankings(that)
      }
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
  onItemMatch: function (e) { //轮空不跳转
    var item = e.currentTarget.dataset.item
    if (item.away_group_id == 0 || item.home_group_id == 0) {
      return
    }
    this.setData({
      next_page_data: item
    })
    if (item.is_end == 1 || item.match_info.match_status == 3) { //赛事完结跳转数据统计页面
      toolUtils.pageTo(`/page/pack-match/pages/sports-record-end/sports-record-end`)
    } else { //跳转赛况
      toolUtils.pageTo(`/page/pack-match/pages/sports-record/sports-record`)
    }
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

  //最后最前轮次
  onAroundLast: function (e) {
    var id = e.currentTarget.id;
    if ('front' == id) {
      toolUtils.showToast("已是最前一轮了！")
    } else {
      toolUtils.showToast("已是最后一轮了！")
    }
  },
  //前一轮
  onFront: function (e) {
    var that = this,
      checkLabelIndex = that.data.checkLabelIndex, //swiper的下标
      courseLabelItem = that.data.courseLabel[checkLabelIndex], //当前swiper数据
      matchTurns = courseLabelItem.matchTurns, //当前轮次的数组
      match_turn_index = parseInt(courseLabelItem.match_turn_index || 0); //当前选中轮次的下标
    console.log(checkLabelIndex, courseLabelItem, matchTurns, match_turn_index)
    if (match_turn_index > 0) {
      courseLabelItem.match_turn = matchTurns[match_turn_index - 1].match_turn
      courseLabelItem.match_turn_name = matchTurns[match_turn_index - 1].match_turn_name
      courseLabelItem.match_turn_index = match_turn_index - 1 //保存选中的下标
      courseLabelItem.isFront = match_turn_index - 1 > 0 ? true : false //是否有前一轮
      courseLabelItem.isAfter = true //是否还有下一轮
      that.setData({
        [`courseLabel[${checkLabelIndex}]`]: courseLabelItem
      })
      if (mCompetitionLevel == 1) {
        getcommanMatch(that)
      } else {
        getLeagueCompetitionMatch(that)
      }
    }
  },
  //后一轮
  onAfter: function (e) {
    var that = this,
      checkLabelIndex = that.data.checkLabelIndex, //swiper的下标
      courseLabelItem = that.data.courseLabel[checkLabelIndex], //当前swiper数据
      matchTurns = courseLabelItem.matchTurns, //当前轮次的数组
      match_turn_index = parseInt(courseLabelItem.match_turn_index || 0); //当前选中轮次的下标
    if (match_turn_index < matchTurns.length - 1) {
      courseLabelItem.match_turn = matchTurns[match_turn_index + 1].match_turn
      courseLabelItem.match_turn_name = matchTurns[match_turn_index + 1].match_turn_name
      courseLabelItem.match_turn_index = match_turn_index + 1 //保存选中的下标
      courseLabelItem.isFront = true //是否有前一轮
      courseLabelItem.isAfter = matchTurns.length - 1 > match_turn_index + 1 ? true : false //是否还有下一轮
      that.setData({
        [`courseLabel[${checkLabelIndex}]`]: courseLabelItem
      })
      if (mCompetitionLevel == 1) { //杯赛
        getcommanMatch(that)
      } else { //联赛
        getLeagueCompetitionMatch(that)
      }
    }
  },
  //选择轮次回调
  bindchangeMatchTurns: function (e) {
    var that = this,
      value = e.detail.value, //picker选中的下标
      checkLabelIndex = that.data.checkLabelIndex, //swiper的下标
      courseLabelItem = that.data.courseLabel[checkLabelIndex], //当前swiper数据
      matchTurns = courseLabelItem.matchTurns; //当前轮次的数组
    console.log(value, checkLabelIndex, courseLabelItem, matchTurns)
    courseLabelItem.match_turn = matchTurns[value].match_turn
    courseLabelItem.match_turn_name = matchTurns[value].match_turn_name
    courseLabelItem.match_turn_index = value //保存选中的下标
    courseLabelItem.isFront = value > 0 ? true : false //是否有前一轮
    courseLabelItem.isAfter = matchTurns.length - 1 > value ? true : false //是否还有下一轮
    console.log('courseLabelItem', courseLabelItem)
    that.setData({
      [`courseLabel[${checkLabelIndex}]`]: courseLabelItem
    })
    // if (mCompetitionLevel == 1) {
    //   getcommanMatch(that)
    // } else {
    //   getLeagueCompetitionMatch(that)
    // }
  },
  //选择组回调
  bindchangeGroup: function (e) {
    var index = e.detail.value,
      groupItem = this.data.groupNumList[index];
    this.setData({
      groupNum_name: groupItem.groupNum_name,
      groupNum_index: groupItem.groupNum_index
    })
  },
  //获取分组
  onGroup: function (e) {
    getGroupNoList(this)
  },
  //获取轮次
  onMatchTurns: function (e) {
    getmatchTurnList(this)
  },
  //赛程和排行切换
  bindTabClick: function (e) {
    var that = this,
      id = e.currentTarget.id,
      swiperTop = that.data.swiperTop,
      swiperHeight = that.data.swiperHeight,
      statusBarHeight = that.data.statusBarHeight,
      windowHeight = that.data.windowHeight;
    if ('tab1' == id) {
      swiperTop = mCompetitionLevel == 1 ? statusBarHeight + 46 + 296 * rpxTopx + 72 * rpxTopx + 400 * rpxTopx : statusBarHeight + 46 + 216 * rpxTopx + 400 * rpxTopx;
      swiperHeight = windowHeight - swiperTop
    } else if ('tab2' == id) {
      swiperTop = statusBarHeight + 254 * rpxTopx + 400 * rpxTopx
      swiperHeight = windowHeight - swiperTop
    }
    that.setData({
      tabId: id,
      swiperTop: swiperTop,
      swiperHeight: swiperHeight,
      swiperCurrent: 0,
      checkLabelIndex: 0,
    })
    if (mCompetitionLevel == 1) { //杯赛
      if ('tab1' != id) { //排行榜
        var rankingsLabelItem = that.data.rankingsLabel;
        if (rankingsLabelItem.length == 0) {
          getRankings(that)
        }
      } else { //赛程小组赛
        var courseLabelItem = that.data.courseLabel[0]
        if (courseLabelItem.list.length == 0) {
          getcommanMatch(that)
        }
      }
    } else { //联赛
      if ('tab1' != id) {
        var rankingsLabelItem = that.data.rankingsLabel;
        if (rankingsLabelItem.length == 0) {
          getLeagueRankings(that)
        }
      } else {
        var courseLabelItem = that.data.courseLabel[0]
        if (courseLabelItem.list.length == 0) {
          getLeagueCompetitionMatch(that)
        }
      }
    }

  },
  //swiper的tab点击 (小组赛和淘汰赛切换)
  bindLabelClick: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    console.log(index)
    that.setData({
      swiperCurrent: index, //当前swiper所在页
      checkLabelIndex: index // 0 小组赛 1 淘汰赛
    })
    getcommanMatch(that)
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
    if ('tab1' == id) { //赛程
      var courseLabelItem = that.data.courseLabel[current], //当前swiper的item数据
        isEliminate = current == 1 && mCompetitionStatus == 3; // 是否淘汰赛
      if (!isEliminate) {
        swiperTop = statusBarHeight + 46 + 296 * rpxTopx + 72 * rpxTopx + 400 * rpxTopx
      } else {
        swiperTop = statusBarHeight + 214 * rpxTopx + 72 * rpxTopx + 400 * rpxTopx
        // swiperTop = statusBarHeight + 46 + 296 * rpxTopx + 72 * rpxTopx
      }
      swiperHeight = windowHeight - swiperTop
      that.setData({
        checkLabelIndex: current,
        swiperTop: swiperTop,
        swiperHeight: swiperHeight
      })
      if (!isEliminate) {
        if (courseLabelItem.list.length == 0 && courseLabelItem.matchTurns && courseLabelItem.matchTurns.length > 0) {
          if (mCompetitionLevel == 1) {
            getcommanMatch(that)
          } else {
            getLeagueCompetitionMatch(that)
          }
        }
        if (!courseLabelItem.matchTurns || courseLabelItem.matchTurns.length == 0) {
          getmatchTurnList(that)
        }
      } else { //已完成的淘汰赛
        promotionRoad(that) //晋级之路
      }
    } else { //排行
      var rankingsLabelItem = that.data.rankingsLabel[current]
      if (current == 3) {
        swiperTop = statusBarHeight + 254 * rpxTopx + 172 * rpxTopx + 400 * rpxTopx
        swiperHeight = windowHeight - swiperTop
        if (that.data.competition_status == 3) {
          rankingsLabelItem.type = 2
          that.setData({
            checkLabelIndex4: 1
          })
        }
      } else {
        swiperTop = statusBarHeight + 254 * rpxTopx + 400 * rpxTopx
        swiperHeight = windowHeight - swiperTop
      }
      that.setData({
        checkLabelIndex3: current,
        swiperTop: swiperTop,
        swiperHeight: swiperHeight
      })
      if (rankingsLabelItem.list.length == 0) {
        if (mCompetitionLevel == 1) {
          getRankings(that)
        } else {
          getLeagueRankings(that)
        }
      }
    }
  },
  //晋级区和排位区的切换
  bindLabelClick2: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      courseLabelItem = that.data.courseLabel[1];
    courseLabelItem.match_turn = 1
    courseLabelItem.current_page = 1
    courseLabelItem.page_size = 10
    courseLabelItem.total_num = 0
    courseLabelItem.loadData = {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    }
    that.setData({
      checkLabelIndex2: index,
    })
    getcommanMatch(that)
    // getmatchTurnList(that)
  },
  //停赛榜，球员累计，球队累计切换
  bindLabelClick4: function (e) {
    var that = this,
      list = [],
      index = e.currentTarget.dataset.index,
      checkLabelIndex3 = that.data.checkLabelIndex3,
      rankingsLabelItem = that.data.rankingsLabel[checkLabelIndex3];
    rankingsLabelItem.type = index + 1
    rankingsLabelItem.current_page = 1
    rankingsLabelItem.page_size = 10
    rankingsLabelItem.total_num = 0
    rankingsLabelItem.loadData = {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    }
    that.setData({
      checkLabelIndex4: index
    })
    if (mCompetitionLevel == 1) { //杯赛
      getRankings(that)
    } else { //联赛
      getLeagueRankings(that)
    }
  },
  //监听赛事滚动
  bindSportInfoChange: function (e) {
    this.setData({
      current: e.detail.current
    })
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
 * 赛程列表（杯赛）
 * 
 * 
 */
function getcommanMatch(that) {
  var courseLabelIndex = that.data.checkLabelIndex, //0 小组赛 1 淘汰赛,
    checkLabelIndex = courseLabelIndex,
    courseLabelItem = that.data.courseLabel[courseLabelIndex],
    params = {};
  params.competition_id = mCompetitionId
  params.match_type = courseLabelIndex == 0 ? 1 : 2
  if (params.match_type == 1) { //小组赛
    params.group_no = that.data.groupNum_index || 1 //小组组号
    params.match_turn = courseLabelItem.match_turn || 1 //小组轮次
  } else { //淘汰赛
    params.knockout_type = that.data.checkLabelIndex2 == 0 ? 1 : 0 //checkLabelIndex2 0 晋级区 1 排位区
    if (params.knockout_type == 1) { //晋级赛
      params.knockout_type = courseLabelItem.match_turn
    }
  }
  httpsUtils.commanMatch(params, function (res) {
    that.setData({
      info_data: res.info
    })
    //轮次
    // if (courseLabelItem.match_count && courseLabelItem.match_count < 1) {
    //   console.log('courseLabelItem', courseLabelItem)
    //   getmatchTurnList(that)
    // }
    getmatchTurnList(that)
    //小组组数
    if (res.info.match_type == 1 && res.info.total_group_no > 0) {
      getGroupNoList(that)
    }
    if (res.list.length > 0) {
      courseLabelItem.list = []
    }
    courseLabelItem.list = courseLabelItem.list.concat(res.list)
    that.setData({
      [`courseLabel[${checkLabelIndex}]`]: courseLabelItem
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })

}
/**
 * 赛程列表（联赛）
 */
function getLeagueCompetitionMatch(that) {
  var courseLabelIndex = that.data.checkLabelIndex,
    checkLabelIndex = courseLabelIndex,
    courseLabelItem = that.data.courseLabel[courseLabelIndex],
    params = {}
  params.competition_id = mCompetitionId
  params.match_turn = courseLabelItem.match_turn
  params.current_page = courseLabelItem.current_page
  params.page_size = courseLabelItem.page_size
  httpsUtils.commonLeagueMatch(params, function (res) {
    console.log(res)
    //轮次
    if (res.match_total_turn > 0) {
      var match_total_turn = +res.match_total_turn;
      var matchTurns = [];
      for (var i = 0; i < match_total_turn; i++) {
        var obj = {
          match_turn_name: `第${i + 1}轮`,
          match_turn: i + 1
        }
        matchTurns.push(obj)
      }
      var _index = params.match_turn - 1 > 0 ? params.match_turn - 1 : 0;
      courseLabelItem.matchTurns = matchTurns;
      courseLabelItem.match_turn = +res.match_turn
      courseLabelItem.match_turn_name = `第${+res.match_turn}轮`
      courseLabelItem.match_turn_index = _index;
      courseLabelItem.isFront = courseLabelItem.match_turn > 1 ? true : false;
      courseLabelItem.isAfter = courseLabelItem.match_turn < matchTurns.length ? true : false;
    }
    courseLabelItem.total_num = res.total_num
    if (res.current_page == 1) {
      courseLabelItem.list = []
    }
    courseLabelItem.list = courseLabelItem.list.concat(res.list)
    if (courseLabelItem.list.length == res.total_num) {
      courseLabelItem.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        [`courseLabel[${checkLabelIndex}]`]: courseLabelItem
      })
    } else {
      courseLabelItem.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        [`courseLabel[${checkLabelIndex}]`]: courseLabelItem
      })
    }
    wx.stopPullDownRefresh()
  }, function (e) {
    if (courseLabelItem.current_page > 1) {
      --courseLabelItem.current_page
    }
    that.setData({
      [`courseLabel[${checkLabelIndex}].loadData`]: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.stopPullDownRefresh()
  })
}
/**
 * 排行榜（杯赛）
 */
function getRankings(that) {
  var params = {},
    rankingsLabelItem = that.data.rankingsLabel;
  params.competition_id = mCompetitionId

  httpsUtils.commonMatchRank(params, function (res) {
    var httpList = res.list
    rankingsLabelItem = rankingsLabelItem.concat(httpList)
    that.setData({
      rankingsLabel: rankingsLabelItem
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })

}
/**
 * 排行榜（联赛）
 */
function getLeagueRankings(that) {
  var params = {},
    rankingsLabelItem = that.data.rankingsLabel;
  params.competition_id = mCompetitionId
  httpsUtils.commonLeagueRanking(params, function (res) {
    var httpList = res.list
    rankingsLabelItem = rankingsLabelItem.concat(httpList)
    that.setData({
      rankingsLabel: rankingsLabelItem
    })
    console.log(that.data.rankingsLabel)
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}

//获取小组
function getGroupNoList(that) {
  var groupNumListLength = that.data.info_data.total_group_no
  var groupNumList = [];
  for (let i = 0; i < groupNumListLength; i++) {
    var str = 'A'
    groupNumList.push({
      groupNum_name: String.fromCharCode(str.charCodeAt() + i) + '组',
      groupNum_index: i + 1
    })
  }
  that.setData({
    groupNumList: groupNumList
  })
}
//获取轮次
function getmatchTurnList(that) {
  var params = {},
    courseLabelIndex = that.data.checkLabelIndex, //0 小组赛 1 淘汰赛,
    checkLabelIndex = courseLabelIndex,
    courseLabelItem = that.data.courseLabel[courseLabelIndex],
    checkLabelIndex2 = that.data.checkLabelIndex2;
  params.competition_id = mCompetitionId
  params.match_type = checkLabelIndex == 0 ? 1 : 2
  if (params.match_type == 2) { //淘汰赛
    params.knockout_type = checkLabelIndex2 == 0 ? 1 : 2
  }
  var info_data = that.data.info_data
  if (info_data.match_type == 1) { //小组赛
    //小组轮次
    if (info_data.total_match_turn > 0) {
      var match_total_turn = +info_data.total_match_turn;
      var matchTurns = [];
      for (var i = 0; i < match_total_turn; i++) {
        var obj = {
          match_turn_name: `第${i + 1}轮`,
          match_turn: i + 1
        }
        matchTurns.push(obj)
      }
    }
  } else { //淘汰赛
    if (info_data.match_type == 2 && params.knockout_type != 0) { //晋级赛
      var matchTurns = [];
      while (info_data.total_knockout_type >= 1) {
        var obj = {
          match_turn_name: info_data.total_knockout_type != 1 ? `1/${info_data.total_knockout_type}决赛` : '决赛',
          match_turn: info_data.total_knockout_type != 1 ? info_data.total_knockout_type : 1
        }
        matchTurns.push(obj);
        info_data.total_knockout_type = info_data.total_knockout_type / 2;
      }
    } else { //排位区
      var matchTurns = [];
      for (var i = 0; i < info_data.total_knockout_type; i++) {
        var obj = {
          match_turn_name: `第${i + 1}轮`,
          match_turn: i + 1
        }
        matchTurns.push(obj)
      }
    }
  }
  var _index = params.match_type == 2 ? courseLabelItem.match_turn_index || (matchTurns.length - 1) : courseLabelItem.match_turn_index || 0
  courseLabelItem.matchTurns = matchTurns
  courseLabelItem.match_turn = matchTurns[_index].match_turn
  courseLabelItem.match_turn_name = matchTurns[_index].match_turn_name
  courseLabelItem.match_turn_index = _index
  courseLabelItem.match_count += 1;
  courseLabelItem.isFront = params.match_type == 2 ? (matchTurns.length > 1 ? true : false) : false
  courseLabelItem.isAfter = params.match_type == 2 ? false : (matchTurns.length > 1 ? true : false)
  that.setData({
    [`courseLabel[${checkLabelIndex}]`]: courseLabelItem
  })
  console.log('courseLabelItem', courseLabelItem)
}