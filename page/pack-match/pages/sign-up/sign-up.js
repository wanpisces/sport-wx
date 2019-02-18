// page/pack-match/pages/sign-up/sign-up.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js");
var mCompetitionId, user_tel, mCompetitionRule, topPage, allow_max_team_member_num,
  isEnlist = -1 //是否报名
  ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,
      pageList = getCurrentPages();
    topPage = pageList[pageList.length - 2]
    mCompetitionId = options.competition_id || -1
    mCompetitionRule = options.competition_rule || 0
    allow_max_team_member_num = topPage.data.allow_max_team_member_num
    isEnlist = options.is_enlist
    if (isEnlist == 1) {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            statusBarHeight: res.statusBarHeight,
            competition_rule: mCompetitionRule,
            need_realname: options.need_realname,
            allow_max_team_member_num: allow_max_team_member_num,
            is_enlist: true,
            attr_id: options.attr_id
          })
        }
      })
      putTeam(that)
    } else {
      if (topPage.route == 'page/pack-match/pages/match-sign-up/match-sign-up') {
        var group_id = topPage.data.teamList[topPage.data.selectTeamIndex].group_id;
        var index = topPage.data.selectTeamIndex;
        getTeamDetails(that, group_id, index)
        that.setData({
          is_enlist: true,
          groupId: group_id,
          from_page: 'match-sign-up',
          group_name: topPage.data.teamList[topPage.data.selectTeamIndex].group_name
        })
      }
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            statusBarHeight: res.statusBarHeight,
            teamList: topPage.data.teamList,
            competition_rule: mCompetitionRule,
            allow_max_team_member_num: allow_max_team_member_num,
            need_realname: options.need_realname,
            attr_id: options.attr_id
          })
        }
      })
      getApp().userInfo(function (res) {
        user_tel = res.user_tel || res.user_phone
        that.setData({
          user_tel: user_tel
        })
        console.log('user_tel', user_tel)
      })
    }
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
  //提交报名
  submit: toolUtils.throttle(function () {
    if (this.data.is_enlist) {
      if (this.data.from_page) {
        putCompetitionEnlist(this)
      } else {
        updateTeam(this)
      }
    } else {
      putCompetitionEnlist(this)
    }
  }),
  //输入电话号码
  bindinput: function (e) {
    user_tel = e.detail.value
  },
  //添加参赛队员
  onAdd: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      list1 = that.data.userList1,
      list2 = that.data.userList2;

    list1.push(list2[index])
    list2.splice(index, 1)
    that.setData({
      userList1: list1,
      userList2: list2,
    })
  },
  //移除参赛队员
  onSubtract: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      list1 = that.data.userList1,
      list2 = that.data.userList2;
    list2.push(list1[index])
    list1.splice(index, 1)
    that.setData({
      userList1: list1,
      userList2: list2,
    })
  },
  //选择队伍
  bindPickerChangeGroup: function (e) {
    var that = this,
      index = e.detail.value,
      group = that.data.teamList[index];
    that.setData({
      index: index,
      groupId: group.group_id,
      group_name: group.group_name
    })
    if (!group.group_info) {
      getTeamDetails(that, group.group_id, index)
    } else {
      memberListHandle(that, group.group_info)
    }
  }
})
//获取队伍详情
function getTeamDetails(that, group_id, index) {
  httpsUtils.competitionGroup(group_id, {}, function (res) {
    that.setData({
      [`teamList[${index}].group_info`]: res,
      index: index
    })
    memberListHandle(that, res)
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
//处理成员数据
function memberListHandle(that, group_info) {
  var user_id = group_info.user_info.user_id,
    userList1 = [],
    userList2 = group_info.member_list,
    userList2_ = [];
  for (var i = 0, length = userList2.length; i < length; i++) {
    if (user_id == userList2[i].user_id) {
      userList1.push(userList2[i])
    } else {
      userList2_.push(userList2[i])
    }
  }
  that.setData({
    userList1: userList1,
    userList2: userList2_,
    user_id: user_id
  })
  console.log(that.data.userList2)
}

//提交报名
function putCompetitionEnlist(that) {
  var params = {},
    index = that.data.index,
    item = that.data.teamList[index],
    list1 = that.data.userList1,
    enlist_user = [];
  if (!user_tel) {
    toolUtils.showToast("联系方式不能为空")
    return
  }
  // if (list1.length < mCompetitionRule) {
  //   toolUtils.showToast("参赛队员人数不够")
  //   return
  // }
  if (allow_max_team_member_num != 0 && list1.length > allow_max_team_member_num) {
    toolUtils.showToast(`人数不能超过${allow_max_team_member_num}`)
    return
  }
  params.group_id = item.group_info.group_id
  params.competition_id = mCompetitionId
  params.user_tel = user_tel
  for (var i = 0, length = list1.length; i < length; i++) {
    enlist_user.push(list1[i].user_id)
  }
  params.enlist_user = enlist_user
  params.remark = ''
  that.setData({
    isloading: true
  })
  httpsUtils.competitionEnlist(params, function (res) {
    toolUtils.showToast("报名成功")
    topPage.setData({
      is_enlist: 1
    })
    wx.navigateBack({
      delta: 1
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
    that.setData({
      isloading: false
    })
  })
}

//获取报名信息
function putTeam(that) {
  var params = {};
  params.competition_id = mCompetitionId
  httpsUtils.putTeam(params, function (res) {
    user_tel = res.user_info.user_tel || res.user_info.user_phone

    if (that.data.need_realname == 1) {
      var arr = res.not_join_list,
        userList2 = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].audit_status == 2) {
          userList2.push(arr[i])
        }
      }
      that.setData({
        group_info: res.group_info,
        groupId: res.group_info.group_id,
        group_soccer: res.group_soccer,
        user_info: res.user_info,
        user_tel: user_tel,
        userList1: res.join_list,
        userList2: userList2,
        user_id: res.user_info.user_id
      })
    } else {
      that.setData({
        group_info: res.group_info,
        groupId: res.group_info.group_id,
        group_soccer: res.group_soccer,
        user_info: res.user_info,
        user_tel: user_tel,
        userList1: res.join_list,
        userList2: res.not_join_list,
        user_id: res.user_info.user_id
      })
    }

  }, function (e) {

  })
}

//提交报名
function updateTeam(that) {
  var params = {},
    group_info = that.data.group_info,
    list1 = that.data.userList1,
    enlist_user = [];
  if (!user_tel) {
    toolUtils.showToast("联系方式不能为空")
    return
  }
  // if (list1.length < mCompetitionRule) {
  //   toolUtils.showToast("参赛队员人数不够")
  //   return
  // }
  if (allow_max_team_member_num != 0 && list1.length > allow_max_team_member_num) {
    toolUtils.showToast(`人数不能超过${allow_max_team_member_num}`)
    return
  }
  params.group_id = group_info.group_id
  params.competition_id = mCompetitionId
  params.user_tel = user_tel
  for (var i = 0, length = list1.length; i < length; i++) {
    enlist_user.push(list1[i].user_id)
  }
  params.enlist_user = enlist_user
  params.remark = ''
  that.setData({
    isloading: true
  })
  httpsUtils.updateTeam(params, function (res) {
    toolUtils.showToast("修改成功")
    topPage.setData({
      is_enlist: 1
    })
    wx.navigateBack({
      delta: 1
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
    that.setData({
      isloading: false
    })
  })
}