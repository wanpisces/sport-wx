// page/pack-find/yue-move/yue-move.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
var areaInfo;
var attrObj
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2,
    typeIndex: 0,
    filterIndex: 0,
    filterText: '筛选',
    typesOf: '类型',
    filterArray: [{
      id: '',
      name: '全部'
    }, {
      id: 1,
      name: '待约战'
    }, {
      id: 2,
      name: '约战成功'
    }, {
      id: 3,
      name: '约战结束'
    }, {
      id: 4,
      name: '正常取消'
    }, {
      id: 5,
      name: '违约取消'
    }],
    areaIndex: [0, 0, 0],
    areaList: [
      [],
      [],
      []
    ],
    loadData: {
      isFinish: false,
      isMore: true
    },
    search: {
      area_id: '',
      movement_state: '',
      current_page: 1,
      page_size: 10
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
    this.bindFight();
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
      areaInfo = data;
      that.setData({
        areaList: toolUtils.areaPickerData2(data, [
          [],
          [],
          []
        ], 0, 0)
      })
    })
    that.getData();
  },
  // 我的队伍
  bindFight(e) {
    httpsUtils.myGroup({ current_page: 1, page_size: 1000, attr_id: 2, is_leader:1}, function (res) {
      console.log('res', res)
      if (res.list.length != 0) {
        that.setData({
          show: true,
          chooseData: res.list
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '您暂无自己组建的该类型队伍，快去创建一个吧',
          success: function (res) {
            if (res.confirm) {
              toolUtils.pageTo('/page/tabBar/index/index', 3)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      }
    }, function (e) {

    })
  },
  bindPickerChange(e){
      console.log(e)
      let group_id= that.data.chooseData[e.detail.value].group_id;
      console.log(group_id);
      toolUtils.pageTo('/page/pack-find/yue-release/yue-release?group_id=' + group_id)
  },
  //选择省市区
  bindAreaPickerChange: function (e) {
    var value = e.detail.value
    var areaList = this.data.areaList
    var area = areaList[2][value[2]]
    var search = that.data.search;
    search.area_id = area.id;
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
  //类型
  bindTypeChange: function (e) {
    var that = this;
    var search = that.data.search;
    var typeArray = that.data.typeArray;
    search.type = typeArray[e.detail.value].id;
    search.current_page = 1;
    that.setData({
      typesOf: that.data.typeArray[e.detail.value].name,
      search: search
    })
    that.getData('加载中...');
  },
  //筛选
  bindFilterChange: function (e) {
    var that = this;
    var search = that.data.search;
    var filterArray = that.data.filterArray;
    search.movement_state = filterArray[e.detail.value].id;
    search.current_page = 1;
    that.setData({
      filterText: that.data.filterArray[e.detail.value].name,
      search: search
    })
    that.getData('加载中...');
  },
  getData: function (msg) {
    var search = that.data.search;
    for (var i in search) {
      if (!search[i]) {
        delete search[i];
      }
    }
    httpsUtils.findMovement(search, function (res) {
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
   * 发约动没队伍时去首页创建
   */
  onTeam:function(e){
    wx.showModal({
      title: '温馨提示',
      content: '您暂无队伍，快去创建或加入一个吧',
      success: function (res) {
        if (res.confirm) {
          toolUtils.pageTo('/page/tabBar/index/index', 3)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
  search() {
    toolUtils.pageTo('/page/pack-find/yue-move-search/yue-move-search?tag=1')
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
  }
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