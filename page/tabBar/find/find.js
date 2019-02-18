// page/tabBar/find/find.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js")
const my_configure = require('../../../utils/my-configure.js');
var that, app = getApp()
var page_size = 10
// 找 数据获取
function getTabData() {
  that.setData({
    refreshing: true
  })
  updateRefreshIcon.call(that)
  httpsUtils.discover({
    current_page: 1,
    page_size
  }, function(res) {
    let newsData = res.news;
    !!newsData.list && newsData.list.map((item, index) => {
      if ('create_time' in item) {
        item.create_time = item.create_time.substring(0, 10);
      }
    })
    that.setData({
      list: res,
      newsData: newsData,
      refreshing: false
    })

  
  }, function(e) {

  })
}
// 约动数据获取
function getTab1Data() {

  let loadData = that.data.loadData1;
  let args = {
    current_page: that.data.current_page1,
    page_size
  }
  that.setData({
    refreshing: true
  })
  updateRefreshIcon.call(that)
  httpsUtils.movement(args, function(res) {
    let newsData = res.list;
    var myues = that.data.feedList || []
    if (args.current_page == 1) {
      myues = []
    }
    if (newsData.length > 0) {
      if (Math.ceil(res.total_num / res.page_size) == 1) {
        loadData = {
          isFinish: true,
          isMore: false,
        }
      } else {
        loadData = {
          isFinish: false,
          isMore: true
        }
      }!!newsData && newsData.map((item, index) => {
        if ('create_time' in item) {
          item.create_time = item.create_time.substring(0, 10);
        }
        item.feed_pic = JSON.parse(item.feed_pic)
      })
      that.setData({
        feedList: myues.concat(newsData),
        loadData1: loadData,
        refreshing: false
      })
    } else {
      loadData.isFinish = true;
      loadData.isMore = false;
      that.setData({
        feedList: myues,
        loadData1: loadData,
        refreshing: false
      })

    }
  
  }, function(e) {
  
  })
}
// 资讯数据获取
function getTab2Data() {
  let loadData = that.data.loadData2;
  let args = {
    current_page: that.data.current_page2,
    page_size
  }
  that.setData({
    refreshing: true
  })
  httpsUtils.newsList(args, function(res) {
    let newsData = res.list;
    var newsTabs = that.data.newsDataTab || []
    if (args.current_page == 1) {
      newsTabs = []
    }
    if (newsData.length > 0) {
      if (Math.ceil(res.total_num / res.page_size) == 1) {
        loadData = {
          isFinish: true,
          isMore: false
        }
      } else {
        loadData = {
          isFinish: false,
          isMore: true
        }
      }!!newsData && newsData.map((item, index) => {
        if ('create_time' in item) {
          item.create_time = item.create_time.substring(0, 10);
        }
      })
      that.setData({
        newsDataTab: newsTabs.concat(newsData),
        loadData2: loadData,
        refreshing: false
      })
    } else {
      loadData.isFinish = true;
      loadData.isMore = false;
      that.setData({
        newsDataTab: newsTabs,
        loadData2: loadData,
        refreshing: false
      })
    }
  
  }, function(e) {
 
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    currentIndex:1,
    labelList: ['找', '运动圈', '资讯'],
    curLabelIndex: 0,
    scrollHeight: 0,
    newsData: [], //找 资讯数据
    current_page1: 1,
    loadData1: {
      isFinish: false,
      isMore: true
    },
    current_page2: 1,
    loadData2: {
      isFinish: false,
      isMore: true
    },
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无数据'
    },
    refreshing: true,
    autoplay: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */


  // 切换
  swiperChange(e) {
    let that = this;
    let current = e.detail.current
    this.setData({
      isLoading: current == 0 && !that.data.list && true || current == 1 && !that.data.feedList && true || current == 2 && !that.data.newsDataTab && true || false,
      curLabelIndex: current
    })
    if (current == 1 || current == 2) {
      that.setData({
        autoplay: false
      })
    } else if (current == 0) {
      that.setData({
        autoplay: true
      })
    }
    if (that.data.curLabelIndex == 2 && (!that.data.newsDataTab || that.data.newsDataTab.length == 0)) {
      getTab2Data(that)
    } else if (that.data.curLabelIndex == 1 && (!that.data.feedList || that.data.feedList.length == 0)) {
      getTab1Data(that)
    }
  },
  switchTabPerson(e) {
    let that = this;
    var current = e.detail.curLabelIndex
    this.setData({
      isLoading: current == 0 && !that.data.list && true || current == 1 && !that.data.feedList && true || current == 2 && !that.data.newsDataTab && true || false,
      curLabelIndex: current
    })
  },
  // 数据刷新
  refreshData() {
    this.setData({
      current_page1: 1,
    })
    getTab1Data()
  },
  // 轮播
  swiperChangeImg(e) {
    let that = this
    this.setData({
      currentIndex: e.detail.current+1,
    })
  },
  // 轮播（banner跳转）
  linkBanner(e) {
    let item = e.currentTarget.dataset.item
    getApp().getToken(function(token) {
      // bannerAndNav(item.banner_mini_run, item.banner_mini_url)
      if (item.banner_mini_run == 2) {
        bannerAndNav(2, item.banner_mini_url, token)
      } else if (item.banner_mini_run == 1) {
        bannerAndNav(1, item.banner_mini_url, token)
      } else if (item.banner_mini_run == 3){
        toolUtils.pageTo("/"+item.banner_mini_url)
      }

    })
  },
  onLoad: function(options) {
    that = this
    getApp().userInfo(function (userInfo) {
      that.setData({
        mineUserId: userInfo.user_id
      })
    })
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          curLabelIndex: options.current||0,
          statusBarHeight: res.statusBarHeight,
          currentIndex: 1,
          scrollHeight: res.windowHeight
        })
      }
    })
    getTabData(that)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    that = this
    wx.getSystemInfo({
      success: function(res) {
        var h 
        if(res.platform == 'android'){
          h = res.windowHeight - 45
        }else{
          h = res.windowHeight - 45 - res.statusBarHeight
        }
        that.setData({
          statusBarHeight: res.statusBarHeight,
          scrollHeight: h
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var item = res.target.dataset.item
      var contents = toolUtils.canvasTxtHandle(item.feed_content, 50, 1)
      var img
      if (item.feed_pic && item.feed_pic.length > 0) {
        img = item.feed_pic[0]
      }
      return {
        title: contents[0],
        imageUrl: img || '/pic/comment-share-img.jpg',
        path: '/page/pack-index/pages/personal-dynamics/personal-dynamics?isShare=1&feed_id=' + item.feed_id + '&type=2'
      }
    }
  },
  //点击动态
  onItemSS: function(e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    toolUtils.pageTo(`/page/pack-index/pages/personal-dynamics/personal-dynamics?index=${index}&type=2&feed_id=${item.feed_id}`)
  },
  // 下拉刷新
  freshLoad() {
    let that = this
    if (that.data.curLabelIndex == 0) {
      getTabData(that)
    } else if (that.data.curLabelIndex == 1) {
      that.setData({
        current_page1: 1,
      })
      getTab1Data(that)
    } else if (that.data.curLabelIndex == 2) {
      that.setData({
        current_page2: 1
      })
      getTab2Data(that)
    }
  },
  onLongTag: function (e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '是否删除当前动态？',
      success: function (res) {
        if (res.confirm) {
          var params = {
            feed_id: item.feed_id
          }
          httpsUtils.deleteFeed(params, function (res) {
            var fl = that.data.feedList
            fl.splice(index, 1)
            that.setData({
              feedList: fl
            })
            toolUtils.showToast("删除成功")
          }, function (e) {
            toolUtils.showToast(e.data.msg)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 上拉刷新
  pullLower() {
    let that = this;
    if (that.data.curLabelIndex == 2) {
      let loadData = that.data.loadData2;
      if (loadData.isMore) {
        let current_page2 = that.data.current_page2 + 1;
        that.setData({
          current_page2: current_page2
        })
        getTab2Data(that);
      }
    } else if (that.data.curLabelIndex == 1) {
      let loadData = that.data.loadData1;
      if (loadData.isMore) {
        let current_page1 = that.data.current_page1 + 1;
        that.setData({
          current_page1: current_page1
        })
        getTab1Data(that);
      }
    }

  },

  onBut: function(e) {
    let item = e.currentTarget.dataset.id
    if (item.nav_mini_state == 1) {
      getApp().getToken(function(token) {
        bannerAndNav(item.nav_mini_run , item.nav_mini_url, token)
      })
    } else {
      toolUtils.showToast("暂未开通")
    }

    // if (e.currentTarget.dataset.id == 0) {

    // } else if (e.currentTarget.dataset.id == 1) {
    //   wx.navigateTo({
    //     url: '/page/pack-find/yue-move/yue-move',
    //   })
    // } else {
    //   wx.showToast({
    //     title: '暂未开通',
    //     icon: 'loading',
    //     duration: 10000
    //   })

    //   setTimeout(function () {
    //     wx.hideToast()
    //   }, 1000)
    // }

  },
  bindscrollo(e) {

  },
  toUpperLoadNews(e) {

  },
  //预览图片
  lookImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.i // 需要预览的图片http链接列表
    })
  },
  /**
   * 动态列表点赞
   */
  onStar: function(e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    putStar(item, index)
  },
  /**
   * 刷新动态
   */
  refreshStar: function(index) {
    var item = that.data.feedList[index]
    if (item.is_star == 1) {
      item.is_star = 2
    } else {
      item.is_star = 1
    }
    var star_num = item.star_num
    if (item.is_star == 1) {
      item.star_num = ++star_num
    } else {
      item.star_num = --star_num
    }
    that.setData({
      [`feedList[${index}]`]: item
    })
  }

})
//下拉刷新图标旋转动画
function updateRefreshIcon() {
  var deg = 0;
  //创建动画
  var animation = wx.createAnimation({
    duration: 1500
  })
  var timer = setInterval(function() {
    if (!that.data.refreshing)
      clearInterval(timer)
    animation.rotateZ(deg).step(); //在Z轴旋转一个deg角度
    deg += 360
    that.setData({
      refreshAnimation: animation.export()
    })
  }, 400);
}
//动态点赞
function putStar(item, index) {
  var params = {}
  params.branch_type = 2
  params.branch_id = item.feed_id
  httpsUtils.putStar(params, function(res) {
    var is_star = item.is_star
    item.is_star = is_star == 1 ? 2 : 1
    var star_num = item.star_num
    if (item.is_star == 1) {
      item.star_num = ++star_num
    } else {
      item.star_num = --star_num
    }
    that.setData({
      [`feedList[${index}]`]: item
    })
  })
}

//banner和nav的跳转
//falg 跳转方式 1=原生  2=h5,
//url 地址
function bannerAndNav(falg, url, token) {
  try {
    if (!url) {
      toolutils.showToast("路径错误")
      return
    }
    if (falg == 1) {
      wx.navigateTo({
        url: "/" + url,
      })
    } else if (falg == 2) {
      if (url.indexOf('https') == 0) {
        if (url.indexOf("#") > 0) {
          url = url
        } else {
          url.indexOf("?", 0) > 0 ? url = url + "&token=" + token + "&version=" + my_configure.VERSION + '#wechat_redirect' : url = url + "?token=" + token + "&version=" + my_configure.VERSION + '#wechat_redirect'
        }
        app.data.url = url
        wx.navigateTo({
          url: '/page/tabBar/my-webview/my-webview',
        })
      } else {
        toolutils.showToast("未开通")
      }
    }
  } catch (e) {

  }

}