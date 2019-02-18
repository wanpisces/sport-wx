var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js")
const mapUtils = require('../../../utils/map-utils.js')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index1: 0,
    index2: -1,
    index3: -1,
    params: {
      page_size: 20,
      current_page: 1
    },
    empty: {
      icon: '/pic/no-content.png',
      txt: '未查询到相关小区...'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          isLoading: false,
        })

      }
    })
    getAddress(this)
    getUserLocation(this)
  },
  //添加位置
  addPosition: function() {
    toolUtils.pageTo('/page/pack-find/add-position/add-position', 1)
  },
  searchEvt: function() {
    toolUtils.pageTo('/page/pack-find/position-search/position-search', 1)
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
  // onPullDownRefresh: function () {
  //   getNearbySearch(this, '')
  //   getUserLocation(this)
  //   wx.stopPullDownRefresh()
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this,
      params = this.data.params;
    if (params.total_num > params.page_size * params.current_page) {
      ++params.current_page
      that.setData({
        loadData: {
          searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
      getNearbySearch(that, '')
    } else {
      that.setData({
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    }

  },
  //当前定位点击事件
  onPositionLocation: function() {
    var item = this.data.locationItem
    this.setData({
      index1: 0,
      index2: -1,
      index3: -1,
      ck_item: item
    })
  },
  //常用位置和周边位置点击事件
  onItem: function(e) {
    var id = e.currentTarget.id,
      item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index;
    if ('tag2' == id) { //常用位置
      this.setData({
        index1: -1,
        index2: index,
        index3: -1,
        ck_item: item
      })
    } else if ('tag3' == id) { //周边位置
      this.setData({
        index1: -1,
        index2: -1,
        index3: index,
        ck_item: item
      })
    }

  },
  butSubmit: function() {
    var item = this.data.ck_item,
      app = getApp();
    app.data.locationInfo = item.location ? {
      "name": item.title, // 位置名称
      "address": item.address, // 详细位置
      "lat": item.location.lat, // 纬度
      "lng": item.location.lng, // 经度
    } : item
    app.data.isLoadLocationInfo = true
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})

//附近和搜索的小区
function getNearbySearch(that, keyword) {
  var params = that.data.params,
    app = getApp(),
    location = app.data.location;
  mapUtils.nearby_search(keyword, location.lat + ',' + location.lng, params, function(res) {
    params.total_num = res.count
    var list = that.data.list || []
    if (params.current_page == 1) {
      list = []
      if (res.data.length > 0) {
        app.data.ad_info = res.data[0].ad_info
        that.setData({
          locationItem: res.data[0],
          ck_item: res.data[0],
          selectLocation: res.data[0].location
        })
      }
    }
    list = list.concat(res.data)
    if (list.length == params.total_num) {
      that.setData({
        list: list,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    } else {
      that.setData({
        list: list,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
    wx.hideLoading();
  }, function(e) {
    if (params.current_page > 1) {
      --params.current_page
    }
    that.setData({
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.hideLoading();
  })
}

//常用位置列表
function getUserLocation(that) {
  httpsUtils.getUserLocation({}, function(res) {
    that.setData({
      userLocations: res
    })
  }, function(e) {

  })
}
//获取当前位置
function getAddress(that) {
  wx.showLoading({
    title: '定位中...',
  })
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success: function(res) {
      // toolUtils.showToast(JSON.stringify(res))
      wx.hideLoading();
      getApp().data.location = {
        lat: res.latitude,
        lng: res.longitude
      }
      wx.showLoading({
        title: '加载中...',
      })
      getNearbySearch(that, '')
      //逆地理编码
      // mapUtils.reverseGeocoder(res.latitude, res.longitude, function (res2) {
      //   that.setData({
      //     isLocationStreet: true,
      //     nowLocation: {
      //       lat: res.latitude,
      //       lng: res.longitude,
      //       address: res2.result.address
      //     }
      //   })
      // }, function (e) {
      //   console.log('失败', e);
      // });
    },
    fail: function(e) {
      wx.showModal({
        title: '温馨提示',
        content: '请在我的-设置中，授权使用我的地理位置！',
        success: function(res) {
          if (res.cancel) {
            that.getData();
            console.info("授权失败返回数据");
          } else if (res.confirm) {
            toolUtils.pageTo('/page/pack-mine/mine-settings/mine-settings')
          }
        }
      })
    }
  })
}