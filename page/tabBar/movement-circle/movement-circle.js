// page/tabBar/movement-circle/movement-circle.js
var toolUtils = require("../../../utils/tool-utils.js")
var httpsUtils = require("../../../utils/https-utils.js")
var that, app = getApp()
var page_size = 10
var windowHeight
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCommentShow: true,
    current_page: 1,
    loadData: {
      isFinish: false,
      isMore: true
    },
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无数据'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    getApp().userInfo(function (userInfo) {
      that.setData({
        mineUserId: userInfo.user_id
      })
    })
    getData('加载中...')
    wx.getSystemInfo({
      success: function(res) {
        windowHeight = res.windowHeight
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
  },
  onCommentBut: function (e) {
    that.setData({
      isCommentShow: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
   * 发布运动圈
   */
  addShuoShuo: function(e) {
    toolUtils.pageTo('/page/pack-index/pages/evaluate/evaluate?type=' + 2, 1)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    that.setData({
      current_page: 1,
    })
    getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let loadData = that.data.loadData;
    if (loadData.isMore) {
      let current_page = that.data.current_page + 1;
      that.setData({
        current_page: current_page
      })
      getData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
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
  // 数据刷新
  refreshData() {
    this.setData({
      current_page: 1,
    })
    getData()
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
   * 评论
   */
  onComment: function(e) {
    var that = this
    var client = e.changedTouches[0]
    var socrollY = client.pageY - windowHeight+5
    if(that.data.feedList.length<3){
      socrollY = socrollY+200
    }
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    console.log(e)
    if (socrollY > 0) {
      wx.pageScrollTo({
        scrollTop: socrollY,
        duration: 150
      })
    }
    setTimeout(function() {
      var params = {
        'branch_id': item.feed_id,
        'branch_type': 2,
        'level': 1
      }
      that.setData({
        isCommentShow: false,
        params:JSON.stringify(params)
      })
    }, 300)
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
  },
  /**
   * 删除动态
   */
  onLongTag: function(e) {
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '是否删除当前动态？',
      success: function(res) {
        if (res.confirm) {
          var params = {
            feed_id: item.feed_id
          }
          httpsUtils.deleteFeed(params, function(res) {
            var fl = that.data.feedList
            fl.splice(index, 1)
            that.setData({
              feedList: fl
            })
            toolUtils.showToast("删除成功")
          }, function(e) {
            toolUtils.showToast(e.data.msg)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
})
// 约动数据获取
function getData(msg) {
  let loadData = that.data.loadData;
  let args = {
    current_page: that.data.current_page,
    page_size
  }
  that.setData({
    refreshing: true
  })
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
      }
      // !!newsData && newsData.map((item, index) => {
      //   if ('create_time' in item) {
      //     item.create_time = item.create_time.substring(0, 10);
      //   }
      //   item.feed_pic = JSON.parse(item.feed_pic)
      // })
      that.setData({
        feedList: myues.concat(newsData),
        loadData: loadData,
        refreshing: false
      })
    } else {
      loadData.isFinish = true;
      loadData.isMore = false;
      that.setData({
        feedList: myues,
        loadData: loadData,
        refreshing: false
      })

    }
    wx.stopPullDownRefresh();
  }, function(e) {
    wx.stopPullDownRefresh();
  },msg)
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