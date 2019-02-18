// page/pack-find/yue-release/yue-release.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
var mCaseAddr = ''
var movementRule;
var movementType;
var costType;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movement: [
      [],
      []
    ],
    venue: '',
    remark: ''
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
          groupId: options.group_id || '',
          isGroup: options.group_id && true || false,
          attr_id: options.attr_id || ''
        })
      }
    })
    if (options.color && options.home_shirt) {
      that.setData({
        color: options.color,
        home_shirt: options.home_shirt
      })
    } else {
      that.setData({
        color: "",
        home_shirt: ""
      })
    }
    if (options.soccer_movement_id) {
      // 约战详情
      that.setData({
        soccer_movement_id: options.soccer_movement_id
      })
      movementDetail(that);
    }
    if (options.isEdit) {
      that.setData({
        isEdit: true
      })
    } else {
      that.setData({
        isEdit: false
      })
    }
    getTime(that);
    getAttr(1);
    getAttr(8);
    getCost();
    if (that.data.attr_id == 2 || that.data.attr_id == 3) {
      getColorList();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  freshData() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.myGroup();
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
  // 我的队伍
  myGroup(e) {
    httpsUtils.myGroup({
      current_page: 1,
      page_size: 1000,
      attr_id: that.data.attr_id,
      is_leader: 1
    }, function (res) {
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
              console.log(that.data.attr_id)
              // toolUtils.pageTo('/page/tabBar/index/index', 3)
              if (that.data.attr_id == 2 || that.data.attr_id == 3) {
                toolUtils.pageTo(`/page/pack-index/pages/organize-team/organize-team?attr_id=${that.data.attr_id}`, 1)
              } else {
                toolUtils.pageTo(`/page/pack-index/pages/currency-organize-team/organize-team?attr_id=${that.data.attr_id}`, 1)
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }, function (e) { })
  },
  /**
   * 选择队伍
   */
  bindPickerChangeGroup(e) {
    let group = that.data.chooseData[e.detail.value];
    this.setData({
      groupId: group.group_id,
      group_name: group.group_name,
      color: group.home_shirt || '',
      home_shirt: group.home_shirt_id || ''
    })
  },
  // 日期获取
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //时间获取
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  // 获取约战地点
  onLocation: toolUtils.throttle(function (e) {
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        mCaseAddr = res.address
        that.setData({
          mCaseAddr: mCaseAddr,
          lat: res.latitude,
          lng: res.longitude
        })
      },
      fail: function (e) {
        mCaseAddr = ''
        that.setData({
          mCaseAddr: mCaseAddr,
          lat: '',
          lng: ''
        })
        if (e.errMsg != "chooseLocation:fail cancel") {
          wx.showModal({
            title: '温馨提示',
            content: '请授权获取地理位置，可以更精准的提供街道选择',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userLocation"] == true) {

                    } else { }
                  }
                })
              } else if (res.cancel) { }
            }
          })
        }

      }
    })
  }),
  //比赛场馆
  matchAddress: function (e) {
    if (toolUtils.emojiCharacter(e.detail.value)) {
      toolUtils.showToast("常用场馆不支持输入emoji表情")
      this.setData({
        venue: this.data.venue
      })
      return
    } else {
      this.setData({
        venue: e.detail.value
      })
    }
  },

  // 赛制
  bindPickerChangeRule(e) {
    var item = e.detail.value;
    this.setData({
      indexRuleId: that.data.movement[0][item[0]].id,
      indexTypeId: that.data.movement[1][item[1]].id,
      itemRule: that.data.movement[0][item[0]].name,
      itemType: that.data.movement[1][item[1]].name
    })
  },
  //球衣颜色自定义picker的返回时间
  bindViewPicker: function (e) {
    this.setData({
      isViewPicker: false
    })
    if ("cancel" == e.detail.id) { } else if ("confirm" == e.detail.id) {
      if (e.detail.attr_id) {
        this.setData({
          color: e.detail.attr_value || this.data.color,
          home_shirt: e.detail.attr_id || this.data.home_shirt
        })
      }
    }
  },
  //选择球衣颜色
  onColors: function (e) {
    this.setData({
      isViewPicker: true,
    })
  },
  // 选择费用方式
  bindPickerChangecost: function (e) {
    this.setData({
      cost: this.data.costType[e.detail.value].name,
      costId: this.data.costType[e.detail.value].id
    })
  },
  // 备注
  bindinput(e) {
    if (toolUtils.emojiCharacter(e.detail.value)) {
      toolUtils.showToast("备注不支持输入emoji表情")
      this.setData({
        remark: this.data.remark
      })
      return
    } else {
      this.setData({
        remark: e.detail.value
      })
    }
  },
  // 发布约战
  bindUpRelese() {
    if (!this.data.groupId) {
      toolUtils.showToast("请选择队伍")
      return
    }
    if (!this.data.date) {
      toolUtils.showToast("请选择日期")
      return
    }
    if (!this.data.time) {
      toolUtils.showToast("选择约战时间")
      return
    }
    if (!this.data.mCaseAddr) {
      toolUtils.showToast("请选择约战地点")
      return
    }
    let args = {
      group_id: this.data.groupId,
      movement_time: this.data.date + " " + this.data.time,
      address: this.data.mCaseAddr,
      lng: this.data.lng,
      lat: this.data.lat,
      movement_type: this.data.indexTypeId,
      movement_rule: this.data.indexRuleId,
      movement_remark: this.data.remark,
      attr_id: this.data.attr_id,
      venue: this.data.venue,
      movement_fee: this.data.costId,
      home_shirt: this.data.home_shirt
    }
    if (!toolUtils.timeCompare(args.movement_time)) {
      toolUtils.showToast("约战时间必须大于当前时间")
      return
    }
    this.setData({
      isloading: true
    })
    httpsUtils.publishMovement(args, function (res) {
      try {
        var pages = getCurrentPages()
        pages[pages.length - 2].refreshData()
      } catch (e) {

      }
      // wx.navigateBack({
      //   delta: 1
      // })
      toolUtils.pageTo(`/page/pack-find/yue-sport/yue-sport?soccer_movement_id=${res.movement_id}`)
    }, function (e) {
      that.setData({
        isloading: false
      })
    })
  },
  refreshData() { },
  //修改约战
  bindSave: function () {
    if (!this.data.groupId) {
      toolUtils.showToast("请选择队伍")
      return
    }
    if (!this.data.date) {
      toolUtils.showToast("请选择日期")
      return
    }
    if (!this.data.time) {
      toolUtils.showToast("选择约战时间")
      return
    }
    if (!this.data.mCaseAddr) {
      toolUtils.showToast("请选择约战地点")
      return
    }
    let args = {
      soccer_movement_id: this.data.soccer_movement_id,
      movement_time: this.data.date + " " + this.data.time,
      address: this.data.mCaseAddr,
      lng: this.data.lng,
      lat: this.data.lat,
      movement_type: this.data.indexTypeId,
      movement_rule: this.data.indexRuleId,
      movement_remark: this.data.remark,
      attr_id: this.data.attr_id,
      venue: this.data.venue,
      movement_fee: this.data.costId,
      home_shirt: this.data.home_shirt
    }
    if (!toolUtils.timeCompare(args.movement_time)) {
      toolUtils.showToast("约战时间必须大于当前时间")
      return
    }
    this.setData({
      isloading: true
    })
    httpsUtils.editMovement(args, function (res) {
      try {
        var pages = getCurrentPages()
        pages[pages.length - 2].freshData()
      } catch (e) { }
      wx.navigateBack({
        delta: 1
      })
    }, function (e) {
      that.setData({
        isloading: false
      })
    })
  },
})

//  获取 赛制与性质  费用方式
function getAttr(attr_group_id) {
  httpsUtils.attr(attr_group_id, function (res) {
    if (attr_group_id == 1) {
      movementRule = res[0]
      that.data.movement[0] = movementRule;
      that.setData({
        movement: that.data.movement,
        indexRuleId: movementRule[0].id,
        itemRule: movementRule[0].name,
      })
    } else if (attr_group_id == 8) {
      movementType = res[0]
      that.data.movement[1] = movementType;
      that.setData({
        movement: that.data.movement,
        indexTypeId: movementType[0].id,
        itemType: movementType[0].name,
      })
    }
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
//  获取 费用方式
function getCost() {
  httpsUtils.attr(11, function (res) {
    console.log(res)
    costType = res[0]
    that.setData({
      costType: costType,
      cost: costType[0].name,
      costId: costType[0].id
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
//获取球衣
function getColorList() {
  httpsUtils.attr(2, function (res) {
    try {
      if (that.data.isEdit) {
        that.setData({
          colorList: res[0]
        })
      } else {
        that.setData({
          colorList: res[0],
        })
      }
    } catch (e) {
      that.setData({
        colorList: res[0]
      })
    }

  }, function (e) {

  })
}
//默认初始日期和时间
function getTime(that) {
  var dateTime = new Date();
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minut = dateTime.getMinutes();

  if (month < 10) {
    month = "0" + month;
  } else { }
  if (day < 10) {
    day = "0" + day;
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minut < 10) {
    minut = '0' + minut
  }
  that.setData({
    endDate: year + '-' + month + 3 + '-' + day,
    startDate: year + "-" + month + "-" + day,
    date: year + "-" + month + "-" + day,
    time: parseInt(hour) + 1 + ':' + minut
  })
}
// 约战详情
function movementDetail(that) {
  httpsUtils.movementDetail(that.data.soccer_movement_id, {}, function (res) {
    if (that.data.attr_id == 2 || that.data.attr_id == 3) {
      that.setData({
        color: res.home_shirt || that.data.color,
        home_shirt: res.home_shirt_id || that.data.home_shirt,
      })
    }
    that.setData({
      group_name: res.group_info.group_name,
      groupId: res.group_id,
      dateNum: res.movement_date,
      date: res.movement_date,
      timeNum: res.movement_time,
      time: res.movement_time,
      mCaseAddr: res.address,
      lng: res.lng,
      lat: res.lat,
      itemRule: res.movement_rule,
      indexRuleId: res.movement_rule_id,
      itemType: res.movement_type,
      indexTypeId: res.movement_type_id,
      remark: res.movement_remark,
      costId: res.movement_fee_id,
      cost: res.movement_fee,
      attr_id: res.attr_id,
      venue: res.venue,
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}