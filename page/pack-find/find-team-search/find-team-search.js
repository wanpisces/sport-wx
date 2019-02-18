// page/pack-find/find-team-search/find-team-search.js
// page/pack-find/find-team/find-team.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
var areaInfo;
var mTotalNum //总条数
var attrObj
var startX, startY;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    bgUrl1: getApp().data.bgUrl1,
    typeIndex: 0,
    filterIndex: 0,
    filterText: '筛选',
    typesOf: '类型',
    filterArray: [{
      id: 2,
      name: '活跃度最高'
    }, {
      id: 1,
      name: '队员数最多'
    }],
    areaIndex: [0, 0, 0],
    areaList: [
      [],
      [],
      []
    ],
    search: {
      keywords: '',
      current_page: 1,
      page_size: 10
    },
    loadData: {
      isFinish: false,
      isMore: true
    },
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无数据'
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
    try {
      var value = wx.getStorageSync('attrList')
      if (value) {
        // Do something with return value
        attrObj = value
        var typeArray = [
          [],
          []
        ]
        typeArray[0] = value['0']
        typeArray[1] = value[typeArray[0].id] || []
        console.log(typeArray)
        that.setData({
          typeArray: typeArray
        })
      } else {
        gettypeArrayList()
      }
    } catch (e) {
      gettypeArrayList()
      // Do something when catch error
    }
    getApp().getAreaData(function (data) {
      areaInfo = JSON.parse(JSON.stringify(data));;
      var areaList = toolUtils.areaPickerData2(data, [
        [],
        [],
        []
      ], 0, 0)
      that.setData({
        areaList: areaList
      })
    })
    getApp().userInfo(function (userInfo) {
      if (!userInfo) {
        getUserInfoEvt()
      } else {
        that.setData({
          user: userInfo,
        })
      }
    })
    // that.getData();
  },
  //关注
  followTeam: function (e) {
    var followid = e.currentTarget.dataset.followid;
    var args = {
      group_id: e.currentTarget.dataset.follow
    }
    httpsUtils.followTeam(args, function (res) {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
      })
      var dataList = that.data.dataList;
      if (followid == 1) {
        dataList[e.currentTarget.dataset.index].is_follow = 2;
      } else if (followid == 2) {
        dataList[e.currentTarget.dataset.index].is_follow = 1;
      }
      that.setData({
        dataList: dataList
      })
    })
  },
  // 取消关注
  cancelFollow: function (e) {
    var args = {
      group_id: e.currentTarget.dataset.follow
    }
    httpsUtils.cancelFollow(args, function (res) {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
      })
      var dataList = that.data.dataList;
      dataList[e.currentTarget.dataset.index].is_follow = 1;
      that.setData({
        dataList: dataList
      })
    })
  },
  // 搜索数据
  search(e) {
    let search = that.data.search;
    search.keywords = e.detail.value
    search.current_page = 1;
    search.page_size = 10
    that.setData({
      search: search
    })
    that.getData()
  },
  cancleBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 队伍搜索列表
  getData: function (msg) {
    var search = that.data.search;
    var pages = getCurrentPages();
    var Page = pages[pages.length - 2]; //当前页
    if (Page.route == "page/pack-mine/join-team/join-team") {
      that.setData({
        is_join: true
      })
      //我加入的队伍列表
      httpsUtils.myJoinGroup(search, function (res) {
        if (res.list.length > 0) {
          if (Math.ceil(res.total_num / res.page_size) == 1) {
            var loadData = {
              isFinish: true,
              isMore: false
            }
          } else {
            var loadData = {
              isFinish: false,
              isMore: true
            }
          }
          var list = that.data.dataList || []
          if (search.current_page == 1) {
            list = []
          }
          list = list.concat(res.list);
          list.forEach(msg => {
            msg.moveLeft = 0;
          })
          that.setData({
            dataList: list,
            current_page: res.current_page,
            loadData: loadData
          })
        } else {
          let list = [];
          var loadData = {
            isFinish: true,
            isMore: false,
          }
          that.setData({
            loadData: loadData,
            dataList: list,
          })
        }
        wx.stopPullDownRefresh();
      }, function (e) { }, msg)
    } else {
      that.setData({
        is_join: false
      })
      //队伍广场
      httpsUtils.findTeam(search, function (res) {
        if (res.list.length > 0) {
          if (Math.ceil(res.total_num / res.page_size) == 1) {
            var loadData = {
              isFinish: true,
              isMore: false
            }
          } else {
            var loadData = {
              isFinish: false,
              isMore: true
            }
          }
          var list = that.data.dataList || []
          if (search.current_page == 1) {
            list = []
          }
          that.setData({
            dataList: list.concat(res.list),
            current_page: res.current_page,
            loadData: loadData
          })
        } else {
          let list = [];
          var loadData = {
            isFinish: true,
            isMore: false,

          }
          that.setData({
            loadData: loadData,
            dataList: list,
          })
        }
        wx.stopPullDownRefresh();

      }, function (e) { }, msg)
    }

  },

  // 滑动开始事件  moveFlag 为true可分享，false隐藏分享按钮
  touchStart: function (e) {
    startX = e.touches[0].pageX; // 获取触摸时的原点(x轴)
    startY = e.touches[0].pageY; // 获取触摸时的原点(y轴)
  },
  //滑动事件
  touchMove: function (e) {
    var _index = e.currentTarget.dataset.index;
    var currectX = e.changedTouches[0].pageX;
    var currectY = e.changedTouches[0].pageY;
    var angX = currectX - startX;
    var angY = currectY - startY;
    var angle = Math.atan2(angY, angX) * 180 / Math.PI
    var team = this.data.dataList;
    var teamName = 'dataList'
    var moveLeft = team[_index].moveLeft;
    if (angX < -20 && (angle <= -170 || angle > 170)) {
      //向左滑动
      if (moveLeft <= 0 && moveLeft > -176) {
        // team[_index].moveLeft -= 20;
        team[_index].moveLeft = -176;
        this.setData({
          [teamName]: team
        })
      }
    } else if (angX > 20 && angle <= 20) {
      //向右滑动
      if (moveLeft >= -180 && moveLeft < 0) {
        // team[_index].moveLeft += 20;
        team[_index].moveLeft = 0
        this.setData({
          [teamName]: team
        })
      }
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
    var search = that.data.search;
    search.current_page = 1;
    that.setData({
      search: search
    })
    that.getData('加载中...');
  },
  // search() {
  //   toolUtils.pageTo('/page/pack-find/find-team-search/find-team-search')
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var loadData = that.data.loadData;
    if (loadData.isMore) {
      var search = that.data.search;
      search.current_page = search.current_page + 1;
      that.setData({
        search: search
      })
      that.getData();
    }
  },
  //pick-view选择器某一列的值改变时触发 
  bindMultiPickerColumnChange: function (e) {
    var value = e.detail.value
    var column = e.detail.column
    if (column == 0) {
      this.setData({
        ['typeArray[' + 1 + ']']: attrObj[this.data.typeArray[0][value].id] || []
      })
    }
  },
  bindMultiPickerChange: function (e) {
    var value = e.detail.value
    var list = this.data.typeArray[1]
    var attr_id
    var typesOf
    if (list.length == 0) {
      attr_id = this.data.typeArray[0][value[0] || 0].id
      typesOf = this.data.typeArray[0][value[0] || 0].name
    } else {
      attr_id = this.data.typeArray[1][value[1] || 0].id
      typesOf = this.data.typeArray[1][value[1] || 0].name
    }
    var search = that.data.search;
    search.attr_id = attr_id
    search.current_page = 1;
    that.setData({
      search: search,
      typesOf: typesOf
    })
    that.getData('加载中...')
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      var _index = res.target.dataset.index;
      var url = `/page/pack-index/pages/team-page/team-page?share=1&group_id=${that.data.dataList[_index].group_id}`
      return {
        title: `${that.data.user.user_nickname}邀请你参加一个很棒的${that.data.dataList[_index].attr_value}队伍`,
        path: url,
        imageUrl: that.data.dataList[_index].group_badge,
        success: (res) => {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              that.data.dataList[_index].moveLeft = 0;
              that.setData({
                dataList: that.data.dataList
              })
            }
          })
        },
        fail: (res) => { }
      }
    } else {
      return {
        path: '/page/pack-find/find-team-search/find-team-search',
      }
    }
  },
})

/**
 * 获取队伍分类
 */
function gettypeArrayList() {
  httpsUtils.attr(6, function (res) {
    attrObj = res
    var typeArray = [
      [],
      []
    ]
    typeArray[0] = res['0']
    typeArray[1] = res[typeArray[0].id] || []
    that.setData({
      typeArray: typeArray
    })
  }, function (e) {

  })
}
// 获取个人资料
function getUserInfoEvt() {
  httpsUtils.getUserInfo({}, function (res) {
    that.setData({
      user: res
    })
  }, function (e) { })
}