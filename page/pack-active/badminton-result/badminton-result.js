// page/pack-active/badminton-result/badminton-result.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    matchIndex: 0,
    groupIndex: 0,
    tabData: ['赛况', '分组'],
    grouping: [{
      group: 'A',
      name: 'A组'
    }, {
      group: 'B',
      name: 'B组'
    }, {
      group: 'C',
      name: 'C组'
    }, {
      group: 'D',
      name: 'D组'
    }, {
      group: 'E',
      name: 'E组'
    }, {
      group: 'F',
      name: 'F组'
    }, {
      group: 'G',
      name: 'G组'
    }, {
      group: 'H',
      name: 'H组'
    }],
    selectIndex: 0,
    outList: [],
    matchObj: null,
    dataList: [],
    search: {
      current_page: 1,
      page_size: 6
    },
    isFinished: false,
    total_num: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
    getKnockoutList();
    getMatchList('A');
    getSubgroupList();
  },
  getPhone: function(e) {
    var _index = e.currentTarget.dataset.index
    var title = e.currentTarget.dataset.title;
    var key = "";
    key = title == "A" ? 1 : 2
    wx.makePhoneCall({
      phoneNumber: this.data.dataList[_index][key].phone,
    })
  },
  //查看更多
  checkMore() {
    var search = that.data.search;
    var total_num = that.data.total_num;
    
    if (total_num >= search.current_page * search.page_size) {
      search.current_page++;
      that.setData({
        search: search,
        isFinished: false
      })
      getKnockoutList();
    } else {
      that.setData({
        isFinished: true
      })
    }
  },
  // tab切换
  bindTabs(e) {
    that.setData({
      tabIndex: e.currentTarget.dataset.id
    })
  },
  //淘汰赛和小组赛切换
  bindmatch(e) {
    that.setData({
      matchIndex: e.currentTarget.dataset.id
    })
  },
  //选择分组
  bindChangeGroup(e) {
    that.setData({
      groupIndex: e.detail.value
    })
    var group = that.data.grouping[e.detail.value].group;
    getMatchList(group);
  },
  //选择具体分组
  groupSelect: function(e) {
    that = this
    var _index = e.currentTarget.dataset.index;
    that.setData({
      selectIndex: _index
    })
    getSubgroupList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '川大四院羽毛球友谊赛',
      // imageUrl: url,
      path: '/page/pack-active/badminton-result/badminton-result'
    }
  }
})

function getKnockoutList() {
  var arg = that.data.search;
  httpsUtils.knockoutList(arg, function(res) {
    that.setData({
      outList: that.data.outList.concat(res.list),
      total_num: res.total_num
    })
    if (res.total_num <= res.current_page * res.page_size) {
      that.setData({
        isFinished: true
      })
    }
  }, function(res) {

  })
}

function getMatchList(group) {
  httpsUtils.matchList({
    group: group
  }, function(res) {
    that.setData({
      matchObj: res
    })
  }, function(res) {})
}

function getSubgroupList() {
  var arg = {
    group: that.data.grouping[that.data.selectIndex].group
  };
  httpsUtils.subgroupList(arg, function(res) {
    that.setData({
      dataList: res.list || []
    })

  }, function(res) {})
}