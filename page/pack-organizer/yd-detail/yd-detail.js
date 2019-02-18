// page/pack-find/yue-sport/yue-sport.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
var groupArray = [];
var startPoint;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex_a: -1,
    selectIndex_b: -1,
    detail_tab: {
      currentTab: 1,
      isShow: true
    },
    tab_tip: { //弹窗Tab
      currentTab: 0,
      isShow: true
    },
    group_sign: 1,
    // A队
    current_page1: 1,
    page_size1: 3,
    total_num1: 0,
    // B队
    current_page2: 1,
    page_size2: 3,
    total_num2: 0,
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无报名人员'
    },
    homeList: [],
    awayList: [],
    group_name_a: 'A队',
    group_name_b: 'B队',
    groupInfo: {
      0: {},
      1: {}
    },
    countDownNum: 3, //倒计时
    buttonBtm: 100,
    buttonRighgt: 10
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
          bgh: (res.statusBarHeight + 45) * 750 / res.windowWidth + 368,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          widthCli: res.screenWidth,
          isLoading: true,
          movement_id: options.movement_id || '',
          isShare: options.isShare && true || false
        })
        getYdDetail() //组织者约战详情
        getTeamMber(1) //组织者队伍成员
        getTeamMber(2) //组织者队伍成员
      }
    })
  },
  // 移动浮标
  buttonStart: function (e) {
    startPoint = e.touches[0]
  },
  buttonMove: function (e) {
    var buttonBtm;
    var buttonRighgt;
    var endPoint = e.touches[e.touches.length - 1]
    var translateX = endPoint.clientX - startPoint.clientX
    var translateY = endPoint.clientY - startPoint.clientY
    startPoint = endPoint
    if (this.data.buttonBtm - translateY <= this.data.minHeight) {
      buttonBtm = this.data.buttonBtm - translateY
    } else {
      buttonBtm = this.data.minHeight
    }
    if (this.data.buttonBtm - translateY < 0) {
      buttonBtm = 0
    }
    if (this.data.buttonRighgt - translateX + 60 < this.data.widthCli) {
      buttonRighgt = this.data.buttonRighgt - translateX
    } else {
      buttonRighgt = this.data.widthCli - 60
    }
    if (this.data.buttonRighgt - translateX < 0) {
      buttonRighgt = 0
    }
    this.setData({
      buttonBtm: buttonBtm,
      buttonRighgt: buttonRighgt
    })
  },
  //tab切换事件
  tabNav: function (e) {
    console.log(e)
    if (this.data.detail_tab.currentTab === e.currentTarget.dataset.current) {
      return false;
    }
    var showMode = e.currentTarget.dataset.current == 2;
    this.data.detail_tab.currentTab = e.currentTarget.dataset.current;
    this.data.group_sign = e.currentTarget.dataset.current;
    this.data.detail_tab.isShow = showMode;
    this.setData({
      detail_tab: this.data.detail_tab,
      group_sign: this.data.group_sign,
      current_page2: 1,
      current_page1: 1
    })
    getTeamMber(this.data.group_sign)
  },
  //弹窗tab切换事件
  tipTabNav: function (e) {
    if (this.data.tab_tip.currentTab === e.currentTarget.dataset.current) {
      return false;
    }
    var showMode = e.target.dataset.current == 2;
    this.data.tab_tip.currentTab = e.currentTarget.dataset.current;
    this.data.group_sign = parseInt(e.currentTarget.dataset.current) + 1
    this.data.tab_tip.isShow = showMode;
    this.setData({
      tab_tip: this.data.tab_tip,
      group_sign: this.data.group_sign
    })
    getTeamMber(this.data.group_sign)
  },
  // 文本框失去焦点
  bindblurAevt: function () {
    that = this;
    if (!that.data.group_name_a) {
      that.setData({
        group_name_a: 'A队'
      })
    }
    that.data.tab_tip.currentTab = 0;
    that.data.tab_tip.isShow = true
    that.data.groupInfo[0].group_name = that.data.group_name_a
    that.setData({
      tab_tip: that.data.tab_tip,
      focusState: false,
      groupInfo: that.data.groupInfo
    })
  },
  bindblurBevt: function () {
    that = this;
    if (!that.data.group_name_b) {
      that.setData({
        group_name_b: 'B队'
      })
    }
    that.data.tab_tip.currentTab = 1;
    that.data.tab_tip.isShow = true
    that.data.groupInfo[1].group_name = that.data.group_name_b
    that.setData({
      tab_tip: that.data.tab_tip,
      focusStatus: false,
      groupInfo: that.data.groupInfo
    })
  },
  bindSure: function (e) {
    that = this;
    var title = e.currentTarget.dataset.title;
    if (title == 'A') {
      if (!that.data.group_name_a) {
        that.setData({
          group_name_a: 'A队'
        })
      }
      that.data.tab_tip.currentTab = 0;
      that.data.tab_tip.isShow = true
      that.data.groupInfo[0].group_name = that.data.group_name_a
      that.setData({
        tab_tip: that.data.tab_tip,
        focusState: false,
        groupInfo: that.data.groupInfo
      })
    } else {
      if (!that.data.group_name_b) {
        that.setData({
          group_name_b: 'B队'
        })
      }
      that.data.tab_tip.currentTab = 1;
      that.data.tab_tip.isShow = true
      that.data.groupInfo[1].group_name = that.data.group_name_b
      that.setData({
        tab_tip: that.data.tab_tip,
        focusStatus: false,
        groupInfo: that.data.groupInfo
      })
    }
  },
  // 修改队伍名称
  bindEdit: function (e) {
    that = this;
    var title = e.currentTarget.dataset.title;
    if (title == 'A') {
      that.setData({
        focusState: true,
        focus_a: true
      })
    } else {
      that.setData({
        focusStatus: true,
        focus_b: true
      })
    }
  },
  // A队值
  getOneText: function (e) {
    that = this;
    if (toolUtils.emojiCharacter(e.detail.value)) {
      toolUtils.showToast("队伍名称不支持输入emoji表情")
      this.setData({
        group_name_a: that.data.group_name_a
      })
      return
    }
    this.setData({
      group_name_a: e.detail.value
      // group_name_a: e.detail.value || that.data.group_name_a
    })
  },
  // B队值
  getTwoText: function (e) {
    if (toolUtils.emojiCharacter(e.detail.value)) {
      toolUtils.showToast("队伍名称不支持输入emoji表情")
      this.setData({
        group_name_b: that.data.group_name_b
      })
      return
    }
    that.setData({
      group_name_b: e.detail.value
      // group_name_b: e.detail.value || that.data.group_name_b
    })
  },
  /**
   * 返回首页
   */
  goHome: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },
  // 刷新页面
  freshData: function () {
    this.setData({
      current_page1: 1,
      current_page2: 1
    })
    getYdDetail()
    getTeamMber(1)
    getTeamMber(2)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var url;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    if (this.data.movement_info.attr_id == 2) {
      url = "https://img.sport.darongshutech.com/image_201810251736568193.png"
    } else if (this.data.movement_info.attr_id == 3) {
      url = "https://img.sport.darongshutech.com/image_201810251735466355.png"
    } else {
      url = "https://img.sport.darongshutech.com/image_201810251737248924.png"
    }
    return {
      title: '组织者约战',
      imageUrl: url,
      path: '/page/pack-organizer/yd-detail/yd-detail?isShare=true&movement_id=' + that.data.movement_id
    }
  },
  // 查看更多
  checkMoreEvt: function (e) {
    that = this;
    var title = e.currentTarget.dataset.title;
    if (title == 'home') {
      if (that.data.total_num1 > that.data.page_size1 * that.data.current_page1) {
        ++that.data.current_page1
        that.setData({
          'homeMore': true
        })
        getTeamMber(1)
      } else {
        that.setData({
          'homeMore': false
        })
      }
    } else {
      if (that.data.total_num2 > that.data.page_size2 * that.data.current_page2) {
        ++that.data.current_page2
        that.setData({
          'awayMore': true
        })
        getTeamMber(2)
      } else {
        that.setData({
          'awayMore': false
        })
      }
    }

  },
  // 查看地图
  openMap: function () {
    var longitude = this.data.movement_info.lng;
    var latitude = this.data.movement_info.lat
    wx.openLocation({
      address: this.data.movement_info.address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      scale: 28
    })
  },
  // 拨打组织者电话
  phoneOr() {
    wx.makePhoneCall({
      phoneNumber: this.data.organizer.user_phone,
    })
  },

  // 拨打队员电话
  phoneEvt: function (e) {
    var _index = e.currentTarget.dataset.index;
    var phoneNumber, key = "";
    key = that.data.detail_tab.currentTab == 1 ? 'homeList' : 'awayList'
    wx.makePhoneCall({
      phoneNumber: this.data[key][_index].user_phone,
    })
  },
  //删除队员
  deleteEvt: function (e) {
    that = this
    var _index = e.currentTarget.dataset.index;
    var params = {},
      key = '';
    key = that.data.detail_tab.currentTab == 2 ? 'awayList' : 'homeList';
    params.group_sign = that.data.detail_tab.currentTab || 1;
    params.movement_id = that.data.movement_id;
    params.member_user_id = that.data[key][_index].user_id
    httpsUtils.deleteOrganizationMerber(params, function (res) {
      toolUtils.showToast('队员删除成功');
      that.freshData();
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  //取消约战
  cancelYdEvt: function () {
    var params = {};
    params.movement_id = this.data.movement_id
    httpsUtils.deleteOrganization(params, function (res) {
      toolUtils.showToast('约战取消成功');
      wx.navigateBack({
        delta: 1,
      })
      var pages = getCurrentPages();
      pages[pages.length - 2].freshData()
    }, function (e) {
      toolUtils.showToast(e.data.msg);
    })
  },
  //重新编辑
  editYdEvt: function () {
    var movement_id = this.data.movement_id;
    var group_member_count = this.data.detail_tab.currentTab == 1 ? this.data.group_member_count.group_a_count : this.data.group_member_count.group_b_count
    toolUtils.pageTo("/page/pack-organizer/organizer-appointment/organizer-appointment?movement_id=" + movement_id + '&group_member_count=' + group_member_count, 1)
  },
  // 点我报名
  applyEvt: function (e) {
    that = this;
    that.setData({
      countDownNum: 3, //倒计时
    })
    var title = e.currentTarget.dataset.title;
    var countDownNum = that.data.countDownNum;
    if (title == 'A_team' || title == 'C_team') {
      if (that.data.home_fill == 1) {
        toolUtils.showToast('该队伍报名人数已满，联系组织者或试试其他队吧')
      } else {
        that.setData({
          openStatus: true,
          timer: setInterval(function () {
            countDownNum--;
            that.setData({
              countDownNum: countDownNum
            })
            if (countDownNum == 0) {
              clearInterval(that.data.timer);
              that.setData({
                openStatus: false,
              })
              var pages = getCurrentPages();
              console.log(pages[pages.length - 1])
              if (pages[pages.length - 1].route == "page/pack-organizer/yd-detail/yd-detail") {
                toolUtils.pageTo(`/page/pack-organizer/sign-appointment/sign-appointment?group_sign=${that.data.detail_tab.currentTab}&movement_id=${that.data.movement_id}&attr_id=${that.data.movement_info.attr_id}`, 1)
              }
              // toolUtils.pageTo(`/page/pack-organizer/sign-appointment/sign-appointment?group_sign=${that.data.detail_tab.currentTab}&movement_id=${that.data.movement_id}&attr_id=${that.data.movement_info.attr_id}`, 1)
            }
          }, 1000)
        })
      }
    } else if (title == 'B_team') {
      if (that.data.away_fill == 1) {
        toolUtils.showToast('该队伍报名人数已满，联系组织者或试试其他队吧')
      } else {
        that.setData({
          openStatus: true,
          timer: setInterval(function () {
            countDownNum--;
            that.setData({
              countDownNum: countDownNum
            })
            if (countDownNum == 0) {
              clearInterval(that.data.timer);
              that.setData({
                openStatus: false
              })
              var pages = getCurrentPages();
              console.log(pages[pages.length - 1])
              if (pages[pages.length - 1].route == "page/pack-organizer/yd-detail/yd-detail") {
                toolUtils.pageTo(`/page/pack-organizer/sign-appointment/sign-appointment?group_sign=${that.data.detail_tab.currentTab}&movement_id=${that.data.movement_id}&attr_id=${that.data.movement_info.attr_id}`, 1)
              }
            }
          }, 1000)
        })
      }
    }
  },

  // 我知道了
  navigatorEvt: function () {
    var pages = getCurrentPages();
    if (pages[pages.length - 1].route == "page/pack-organizer/yd-detail/yd-detail") {
      toolUtils.pageTo(`/page/pack-organizer/sign-appointment/sign-appointment?group_sign=${that.data.detail_tab.currentTab}&movement_id=${that.data.movement_id}&attr_id=${that.data.movement_info.attr_id}`, 1)
    }
    // setTimeout(function () {
    //   that.setData({
    //     countDownNum: 0,
    //     openStatus: false
    //   })
    // }, 1000)
  },
  // 取消报名
  cancelBaoming: function (e) {
    console.log(e)
    var title = e.currentTarget.dataset.title;
    that = this;
    var params = {};
    params.movement_id = that.data.movement_id;
    params.group_sign = that.data.detail_tab.currentTab
    httpsUtils.cancelOrganization(params, function (res) {
      toolUtils.showToast('成功取消报名')
      that.freshData()
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  // 开启约战
  openYd: function () {
    that = this;
    //时间转为时间戳
    var outTime = that.data.movement_info.movement_date + ' ' + that.data.movement_info.movement_time;
    outTime = outTime.replace(new RegExp("-", "gm"), "/");
    var allTime = new Date(outTime).getTime();
    // 
    // 当前时间
    var timestamp = new Date().valueOf();
    if (that.data.movement_info.group_num == 2) {
      if (timestamp > allTime) {
        toolUtils.showToast('约战时间不能小于当前时间')
      } else {
        if (that.data.homeList.length > 0 && that.data.awayList.length > 0) {
          that.data.groupInfo[0].group_name = that.data.group_name_a;
          that.data.groupInfo[1].group_name = that.data.group_name_b
          that.setData({
            openState: true,
            groupInfo: that.data.groupInfo,
            page_size1: that.data.group_member_count.group_a_count,
            page_size2: that.data.group_member_count.group_b_count
          })
          getTeamMber(1)
          getTeamMber(2)
        } else {
          toolUtils.showToast('队伍双方均有成员才能开启约战')
        }
      }
    } else {
      if (timestamp > allTime) {
        toolUtils.showToast('约战时间不能小于当前时间')
      } else {
        if (that.data.homeList.length > 0) {
          that.data.groupInfo[0].group_name = that.data.group_name_a;
          that.setData({
            openState: true,
            groupInfo: that.data.groupInfo,
            page_size1: that.data.group_member_count.group_a_count,
          })
          getTeamMber(1)
        } else {
          toolUtils.showToast('暂无成员，不能开启约战')
        }
      }
    }
  },
  // 选成员为创建者
  selectMember: function (e) {
    that = this;
    var _index = e.currentTarget.dataset.index;
    var key = "";
    var selectIndex = -1;
    key = that.data.tab_tip.currentTab == 0 ? 'homeList' : 'awayList'
    if (that.data.tab_tip.currentTab == 0) {
      that.setData({
        selectIndex_a: _index
      })
    } else if (that.data.tab_tip.currentTab == 1) {
      that.setData({
        selectIndex_b: _index
      })
    }
    selectIndex = that.data.tab_tip.currentTab == 0 ? that.data.selectIndex_a : that.data.selectIndex_b
    that.data.groupInfo[that.data.tab_tip.currentTab].group_admin = that.data[key][selectIndex].user_id;
    that.data.groupInfo[that.data.tab_tip.currentTab].group_phone = that.data[key][selectIndex].user_phone;
    that.data.groupInfo[that.data.tab_tip.currentTab].group_sign = that.data.group_sign;
    that.setData({
      groupInfo: that.data.groupInfo
    })
  },
  // 队伍成员
  tipEvt: function (e) {
    that = this;
    var title = e.currentTarget.dataset.title;
    var params = {};
    params.movement_id = that.data.movement_id
    if (title == 'sure') {
      if (that.data.movement_info.group_num == 2) {
        if (that.data.homeList.length > 0 && that.data.awayList.length > 0 && that.data.selectIndex_a != -1 && that.data.selectIndex_b != -1) {
          if (that.data.group_name_a === that.data.group_name_b) {
            toolUtils.showToast('队伍名重复，请重新输入')
            return
          }
          groupArray.push(that.data.groupInfo[0], that.data.groupInfo[1])
          params.group_info = JSON.stringify(groupArray);
          // console.log(params)
          groupArray = []
          httpsUtils.openOrganization(params, function (res) {
            toolUtils.showToast('成功开启约战')
            that.freshData()
            groupArray = []
            that.setData({
              openState: false,
              selectIndex_b: -1,
              selectIndex_a: -1
            })
          }, function (e) {
            toolUtils.showToast(e.data.msg)
            groupArray = []
            that.setData({
              openState: true,
            })
          })
        } else {
          toolUtils.showToast('请指定队伍创建者')
        }
      } else {
        if (that.data.homeList.length > 0 && that.data.selectIndex_a != -1) {
          groupArray.push(that.data.groupInfo[0])
          params.group_info = JSON.stringify(groupArray);
          httpsUtils.openOrganization(params, function (res) {
            toolUtils.showToast('成功开启约战')
            that.freshData()
            groupArray = []
            that.setData({
              openState: false,
              selectIndex_b: -1,
              selectIndex_a: -1
            })
          }, function (e) {
            toolUtils.showToast(e.data.msg)
            groupArray = []
            that.setData({
              openState: true,
            })
          })
        } else {
          toolUtils.showToast('请指定队伍创建者')
        }
      }

    } else {
      that.setData({ //取消
        openState: false
      })
    }
  },
})

// 获取约战详情
function getYdDetail() {
  var params = {};
  params.movement_id = that.data.movement_id;
  httpsUtils.organization(params, function (res) {
    if (res) {
      that.setData(res);
      that.setData({
        isLoading: true
      })
    }
  }, function (e) {
    toolUtils.showToast(e.data.msg)
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement',
    })
  })
}
// 展示队伍成员
function getTeamMber(num) {
  var params = {};
  params.movement_id = that.data.movement_id;
  params.group_sign = num;
  if (num == 1) { //A队
    params.current_page = that.data.current_page1;
    params.page_size = that.data.page_size1
    httpsUtils.organizationTeam(params, function (res) {
      that.setData(res)
      that.setData({
        home_fill: res.is_full
      })
      that.data.total_num1 = res.total_num
      var list = that.data.homeList
      if (that.data.current_page1 == 1) {
        list = []
      }
      list = list.concat(res.list)
      if (list.length == that.data.total_num1) {
        that.setData({
          homeList: list,
          'homeMore': false
        })
      } else {
        that.setData({
          homeList: list,
          'homeMore': true
        })
      }
    }, function (e) {
      if (that.data.current_page1 > 1) {
        --that.data.current_page1
      }
      that.setData({
        'homeMore': false
      })
    })
  } else { //B队
    params.current_page = that.data.current_page2;
    params.page_size = that.data.page_size2
    httpsUtils.organizationTeam(params, function (res) {
      that.setData(res)
      that.setData({
        home_fill: res.is_full
      })
      that.data.total_num2 = res.total_num
      var list = that.data.awayList
      if (that.data.current_page2 == 1) {
        list = []
      }
      list = list.concat(res.list)
      if (list.length == that.data.total_num2) {
        that.setData({
          awayList: list,
          'awayMore': false
        })
      } else {
        that.setData({
          awayList: list,
          'awayMore': true
        })
      }
    }, function (e) {
      if (that.data.current_page2 > 1) {
        --that.data.current_page2
      }
      that.setData({
        'awayMore': false
      })
    })
  }
}