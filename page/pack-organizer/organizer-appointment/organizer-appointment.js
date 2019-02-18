// page/pack-organizer/organizer-appointment/organizer-appointment.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
var mCaseAddr = ''
var movementRule;
var movementType;
var costType;
var group_member_count;

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
    remark: '',
    group_num: 1,
    teamAttr: [],
    movement_id: '',
    curLimitNum: 0,
    isMark: true,
    group_per_num: 8
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    group_member_count = options.group_member_count;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
    if (options.movement_id) {
      that.setData({
        movement_id: options.movement_id
      })
      movementDetail(options.movement_id);
    }
    getTime(that);
    getAttr(1);
    getAttr(8);
    getCost();
    getAttrGroup(); //获取约动详情
    if (that.data.attr_id == 2 || that.data.attr_id == 3) {
      getColorList();
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
    that.setData({
      isMark: true
    })
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
  onShareAppMessage: function (res) { },
  /**
   * 选择类型
   */
  bindPickerChangeGroup(e) {
    let group = that.data.chooseData[e.detail.value];
    this.setData({
      attrId: group.id,
      group_name: group.name
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
  // 获取约动地点
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
    var venue = '';
    if (toolUtils.emojiCharacter(e.detail.value)) {
      toolUtils.showToast("常用场馆不支持输入emoji表情")
      venue = this.data.venue;
    } else {
      venue = e.detail.value;
    }
    this.setData({
      venue: venue
    })
  },
  //选择人数
  selectTeam: function (e) {
    that.setData({
      group_num: e.target.dataset.id
    })
  },
  //获取每只队伍的人数
  getGroupNum(e) {
    var group_per_num = 1;
    if (!(/^\d+$/).test(parseInt(e.detail.value)) || isNaN(e.detail.value) || parseInt(e.detail.value) == 0) {
      group_per_num = 1;
    } else {
      if (parseInt(e.detail.value) > 255) {
        group_per_num = 255;
      } else {
        group_per_num = parseInt(e.detail.value);
      }
    }
    that.setData({
      group_per_num: group_per_num
    })
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
      toolUtils.showToast("备注不支持输入emoji表情");
      this.setData({
        remark: this.data.remark
      })
      return
    } else {
      this.setData({
        remark: e.detail.value
      })
    }
    this.setData({
      curLimitNum: this.data.remark.length
    })
  },
  // 发布约动
  bindUpRelese() {
    if (!this.data.attrId) {
      toolUtils.showToast("请选择约动类型")
      return
    }
    if (!this.data.date) {
      toolUtils.showToast("请选择日期")
      return
    }
    if (!this.data.time) {
      toolUtils.showToast("选择约动时间")
      return
    }
    if (!this.data.mCaseAddr) {
      toolUtils.showToast("请选择约动地点")
      return
    }
    let args = {
      attr_id: this.data.attrId,
      movement_time: this.data.time,
      movement_date: this.data.date,
      address: this.data.mCaseAddr,
      lng: this.data.lng,
      lat: this.data.lat,
      movement_type: this.data.indexTypeId,
      movement_rule: this.data.indexRuleId,
      movement_remark: this.data.remark,
      venue: this.data.venue,
      movement_fee: this.data.costId,
      group_num: this.data.group_num,
      group_per_num: this.data.group_per_num
    }
    if (!toolUtils.timeCompare(args.movement_date + ' ' + args.movement_time)) {
      toolUtils.showToast("约动时间必须大于当前时间")
      return;
    }
    if (!that.data.group_per_num) {
      toolUtils.showToast("请输入每队人数")
      return;
    }
    if (args.movement_remark && args.movement_remark.length > 150) {
      toolUtils.showToast("备注信息限制在1-150字符以内")
      return;
    }
    this.setData({
      isloading: true,
      isMark: false
    })
    httpsUtils.createOrganization(args, function (res) {
      try {
        toolUtils.pageTo('/page/pack-organizer/yd-detail/yd-detail?movement_id=' + res.movement_id, 1);
      } catch (e) {
        wx.navigateBack({
          delta: 1
        })
      }

    }, function (e) {
      that.setData({
        isloading: false
      })
    })
  },
  //修改约动
  bindSave: function () {
    if (!this.data.attrId) {
      toolUtils.showToast("请选择约动类型")
      return
    }
    if (!this.data.date) {
      toolUtils.showToast("请选择日期")
      return
    }
    if (!this.data.time) {
      toolUtils.showToast("选择约动时间")
      return
    }
    if (!this.data.mCaseAddr) {
      toolUtils.showToast("请选择约动地点")
      return
    }
    let args = {
      movement_id: this.data.movement_id,
      movement_time: this.data.time,
      movement_date: this.data.date,
      address: this.data.mCaseAddr,
      lng: this.data.lng,
      lat: this.data.lat,
      movement_type: this.data.indexTypeId,
      movement_rule: this.data.indexRuleId,
      movement_remark: this.data.remark,
      attr_id: this.data.attr_id,
      venue: this.data.venue,
      movement_fee: this.data.costId,
      group_num: this.data.group_num,
      group_per_num: this.data.group_per_num
    }
    if (!toolUtils.timeCompare(args.movement_date + ' ' + args.movement_time)) {
      toolUtils.showToast("约动时间必须大于当前时间")
      return
    }
    if (!that.data.group_per_num) {
      toolUtils.showToast("请输入每队人数");
      return
    }
    if (that.data.group_per_num < parseInt(group_member_count)) {
      toolUtils.showToast("队伍人数不能小于队伍报名数:" + group_member_count + '人');
      return;
    }
    if (args.movement_remark && args.movement_remark.length > 150) {
      toolUtils.showToast("备注信息限制在1-150字符以内")
      return;
    }
    this.setData({
      isloading: true,
      isMark: false
    })
    httpsUtils.editOrganization(args, function (res) {
      try {
        var pages = getCurrentPages();
        pages[pages.length - 2].freshData();
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
function getAttr(attr_attr_id) {
  httpsUtils.attr(attr_attr_id, function (res) {
    if (attr_attr_id == 1) {
      movementRule = res[0]
      that.data.movement[0] = movementRule;
      that.setData({
        movement: that.data.movement,
        indexRuleId: movementRule[0].id,
        itemRule: movementRule[0].name,
      })
    } else if (attr_attr_id == 8) {
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
      if (that.data.movement_id) {
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
// 约动详情
function movementDetail(movement_id) {
  httpsUtils.organization({
    movement_id: movement_id
  }, function (res) {
    // if (that.data.attr_id == 2 || that.data.attr_id == 3) {
    //   that.setData({
    //     color: res.home_shirt,
    //     home_shirt: res.home_shirt_id,
    //   })
    // }
    var movement_info = res.movement_info;
    that.setData({
      movement_id: movement_info.movement_id,
      group_name: movement_info.attr_name,
      attrId: movement_info.attr_id,
      date: movement_info.movement_date,
      time: movement_info.movement_time,
      mCaseAddr: movement_info.address,
      lng: movement_info.lng,
      lat: movement_info.lat,
      itemRule: movement_info.movement_rule,
      indexRuleId: movement_info.movement_rule_id,
      itemType: movement_info.movement_type,
      indexTypeId: movement_info.movement_type_id,
      remark: movement_info.movement_remark,
      costId: movement_info.movement_fee_id,
      cost: movement_info.movement_fee,
      attr_id: movement_info.attr_id,
      venue: movement_info.venue,
      group_num: movement_info.group_num,
      group_per_num: movement_info.group_per_num,
      curLimitNum: movement_info.movement_remark.length
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
//获取约动类型
function getAttrGroup() {
  httpsUtils.attr(6, function (res) {
    that.setData({
      chooseData: res[0]
    })
  }, function (res) {
    toolUtils.showToast(e.data.msg)
  }, '')
}