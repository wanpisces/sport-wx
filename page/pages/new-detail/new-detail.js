// page/pack-find/new-detail/new-detail.js
// pages/index/information_details/information_details.js
var toolutils = require('../../../utils/tool-utils.js')
var WxParse = require('../../../libs/wxParse/wxParse.js')
var httpUtils = require('../../../utils/https-utils.js')
var app = getApp()
var that
var mPageSize = 10
var mTotalNum = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadData: {
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    },
    isHome: 0,
    currentPage: 1,
    dataList: [],
    isShowView: false,
    userPhone: '',
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      userPhone: !!app.data.userPhone ? app.data.userPhone : "",
      currentPage: 1,
      newsID: options.news_id
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          scrollHeight: res.windowHeight,
          isLoading: true,
          isShare: options.isShare && options.isShare == 1 && true || false
        })
      }
    })
    getData(options.news_id)
  },
  plZan: function (e) {
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 返回首页
   */
  goHome: function () {
    wx.switchTab({
      url: '/page/tabBar/about-movement/about-movement'
    })
  },
  //点赞
  praise: function (e) {
    putStar()
    that.setData({
      isPraise: 1
    })
  },
  //回到首页
  gohome: toolutils.throttle(function (e) {
    that.setData({
      isHome: 1
    })
    toolutils.pageTo('/page/tabBar/about-movement/about-movement', 3)
  }),

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (that.data.refresh) {
      that.getCommentList()
      that.setData({
        refresh: false
      })
    }

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    if (mTotalNum > mPageSize * that.data.currentPage) {
      that.setData({
        currentPage: ++that.data.currentPage,
        loadData: {
          searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
      that.getCommentList()
    } else {
      that.setData({
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
      })
    }

    // wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
    //   // 使页面滚动到底部
    //   wx.pageScrollTo({
    //     scrollTop: rect.bottom
    //   })
    // }).exec()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: that.data.news_title || '资讯详情',
      path: `/page/pages/new-detail/new-detail?isShare=1&news_id=${that.data.newsID}`,
    }
    var params = {}
    params.branch_type = 6
    params.branch_id = that.data.newsID
    httpUtils.shareBtn(params, function (res) { }, function (e) { })

  },
  //获取评论列表
  getCommentList: function () {
    var params = {}
    params.branch_id = that.data.newsID;
    params.branch_type = 6
    params.current_page = that.data.currentPage
    params.page_size = mPageSize
    httpUtils.getCommentList(params, function (res) {
      mTotalNum = res.total_num
      var list = that.data.dataList
      if (res.current_page == 1) {
        list = []
      }
      list = list.concat(res.list)
      if (list.length == mTotalNum) {
        that.setData({
          dataList: list,
          mTotalNum: mTotalNum,
          loadData: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
          }
        })
      } else {
        that.setData({
          dataList: list,
          mTotalNum: mTotalNum,
          loadData: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
          }
        })
      }
    }, function (e) {
      toolutils.showToast("获取评论列表失败")
      that.setData({
        currentPage: --that.data.currentPage,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
      })
    })
  }
})
//获取资讯详情
function getData(id) {
  var params = {}
  httpUtils.competitionMaterialInfo(id, params, function (res) {
    that.setData({
      news_title: res.material_title,
      visit_num: res.visit_num,
      comment_num: res.comment_num,
      star_num: res.star_num,
      create_time: res.create_time,
      isStar: res.is_star,
      newsID: res.material_id,
      isCollect: res.is_favorites,
      favorites_num: res.favorites_num,
      material_pic: res.material_pic,
      isShowView: true
      // tags: res.tags || []
    })
    WxParse.wxParse('article', 'html', res.material_content, that);
    that.getCommentList()
  }, function (e) {
    toolutils.showToast(e.data.msg)
  })
}

//资讯点赞
function putStar() {
  var params = {}
  params.star_type = 1
  params.branch_type = 6
  params.branch_id = that.data.newsID
  //点下禁用按钮和数量加一
  that.setData({
    staring: true,
    star_num: that.data.isStar == 2 ? ++that.data.star_num : --that.data.star_num,
    isStar: that.data.isStar == 2 ? 1 : 2
  })
  console.log(that.data.isStar)
  httpUtils.putStar(params, function (res) {
    toolutils.showToast(that.data.isStar == 1 ? "点赞成功" : "取消点赞成功")
    that.setData({
      staring: false
    })
  }, function (e) {
    toolutils.showToast(that.data.isStar == 1 ? "点赞失败" : "取消点赞失败")
    that.setData({
      staring: false,
      star_num: that.data.isStar == 1 ? --that.data.star_num : ++that.data.star_num,
      isStar: that.data.isStar == 1 ? 2 : 1
    })
  })
}