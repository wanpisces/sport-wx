var httpsUtils = require('../../../../utils/https-utils.js')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    empty: {
      icon: '/pic/no-content.png',
      txt: '暂无评论'
    },
    infoDetail_list: {
      isCollect: 1,
      isStar: 1,
      material_id: '',
      current_page: 1,
      total_num: 0,
      page_size: 10,
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
    },
    info_detail: {}, //资讯详情
    comment_list: [] //评论列表
  },
  //资讯详情
  infoDetail_init: function () {
    that = this;
    httpsUtils.competitionMaterialInfo(that.data.infoDetail_list.material_id, {}, function (res) {
      console.log(res)
      that.setData({
        info_detail: res
      })
      console.log(that.data.info_detail)
    }, function (e) { })
  },
  //评论列表
  CommentList_init: function (that) {
    that = this;
    var params = {
      branch_type: 5,
      branch_id: that.data.infoDetail_list.material_id,
      current_page: that.data.infoDetail_list.current_page,
      page_size: that.data.infoDetail_list.page_size
    }
    httpsUtils.getCommentList(params, function (res) {
      that.data.infoDetail_list.page_size = res.page_size;
      that.data.infoDetail_list.current_page = res.current_page;
      that.data.infoDetail_list.total_num = res.total_num;
      if (res.current_page == 1) {
        that.data.comment_list = [];
      }
      that.data.comment_list = that.data.comment_list.concat(res.list);
      if (that.data.comment_list.length == res.total_num) {
        that.data.infoDetail_list.loadData = {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
        }
        that.setData({
          comment_list: that.data.comment_list,
          infoDetail_list: that.data.infoDetail_list
        })
      } else {
        that.data.infoDetail_list.loadData = {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        }
        that.setData({
          comment_list: that.data.comment_list,
          infoDetail_list: that.data.infoDetail_list
        })
      }
      wx.stopPullDownRefresh()
    }, function (e) {
      if (that.data.infoDetail_list.current_page > 1) {
        --that.data.infoDetail_list.current_page
      }
      that.data.infoDetail_list.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
      that.setData({
        infoDetail_list: that.data.infoDetail_list
      })
      wx.stopPullDownRefresh()
    }, true)
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
          date: new Date().toLocaleDateString()
        })
      }
    })
    that.data.infoDetail_list.material_id = options.material_id
    that.setData({
      infoDetail_list: that.data.infoDetail_list
    })
    that.infoDetail_init();
    that.CommentList_init(that);
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
    if (this.data.infoDetail_list.total_num > this.data.infoDetail_list.page_size * this.data.infoDetail_list.current_page) {
      ++this.data.infoDetail_list.current_page
      this.data.infoDetail_list.loadData = {
        searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
      }
      this.setData({
        infoDetail_list: this.data.infoDetail_list
      })
      this.CommentList_init(this)
    } else {
      this.data.infoDetail_list.loadData = {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
      }
      this.setData({
        infoDetail_list: this.data.infoDetail_list
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
    return {
      title: this.data.info_detail.material_title,
      imageUrl: this.data.info_detail.material_pic,
      path: '/page/pack-match/pages/info-detail/info-detail'
    }
  }
})