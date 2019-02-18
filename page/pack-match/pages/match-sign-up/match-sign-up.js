// page/pack-match/pages/match-sign-up/match-sign-up.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js");
var WxParse = require('../../../../libs/wxParse/wxParse.js')
var mPageSize //每页条数
var mTotalNum //总条数
var mCurrentPage
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectTeamIndex: -1,
    isLoading: true,
    selected: false,
    select: 1,
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无队伍'
    },
    teamList: [],
    moreTeamState: false,
    loadData: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    mPageSize = 3 //每页条数
    mCurrentPage = 1
    if (options.competition_id) {
      that.data.competition_id = options.competition_id || '503619487694585856'
      that.setData({
        isGoHome: true
      })
    } else {
      that.data.competition_id = options.scene || '503619487694585856'
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          isLoading: true,
          clientHeight: res.windowHeight - 387,
          statusBarHeight: res.statusBarHeight,
          sportTipState: true
        })
      }
    })
    this.getInfo_init({
      type: that.data.select
    });
    this.getCompetitionDetalis(this);
  },

  //获取详情数据
  getCompetitionDetalis: function (that) {
    var params = {}
    httpsUtils.competitionDetalis(that.data.competition_id, params, function (res) {
      that.setData(res)
      WxParse.wxParse('article1', 'html', res.competition_notice || '', that);
      WxParse.wxParse('article2', 'html', res.competition_rule_txt || '', that);
      if (res.is_enlist == 1) {
        that.setData({
          selected: true
        })
      }
      if (res.competition_status == 1) {
        var time1 = (new Date(res.enlist_starttime + " 00:00:00")).getTime();
        var time2 = new Date().getTime()
        if (time1 > time2) {
          that.setData({
            isNotStarted: true
          })
        }
      }
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },

  //获取队伍信息
  getInfo_init: function (_obj) {
    var that = this;
    var params = Object.assign({
      competition_id: that.data.competition_id,
      current_page: mCurrentPage,
      page_size: mPageSize
    }, _obj)
    httpsUtils.competitionTeamList(params, function (res) {
      mTotalNum = res.total_num;
      if (res.current_page == 1) {
        that.data.teamList = [];
      }
      that.data.teamList = that.data.teamList.concat(res.list);
      if (that.data.teamList.length == res.total_num) {
        that.data.loadData = {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
        that.data.moreTeamState = false;
        that.setData({
          teamList: that.data.teamList,
          loadData: that.data.loadData,
          moreTeamState: that.data.moreTeamState
        })
      } else {
        that.data.moreTeamState = true;
        that.data.loadData = {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏  
        }
        that.setData({
          teamList: that.data.teamList,
          loadData: that.data.loadData,
          moreTeamState: that.data.moreTeamState,
        })
      }
      wx.stopPullDownRefresh()
    }, function (e) {
      if (mCurrentPage > 1) {
        --mCurrentPage
      }
      that.data.moreTeamState = true;
      that.data.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        loadData: that.data.loadData,
        moreTeamState: that.data.moreTeamState,
      })
      wx.stopPullDownRefresh()
    })
  },
  //队长报名和队员报名
  radioChange: function (e) {
    this.setData({
      select: e.detail.value,
      teamList: [],
      selectTeamIndex: -1
    })
    if (this.data.select == 1) {
      mPageSize = 4
    } else {
      mPageSize = 3
    }
    this.getInfo_init({
      type: this.data.select
    });
  },
  //更多队伍
  moreTeamEvt: function () {
    var that = this;
    if (mTotalNum > mPageSize * mCurrentPage) {
      ++mCurrentPage;
      that.data.moreTeamState = true;
      that.data.loadData = {
        searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        loadData: that.data.loadData,
        moreTeamState: that.data.moreTeamState
      })
      that.getInfo_init({
        type: that.data.select
      });
    } else {
      that.data.moreTeamState = false;
      that.data.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        loadData: that.data.loadData,
        moreTeamState: that.data.moreTeamState
      })
    }
  },
  //创建球队页面
  creatSportTeam: function (e) {
    toolUtils.pageTo("/page/pack-index/pages/organize-team/organize-team?attr_id=2");
  },
  // 报名，进行中，已完结状态按钮
  detailApplyEvt: toolUtils.throttle(function (e) {
    var that = this;
    var title = e.currentTarget.dataset.title
    switch (title) {
      //报名
      case 'one':
        {
          if (this.data.isNotStarted) {
            toolUtils.showToast('报名未开始');
          } else {
            httpsUtils.getUserInfo({}, function (res) {
              if (that.data.need_realname != 2) {
                if (res.audit_status != 2) {
                  wx.showModal({
                    content: '此赛事是实名制，是否进行实名认证',
                    success: function (res) {
                      if (res.confirm) {
                        toolUtils.pageTo(`/page/pack-mine/mine-really/mine-really?audit_status=${res.audit_status || '0'}`);
                      }
                    }
                  })
                } else {
                  that.navigateEvt()
                }
              } else {
                that.navigateEvt()
              }
            }, function (e) { })
          }
          break;
        }
      case 'two':
        {
          //进行中
          toolUtils.pageTo(`/page/pack-match/pages/sport-underway/sport-underway?competition_id=${that.data.competition_id}`)
          break
        }
      case 'three':
        {
          //已结束
          toolUtils.pageTo(`/page/pack-match/pages/sport-summary/sport-summary?competition_id=${that.data.competition_id}`)
          break
        }
    }
  }, 1000),
  /**
   * 返回首页
   */
  goHome: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },
  //打开弹窗
  alreadySport: function () {
    this.setData({
      sportTipState: false
    })
  },
  //关闭弹窗
  cancelBtn: function () {
    this.setData({
      sportTipState: true
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
    // 转发成功
    var params = {}
    params.branch_type = 5
    params.branch_id = this.data.competition_id
    httpsUtils.shareBtn(params, function (res) { }, function (e) { })
    return {
      title: this.data.competition_name,
      path: '/page/pack-match/pages/match-sign-up/match-sign-up?competition_id=' + this.data.competition_id,
      imageUrl: this.data.competition_pic,

    }
  },
  //选择队伍
  onItem: function (e) {
    var index = e.currentTarget.dataset.index,
      item = this.data.teamList[index];
    if (item.group_status == 0 || (this.data.select == 2 && this.data.is_enlist != 1)) {
      this.setData({
        selectTeamIndex: index,
        group_id: this.data.teamList[index].group_id
      })
    }


  },
  //同意须知和规程
  onSelected: toolUtils.throttle(function (e) {
    this.setData({
      selected: !this.data.selected
    })
    console.log(this.data.selected)
  }, 1000),

  //同意报名的页面跳转
  navigateEvt: function () {
    var that = this;
    if (that.data.selected && that.data.selectTeamIndex > -1 || that.data.is_enlist == 1) {
      if (that.data.select == 2) {
        toolUtils.pageTo(`/page/pack-match/pages/sign-up/sign-up?is_enlist=${that.data.is_enlist}&competition_id=${that.data.competition_id}&competition_rule=0&need_realname={{that.data.need_realname}}`)
      } else {
        toolUtils.pageTo(`/page/pack-mine/complete-infomation/complete-infomation?attr_id=2&group_id=${that.data.group_id}`)
      }
    } else {
      if (!that.data.selected) {
        toolUtils.showToast('请先同意上诉条例')
      } else if (that.data.selectTeamIndex < 0) {
        toolUtils.showToast('请先选择队伍')
      }
    }
  }
})