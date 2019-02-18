// page/tabBar/about-movement/about-movement.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
const mapUtils = require('../../../utils/map-utils.js')
var areaInfo;
var statusBarHeight;
var attrObj;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    swiperCurrent: 0,
    isLoading: true,
    isCircularMenu: true,
    isPicker: true,
    filterText: '状态',
    typesOf: '类型',
    formatText: '赛制',
    filterArray: [{
      id: '',
      name: '全部'
    }, {
      id: 1,
      name: '等待应约'
    }, {
      id: 2,
      name: '约战成功'
    }, {
      id: 3,
      name: '约战完结'
    }, {
      id: 6,
      name: '约战进行时'
    }],
    formatArray: [],
    areaIndex: [0, 0, 0],
    areaList: [
      [],
      [],
      []
    ],
    search: {
      area_id: '',
      attr_id: '',
      movement_state: '',
      current_page: 1,
      page_size: 10,
      rule_id: ''
    },
    loadData: {
      isFinish: false,
      isMore: true
    },
    autoplayList: []
  },
  positionEvt: function() {
    if (getApp().data.location) {
      toolUtils.pageTo("/page/pack-find/yue-position/yue-position", 1)
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '请在我的-设置中，授权使用我的地理位置！',
        success: function(res) {
          if (res.cancel) {
            console.info("授权失败返回数据");
          } else if (res.confirm) {
            toolUtils.pageTo('/page/pack-mine/mine-settings/mine-settings')
          }
        }
      })
    }
  },

  //改变banner图指示点的样式
  changDot(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        statusBarHeight = res.statusBarHeight
        that.setData({
          statusBarHeight: res.statusBarHeight,
          windowHeight: res.windowHeight,
          bannerHeight: (750 / res.windowWidth) * res.statusBarHeight + 330,
          bannerHeight2: (750 / res.windowWidth) * res.statusBarHeight + 90,
        })
      }
    })
    that.getBanner();
    that.getScrollBar();
    that.getData();
    getAuthSet(that);
    getApp().getAreaData(function(data) {
      areaInfo = JSON.parse(JSON.stringify(data));
      that.setData({
        areaList: toolUtils.areaPickerData2(areaInfo, [
          [],
          [],
          []
        ], 0, 0)
      })
    })
    //约战类型
    wx.getStorage({
      key: 'attrList',
      success: function(res) {
        attrObj = JSON.parse(JSON.stringify(res.data));
        attrObj[0].unshift({
          id: '',
          name: '全部'
        })
        var attrList = [
          [],
          []
        ]
        attrList[0] = attrObj['0']
        attrList[1] = attrObj[attrList[0].id] || []
        that.setData({
          attrList: attrList,
          ydList: JSON.parse(JSON.stringify(res.data))
        })
      },
      fail: function(e) {
        getAttrList(that, "")
      }
    })

    //赛制
    wx.getStorage({
      key: 'formatList',
      success: function(res) {
        // res.data.unshift({
        //   id: '',
        //   name: '全部'
        // })
        that.setData({
          formatArray: res.data
        })
      },
      fail: function(res) {
        getFormatList(that, "")
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const updateManager = wx.getUpdateManager()
    const version = wx.getSystemInfoSync().SDKVersion
    if (toolUtils.compareVersion(version, '1.9.90') >= 0) {
      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function() {
        toolUtils.showToast('微信更新下载失败')
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var app = getApp()
    this.setData({
      isPicker: true,
      isCircularMenu: true,
      current: 0
    })
    if (getApp().data.refreshLocation) { //授权位置信息回来从新定位
      getApp().data.refreshLocation = false
      getPosition(this)
    } else if (app.data.isLoadLocationInfo) { //位置切换刷新数据
      app.data.isLoadLocationInfo = false
      this.data.search.lat = app.data.locationInfo.lat;
      this.data.search.lng = app.data.locationInfo.lng;
      this.setData({
        locationAddress: app.data.locationInfo.name,
        search: this.data.search
      })
      this.getData('加载中...');
      that.getScrollBar()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      isPicker: false,
      isCircularMenu: false
    })
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
    var that = this;
    var search = that.data.search;
    search.current_page = 1;
    that.setData({
      search: search,
      current: 0
    })
    that.getData('加载中...');
    that.getBanner();
    that.getScrollBar()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '八分钟运动',
      imageUrl: 'https://img.sport.darongshutech.com/image_201810300920055506.png',
      path: '/page/tabBar/about-movement/about-movement'
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
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
  //选择省市区
  bindAreaPickerChange: function(e) {
    var that = this
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
  bindAreaPickerColumnChange: function(e) {
    var that = this
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
  //选择队伍类型
  bindTypePickerChange: function(e) {
    that = this;
    var index = e.detail.value;
    var item = that.data.attrList[0];
    that.data.search.attr_id = item[index].id
    that.setData({
      typesOf: e.detail.value == 0 ? '类型' : item[index].name,
      search: that.data.search
    })
    that.getData('加载中...');
  },
  //状态
  bindFilterChange: function(e) {
    var that = this;
    var search = that.data.search;
    var filterArray = that.data.filterArray;
    search.movement_state = filterArray[e.detail.value].id;
    search.current_page = 1;
    that.setData({
      filterText: e.detail.value == 0 ? '状态' : that.data.filterArray[e.detail.value].name,
      search: search
    })
    that.getData('加载中...');
  },
  // 赛制
  bindFilterFormatChange: function(e) {
    var that = this;
    var search = that.data.search;
    var formatArray = that.data.formatArray;
    search.rule_id = formatArray[e.detail.value].id;
    search.current_page = 1;
    that.setData({
      formatText: e.detail.value == 0 ? '赛制' : that.data.formatArray[e.detail.value].name,
      search: search
    })
    that.getData('加载中...');
  },
  // 我要约战
  bindFilterYdChange: function(e) {
    var value = e.detail.value
    var attr_id = this.data.ydList[0][value || 0].id
    toolUtils.pageTo("/page/pack-find/yue-release/yue-release?attr_id=" + attr_id, 1)
  },
  /**
   * 页面滚动触发
   */
  onPageScroll: function(e) {
    var sTop = e.scrollTop - statusBarHeight
    if (!(this.data.isTop)) {
      if (sTop > 150) {
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: "",
          animation: {
            duration: 200,
            timingFunc: 'easeIn'
          }
        })
        this.setData({
          isTop: true
        })
      }
    } else {
      if (sTop < 150) {
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: "",
          animation: {
            duration: 200,
            timingFunc: 'easeIn'
          }
        })
        this.setData({
          isTop: false
        })
        wx.pageScrollTo({
          scrollTop: 0,
        })
      }

    }
  },
  search() {
    toolUtils.pageTo('/page/pack-find/yue-move-search/yue-move-search?tag=1')
  },
  /**
   * 刷新页面数据
   */
  refreshData: function() {
    var that = this;
    var search = that.data.search;
    search.current_page = 1;
    that.setData({
      search: search,
      current: 0
    })
    that.getData('');
    that.getScrollBar()
  },
  // 轮播（banner跳转）
  linkBanner(e) {
    var item = e.currentTarget.dataset.item,
      params = {};
    if (item.banner_mini_run == 4) {
      params.competition_status = item.competition_status
    }
    if (item.banner_id == '') {
      httpsUtils.isBind({}, function(res) {
        if (res.to_jump == 1 || res.to_jump == 2) {
          toolUtils.pageTo('/page/pack-active/active-show/active-show?scene=2', 1)
        } else {
          toolUtils.pageTo('/page/pack-active/badminton-result/badminton-result', 1)
        }
      }, function(e) {
        toolUtils.showToast(e.data.msg)
      })
    }
    toolUtils.jumpRules(1, item.banner_mini_run, item.banner_mini_url, item.banner_title, params)
  },
  /**
   * 获取页面数据
   */

  getData: function(msg) {
    var that = this
    var search = that.data.search;
    for (var i in search) {
      if (!search[i]) {
        delete search[i];
      }
    }
    httpsUtils.findMovement(search, function(res) {
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

    }, function(e) {

    }, msg)
  },
  // 滚动栏
  getScrollBar: function() {
    var that = this;
    httpsUtils.scrollBar({}, function(res) {
      that.setData({
        autoplayList: res.list
      })
    }, function(e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  /**
   * 获取banner
   */
  getBanner() {
    var that = this
    httpsUtils.getBanner(function(res) {
      that.setData({
        banner: res || []
      })
    }, function(e) {

    })
  },
  //位置切换
  onStreetClick: toolUtils.throttle(function(e) {
    var _location = e.detail.dataset.item;
    this.setData({
      isLocationStreet: false
    })
    switch (e.detail.id) {
      case 'colse':
        this.getData('加载中...');
        break
      case 'select':
        toolUtils.pageTo("/page/pack-find/yue-position/yue-position", 1)
        this.getData();
        break
      case 'province':
        break
      case 'submit':
        this.data.search.lat = _location.lat;
        this.data.search.lng = _location.lng;
        //缓存位置信息
        getApp().data.location = _location
        this.setData({
          locationAddress: _location.address,
          isChangePosition: false
        })
        this.getData('加载中...');

        //记录定位时间
        locationTime(this, 2, _location)
        break
    }
  })

})
/**
 * 获取队伍分类
 */
function getAttrList(that, msg) {
  httpsUtils.attr(6, function(res) {
    attrObj = JSON.parse(JSON.stringify(res));
    var attrList = [
      [],
      []
    ]
    // 我要约战
    var ydList = [
      [],
      []
    ]
    ydList[0] = attrObj['0']
    ydList[1] = attrObj[ydList[0].id] || []

    // 类型筛选
    res[0].unshift({
      id: '',
      name: '全部'
    })
    attrList[0] = res['0']
    attrList[1] = res[attrList[0].id] || []
    that.setData({
      attrList: attrList,
      ydList: ydList
    })
    try {
      wx.setStorage({
        key: 'attrList',
        data: attrObj,
      })
    } catch (e) {

    }
  }, function(e) {

  }, msg)
}
// 获取赛制
function getFormatList(that, msg) {
  httpsUtils.attr(1, function(res) {
    res[0].unshift({
      id: '',
      name: '全部'
    })
    that.setData({
      formatArray: res[0]
    })
    try {
      wx.setStorage({
        key: 'formatList',
        data: that.data.formatArray,
      })
    } catch (e) {}
  }, function(e) {}, msg)
}
// 获取当前位置的经纬度
function getPosition(that) {
  var _location = locationTime(that, 1)
  if (_location) {
    that.data.search.lat = _location.lat;
    that.data.search.lng = _location.lng;
    //缓存位置信息
    getApp().data.location = _location
    that.setData({
      locationAddress: _location.address
    })
    that.getData();
  } else {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        // toolUtils.showToast(JSON.stringify(res))

        getApp().data.location = {
          lat: res.latitude,
          lng: res.longitude
        }
        //逆地理编码
        mapUtils.reverseGeocoder(res.latitude, res.longitude, function(res2) {
          that.setData({
            isLocationStreet: true,
            nowLocation: {
              lat: res.latitude,
              lng: res.longitude,
              address: res2.result.address
            }
          })
        }, function(e) {
          console.log('失败', e);
        });
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

}
// 获取地理位置授权
function getAuthSet(that) {
  getPosition(that)
}

//定位时间校验及存储,tag=1判断今天是否有过定位；tag=2记录定位时间
function locationTime(that, tag, _location) {
  var date = new Date(),
    nowDateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  if (tag == 1) {
    var historyLocation = wx.getStorageSync('_location_info')
    if (!historyLocation) {
      return null
    }
    if (nowDateStr === historyLocation.time) {
      return historyLocation
    } else {
      that.setData({
        isChangePosition: true
      })
      return null
    }

  } else if (tag == 2) {
    _location.time = nowDateStr
    wx.setStorage({
      key: '_location_info',
      data: _location,
    })
  }
}