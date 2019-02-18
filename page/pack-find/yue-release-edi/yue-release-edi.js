// page/pack-find/yue-release-edi/yue-release-edi.js
// page/pack-find/yue-release/yue-release.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
var mCaseAddr = ''
//  获取 赛制与性质
function getAttr(attr_group_id) {
  httpsUtils.attr(attr_group_id, function (res) {
    if (attr_group_id == 1) {
      that.setData({
        movementRule: res[0],
      })
    } else if (attr_group_id == 8) {
      that.setData({
        movementType: res[0],
      })
    }
  }, function (e) { })
}
// 获取 约动详情
function getData(id) {
  httpsUtils.movementDetail(id, {}, function (res) {
    that.setData({
      date: res.movement_time.substring(0,10),
      time: res.movement_time.substring(11,16),
      movement_rule: res.movement_rule,
      movement_type: res.movement_type,
      mCaseAddr: res.address,
      remark:res.movement_remark,
    })
  }, function (e) {

  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movementRule: [],
    movementType: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    console.log(options)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          groupId: options.group_id,
          soccer_movement_id: options.soccer_movement_id,
          startdate: toolUtils.getNowFormatDate(),
          starttime: toolUtils.getNowTime()
        })
        getAttr(1);
        getAttr(8);
        getData(options.soccer_movement_id);
       
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 日期获取
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
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
        console.log(that.data.lat)
      }, fail: function (e) {
        // mCaseAddr = ''
        // that.setData({
        //   mCaseAddr: mCaseAddr,
        //   lat: '',
        //   lng: ''
        // })
        if (e.errMsg != "chooseLocation:fail cancel") {
          wx.showModal({
            title: '温馨提示',
            content: '请授权获取地理位置，可以更精准的提供街道选择',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userLocation"] == true) {

                    } else {
                    }
                  }
                })
              } else if (res.cancel) {
              }
            }
          })
        }

      }
    }
    )
  }),

  // 赛制
  bindPickerChangeRule(e) {
    var index = e.detail.value;
    var item = this.data.movementRule[index]
    var currentId = item.id; // 这个id就是选中项的id
    this.setData({
      indexRule: e.detail.value,
      movement_rule: item.name,
      indexRuleId: currentId
    })
  },
  // 性质
  bindPickerChangeType(e) {
    console.log(e)
    var index = e.detail.value;
    var item = this.data.movementType[index]
    var currentId = item.id; // 这个id就是选中项的id
    this.setData({
      movement_type:item.name,
      indexType: e.detail.value,
      indexTypeId: currentId
    })
  },
  // 备注
  bindinput(e) {
    that.setData({
      remark: e.detail.value
    })
  },
  // 发布约动
  bindUpRelese() {
    console.log(that.data.date)
    // debugger
    let args = {
      // group_id: that.data.groupId,
      soccer_movement_id: that.data.soccer_movement_id,
      movement_remark: that.data.remark,
      movement_time :that.data.date + " " + that.data.time
    }
    if (!toolUtils.timeCompare(args.movement_time)){
      toolUtils.showToast("约战时间必须大于当前时间")
      return
    }

    // if (!that.data.date) {
    //   // toolUtils.showToast("请选择日期")
    //   // return
    // }else{
      
    // }
    // if (!that.data.time) {
    //   // toolUtils.showToast("选择开战时间")
    //   // return
    // }else{
     
    // }
    if (!that.data.lng) {
      // toolUtils.showToast("请选择地址")
      // return
    }else{
      args.address = that.data.mCaseAddr
      args.lng = that.data.lng
      args.lat = that.data.lat
    }
    if (!that.data.indexType) {
      // toolUtils.showToast("请选择比赛性质")
      // return
    }else{
      args.movement_type = that.data.indexTypeId
    }
    if (!that.data.indexRule) {
      // toolUtils.showToast("请选择赛制")
      // return
    }else{
      args.movement_rule = that.data.indexRuleId
    }
    httpsUtils.editMovement(args, function (res) {
      var pages = getCurrentPages()
      try{
        var page1 = pages[pages.length-2]
        if ("page/pack-find/yue-sport/yue-sport" == page1.route){
          page1.freshData()
        }

      }catch(e){

      }
      try {
        var page2 = pages[pages.length - 3]
        if ("page/pack-index/pages/team-page/team-page" == page2.route) {
          page2.refreshData()
        }
      } catch (e) {

      }
      wx.navigateBack({
        delta: 1
      })
    }, function (e) {
    })
  }
})