// page/pack-find/yue-team-detail/yue-team-detail.js
var toolUtils = require('../../../utils/tool-utils.js')
var httpsUtils = require('../../../utils/https-utils.js')
var mGroupId
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLine: "1",
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2,
    dissolveState: true,
    transferList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    mGroupId = options.group_id
    wx.getSystemInfo({
      success: function (res) {
        var pages = getCurrentPages()
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          member_state: pages[pages.length - 2].data.member_state
        })
        groupDetail();
      }
    })
  },
  tabClick(e) {
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        showLine: "1"
      })
    } else {
      this.setData({
        showLine: "2"
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
  //选择队伍成员
  selectTeam: function (e) {
    var index = e.currentTarget.dataset.index;
    for (let i = 0; i < this.data.transferList.length; i++) {
      if (i == index) {
        this.data.transferList[i].selectState = true;
      } else {
        this.data.transferList[i].selectState = false;
      }
    }
    this.setData({
      transferList: this.data.transferList,
      assign_user_id: this.data.transferList[index].user_id
    })
  },
  //刷新队伍详情
  refreshData: function () {
    groupDetail()
  },

  // 队伍相关操作
  submitBtn: function (e) {
    that = this;
    var title = e.currentTarget.dataset.title;
    var attr_id = that.data.attr_id;
    var group_id = that.data.group_id;
    switch (title) {
      //解散队伍
      case "dissolve":
        exitGroup()
        break
      //转让队伍
      case "transfer":
        getGroupList()
        break
      //修改信息
      case "edit":
        if (attr_id == 2 || attr_id == 3) {
          toolUtils.pageTo('/page/pack-index/pages/organize-team/organize-team?isEdit=true' + '&attr_id=' + attr_id + '&group_id=' + group_id, 1)
        } else {
          toolUtils.pageTo('/page/pack-index/pages/currency-organize-team/organize-team?isEdit=true' + '&attr_id=' + attr_id + '&group_id=' + group_id, 1)
        }
        break
      //退出队伍
      case "quit":
        quitGroup()
        break
    }
  },
  //取消转让
  cancelBtn: function () {
    this.setData({
      dissolveState: true
    })
  },
  //确定转让
  sureTransfer: function () {
    assignGroup()
  }
})
//获取队伍详情
function groupDetail() {
  httpsUtils.groupDetail(mGroupId, {}, function (res) {
    that.setData(res)
  }, function (e) { })
}
//解散队伍
function exitGroup() {
  var params = {
    'group_id': mGroupId
  }
  var pages = getCurrentPages();
  httpsUtils.exitGroup(params, function (res) {
    var pages = getCurrentPages();
    toolUtils.showToast("解散成功");
    console.log(pages.length, pages[pages.length - 3].route)
    if (pages.length >= 3 && "page/pack-mine/mine-team/mine-team" == pages[pages.length - 3].route) {
      pages[pages.length - 3].refreshData()
      wx.navigateBack({
        delta: 2,
      })
    }
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
//退出队伍
function quitGroup() {
  var params = {
    'group_id': mGroupId
  }
  httpsUtils.quitGroup(params, function (res) {
    var pages = getCurrentPages();
    toolUtils.showToast("退出成功");
    if (pages.length >= 3 && "page/pack-mine/mine-team/mine-team" == pages[pages.length - 3].route) {
      pages[pages.length - 3].refreshData();
      setTimeout(function () {
        wx.navigateBack({
          delta: 2,
        })
      }, 500)
    }
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
// 转让队伍
function assignGroup() {
  var params = {};
  params.group_id = mGroupId
  params.assign_user_id = that.data.assign_user_id
  httpsUtils.assignGroup(params, function (res) {
    var pages = getCurrentPages();
    toolUtils.showToast("转让成功");
    if (pages.length >= 3 && "page/pack-mine/mine-team/mine-team" == pages[pages.length - 3].route) {
      that.setData({
        dissolveState: true
      })
      setTimeout(function () {
        pages[pages.length - 3].refreshData()
      }, 1000)
    }
    wx.navigateBack({
      delta: 2,
    })
  }, function (e) {
    that.setData({
      dissolveState: true
    })
  })
}

//获取队伍可转让成员列表
function getGroupList() {
  var params = {}
  params.group_id = mGroupId;
  httpsUtils.assignGroupList(params, function (res) {
    if (res.list.length == 0) {
      that.setData({
        dissolveState: true
      })
      toolUtils.showToast('暂无可转让的队员')
    } else {
      that.setData({
        transferList: res.list,
        dissolveState: false
      })
    }
  }, function (e) {
    toolUtils.showToast(e.data.msg)
    setTimeout(function () {
      that.setData({
        dissolveState: true
      })
    }, 1500)
  })
}