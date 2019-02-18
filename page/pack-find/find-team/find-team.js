// page/pack-find/find-team/find-team.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
var areaInfo;
var mTotalNum //总条数
var attrObj
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
      id: '',
      name: '默认排序'
    }, {
      id: 2,
      name: '访问量最高'
    }, {
      id: 3,
      name: '关注数最多'
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
      area_id: '',
      city_id: '',
      province_id: '',
      screen: "",
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
        value[0].unshift({
          id: '',
          name: '全部'
        })
        typeArray[0] = value['0']
        typeArray[1] = value[typeArray[0].id] || []
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
    that.getData();
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
  //选择省市区
  bindAreaPickerChange: function (e) {
    var area;
    var value = e.detail.value
    var _index = value.indexOf(0)
    var search = that.data.search;
    var areaList = this.data.areaList
    if (_index < 0) {
      area = areaList[2][value[2]]
      search.area_id = area.id;
      search.province_id = '';
      search.city_id = '';
    } else if (_index == 0) {
      area = areaList[_index][value[_index]]
      search.province_id = area.id
      search.city_id = '';
      search.area_id = '';
    } else if (_index == 1) {
      area = areaList[_index - 1][value[_index - 1]]
      search.province_id = area.id
      search.city_id = '';
      search.area_id = '';
    } else {
      area = areaList[_index - 1][value[_index - 1]]
      search.city_id = area.id
      search.province_id = '';
      search.area_id = '';
    }
    search.current_page = 1;
    that.setData({
      address: area.name,
      search: search
    })
    that.getData('加载中...');
  },
  //省市区滚动监听
  bindAreaPickerColumnChange: function (e) {
    var detail = e.detail;
    var areaIndex = that.data.areaIndex;
    if (detail.column == 0) {
      if (detail.value == 0) {
        areaIndex[0] = detail.value
        areaIndex[1] = 0
        areaIndex[2] = 0
      } else {
        areaIndex[0] = detail.value
        areaIndex[1] = 1
        areaIndex[2] = 1
      }
    } else if (detail.column == 1) {
      if (detail.value == 0) {
        areaIndex[1] = detail.value
        areaIndex[2] = 0
      } else {
        areaIndex[1] = detail.value
        areaIndex[2] = 1
      }
    } else {
      areaIndex[2] = detail.value
    }
    that.setData({
      areaList: toolUtils.areaPickerData2(areaInfo, that.data.areaList, detail.column, detail.value),
      areaIndex: areaIndex
    })
  },
  // //类型
  // bindTypeChange: function (e) {
  //   var that = this;
  //   var search = that.data.search;
  //   var typeArray = that.data.typeArray;
  //   search.type = typeArray[e.detail.value].id;
  //   search.current_page = 1;
  //   that.setData({
  //     typesOf: that.data.typeArray[e.detail.value].name,
  //     search: search,
  //     dataList: []
  //   })
  //   that.getData();
  // },
  //筛选
  bindFilterChange: function (e) {
    var that = this;
    var search = that.data.search;
    var filterArray = that.data.filterArray;
    search.screen = filterArray[e.detail.value].id;
    search.current_page = 1;
    that.setData({
      filterText: that.data.filterArray[e.detail.value].name.slice(0, -2),
      search: search
    })
    that.getData('加载中...');
  },
  getData: function (msg) {
    var search = that.data.search;
    httpsUtils.findTeam(search, function (res) {
      var list = that.data.dataList || []
      if (search.current_page == 1) {
        list = []
      }
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
        that.setData({
          dataList: list.concat(res.list),
          current_page: res.current_page,
          loadData: loadData
        })
      } else {
        var loadData = {
          isFinish: true,
          isMore: false
        }
        that.setData({
          dataList: list,
          loadData: loadData
        })
      }
      wx.stopPullDownRefresh();
    }, function (e) {

    }, msg)
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
  search() {
    toolUtils.pageTo('/page/pack-find/find-team-search/find-team-search?tag=1')
  },

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
  // pick-view选择器某一列的值改变时触发 
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
      attr_id = this.data.typeArray[0][value || 0].id
      typesOf = this.data.typeArray[0][value || 0].name
    } else {
      attr_id = this.data.typeArray[1][value || 0].id
      typesOf = this.data.typeArray[1][value || 0].name
    }
    var search = that.data.search;
    search.attr_id = attr_id
    search.current_page = 1;
    that.setData({
      search: search,
      typesOf: typesOf
    })
    that.getData('加载中...')
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
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