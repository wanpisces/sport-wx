// page/pack-find/yue-score/yue-score.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    array: [],
    // 足球
    arrayR: [{
      score_type: 1,
      name: '进球'
    }, {
      score_type: 2,
      name: '助攻'
    }, {
      score_type: 3,
      name: '红牌'
    }, {
      score_type: 4,
      name: '黄牌'
    }],
    // 篮球
    arrayScore: [{
      score_type: 1,
      name: '得分'
    }, {
      score_type: 2,
      name: '两分'
    }, {
      score_type: 3,
      name: '三分'
    }],
    teamArr: [{
      teamerName: '选择队伍',
      indexD: 0,
      indexR: 0,
      score: '',
      score_attr: '',
    }],
    formData: {
      score: 0,
      list: [],
    },
    bgUrl1: getApp().data.bgUrl1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          isLoading: true,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          bgh: (res.statusBarHeight + 45) * 750 / res.windowWidth + 230,
          date: new Date().toLocaleDateString(),
        })
      }
    })
    try {
      that.setData({
        soccer_movement_id: options.soccer_movement_id,
        attr_id: options.attr_id
      })
    } catch (e) { }
    that.getMovementDetail();
    if (that.data.attr_id == 3) {
      that.data.teamArr = [{
        teamerName: '选择队伍',
        indexD: 0,
        indexR: 0,
        score: '',
        score_attr: '',
      }, {
        teamerName: '选择队伍',
        indexD: 0,
        indexR: 1,
        score: '',
        score_attr: '',
      }, {
        teamerName: '选择队伍',
        indexD: 0,
        indexR: 2,
        score: '',
        score_attr: '',
      }]
    }
    if (that.data.attr_id == 2) {
      that.data.teamArr = [{
        teamerName: '选择队伍',
        indexD: 0,
        indexR: 0,
        score: '',
        score_attr: '',
      }, {
        teamerName: '选择队伍',
        indexD: 0,
        indexR: 1,
        score: '',
        score_attr: '',
      }, {
        teamerName: '选择队伍',
        indexD: 0,
        indexR: 2,
        score: '',
        score_attr: '',
      }, {
        teamerName: '选择队伍',
        indexD: 0,
        indexR: 3,
        score: '',
        score_attr: '',
      }]
    }
  },
  //获取约战详情
  getMovementDetail: function () {
    that = this;
    httpsUtils.movementDetail(that.data.soccer_movement_id, {}, function (res) {
      if (res.user_role == 1 || res.user_role == 3 || res.user_role == 5) {
        that.data.formData.score = res.movement_result.home_score || 0;
        that.data.formData.list = res.movement_result.home
        that.data.group_id = res.group_info.group_id
        if (res.movement_result.home_raw && res.movement_result.home_raw.length > 0) {
          that.data.teamArr = res.movement_result.home_raw
        }
      } else if (res.user_role == 2 || res.user_role == 4 || res.user_role == 6) {
        that.data.formData.score = res.movement_result.away_score || 0;
        that.data.formData.list = res.movement_result.away
        that.data.group_id = res.away_info.group_id
        if (res.movement_result.away_raw && res.movement_result.away_raw.length > 0) {
          that.data.teamArr = res.movement_result.away_raw
        }
      }
      that.setData({
        dataList: res,
        formData: that.data.formData,
        group_id: that.data.group_id,
        teamArr: that.data.teamArr
      })
      that.getGroupTeam();
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  // 类型比较  足球类型
  getArrayR: function () {
    for (var i = 0; i < that.data.teamArr.length; i++) {
      for (var j = 0; j < that.data.arrayR.length; j++) {
        if (that.data.teamArr[i].score_type == that.data.arrayR[j].score_type) {
          that.data.teamArr[i].indexR = j
          that.setData({
            teamArr: that.data.teamArr
          })
        }
      }
    }
  },
  // 类型比较  篮球类型
  getArrayScore: function () {
    for (var i = 0; i < that.data.teamArr.length; i++) {
      for (var j = 0; j < that.data.arrayScore.length; j++) {
        if (that.data.teamArr[i].score_type == that.data.arrayScore[j].score_type) {
          that.data.teamArr[i].indexR = j
          that.setData({
            teamArr: that.data.teamArr
          })
        }
      }
    }
  },
  // 队员比较
  getArray: function () {
    for (var i = 0; i < that.data.teamArr.length; i++) {
      for (var j = 0; j < that.data.array.length; j++) {
        if (that.data.teamArr[i].user_id == that.data.array[j].user_id) {
          that.data.teamArr[i].indexD = j
          that.setData({
            teamArr: that.data.teamArr
          })
        }
      }
    }
  },
  // 获取队伍成员
  getGroupTeam: function () {
    that = this;
    httpsUtils.getAllGroupMember({
      attr_id: that.data.attr_id,
      group_id: that.data.group_id
    }, function (res) {
      if (that.data.attr_id == 2 || that.data.attr_id == 3) {
        res.forEach(item => {
          item.user_msg = item.user_nickname + '#' + item.no
        })
      }
      that.setData({
        array: res,
        teamArr: that.data.teamArr
      })
      if (that.data.teamArr.length > 0 && that.data.dataList.is_confirm == 1) {
        if (that.data.dataList.attr_id == 2) {
          that.getArrayR();
        }
        if (that.data.dataList.attr_id == 3) {
          that.getArrayScore();
        }
        that.getArray();
      }
    }, function (e) { })
  },



  // 选择队伍成员
  bindPickerChange: function (e) {
    var curIndex = e.currentTarget.dataset.index;
    var teamArr = that.data.teamArr;
    var array = that.data.array;
    teamArr[curIndex].indexD = e.detail.value;
    console.log(e.detail.value, curIndex)
    teamArr[curIndex].teamerName = array[e.detail.value].user_nickname,
      teamArr[curIndex].group_id = array[e.detail.value].user_id;
    this.setData({
      teamArr: teamArr
    })
  },
  // 选择类型
  bindPickerChangeR(e) {
    var curIndex = e.currentTarget.dataset.index;
    var teamArr = that.data.teamArr;
    teamArr[curIndex].indexR = e.detail.value
    this.setData({
      teamArr: teamArr
    })
  },
  bindPickerChangeScore(e) {
    var curIndex = e.currentTarget.dataset.index;
    var teamArr = that.data.teamArr;
    teamArr[curIndex].indexR = e.detail.value
    this.setData({
      teamArr: teamArr
    })
  },
  // 队伍进球数
  getTotalScore: function (e) {
    var formData = this.data.formData;
    if (isNaN(e.detail.value) || parseInt(e.detail.value) < 0 || e.detail.value == "") {
      formData.score = 0;
    } else {
      formData.score = e.detail.value;
    }
    this.setData({
      formData: formData
    })
  },
  //获取队员进球数
  getScore: function (e) {
    var curIndex = e.currentTarget.dataset.index;
    var teamArr = that.data.teamArr;
    if (isNaN(e.detail.value) || parseInt(e.detail.value) < 0 || e.detail.value == "") {
      teamArr[curIndex].score = 0;
    } else {
      teamArr[curIndex].score = parseInt(e.detail.value);
    }
    this.setData({
      teamArr: teamArr
    })
  },
  // 获取球员自定义类型
  getType: function (e) {
    var curIndex = e.currentTarget.dataset.index;
    var teamArr = that.data.teamArr;
    teamArr[curIndex].score_attr = e.detail.value
    this.setData({
      teamArr: teamArr
    })
  },
  // 添加队员数据
  addTeamData(e) {
    var id = e.currentTarget.dataset.id;
    var teamArr = that.data.teamArr;
    // if (id == 2) {
    teamArr.push({
      teamerName: '选择队伍',
      indexD: 0,
      indexR: 0,
      score_attr: '',
      score: '',
    })
    // }
    that.setData({
      teamArr: teamArr
    })
  },
  // 删除队员数据
  deleteTeamer(e) {
    var curIndex = e.currentTarget.dataset.index;
    var teamArr = that.data.teamArr;
    teamArr.splice(curIndex, 1);
    that.setData({
      teamArr: teamArr
    })
  },
  // 跳过
  submitSkip: function () {
    that = this;
    var _type;
    var params = {};
    var dataList = that.data.dataList
    if (dataList.user_role == 1 || dataList.user_role == 3 || dataList.user_role == 5) {
      _type = 1
    } else if (dataList.user_role == 2 || dataList.user_role == 4 || dataList.user_role == 6) {
      _type = 2
    }
    params.soccer_movement_id = that.data.soccer_movement_id
    params.attr_id = that.data.attr_id
    params.type = _type
    console.log(params)
    httpsUtils.completeMovement(params, function (res) {
      var pages = getCurrentPages();
      pages[pages.length - 2].freshData(); //刷新上一页面
      wx.navigateBack({
        delta: 1,
      })
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  // 确认提交
  submitForm() {
    that = this;
    var _type, dataObj, checkVoid, params = {},
      memberList = [],
      soccer_movement_id = that.data.soccer_movement_id,
      group_id = that.data.group_id;
    var dataList = that.data.dataList
    if (dataList.user_role == 1 || dataList.user_role == 3 || dataList.user_role == 5) {
      _type = 1
    } else if (dataList.user_role == 2 || dataList.user_role == 4 || dataList.user_role == 6) {
      _type = 2
    }
    var teamArr = this.data.teamArr;
    if (that.data.attr_id == 2) { // 足球类型
      for (var i = 0; i < teamArr.length; i++) {
        dataObj = {
          user_id: that.data.array[teamArr[i].indexD].user_id,
          score_type: that.data.arrayR[teamArr[i].indexR].score_type,
          score: teamArr[i].score + ''
        }
        memberList = memberList.concat(dataObj);
      }
      checkVoid = memberList.every((item, index) => {
        if (!item.score) {
          toolUtils.showToast(`输入项不能为空`);
          return false;
        }
        return true
      })

    } else if (that.data.attr_id == 3) { // 篮球类型
      for (var i = 0; i < teamArr.length; i++) {
        dataObj = {
          user_id: that.data.array[teamArr[i].indexD].user_id,
          score_type: that.data.arrayScore[teamArr[i].indexR].score_type,
          score: teamArr[i].score + ''
        }
        memberList = memberList.concat(dataObj);
      }
      checkVoid = memberList.every((item, index) => {
        if (!item.score) {
          toolUtils.showToast(`输入项不能为空`);
          return false;
        }
        return true
      })
    } else { //其他队伍类型
      for (var i = 0; i < teamArr.length; i++) {
        dataObj = {
          user_id: that.data.array[teamArr[i].indexD].user_id,
          score_attr: teamArr[i].score_attr,
          score: teamArr[i].score + ''
        }
        memberList = memberList.concat(dataObj);
      }
      checkVoid = memberList.every((item, index) => {
        if (!item.score_attr || !item.score) {
          toolUtils.showToast(`输入项不能为空`);
          return false;
        }
        return true
      })
    }
    if (checkVoid) {
      var params = {};
      params.soccer_movement_id = soccer_movement_id;
      params.attr_id = that.data.attr_id;
      params.score = that.data.formData.score,
        params.data = JSON.stringify(memberList);
      params.type = _type;
      console.log(params)
      httpsUtils.addMovementScore(params, function (res) {
        toolUtils.pageTo(`/page/pack-find/yue-data/yue-data?soccer_movement_id=${that.data.soccer_movement_id}&group_id=${that.data.group_id}`)
      }, function (e) {
        toolUtils.showToast(e.data.msg)
      })
    }
  },
  // 修改
  submitFormEdit: function () {
    that = this;
    var _type, dataObj, checkVoid, params = {},
      memberList = [],
      soccer_movement_id = that.data.soccer_movement_id,
      group_id = that.data.group_id,
      dataList = that.data.dataList
    if (dataList.user_role == 1 || dataList.user_role == 3 || dataList.user_role == 5) {
      _type = 1
    } else if (dataList.user_role == 2 || dataList.user_role == 4 || dataList.user_role == 6) {
      _type = 2
    }
    var teamArr = this.data.teamArr;
    if (that.data.attr_id == 2) { // 足球类型
      for (var i = 0; i < teamArr.length; i++) {
        dataObj = {
          user_id: that.data.array[teamArr[i].indexD].user_id,
          score_type: that.data.arrayR[teamArr[i].indexR].score_type,
          score: teamArr[i].score + ''
        }
        memberList = memberList.concat(dataObj);
      }
      checkVoid = memberList.every((item, index) => {
        if (!item.score) {
          toolUtils.showToast(`输入项不能为空`);
          return false;
        }
        return true
      })
    } else if (that.data.attr_id == 3) { //篮球类型
      for (var i = 0; i < teamArr.length; i++) {
        dataObj = {
          user_id: that.data.array[teamArr[i].indexD].user_id,
          score_type: that.data.arrayScore[teamArr[i].indexR].score_type,
          score: teamArr[i].score + ''
        }
        console.log(dataObj)
        memberList = memberList.concat(dataObj);
      }
      checkVoid = memberList.every((item, index) => {
        if (!item.score) {
          toolUtils.showToast(`输入项不能为空`);
          return false;
        }
        return true
      })
    } else { //其他队伍类型
      for (var i = 0; i < teamArr.length; i++) {
        dataObj = {
          user_id: that.data.array[teamArr[i].indexD].user_id,
          score_attr: teamArr[i].score_attr,
          score: teamArr[i].score + ''
        }
        memberList = memberList.concat(dataObj);
      }
      checkVoid = memberList.every((item, index) => {
        if (!item.score_attr || !item.score) {
          toolUtils.showToast(`输入项不能为空`);
          return false;
        }
        return true
      })
    }
    if (checkVoid) {
      var params = {};
      params.soccer_movement_id = soccer_movement_id;
      params.attr_id = that.data.attr_id;
      params.score = that.data.formData.score,
        params.data = JSON.stringify(memberList);
      params.type = _type;
      httpsUtils.editMovementScore(params, function (res) {
        var pages = getCurrentPages();
        pages[pages.length - 2].freshData(); //刷新上一页面
        wx.navigateBack({
          delta: 1,
        })
      }, function (e) {
        toolUtils.showToast(e.data.msg)
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
    * 用户点击右上角分享
    */
  // onShareAppMessage: function (res) {
  //   console.log(res)
  //   var url;
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //   }
  //   if (this.data.dataList.attr_id == 2) {
  //     url = "https://img.sport.darongshutech.com/image_201810251736568193.png"
  //   } else if (this.data.dataList.attr_id == 3) {
  //     url = "https://img.sport.darongshutech.com/image_201810251735466355.png"
  //   } else {
  //     url = "https://img.sport.darongshutech.com/image_201810251737248924.png"
  //   }
  //   return {
  //     title: '约动战况',
  //     imageUrl: url,
  //     path: `/page/pack-find/yue-score/yue-score?soccer_movement_id=${that.data.soccer_movement_id}&group_id=${that.data.dataList.group_id}&attr_id=${that.data.dataList.attr_id}&is_share=1`
  //   }
  // },
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
   * 跳转到球队主页
   */
  onTeam: function (e) {
    var group_id = e.currentTarget.dataset.id
    if (group_id) {
      toolUtils.pageTo('/page/pack-index/pages/team-page/team-page?group_id=' + group_id)
    }
  },

})