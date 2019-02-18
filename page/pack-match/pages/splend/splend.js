var httpsUtils = require('../../../../utils/https-utils.js')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    splendStatus: true,
    competition_id: '', //赛事ID
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无精彩瞬间'
    },
    sportList: {
      current_page: 1,
      page_size: 10,
      total_num: 0,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      },
    },
    sportSplend: [], //精彩瞬间
    splendTip: {}, //弹窗数据
  },


  //更多素材（精彩瞬间）
  more_splend: function (that) {
    that = this;
    var params = {
      type: 2,
      current_page: that.data.sportList.current_page,
      page_size: that.data.sportList.page_size,

    }
    httpsUtils.competitionMaterial(that.data.competition_id, params, function (res) {
      that.data.sportList.current_page = res.current_page;
      that.data.sportList.page_size = res.page_size;
      that.data.sportList.total_num = res.total_num;
      if (res.current_page == 1) {
        that.data.sportSplend = [];
      }
      that.data.sportSplend = that.data.sportSplend.concat(res.list);
      if (that.data.sportSplend.length == res.total_num) {
        that.data.sportList.loadData = {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
        that.setData({
          sportSplend: that.data.sportSplend,
          sportList: that.data.sportList
        })
      } else {
        that.data.sportList.loadData = {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
        that.setData({
          sportSplend: that.data.sportSplend,
          sportList: that.data.sportList
        })
      }
      wx.stopPullDownRefresh()
    }, function (e) {
      if (that.data.sportList.current_page > 1) {
        --that.data.sportList.current_page
      }
      that.data.sportList.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        sportList: that.data.sportList
      })
      wx.stopPullDownRefresh()
    })
  },
  // 获取上一个页面的参数
  splend_init: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    that.data.competition_id = prevPage.options.competition_id;
  },
  //点击精彩瞬间，播放视频或动图
  splendVideoEvt: function (e) {
    var _index = e.currentTarget.dataset.index;
    this.setData({
      splendTip: this.data.sportSplend[_index],
      splendStatus: false,
      videoState: true
    })
  },
  //点击图标，关闭弹窗
  tipIconEvt: function () {
    this.setData({
      splendStatus: true,
      videoState: false
    })
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
          minHeight: res.windowHeight - 132 - res.statusBarHeight,
          date: new Date().toLocaleDateString(),
          competition_id: options.competition_id,
          videoState: false
        })
      }
    })
    that.splend_init();
    that.more_splend(that);
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
    if (this.data.sportList.total_num > this.data.sportList.page_size * this.data.sportList.current_page) {
      ++this.data.sportList.current_page
      this.data.sportList.loadData = {
        searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
      this.setData({
        sportList: this.data.sportList
      })
      this.more_splend(this)
    } else {
      this.data.sportList.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
      }
      this.setData({
        sportList: this.data.sportList
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var competition_id = this.data.competition_id;
    var material_title = this.data.splendTip.material_title
    var material_url = this.data.splendTip.material_url
    var material_type = this.data.splendTip.material_type
    var material_pic = this.data.splendTip.material_pic
    var material_id = this.data.splendTip.material_id
    console.log(this.data.splendTip)
    console.log(material_type)
    if (res.from == 'button') {
      if (material_type == 3) {
        // 转发成功
        var params = {}
        params.branch_type = 6
        params.branch_id = material_id
        httpsUtils.shareBtn(params, function (res) { }, function (e) { })
        return {
          title: material_title,
          imageUrl: material_pic,
          path: '/page/pack-match/pages/sport-share/sport-share?material_id=' + material_id,
        }
      } else {
        // 转发成功
        var params = {}
        params.branch_type = 6
        params.branch_id = material_id
        httpsUtils.shareBtn(params, function (res) { }, function (e) { })
        return {
          title: material_title,
          imageUrl: material_url,
          path: '/page/pack-match/pages/sport-share/sport-share?material_id=' + material_id,
        }
      }
    } else {
      // 转发成功
      var params = {}
      params.branch_type = 5
      params.branch_id = competition_id;
      httpsUtils.shareBtn(params, function (res) { }, function (e) { })
      return {
        title: material_title,
        imageUrl: material_url,
        path: '/page/pack-match/pages/splend/splend?competition_id=' + competition_id
      }
    }
  }
})