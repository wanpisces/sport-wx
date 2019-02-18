var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js");
var WxParse = require('../../../../libs/wxParse/wxParse.js')
var mCompetitionId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personal_is_esline: false,
    personal_is_userInfo: false,
    competition_tag: 2, // 1是队伍，2是个人
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无数据'
    },
    detail_team: [],
    detail_tab: {
      currentTab: 0,
      isShow: true
    }
  },
  //tab切换事件
  tabNav: function (e) {
    if (this.data.detail_tab.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var showMode = e.target.dataset.current == 2;
      this.data.detail_tab.currentTab = e.target.dataset.current;
      this.data.detail_tab.isShow = showMode;
      this.setData({
        detail_tab: this.data.detail_tab
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this,
      sceneCode = getApp().data.sceneCode; //进入场景值
    if (getCurrentPages().length == 1) {
      mCompetitionId = options.scene
      that.setData({
        isGoHome: true
      })
    } else {
      mCompetitionId = options.competition_id
    }
    wx.getSystemInfo({
      success: function (res) {
        var rpxTop = res.windowWidth / 750
        that.setData({
          isLoading: true,
          windowHeight: res.windowHeight,
          statusBarHeight: res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          minHeight: res.windowHeight - res.statusBarHeight - 89 - 390 * rpxTop - 145 * rpxTop + 100 * rpxTop
        })
        console.log(that.data.minHeight)
      }
    })
    getCompetitionDetalis(that)
  },
  //刷新
  refreshData() {
    getCompetitionDetalis(this)
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
  //收藏
  collectEvt: function () {
    var that = this,
      params = {
        branch_type: 5,
        branch_id: mCompetitionId
      }
    httpsUtils.putFavorite(params, function (res) {
      // if (that.data.is_favorites == 1){
      //   toolUtils.showToast('取消收藏成功');
      // }else{
      //   toolUtils.showToast('收藏成功');
      // }
      that.setData({
        is_favorites: that.data.is_favorites == 1 ? 2 : 1
      })
    }, function (e) {

    })
  },
  /**
   * 返回首页
   */
  goHome: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },

  //跳转到队伍主页
  navigationTeam: function (e) {
    var item = this.data.enlist_group[e.currentTarget.dataset.index]
    toolUtils.pageTo("/page/pack-index/pages/team-page/team-page?group_id=" + item.group_id)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var _img, _title;
    if (res.from == 'button') {
      _img = this.data.share_pic || this.data.competition_pic;
      _title = this.data.share_desc || this.data.competition_name
    } else {
      _img = this.data.competition_pic;
      _title = this.data.competition_name
    }
    // 转发成功
    var params = {}
    params.branch_type = 5
    params.branch_id = this.data.competition_id
    httpsUtils.shareBtn(params, function (res) { }, function (e) { })
    return {
      title: _title,
      path: '/page/pack-match/pages/sport-detail/sport-detail?scene=' + this.data.competition_id,
      imageUrl: _img,
    }
  },
  //禁止swiper滑动
  catchTouchMove: function () {

  },
  //关注
  onFollow: function () {
    putFollow(this)

  },
  // 完善个人信息（取消）
  cancelPersonal: function () {
    this.setData({
      personal_is_userInfo: false,
    })
  },
  //完善个人信息（确定）
  surePersonal: function () {
    toolUtils.pageTo(`/page/pack-match/pages/user-info/user-info?is_enlist=2&competition_id=${mCompetitionId}`)
    this.setData({
      personal_is_userInfo: false,
    })
  },
  //同意须知和规程
  onSelected: toolUtils.throttle(function (e) {
    this.setData({
      selected: !this.data.selected
    })
  }, 1000),
  //我要报名
  detailApplyEvt: toolUtils.throttle(function (e) {
    if (this.data.is_enlist == 1 && this.data.competition_status == 1) {
      if (this.data.competition_tag == 1) {
        //已报名（队伍）
        toolUtils.pageTo(`/page/pack-match/pages/sign-up/sign-up?is_enlist=1&competition_id=${mCompetitionId}&competition_rule=${this.data.competition_rule || 0}&need_realname=${this.data.need_realname}&attr_id=${this.data.attr_id}`)
      } else {
        // 已报名（个人）
        toolUtils.pageTo(`/page/pack-match/pages/user-info/user-info?is_enlist=1&competition_id=${mCompetitionId}`)
      }
    } else if (this.data.competition_status == 1 && !this.data.isNotStarted) {
      isAgreement(this)
    } else if (this.data.isNotStarted) {
      toolUtils.showToast('报名未开始')
    }
  }, 1000)
})

//获取详情数据
function getCompetitionDetalis(that) {
  var params = {}
  httpsUtils.competitionDetalis(mCompetitionId, params, function (res) {
    if (res.enlist_group && res.enlist_group.length > 0) {
      var list = []
      //只展示已通过的队伍
      for (var index in res.enlist_group) {
        if (res.enlist_group[index].audit_status == 2) {
          list.push(res.enlist_group[index])
        }
      }
      res.enlist_group = list
    }
    that.setData(res)
    WxParse.wxParse('article1', 'html', res.competition_notice || '无', that);
    WxParse.wxParse('article2', 'html', res.competition_rule_txt || '无', that);
    if (res.competition_status == 1) {
      var time1 = (new Date(res.enlist_starttime + " 00:00:00")).getTime();
      var time2 = new Date().getTime()
      if (time1 > time2) {
        that.setData({
          isNotStarted: true
        })
      }
    }
    if (res.theme_pic) {
      that.setData({
        theme_pic: `background-image:url(${res.theme_pic})`
      })
    }
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}


//判断是否同意协议
function isAgreement(that) {
  if (!that.data.selected) {
    wx.showModal({
      title: '提示',
      content: '我已阅读须知和规程，并同意上述条例。',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            selected: !that.data.selected
          })
          if (that.data.competition_tag == 1) { //队伍
            isAudit(that)
          } else { //个人
            isNeedRealName(that)
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  } else {
    if (that.data.competition_tag == 1) {
      isAudit(that)
    } else {
      isNeedRealName(that)
    }
  }
}
//判断个人报名信息是否完整
function isAuditPerson(that) {
  if (that.data.is_complete == 1) {
    //信息完整
    var params = {
      competition_id: that.data.competition_id
    }
    httpsUtils.competitionPersonalEnlist(params, function (res) {
      //报名成功(弹窗)
      that.setData({
        personal_is_esline: true
      })
      setTimeout(function () {
        that.setData({
          personal_is_esline: false
        })
      }, 1000)
      getCompetitionDetalis(that)
    }, function (e) {
      //报名失败
      toolUtils.showToast(e.data.msg)
    })
  } else {
    //信息不完整
    that.setData({
      personal_is_userInfo: true
    })
  }
}
//判断个人状态是否需要实名制，报名人数是否已满
function isNeedRealName(that) {
  if (that.data.is_full == 1) {
    toolUtils.showToast('报名队伍已满！')
    return
  }
  if (that.data.need_realname == 1) { //需要实名认证
    getApp().userInfo(function (userInfo) {
      httpsUtils.getUserInfo({}, function (userInfo) {
        if (userInfo.audit_status == 2) { //已实名
          isAuditPerson(that)
        } else if (userInfo.audit_status == 1) { //已实名
          toolUtils.showToast('实名认证正在审核，请审核通过再报名')
        } else {
          //未实名
          wx.showModal({
            title: '提示',
            content: '需通过实名认证才能报名',
            success: function (res) {
              if (res.confirm) {
                var audit_status = userInfo.audit_status
                toolUtils.pageTo('/page/pack-mine/mine-really/mine-really?audit_status=' + audit_status)
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        toolUtils.setMyUserInfo(userInfo)
      }, function (e) {
        toolUtils.showToast(e.data.msg)
      })
    })
  } else { //不需要实名认证
    isAuditPerson(that)
  }
}

//判断：队伍数量已满，和实名认证
function isAudit(that) {
  if (that.data.is_full == 1) {
    toolUtils.showToast('报名队伍已满！')
    return
  }
  if (that.data.need_realname == 1) { //需要实名认证
    getApp().userInfo(function (userInfo) {
      httpsUtils.getUserInfo({}, function (userInfo) {
        if (userInfo.audit_status == 2) {
          isMyGroup(that)
        } else if (userInfo.audit_status == 1) { //已实名
          toolUtils.showToast('实名认证正在审核，请审核通过再报名')
        } else {
          wx.showModal({
            title: '提示',
            content: '需通过实名认证才能报名',
            success: function (res) {
              if (res.confirm) {
                var audit_status = userInfo.audit_status
                toolUtils.pageTo('/page/pack-mine/mine-really/mine-really?audit_status=' + audit_status)
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        toolUtils.setMyUserInfo(userInfo)
      }, function (e) {

      })
    })
  } else {
    isMyGroup(that)
  }
}
//判断成员队伍及队伍人数是否满足
function isMyGroup(that) {
  httpsUtils.myGroup({
    current_page: 1,
    page_size: 1000,
    attr_id: that.data.attr_id,
    is_leader: 1
  }, function (res) {
    var list = res.list
    if (list.length == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '您暂无符合规则的队伍，快去创建或加入一个吧',
        success: function (res) {
          if (res.confirm) {
            // toolUtils.pageTo(`/page/pack-index/pages/organize-team/organize-team?attr_id=${that.data.attr_id}`, 1)
            // toolUtils.pageTo('/page/tabBar/index/index', 3)
            if (that.data.attr_id == 2 || that.data.attr_id == 3) {
              toolUtils.pageTo(`/page/pack-index/pages/organize-team/organize-team?attr_id=${that.data.attr_id}`, 1)
            } else {
              toolUtils.pageTo(`/page/pack-index/pages/currency-organize-team/organize-team?attr_id=${that.data.attr_id}`, 1)
            }
            console.log('确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      // var competition_rule = that.data.competition_rule || 0
      // for (var i = 0, length = list.length; i < length; i++) {
      //   if (list[i].member_num >= competition_rule) {
      that.data.teamList = list
      toolUtils.pageTo(`/page/pack-match/pages/sign-up/sign-up?competition_id=${mCompetitionId}&competition_rule=${that.data.competition_rule || 0}&need_realname=${that.data.need_realname}&attr_id=${that.data.attr_id}`)
      //     return
      //   }
      // }
      // wx.showModal({
      //   title: '温馨提示',
      //   content: '您拥有的队伍人数不满足！',
      //   showCancel: false,
      //   success: function(res) {
      //     if (res.confirm) {

      //     } else if (res.cancel) {

      //     }
      //   }
      // })
    }
  }, function (e) {

  })
}

//关注赛事
function putFollow(that) {
  var params = {}
  params.branch_type = 5
  params.branch_id = mCompetitionId
  httpsUtils.putFollow(params, function (res) {
    if (that.data.is_atten == 1) {
      that.setData({
        is_atten: 2
      })
    } else {
      that.setData({
        is_atten: 1
      })
    }
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}