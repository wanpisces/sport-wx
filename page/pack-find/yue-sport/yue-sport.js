// page/pack-find/yue-sport/yue-sport.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js");
var that;
var mMemberUserId = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex: -1,
    soccer_movement_id: '',
    bgUrl1: getApp().data.bgUrl1,
    bgUrl2: getApp().data.bgUrl2,
    commissionList: [],
    contract: '',
    dataList: {}
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
          bgh: (res.statusBarHeight + 45) * 750 / res.windowWidth + 380,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          soccer_movement_id: options.soccer_movement_id,
          isShare: options.isShare && true || false,
          isLoading: true
        })
        // 
        getApp().userInfo(function (userInfo) {
          // 数据获取
          getData(options.soccer_movement_id)
          userInfo = userInfo
          that.setData({
            'but_type': 'share',
            'refreshAuthorizeView': 3,
            'isOneself': !mMemberUserId && true || mMemberUserId == userInfo.user_id
          })
        })
        if (options.attr_id) {
          that.data.dataList.attr_id = options.attr_id
          that.setData({
            dataList: that.data.dataList
          })
          that.commission_init()
        }
      }
    })
  },
  refreshData() { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },
  /**
   * 返回首页
   */
  goHome: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },
  // 刷新页面
  freshData() {
    getData(that.data.soccer_movement_id)
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
    getData(that.data.soccer_movement_id)
    wx.stopPullDownRefresh()
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
    var url;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    if (this.data.dataList.attr_id == 2) {
      url = "https://img.sport.darongshutech.com/image_201810251736568193.png"
    } else if (this.data.dataList.attr_id == 3) {
      url = "https://img.sport.darongshutech.com/image_201810251735466355.png"
    } else {
      url = "https://img.sport.darongshutech.com/image_201810251737248924.png"
    }
    return {
      title: '约动战况',
      // imageUrl: url,
      path: '/page/pack-find/yue-sport/yue-sport?isShare=1&soccer_movement_id=' + that.data.soccer_movement_id
    }
  },
  // 查看地图
  openMap: function () {
    var longitude = this.data.dataList.lng;
    var latitude = this.data.dataList.lat
    wx.openLocation({
      address: this.data.dataList.address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      scale: 28
    })
  },
  // 发起人取消约动
  initiatorCancel: function (e) {
    var params = {};
    params.soccer_movement_id = this.data.soccer_movement_id;
    httpsUtils.cancelMovement(params, function (res) {
      toolUtils.showToast('取消约动成功')
      var pages = getCurrentPages();
      pages[pages.length - 2].refreshData();
      wx.navigateBack({
        delta: 1,
      })
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  // 发起人重新编辑
  editYdEvt: function () {
    var attr_id = this.data.dataList.attr_id;
    var soccer_movement_id = this.data.dataList.soccer_movement_id;
    var group_id = this.data.dataList.group_id;
    toolUtils.pageTo("/page/pack-find/yue-release/yue-release?isEdit=true" + '&attr_id=' + attr_id + '&soccer_movement_id=' + soccer_movement_id + '&group_id=' + group_id, 1)
  },
  // 拨打电话
  phoneEvt: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.dataList.other_phone,
      success: function (res) {
        console.log('拨打成功')
      },
      fail: function (err) {
        console.log('拨打失败')
      }
    })
  },
  // 打开留言弹窗
  messageEvt() {
    this.setData({
      messageTip: true
    })
  },
  // 留言信息
  bindmessageinput(e) {
    this.setData({
      message: e.detail.value
    })
  },
  //约动取消原因
  bindcontractinput: function (e) {
    this.setData({
      contract: e.detail.value
    })
  },
  //取消留言信息或提交信息
  submitMessage: function (e) {
    that = this;
    var title = e.currentTarget.dataset.title;
    switch (title) {
      case 'cancel':
        that.setData({
          messageTip: false
        })
        break;
      case 'sure':
        if (!that.data.message) {
          toolUtils.showToast('请输入留言信息')
        } else {
          var params = {};
          params.soccer_movement_id = that.data.dataList.soccer_movement_id;
          params.message = that.data.message;
          httpsUtils.movementMessage(params, function (res) {
            toolUtils.showToast('留言成功');
            getData(that.data.soccer_movement_id);
          }, function (e) { })
          that.setData({
            messageTip: false
          })
        }
    }
  },
  //取消应约或确定应约
  submitCommission: function (e) {
    that = this;
    var title = e.currentTarget.dataset.title;
    switch (title) {
      case 'cancel':
        that.setData({
          commission: false
        })
        break;
      case 'sure':
        if (this.data.selectIndex < 0) {
          toolUtils.showToast('请选择队伍')
          return
        }
        var params = {};
        params.soccer_movement_id = that.data.dataList.soccer_movement_id;
        params.group_id = that.data.commissionList[that.data.selectIndex].group_id;
        params.away_shirt = that.data.dataList.away_shirt;
        params.attr_id = that.data.dataList.attr_id;
        console.log(params)
        httpsUtils.acceptMovement(params, function (res) {
          getData(that.data.soccer_movement_id);
        }, function (e) {
          toolUtils.showToast(e.data.msg)
        })
        that.setData({
          commission: false
        })
    }
  },
  // 我要应约
  commissionedEvt: function () {
    this.commission_init()
    // httpsUtils.myGroup({
    //   attr_id: that.data.dataList.attr_id
    // }, function (res) {
    //   if (res.list.length != 0) {
    //     that.setData({
    //       commission: true,
    //       commissionList: res.list
    //     })
    //   } else {
    //     wx.showModal({
    //       title: '温馨提示',
    //       content: '您暂无自己组建的该类型队伍，快去创建一个吧',
    //       success: function (res) {
    //         if (res.confirm) {
    //           // toolUtils.pageTo('/page/tabBar/index/index', 3)

    //           if (that.data.dataList.attr_id == 2 || that.data.dataList.attr_id == 3) {
    //             toolUtils.pageTo(`/page/pack-index/pages/organize-team/organize-team?attr_id=${that.data.dataList.attr_id}`, 1)
    //           } else {
    //             toolUtils.pageTo(`/page/pack-index/pages/currency-organize-team/organize-team?attr_id=${that.data.dataList.attr_id}`, 1)
    //           }
    //         } else if (res.cancel) {
    //           console.log('用户点击取消')
    //         }
    //       }
    //     })
    //   }
    // }, function (e) { })
  },
  commission_init: function () {
    that = this;
    httpsUtils.myGroup({
      attr_id: that.data.dataList.attr_id
    }, function (res) {
      if (res.list.length != 0) {
        that.setData({
          commission: true,
          commissionList: res.list
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '您暂无自己组建的该类型队伍，快去创建一个吧',
          success: function (res) {
            if (res.confirm) {
              // toolUtils.pageTo('/page/tabBar/index/index', 3)

              if (that.data.dataList.attr_id == 2 || that.data.dataList.attr_id == 3) {
                toolUtils.pageTo(`/page/pack-index/pages/organize-team/organize-team?attr_id=${that.data.dataList.attr_id}`, 1)
              } else {
                toolUtils.pageTo(`/page/pack-index/pages/currency-organize-team/organize-team?attr_id=${that.data.dataList.attr_id}`, 1)
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }, function (e) { })
  },
  // 选择应约队伍
  selectTeamEvt: function (e) {
    this.setData({
      selectIndex: e.currentTarget.dataset.index
    })
  },
  // 发起方违约取消
  contractCancel: function () {
    this.setData({
      contractTip: true
    })
  },
  // 取消约动  违约原因
  submitContract: function (e) {
    that = this;
    var title = e.currentTarget.dataset.title;
    switch (title) {
      case 'cancel':
        that.setData({
          contractTip: false
        })
        break;
      case 'sure':
        var params = {};
        params.movement_cancel = this.data.contract;
        params.soccer_movement_id = this.data.dataList.soccer_movement_id;
        httpsUtils.breakMovement(params, function (res) {
          // let pages = getCurrentPages();
          // pages[pages.length - 2].refreshData();
          // wx.navigateBack({
          //   delta: 1,
          // })
          getData(that.data.soccer_movement_id)
        }, function (e) {
          toolUtils.showToast(e.data.msg)
        })
        that.setData({
          contractTip: false
        })
    }
  },
  // 拒绝约动
  refuseYd: function () {
    var params = {}
    var attr_id = this.data.dataList.attr_id
    var group_id = this.data.dataList.group_id
    params.soccer_movement_id = this.data.dataList.soccer_movement_id;
    httpsUtils.refuseMovement(params, function (res) {
      toolUtils.showToast('拒绝成功');
      getData(that.data.soccer_movement_id);
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  // 查看数据
  lookDataNum: function () {
    toolUtils.pageTo(`/page/pack-find/yue-data/yue-data?soccer_movement_id=${that.data.soccer_movement_id}&group_id=${that.data.dataList.group_id}`, 1)
  },

  //完成约动
  finishYd: function () {
    toolUtils.pageTo(`/page/pack-find/yue-score/yue-score?soccer_movement_id=${that.data.soccer_movement_id}&group_id=${that.data.dataList.group_id}&attr_id=${that.data.dataList.attr_id}`, 1)
  },

  /**
   * 跳转到球队主页
   */
  onTeam: function (e) {
    var group_id = e.currentTarget.dataset.id
    if (group_id) {
      toolUtils.pageTo('/page/pack-index/pages/team-page/team-page?group_id=' + group_id)
    }
  },
})
//  约动 数据详情
function getData(id) {
  httpsUtils.movementDetail(id, {}, function (res) {
    that.setData({
      dataList: res,
      isLoading: true,
    })
  }, function (e) {
    toolUtils.showToast(e.data.msg);
    setTimeout(function () {
      wx.switchTab({
        url: '/page/tabBar/about-movement/about-movement',
      })
    }, 1000)
  })
}