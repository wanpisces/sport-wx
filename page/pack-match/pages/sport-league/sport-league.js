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
    splendStatus: true,
    sportInfo: [{}], //赛程信息
    tabId: 'tab1',
    checkLabelIndex: 0,
    swiperCurrent: 0,
    checkLabelIndex2: 0,
    checkLabelIndex3: 0,
    checkLabelIndex4: 0,
    courseLabel: [{
      current_page: 1,
      page_size: 10,
      total_num: 0,
      match_turn: 1, //轮次
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }, {
      current_page: 1,
      page_size: 10,
      total_num: 0,
      match_turn: 1, //轮次
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }],
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无数据'
    },
    empty2: {
      icon: '/pic/no-content.png',
      empty_txt: '暂未生成'
    },
    scoreboardTable: {
      ranking: '排名',
      group_name: '球队',
      season: '场次',
      win_num: '胜',
      tie_num: '平',
      fail_num: '负',
      goal_num: '进/失',
      score: '积分'
    },
    shootTable: {
      ranking: '排名',
      user_realname: '球员',
      group_name: '球队',
      goal_num: '进(点)'
    },
    assistsTable: {
      ranking: '排名',
      user_realname: '球员',
      group_name: '球队',
      assists_num: '助攻'
    },
    ryBrand1: {
      group_name: '球队',
      user_realname: '姓名',
      no: '号码',
      card_info: {
        yellow_card: '第N轮'
      },
      next: '下轮'
    },
    ryBrand2: {
      ranking: '排名',
      group_name: '球队',
      user_realname: '姓名',
      no: '号码',
      yellow_card: '黄牌',
      red_card: '红牌'
    },
    ryBrand3: {
      ranking: '排名',
      group_name: '球队',
      yellow_card: '黄牌',
      red_card: '红牌'
    },
    isScoreboardTable: true,
    rankingsLabel: [{
      value: '积分榜',
      current_page: 1,
      page_size: 10,
      total_num: 0,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }, {
      value: '射手榜',
      current_page: 1,
      page_size: 10,
      total_num: 0,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }, {
      value: '助攻榜',
      current_page: 1,
      page_size: 10,
      total_num: 0,
      list: []
    }, {
      value: '红黄牌',
      current_page: 1,
      page_size: 10,
      total_num: 0,
      type: 1,
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
    var that = this,
      tabId = options.tab_id || 'tab1'
    mCompetitionId = options.competition_id || '494924108350357504'
    mCompetitionLevel = options.competition_level || 1
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
        if (tabId == 'tab1') {
          swiperTop = res.statusBarHeight + 46 + 244 * rpxTopx + 400 * rpxTopx
          // swiperTop = mCompetitionLevel == 1 ? res.statusBarHeight + 46 + 296 * rpxTopx + 72 * rpxTopx + 400 * rpxTopx : res.statusBarHeight + 46 + 216 * rpxTopx + 400 * rpxTopx;
        } else {
          swiperTop = res.statusBarHeight + 46 + 264 * rpxTopx + 400 * rpxTopx
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
    if (tabId == 'tab1') { //赛程
      if (mCompetitionLevel == 1) {
        getGroupNoList(this)
      } else {
        getmatchTurnList(this)
      }
      // getCompetitionMatch(that)
    } else { //排行
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
  onItemMatch: function (e) { //轮空不跳转
    var item = e.currentTarget.dataset.item
    if (item.away_group_id == 0 || item.home_group_id == 0) {
      return
    }
    this.setData({
      next_page_data: item
    })
    if (item.is_end == 1) { //赛事完结跳转数据统计页面
      toolUtils.pageTo(`/page/pack-match/pages/sports-record-end/sports-record-end`)
    } else { //跳转赛况
      toolUtils.pageTo(`/page/pack-match/pages/sports-record/sports-record`)
    }
  },

  /**
   * 用户点击右上角分享
   */

  onShareAppMessage: function (res) {
    var competition_id = this.data.competition_id
    var competition_name = this.data.competition_name
    var material_title = this.data.splendTip.material_title
    var material_url = this.data.splendTip.material_url
    var material_type = this.data.splendTip.material_type
    var material_title = this.data.splendTip.material_title
    var material_pic = this.data.splendTip.material_pic
    var material_id = this.data.splendTip.material_id
    if (res.from == 'button') {
      if (material_type == 3) { //视频
        // 转发成功
        var params = {}
        params.branch_type = 6
        params.branch_id = material_id
        httpsUtils.shareBtn(params, function (res) { }, function (e) { })
        return {
          title: material_title,
          imageUrl: material_pic,
          path: '/page/pack-match/pages/sport-share/sport-share?material_id=' + material_id,
        }
      } else { //动图
        // 转发成功
        var params = {}
        params.branch_type = 6
        params.branch_id = material_id
        httpsUtils.shareBtn(params, function (res) { }, function (e) { })
        return {
          title: material_title,
          imageUrl: material_pic,
          path: '/page/pack-match/pages/sport-share/sport-share?material_id=' + material_id,
        }
      }
    } else {
      // 转发成功
      var params = {}
      params.branch_type = 5
      params.branch_id = competition_id
      httpsUtils.shareBtn(params, function (res) { }, function (e) { })
      return {
        title: competition_name,
        path: '/page/pack-match/pages/sport-underway/sport-underway?scene=' + competition_id,
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

    if (match_turn_index > 0) {
      courseLabelItem.match_turn = matchTurns[match_turn_index - 1].match_turn
      courseLabelItem.match_turn_name = matchTurns[match_turn_index - 1].match_turn_name
      courseLabelItem.match_turn_index = match_turn_index - 1 //保存选中的下标
      courseLabelItem.isFront = match_turn_index - 1 > 0 ? true : false //是否有前一轮
      courseLabelItem.isAfter = true //是否还有下一轮
      that.setData({
        [`courseLabel[${checkLabelIndex}]`]: courseLabelItem
      })
      getCompetitionMatch(that)
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
      getCompetitionMatch(that)
    }
  },
  //选择轮次回调
  bindchangeMatchTurns: function (e) {
    var that = this,
      value = e.detail.value, //picker选中的下标
      checkLabelIndex = that.data.checkLabelIndex, //swiper的下标
      courseLabelItem = that.data.courseLabel[checkLabelIndex], //当前swiper数据
      matchTurns = courseLabelItem.matchTurns; //当前轮次的数组
    courseLabelItem.match_turn = matchTurns[value].match_turn
    courseLabelItem.match_turn_name = matchTurns[value].match_turn_name
    courseLabelItem.match_turn_index = value //保存选中的下标
    courseLabelItem.isFront = value > 0 ? true : false //是否有前一轮
    courseLabelItem.isAfter = matchTurns.length - 1 > value ? true : false //是否还有下一轮
    that.setData({
      [`courseLabel[${checkLabelIndex}]`]: courseLabelItem
    })
    getCompetitionMatch(that)
  },
  //选择组回调
  bindchangeGroup: function (e) {
    var index = e.detail.value,
      groupItem = this.data.groupList[index];
    if (mGroupNo == groupItem.group_no) {
      return
    }
    mGroupNo = groupItem.group_no
    this.setData({
      group_name: groupItem.group_name
    })
    getCompetitionMatch(this)

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
      swiperTop = statusBarHeight + 46 + 244 * rpxTopx + 400 * rpxTopx
      swiperHeight = windowHeight - swiperTop
      console.log('赛程', swiperHeight, swiperTop)
    } else if ('tab2' == id) {
      swiperTop = statusBarHeight + 46 + 264 * rpxTopx + 400 * rpxTopx
      swiperHeight = windowHeight - swiperTop
      console.log('排行', swiperHeight, swiperTop)
    }
    that.setData({
      tabId: id,
      swiperTop: swiperTop,
      swiperHeight: swiperHeight,
      swiperCurrent: 0,
      checkLabelIndex3: 0,
      checkLabelIndex: 0,
    })
    if ('tab1' != id) {
      var rankingsLabelItem = that.data.rankingsLabel[0];
      if (rankingsLabelItem.list.length == 0) {
        getRankings(that)
      }
    } else {
      var courseLabelItem = that.data.courseLabel[0]
      if (courseLabelItem.list.length == 0) {
        getCompetitionMatch(that)
      }
    }
  },
  //swiper的tab点击
  bindLabelClick: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index;

    that.setData({
      swiperCurrent: index,
      checkLabelIndex: index
    })
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
    if ('tab1' == id) {
      var courseLabelItem = that.data.courseLabel[current], //当前swiper的item数据
        isEliminate = current == 1 && mCompetitionStatus == 3; // 是否淘汰赛

      if (!isEliminate) {
        swiperTop = statusBarHeight + 46 + 296 * rpxTopx + 72 * rpxTopx + 400 * rpxTopx
      } else {
        swiperTop = statusBarHeight + 46 + 214 * rpxTopx + 72 * rpxTopx + 400 * rpxTopx
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
          getCompetitionMatch(that)
        }
        if (!courseLabelItem.matchTurns || courseLabelItem.matchTurns.length == 0) {
          getmatchTurnList(that)
        }
      } else { //已完成的淘汰赛
        promotionRoad(that) //晋级之路
      }
    } else {
      var rankingsLabelItem = that.data.rankingsLabel[current]
      if (current == 3) {
        swiperTop = statusBarHeight + 46 + 264 * rpxTopx + 172 * rpxTopx + 400 * rpxTopx
        swiperHeight = windowHeight - swiperTop
        if (that.data.competition_status == 3) {
          rankingsLabelItem.type = 2
          that.setData({
            checkLabelIndex4: 1
          })
        }
      } else {
        swiperTop = statusBarHeight + 46 + 264 * rpxTopx + 400 * rpxTopx
        swiperHeight = windowHeight - swiperTop
      }
      that.setData({
        checkLabelIndex3: current,
        swiperTop: swiperTop,
        swiperHeight: swiperHeight
      })
      if (rankingsLabelItem.list.length == 0) {
        getRankings(that)
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
    // getCompetitionMatch(that)
    getmatchTurnList(that)
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
    getRankings(that)

  },
  //监听赛事滚动
  bindSportInfoChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
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
        competition_level: res.competition_level,
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
  //比赛情况跳转页面
  navigatorEvt: function (e) {
    var item = e.currentTarget.dataset.item
    if (item.away_group_id == 0 || item.home_group_id == 0) {
      return
    }
    this.setData({
      next_page_data: item
    })
    if (item.is_end == 1) {
      toolUtils.pageTo(`/page/pack-match/pages/sports-record-end/sports-record-end`)
    } else {
      toolUtils.pageTo(`/page/pack-match/pages/sports-record/sports-record`)
    }
  },
  //跳转赛程或排行页面
  sportEvent: function (e) {
    var tab_id = e.currentTarget.dataset.tabid;
    var competition_id = this.data.competition_id;
    var competition_level = this.data.competition_level;
    toolUtils.pageTo('/page/pack-match/pages/sports-events/sports-events?tab_id=' + tab_id + '&competition_id=' + competition_id + '&competition_level=' + competition_level + '&rank_interval=' + this.data.rank_interval, 1)
  },
})
/**
 * 赛程列表
 */
function getCompetitionMatch(that) {
  var params = {},
    courseLabelItem = {},
    checkLabelIndex = 0;
  params.competition_id = mCompetitionId
  if (mCompetitionLevel == 2) { //杯赛
    var courseLabelIndex = that.data.checkLabelIndex,
      checkLabelIndex = courseLabelIndex;
    courseLabelItem = that.data.courseLabel[courseLabelIndex]
    params.match_type = courseLabelIndex == 0 ? 1 : 2
    if (params.match_type == 1) { //小组赛
      params.group_no = mGroupNo || 1 //小组组号
    } else { //淘汰赛
      params.knockout_type = that.data.checkLabelIndex2 == 0 ? 1 : 0
      if (params.knockout_type == 1) { //晋级赛
        params.knockout_type = courseLabelItem.match_turn
      }
    }
    params.match_turn = courseLabelItem.match_turn
    params.current_page = courseLabelItem.current_page
    params.page_size = courseLabelItem.page_size
  } else if (mCompetitionLevel == 2) { //联赛
    courseLabelItem = that.data.courseLabel[0];
  } else { //其他
    return
  }
  params.match_turn = courseLabelItem.match_turn
  params.current_page = courseLabelItem.current_page
  params.page_size = courseLabelItem.page_size
  httpsUtils.competitionMatch(params, function (res) {
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
 * 排行榜
 */
function getRankings(that) {
  var params = {},
    checkLabelIndex3 = that.data.checkLabelIndex3,
    rankingsLabelItem = that.data.rankingsLabel[checkLabelIndex3];
  params.competition_id = mCompetitionId
  // params.current_page = rankingsLabelItem.current_page
  // params.page_size = rankingsLabelItem.page_size
  if (checkLabelIndex3 == 3) {
    params.type = rankingsLabelItem.type
  }
  httpsUtils.getRankings(checkLabelIndex3, params, function (res) {
    var httpList = []
    if (checkLabelIndex3 == 3) {
      httpList = res.list
    } else {
      httpList = res
    }
    // rankingsLabelItem.total_num = httpList.length
    // if (params.current_page == 1) {
    rankingsLabelItem.list = []
    // }
    rankingsLabelItem.list = rankingsLabelItem.list.concat(httpList)
    // if (rankingsLabelItem.list.length == rankingsLabelItem.total_num) {
    rankingsLabelItem.loadData = {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
    }
    that.setData({
      [`rankingsLabel[${checkLabelIndex3}]`]: rankingsLabelItem
    })
    if (checkLabelIndex3 == 3) {
      that.setData({
        competition_stop_rule: res.competition_stop_rule,
        ['ryBrand1.card_info.yellow_card']: res.stage || `第N轮`
      })
    }
    // } else {
    //   rankingsLabelItem.loadData = {
    //     searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    //     searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    //   }
    //   that.setData({
    //     [`rankingsLabel[${checkLabelIndex3}]`]: rankingsLabelItem
    //   })
    // }
    wx.stopPullDownRefresh()
  }, function (e) {
    // if (rankingsLabelItem.current_page > 1) {
    //   --rankingsLabelItem.current_page
    // }
    // that.setData({
    //   [`rankingsLabel[${checkLabelIndex}].loadData`]: {
    //     searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    //     searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    //   }
    // })
    wx.stopPullDownRefresh()
  })

}

//获取小组
function getGroupNoList(that) {
  var params = {}
  params.competition_id = mCompetitionId
  httpsUtils.groupNoList(params, function (res) {
    var list = numberToUppercase(res)
    if (list.length > 0) {
      mGroupNo = list[0].group_no
      that.setData({
        groupList: list,
        group_name: list[0].group_name,
      })
    }
    getmatchTurnList(that)
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
//获取轮次
function getmatchTurnList(that) {
  var params = {},
    checkLabelIndex = that.data.checkLabelIndex,
    checkLabelIndex2 = that.data.checkLabelIndex2;
  params.competition_id = mCompetitionId
  params.match_type = 1
  httpsUtils.matchTurnList(params, function (res) {
    if (res.list.length < 0) {
      return
    } else if (res.list.length == 0) {
      courseLabelItem = res;
      that.setData({
        [`courseLabel[${checkLabelIndex}]`]: courseLabelItem
      })
      return
    }
    var matchTurns = [],
      courseLabelItem = that.data.courseLabel[checkLabelIndex];
    // if (params.match_type == 2 && params.knockout_type == 1) { //晋级赛
    //   for (var index in res.list) {
    //     var item = res.list[index]
    //     var obj = {
    //       match_turn_name: '1/' + item.knockout_type + '决赛',
    //       match_turn: item.knockout_type
    //     }
    //     matchTurns.push(obj)
    //   }
    // } else { //排位赛
    // console.log("排位赛")
    //   for (var index in res.list) {
    //     var item = res.list[index]
    //     var obj = {
    //       match_turn_name: '第' + item.match_turn + '轮',
    //       match_turn: item.match_turn
    //     }
    //     matchTurns.push(obj)
    //   }
    // }
    for (var index in res.list) {
      var item = res.list[index]
      var obj = {
        match_turn_name: '第' + item.match_turn + '轮',
        match_turn: item.match_turn
      }
      matchTurns.push(obj)
    }
    var _index = 0
    courseLabelItem.matchTurns = matchTurns
    courseLabelItem.match_turn = matchTurns[_index].match_turn
    courseLabelItem.match_turn_name = matchTurns[_index].match_turn_name
    courseLabelItem.match_turn_index = _index
    courseLabelItem.isFront = false
    courseLabelItem.isAfter = matchTurns.length > 1 ? true : false
    that.setData({
      [`courseLabel[${checkLabelIndex}]`]: courseLabelItem
    })
    getCompetitionMatch(that)
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
//小组转化
function numberToUppercase(numbers) {
  var chars = []
  for (var index in numbers) {
    var item = numbers[index],
      code = parseInt(item) + 64;
    var obj = {
      group_name: String.fromCharCode(code) + '组',
      group_no: item
    }
    chars.push(obj)
  }
  return chars
}

//晋级之路
function promotionRoad(that) {
  var params = {}
  params.competition_id = mCompetitionId
  httpsUtils.promotionRoad(params, function (res) {
    that.setData({
      img_url: res.img_url
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}