var httpsUtils = require('../../../utils/https-utils.js');
var toolUtils = require("../../../utils/tool-utils.js")
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grouping: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    group: 'A',
    college: [],
    gender: ['男', '女'],
    selectIndex: 0,
    applyState: false,
    hintState: false,
    dataList: [],
    countDownNum: 3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          isLoading: true,
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          scene: options.scene || '', //1二维码 2 banner 3分享
          isShare: options.scene == 3 ? true : false
        })
      }
    })
    if (options.scene == 1) {
      checkIsBand()
    } else {
      getData()
    }
    getApp().userInfo(function (userInfo) {
      that.setData({
        user_phone: userInfo.user_phone,
        isAuit: userInfo.user_phone && userInfo.user_nickname && true || false
      })
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
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '川大四院羽毛球友谊赛',
      // imageUrl: url,
      path: '/page/pack-active/active-show/active-show?scene=3'
    }
  },
  //回到首页
  goHome: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },
  // 学院
  changeCollege: function (e) {
    this.setData({
      college_name: this.data.college[e.detail.value],
    })
    if (this.data.sex) {
      this.setData({
        sex: '',
        user_name: '',
        act_id: ''
      })
    }
  },
  // 性别
  changeGender: function (e) {
    this.setData({
      sex: this.data.gender[e.detail.value],
    })
    if (this.data.act_id || this.data.user_name) {
      this.setData({
        act_id: '',
        user_name: ''
      })
    }
    this.getUserName()
  },
  // 获取姓名
  getUserName: function () {
    that = this;
    var params = {};
    params.college = that.data.college_name;
    params.sex = that.data.sex;
    httpsUtils.subgroupName(params, function (res) {
      that.setData({
        userList: res
      })
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  // 姓名改变
  changeName: function (e) {
    this.setData({
      act_id: this.data.userList[e.detail.value].act_id,
      user_name: this.data.userList[e.detail.value].name
    })
  },
  //获取手机号
  getPhoneNumber: function (e) {
    if (e.detail.typeStr == "phone") {
      getApp().getRefreshUserInfo(function (userInfo) {
        console.log(userInfo)
        that.setData({
          user_phone: userInfo.user_phone,
          isAuit: true
        })
        toolUtils.showToast("获取成功")
      })
    }
  },
  //编辑手机号码
  getPhoneInfo: function (e) {
    this.setData({
      user_phone: e.detail.value
    })
  },
  // 提交信息
  submitInfo: function () {
    that = this;
    that.setData({
      countDownNum: 3
    })
    if (!that.data.college_name) {
      toolUtils.showToast('请选择学院')
      return
    }
    if (!that.data.sex) {
      toolUtils.showToast('请选择性别')
      return
    }
    if (!that.data.act_id) {
      toolUtils.showToast('请选择姓名')
      return
    }
    if (!toolUtils.checkMobilePhone(that.data.user_phone)) {
      toolUtils.showToast('手机号格式错误')
      return
    }
    var params = {};
    params.act_id = that.data.act_id;
    params.user_phone = that.data.user_phone;
    httpsUtils.subgroupList(params, function (res) {
      that.setData({
        group_no: res.group_no,
        applyState: false,
        hintState: true,
        timer: setInterval(function () {
          that.data.countDownNum--;
          that.setData({
            countDownNum: that.data.countDownNum
          })
          if (that.data.countDownNum == 0) {
            clearInterval(that.data.timer);
            if (that.data.hintState == true) {
              that.setData({
                hintState: false
              })
            }
            getData()
          }
        }, 1000)
      })
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  // 拨打手机
  getPhone: function (e) {
    var _index = e.currentTarget.dataset.index
    var title = e.currentTarget.dataset.title;
    var key = "";
    key = title == "A" ? 1 : 2
    wx.makePhoneCall({
      phoneNumber: this.data.dataList[_index][key].phone,
    })
  },
  // 选择组队
  groupSelect: function (e) {
    that = this
    var params = {};
    var _index = e.currentTarget.dataset.index;
    that.setData({
      selectIndex: _index,
      group: that.data.grouping[_index]
    })
    params.group = that.data.group;
    getData(params);
  },
  // 我知道了关闭弹窗
  shutDown: function () {
    this.setData({
      hintState: false
    })
    getData()
  },
  // 取消弹窗
  cancelTip: function (e) {
    that.setData({
      applyState: false,
      hintState: false,
    })
    getData()
  }
})
// 分组数据
function getData(params) {
  if (typeof params !== 'object') {
    params = {}
  }
  httpsUtils.subgroupList(params, function (res) {
    for (var i = 0; i < that.data.grouping.length; i++) {
      if (that.data.grouping[i] == res.group) {
        that.setData({
          selectIndex: i,
          dataList: res.list || []
        })
      }
    }
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
// 检查是否绑定信息
function checkIsBand() {
  httpsUtils.isBind({}, function (res) {
    if (res.to_jump == 1) {
      that.setData({
        applyState: true,
        hintState: false,
      })
      getCollege()
    } else {
      that.setData({
        applyState: false,
        hintState: false,
      })
      getData()
    }
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
// 获取学院列表
function getCollege() {
  httpsUtils.getCollegeList({}, function (res) {
    console.log(res)
    that.setData({
      college: res
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}