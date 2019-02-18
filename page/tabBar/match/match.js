// page/tabBar/match/match.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js")
var areaInfo
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkLabelIndex: 0,
    swiperCurrent: 0,
    current_page: 1,
    page_size: 10,
    total_num: 0,
    city_id: '',
    competition_status: '',
    list: [],
    loadData: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无数据'
    },
    labelList: [{
      value: '全部',
      current_page: 1,
      attr_id: '',
      page_size: 10,
      total_num: 0,
      is_recom: '1',
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }, {
      value: '足球',
      current_page: 1,
      attr_id: 2,
      page_size: 10,
      total_num: 0,
      is_recom: '0',
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }, {
      value: '篮球',
      current_page: 1,
      attr_id: 3,
      page_size: 10,
      total_num: 0,
      is_recom: '0',
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }, {
      value: '羽毛球',
      current_page: 1,
      current_page: 1,
      attr_id: 4,
      page_size: 10,
      total_num: 0,
      is_recom: '0',
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      list: []
    }],
    cityIndex: [0, 0],
    cityList: [
      [],
      []
    ],
    matchText: '赛事',
    matchArray: [],
    filterText: '筛选',
    filterArray: [{
      id: '',
      name: '全部'
    }, {
      id: 4,
      name: '计划中'
    }, {
      id: 1,
      name: '报名阶段'
    }, {
      id: 5,
      name: '抽签阶段'
    }, {
      id: 2,
      name: '进行中'
    }, {
      id: 3,
      name: '已完结'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          swiperHeight: res.windowHeight - res.statusBarHeight - 125
        })
      }
    })
    getCompetitionList(this)
    getApp().getAreaData(function (data) {
      areaInfo = JSON.parse(JSON.stringify(data));
      that.setData({
        cityList: toolUtils.cityPickerData(areaInfo, [
          [],
          []
        ], 0, 0)
      })
    })
    //赛事类型
    wx.getStorage({
      key: 'attrList',
      success: function (res) {
        res.data[0].unshift({
          'name': '全部',
          'id': ''
        })
        that.setData({
          matchArray: res.data[0]
        })
      },
      fail: function (res) {
        getAttrList(that)
      },
    })
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
  // 刷新
  onTapButtonRefresh: function (e) {
    var _checkLabelIndex = this.data.checkLabelIndex;
    this.data.labelList.forEach(_data => {
      //刷新当前当前查看内容
      if (_data.attr_id == this.data.labelList[_checkLabelIndex].attr_id) {
        this.data.labelList[_checkLabelIndex].current_page = 1
        this.setData({
          rotateRefreshImg: true,
          [`labelList[${_checkLabelIndex}].into_view`]: 'scrollTop',
        })
        getCompetitionList(this)
      } else {
        //清空不是当前查看的内容
        _data.list = [];
      }
    })
  },
  //选择赛事类型（足球，篮球）
  bindMatchChange: function (e) {
    var _index = e.detail.value,
      checkLabelIndex = this.data.checkLabelIndex,
      labelItem = this.data.labelList[checkLabelIndex];
    labelItem.current_page = 1
    labelItem.into_view = 'scrollTop'
    this.setData({
      attr_id: this.data.matchArray[_index].id,
      matchText: this.data.matchArray[_index].name
    })

    getCompetitionList(this)
  },
  //选择省市
  bindCityPickerChange: function (e) {
    var that = this,
      value = e.detail.value,
      cityList = this.data.cityList,
      city = cityList[1][value[1]],
      checkLabelIndex = that.data.checkLabelIndex,
      labelItem = that.data.labelList[checkLabelIndex];
    // city_id = city.id
    labelItem.current_page = 1
    labelItem.into_view = 'scrollTop'
    that.setData({
      address: city.name,
      city_id: city.id
    })
    getCompetitionList(that)
  },
  //省市区滚动监听
  bindCityPickerColumnChange: function (e) {
    var that = this,
      detail = e.detail,
      cityIndex = that.data.cityIndex;
    if (detail.column == 0) {
      if (detail.value == 0) {
        cityIndex[0] = detail.value
        cityIndex[1] = 0
      } else {
        cityIndex[0] = detail.value
        cityIndex[1] = 1
      }
    } else if (detail.column == 1) {
      cityIndex[1] = detail.value
    }
    that.setData({
      cityList: toolUtils.cityPickerData(areaInfo, that.data.cityList, detail.column, detail.value),
      cityIndex: cityIndex
    })
  },
  //筛选
  bindFilterChange: function (e) {
    var that = this,
      filterArray = that.data.filterArray,
      checkLabelIndex = that.data.checkLabelIndex,
      labelItem = that.data.labelList[checkLabelIndex];
    // competition_status = filterArray[e.detail.value].id;
    labelItem.current_page = 1
    labelItem.into_view = 'scrollTop'
    that.setData({
      competition_status: filterArray[e.detail.value].id,
      filterText: e.detail.value == 0 ? '筛选' : that.data.filterArray[e.detail.value].name,
    })
    getCompetitionList(that)
  },
  //输入框获取焦点监听
  bindfocus: function (e) {
    56
    var that = this,
      history = that.data.history;
    that.setData({
      inputFocus: true
    })
    if (!history || history.length == 0) {
      wx.getStorage({
        key: 'search_history',
        success: function (res) {
          console.log(res)
          if (res.errMsg == "getStorage:ok") {
            that.setData({
              history: res.data
            })
          } else { }
        }
      })
    }
  },
  //点击历史搜索
  bindItem2: toolUtils.throttle(function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      value = that.data.history[index];
    this.putSearch(value, 1)
    this.setData({
      inputConfirm: true,
      value: value
    })
    this.data.current_page = 1
    getCompetitionSearchList(this, value)
  }),
  //输入完成
  bindconfirm: function (e) {
    this.setData({
      inputFocus: true,
      inputFocus: true,
      inputConfirm: true,
      value: e.detail.value
    })
    var value = e.detail.value
    this.data.current_page = 1
    getCompetitionSearchList(this, value)
    this.putSearch(value, 1)
  },
  //取消搜索
  onCancel: function () {
    this.setData({
      inputFocus: false,
      current_page: 1,
      page_size: 10,
      total_num: 0,
      list: [],
      value: '',
      inputConfirm: false,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
  },
  //清除历史
  bindDelete: function (e) {
    this.setData({
      history: []
    })
    wx.removeStorage({
      key: 'search_history'
    })
  },
  //保存历史搜索
  putSearch: function (value, flag) {
    var that = this,
      history = that.data.history;
    if (!history) {
      history = []
      history.unshift(value)
    } else {
      for (var i = 0; i < history.length; i++) {
        if (history[i] === value) {
          history.splice(i, 1);
          break;
        }
      }
      if (history.length > 10) {
        history.splice(10, 1);
      }
      history.unshift(value); // 再添加到第一个位置
    }
    that.setData({
      history: history
    })
    wx.setStorage({
      key: "search_history",
      data: history,
      success: function (res) { }
    })
  },
  /**
   * 上拉加载
   */
  bindscrolltolower: function () {
    var checkLabelIndex = this.data.checkLabelIndex,
      labelItem = this.data.labelList[checkLabelIndex];
    if (labelItem.total_num > labelItem.page_size * labelItem.current_page) {
      ++labelItem.current_page
      this.setData({
        [`labelList[${checkLabelIndex}].loadData`]: {
          searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
      getCompetitionList(this)
    } else {
      this.setData({
        [`labelList[${checkLabelIndex}].loadData`]: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindLabelClick: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    that.setData({
      swiperCurrent: index,
      checkLabelIndex: index
    })
  },
  bindSwiperChange: function (e) {
    var that = this,
      current = e.detail.current,
      labelItem = this.data.labelList[current];
    that.setData({
      checkLabelIndex: current,
      //搜索重置
      inputFocus: false,
      current_page: 1,
      page_size: 10,
      total_num: 0,
      list: [],
      value: '',
      inputConfirm: false,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    if (labelItem.list.length == 0) {
      getCompetitionList(this)
    }
  },
  bindItemClick: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      item = that.data.labelList[that.data.checkLabelIndex].list[index],
      labelItem = that.data.labelList[that.data.checkLabelIndex],
      inputFocus = that.data.inputFocus;
    if (inputFocus) {
      item = that.data.list[index]
    }
    switch (item.competition_status) {
      case 1: //报名阶段
      case 4: //计划中 
      case 5: //抽签阶段
        toolUtils.pageTo(`/page/pack-match/pages/sport-detail/sport-detail?competition_id=${item.competition_id}&competition_level=${item.competition_level}`)
        break
      case 2: //进行中
        var attrId = labelItem.attr_id ? labelItem.attr_id : item.attr_id
        //attrId=2 足球  attrId=53 或 attrId=51 跑步或自行车  attrId为其他值则是通用类型
        var _url = attrId == 2 ? '/page/pack-match/pages/sport-underway/sport-underway' : attrId == 53 || attrId == 51 ? '/page/pack-match/pages/sport-other-timing/sport-other-timing' : '/page/pack-match/pages/sport-other-underway/sport-other-underway'
        toolUtils.pageTo(`${_url}?competition_id=${item.competition_id}&competition_level=${item.competition_level}&competition_tag=${item.competition_tag}`)


        // if (item.competition_tag == 1) {//队伍
        // //attrId=2 足球  attrId=53 或 attrId=51 跑步或自行车  attrId为其他值则是通用类型
        //   var _url = attrId == 2 ? '/page/pack-match/pages/sport-underway/sport-underway' : attrId == 53 || attrId == 51 ? '/page/pack-match/pages/sport-other-timing/sport-other-timing' :'/page/pack-match/pages/sport-other-underway/sport-other-underway'

        //   toolUtils.pageTo(`${_url}?competition_id=${item.competition_id}&competition_level=${item.competition_level}`)
        // } else { //个人
        //   toolUtils.pageTo(`/page/pack-match/pages/sport-detail/sport-detail?competition_id=${item.competition_id}&competition_level=${item.competition_level}`)
        // }
        break
      case 3: //已结束
        var attrId = labelItem.attr_id ? labelItem.attr_id : item.attr_id
        if (attrId == 2 && item.competition_tag == 1) { //队伍
          // item.competition_level
          if (item.competition_level == 1) { //杯赛
            toolUtils.pageTo(`/page/pack-match/pages/sport-summary/sport-summary?competition_id=${item.competition_id}&competition_level=${item.competition_level}`)
          } else {
            toolUtils.pageTo(`/page/pack-match/pages/sport-underway/sport-underway?competition_id=${item.competition_id}&competition_level=${item.competition_level}`)
          }
        } else { //个人
          toolUtils.pageTo(`/page/pack-match/pages/sport-detail/sport-detail?competition_id=${item.competition_id}&competition_level=${item.competition_level}`)
        }
        break
    }
  }
})

function getCompetitionList(that) {
  var checkLabelIndex = that.data.checkLabelIndex,
    labelItem = that.data.labelList[checkLabelIndex],

    params = {
      // 'is_recom': labelItem.is_recom,
      'current_page': labelItem.current_page,
      'page_size': labelItem.page_size,
      'city_id': that.data.city_id,
      'competition_status': that.data.competition_status
    };
  that.setData({
    [`labelList[${checkLabelIndex}]`]: labelItem
  })
  if (checkLabelIndex == 0) {
    params.attr_id = that.data.attr_id || ''
  } else {
    params.attr_id = labelItem.attr_id
  }
  // if (city_id > 0) {
  //   params.city_id = city_id
  // } else {
  //   params.city_id = ""
  // }
  // if (competition_status > 0) {
  //   params.competition_status = that.data.competition_status
  // }
  httpsUtils.competitionList(params, function (res) {
    labelItem.total_num = res.total_num
    if (res.current_page == 1) {
      labelItem.list = []
    }
    labelItem.list = labelItem.list.concat(res.list)
    labelItem.into_view = ''
    if (labelItem.list.length == res.total_num) {
      labelItem.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        [`labelList[${checkLabelIndex}]`]: labelItem
      })
    } else {
      labelItem.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        [`labelList[${checkLabelIndex}]`]: labelItem
      })
    }
    wx.stopPullDownRefresh()
    setTimeout(function (e) {
      that.setData({
        rotateRefreshImg: false
      })
    }, 1000)
  }, function (e) {
    if (labelItem.current_page > 1) {
      --labelItem.current_page
    }
    that.setData({
      rotateRefreshImg: false,
      [`labelList[${checkLabelIndex}].loadData`]: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.stopPullDownRefresh()
  })
}
//搜索
function getCompetitionSearchList(that, value) {
  var checkLabelIndex = that.data.checkLabelIndex,
    labelItem = that.data.labelList[checkLabelIndex],
    current_page = that.data.current_page,
    page_size = that.data.page_size,
    total_num = that.data.total_num,
    list = that.data.list,
    params = {
      'attr_id': labelItem.attr_id,
      'current_page': current_page,
      'q': value,
      'page_size': page_size
    };
  httpsUtils.competitionList(params, function (res) {
    total_num = res.total_num
    if (res.current_page == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length == res.total_num) {
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
    wx.stopPullDownRefresh()
  }, function (e) {
    if (current_page > 1) {
      --current_page
    }
    that.setData({
      current_page: current_page,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.stopPullDownRefresh()
  })
}

//获取全部赛事类型
function getAttrList(that) {
  httpsUtils.attr(6, function (res) {
    console.log(res[0])
    var _data = res[0];
    var attrObj = res;
    wx.setStorageSync('attrList', attrObj);
    _data.unshift({
      'id': '',
      'name': '全部'
    })
    that.setData({
      matchArray: _data
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}