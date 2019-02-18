// page/pack-index/pages/member-manage/member-manage.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js")
var that
let pageSize = 15;
let currentPage1 = 1,
  totalNum1 = 0 // 参与中 当前页、总条数
let currentPage2 = 1,
  totalNum2 = 0 // 待审核 当前页、总条数
let currentPage3 = 1,
  totalNum3 = 0 // 已拒绝 当前页、总条数
// 数据接口
// 参与中(已通过) 获取数据
function getData1() {
  let args = {
    audit_status: 2,
    current_page: currentPage1,
    page_size: pageSize,
    group_id: that.data.group_id
  }
  httpsUtils.groupMemberAudit(args, function (res) {
    that.setData(res)
    totalNum1 = res.total_num.audit_status2
    var list = that.data.dataList1
    if (res.member.is_admin == 1) { //创建者
      that.setData({
        identity: true
      })
    } else if (res.member.is_admin == 2 && res.member.is_leader == 1) { //队长
      that.setData({
        identity: false
      })
    }
    if (currentPage1 == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length == totalNum1) {
      that.setData({
        dataList1: list,
        loadData1: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        },
        totalNum1: res.total_num.audit_status2,
        totalNum2: res.total_num.audit_status1,
        totalNum3: res.total_num.audit_status3,
      })
    } else {
      that.setData({
        dataList1: list,
        loadData1: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        },
        totalNum1: res.total_num.audit_status2,
        totalNum2: res.total_num.audit_status1,
        totalNum3: res.total_num.audit_status3,
      })
    }
    wx.stopPullDownRefresh()
    setTimeout(function () {
      that.setData({
        isLoading1: false
      })
    }, 50)
  }, function (e) {
    if (currentPage1 > 1) {
      --currentPage1
    }
    that.setData({
      loadData1: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.stopPullDownRefresh()
    setTimeout(function () {
      that.setData({
        isLoading1: false
      })
    }, 50)
  })
}

// 待审核 获取数据
function getData2() {
  let args = {
    audit_status: 1,
    current_page: currentPage2,
    page_size: pageSize,
    group_id: that.data.group_id
  }
  httpsUtils.groupMemberAudit(args, function (res) {
    console.log(res)
    totalNum2 = res.total_num.audit_status1
    var list = that.data.dataList2
    if (res.member.is_admin == 1) { //创建者
      that.setData({
        identity: true
      })
    } else if (res.member.is_admin == 2 && res.member.is_leader == 1) { //队长
      that.setData({
        identity: false
      })
    }
    if (currentPage2 == 1) {
      list = []
      if (res.list.length == 0) {
        that.setData({
          has_message: 0
        })
        try {
          var ps = getCurrentPages()
          ps[ps.length - 2].setData({
            has_message: 0
          })
          ps[ps.length - 3].setData({
            has_message: 0
          })

        } catch (e) {

        }
      }
    }
    list = list.concat(res.list)
    if (list.length == totalNum2) {
      that.setData({
        dataList2: list,
        loadData2: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        },
        totalNum1: res.total_num.audit_status2,
        totalNum2: res.total_num.audit_status1,
        totalNum3: res.total_num.audit_status3,
      })
    } else {
      that.setData({
        dataList2: list,
        loadData2: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        },
        totalNum1: res.total_num.audit_status2,
        totalNum2: res.total_num.audit_status1,
        totalNum3: res.total_num.audit_status3,
      })
    }
    wx.stopPullDownRefresh()
    setTimeout(function () {
      that.setData({
        isLoading2: false
      })
    }, 50)
  }, function (e) {
    if (currentPage2 > 1) {
      --currentPage2
    }
    that.setData({
      loadData2: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
      totalNum1: res.total_num.audit_status2,
      totalNum2: res.total_num.audit_status1,
      totalNum3: res.total_num.audit_status3,
    })
    wx.stopPullDownRefresh()
    setTimeout(function () {
      that.setData({
        isLoading2: false
      })
    }, 50)
  })
}
// 已拒绝 获取数据
function getData3() {
  let args = {
    audit_status: 3,
    current_page: currentPage3,
    page_size: pageSize,
    group_id: that.data.group_id
  }
  httpsUtils.groupMemberAudit(args, function (res) {
    totalNum3 = res.total_num.audit_status3
    var list = that.data.dataList3
    if (res.member.is_admin == 1) { //创建者
      that.setData({
        identity: true
      })
    } else if (res.member.is_admin == 2 && res.member.is_leader == 1) { //队长
      that.setData({
        identity: false
      })
    }
    if (currentPage3 == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length == totalNum3) {
      that.setData({
        dataList3: list,
        loadData3: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        },
        totalNum1: res.total_num.audit_status2,
        totalNum2: res.total_num.audit_status1,
        totalNum3: res.total_num.audit_status3,
      })
    } else {
      that.setData({
        dataList3: list,
        loadData3: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        },
        totalNum1: res.total_num.audit_status2,
        totalNum2: res.total_num.audit_status1,
        totalNum3: res.total_num.audit_status3,
      })
    }
    wx.stopPullDownRefresh()
    setTimeout(function () {
      that.setData({
        isLoading3: false
      })
    }, 50)
  }, function (e) {
    if (currentPage3 > 1) {
      --currentPage3
    }
    that.setData({
      loadData3: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.stopPullDownRefresh()
    setTimeout(function () {
      that.setData({
        isLoading3: false
      })
    }, 50)
  })
}
// 成员审核 （拒绝、通过）
function examineAduilt(params) {
  let args = params
  httpsUtils.examine(args, res => {
    getData2()
    if (params.audit_status == 3) {
      toolUtils.showToast("已拒绝")
    } else {
      toolUtils.showToast("已通过")
    }
  }, function (res) {
    if (params.audit_status == 3) {
      toolUtils.showToast("拒绝失败")
    } else {
      toolUtils.showToast("通过失败")
    }
  })
}

/**
 * 获取球队中的角色（篮球）
 */
function getBaskList() {
  httpsUtils.attr(10, function (res) {
    try {
      that.setData({
        BaskList: res[0]
      })
    } catch (e) {
      that.setData({
        roleList: []
      })
    }
  }, function (e) {

  })
}
/**
 * 获取球队中的角色（足球）
 */
function getRoleList() {
  httpsUtils.attr(3, function (res) {
    try {
      that.setData({
        roleList: res[0]
      })
    } catch (e) {
      that.setData({
        roleList: []
      })
    }
  }, function (e) {

  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ckTabBarId: 'tab1',
    tabIndex: 0,
    group_id: '',
    // 参与中（已通过）
    // dataList1: [],
    loadData1: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
    // 待审核
    // dataList2: [],
    loadData2: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
    // 已拒绝
    // dataList3: [],
    loadData3: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
    totalNum1: '',
    totalNum2: '',
    totalNum3: '',
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无数据'
    },
    BaskList: [],
    roleList: [],
    index: 0,
    attr_id: '',
    isEdit: false,
    editIndex: 0,
    editForm: {
      no: 0,
      role: ''
    },
    seat: '',
    is_admin: '' //是否为创建者，1为创建者
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      attr_id: options.attr_id,
      is_admin: options.is_admin
    })
    if (options.is_admin == 1) {
      if (options.attr_id == 2) {
        getRoleList();
      } else {
        getBaskList();
      }
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          group_id: options.group_id,
          has_message: options.has_message || 0,
          attr_id: options.attr_id,
        })
      }
    })
    if (options.ckTabBarId == 'tab2') {
      that.setData({
        ckTabBarId: 'tab2',
        isLoading2: true,
        tabIndex: 1
      })
      getData2()
    } else {
      that.setData({
        ckTabBarId: 'tab1',
        isLoading1: true,
      })
      getData1()
    }
  },
  //选择队内位置
  bindPickerSeat: function (e) {
    if (this.data.attr_id == 2) {
      var role = this.data.roleList[e.detail.value]
    } else {
      var role = this.data.BaskList[e.detail.value]
    }
    var editForm = that.data.editForm;
    editForm.role = role.id;
    this.setData({
      seat: role.name,
      editForm: editForm
    })
  },
  //显示编辑框
  editMember(e) {
    var item = this.data.dataList1[e.currentTarget.dataset.index];
    that.setData({
      seat: item.role_vale,
      editForm: {
        no: item.no,
        role: item.role,
        group_member_id: item.group_member_id,
        group_id: that.data.group_id
      },
      isEdit: true
    })
  },
  closeEdit() {
    that.setData({
      isEdit: false
    })
  },
  //修改号码
  getInputNo: function (e) {
    if (parseInt(e.detail.value) > 127) {
      this.data.editForm.no = 127
    } else if (isNaN(e.detail.value) || parseInt(e.detail.value) < 1 || e.detail.value == "") {
      that.data.editForm.no = 1;
    } else {
      this.data.editForm.no = e.detail.value
    }
    that.setData({
      editForm: this.data.editForm
    })
  },
  // 确定修改球员信息
  submitEdit() {
    var args = that.data.editForm;
    httpsUtils.getGroupPlayerPosition(args, function (res) {
      that.setData({
        isEdit: false
      })
      getData1()
    }, function (err) {
      toolUtils.showToast(e.data.msg)
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
    if (that.data.tabIndex == 0) {
      if (totalNum1 > pageSize * currentPage1) {
        ++currentPage1
        that.setData({
          loadData1: {
            searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
          }
        })
        getData()
      } else {
        that.setData({
          loadData1: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
          }
        })
      }

    } else if (that.data.tabIndex == 1) {
      if (totalNum2 > pageSize * currentPage2) {
        ++currentPage2
        that.setData({
          loadData2: {
            searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
          }
        })
        getData()
      } else {
        that.setData({
          loadData2: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
          }
        })
      }
    } else if (that.data.tabIndex == 2) {
      if (totalNum3 > pageSize * currentPage3) {
        ++currentPage3
        that.setData({
          loadData3: {
            searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
          }
        })
        getData()
      } else {
        that.setData({
          loadData3: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
          }
        })
      }
    }

  },
  // 淘汰成员
  handleOutTeamer(e) {
    wx.showModal({
      title: '温馨提示',
      content: '确定要淘汰该成员？',
      success: function (res) {
        if (res.confirm) {
          let args = {
            group_id: that.data.group_id,
            group_member_id: e.currentTarget.dataset.id
          }
          httpsUtils.eliminateMember(args, function (res) {

            getData1();
          }, function (e) {

            toolUtils.showToast(e.data.msg)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 设置为管理员
  handleManager(e) {
    wx.showModal({
      title: '温馨提示',
      content: '确定要设置为队长？',
      success: function (res) {
        if (res.confirm) {
          let args = {
            group_id: that.data.group_id,
            group_member_id: e.currentTarget.dataset.id
          }
          httpsUtils.setManager(args, function (res) {
            getData1();
          }, function (re) { })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 撤销管理员
  handleCancle(e) {
    wx.showModal({
      title: '温馨提示',
      content: '确定要撤销队长？',
      success: function (res) {
        if (res.confirm) {
          let args = {
            group_id: that.data.group_id,
            group_member_id: e.currentTarget.dataset.id
          }
          httpsUtils.cancelManager(args, function (res) {
            getData1();
          }, function (e) { })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 拒绝
  handleRefuse(e) {
    wx.showModal({
      title: '温馨提示',
      content: '确定要拒绝该成员？',
      success: function (res) {
        if (res.confirm) {
          let args = {
            audit_status: 3,
            group_id: that.data.group_id,
            group_member_id: e.currentTarget.dataset.id
          }
          examineAduilt(args)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 同意
  handleSuccese(e) {
    wx.showModal({
      title: '温馨提示',
      content: '确定要通过该成员？',
      success: function (res) {
        if (res.confirm) {
          let args = {
            audit_status: 2,
            group_id: that.data.group_id,
            group_member_id: e.currentTarget.dataset.id
          }
          examineAduilt(args)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 允许参与
  handlePass(e) {
    wx.showModal({
      title: '温馨提示',
      content: '确定要允许参与？',
      success: function (res) {
        if (res.confirm) {
          let args = {
            group_id: that.data.group_id,
            group_member_id: e.currentTarget.dataset.id
          }
          httpsUtils.allowMember(args, res => {
            getData3();
          }, e => {

          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },

  /**
   * tabbar切换事件
   */
  onTabBar: function (e) {
    this.setData({
      ckTabBarId: e.currentTarget.id
    })
    switch (e.currentTarget.id) {
      case 'tab1':
        this.setData({
          tabIndex: '0',
          isLoading1: !that.data.dataList1 && true || false
        })
        break
      case 'tab2':
        this.setData({
          tabIndex: '1',
          isLoading2: !that.data.dataList2 && true || false
        })
        break
      case 'tab3':
        this.setData({
          tabIndex: '2',
          isLoading3: !that.data.dataList3 && true || false
        })
        break
    }
  },
  swiperChange: function (e) {
    switch (e.detail.current) {
      case 0:
        this.setData({
          ckTabBarId: 'tab1',
          isLoading1: !that.data.dataList1 && true || false
        })
        getData1()
        break
      case 1:
        this.setData({
          ckTabBarId: 'tab2',
          isLoading2: !that.data.dataList2 && true || false
        })
        getData2()
        break
      case 2:
        this.setData({
          ckTabBarId: 'tab3',
          isLoading3: !that.data.dataList3 && true || false
        })
        getData3()
        break
    }
  }
})