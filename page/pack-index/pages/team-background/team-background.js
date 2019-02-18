// page/pack-index/pages/team-background/team-background.js
var toolUtils = require("../../../../utils/tool-utils.js")
var httpsUtils = require("../../../../utils/https-utils.js")
var that
var mGroupId
var mMaterialId
var mPageSize = 10//每页条数
var mTotalNum //总条数
var mCurrentPage = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    ckIndex: -1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    mGroupId = options.id
    mMaterialId = -1
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight,
          windowHeight: res.windowHeight,
          imgSrc: options.avatar || ''
        })
        mCurrentPage = 1
        material()
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
    if (mTotalNum > mPageSize * mCurrentPage) {
      ++mCurrentPage
      that.setData({
        loadData: {
          searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
        }
      })
      feedList()
    } else {
      that.setData({
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true  //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
  },
  /**
   * 手机选择
   */
  uploadImg: function (e) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // that.setData({
        //   group_badge: tempFilePaths[0]
        // })
        toolUtils.pageTo("/page/pack-index/pages/upload/upload?src=" + tempFilePaths[0] + '&id=' + mGroupId)
      }
    })

  },
  /**
   * 选择系统图片
   */
  onBgItem: function (e) {
    var index = e.currentTarget.dataset.index
    var item = e.currentTarget.dataset.item
    if (index == that.data.ckIndex) {
      that.setData({
        ckIndex: -1
      })
      mMaterialId = -1
    } else {
      mMaterialId = item.material_id
      that.setData({
        ckIndex: index
      })
    }
  },
  /**
   * 确认修改
   */
  submit: function (e) {
    groupPic()
  }

})
/**
 * 获取素材
 */
function material() {
  var params = {
    'type': 1,
    'from': 1,
    'current_page': mCurrentPage,
    'page_size': mPageSize
  }
  httpsUtils.material(params, function (res) {
    mTotalNum = res.total_num
    var list = that.data.listData
    if (mCurrentPage == 1) {
      list = []
    }
    list = list.concat(res.list)
    if (list.length == mTotalNum) {
      that.setData({
        listData: list,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: true  //“没有数据”的变量，默认false，隐藏  
        }
      })
    } else {
      that.setData({
        listData: list,
        loadData: {
          searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
          searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
        }
      })
    }
    wx.stopPullDownRefresh()
  }, function (e) {
    if (mCurrentPage > 1) {
      --mCurrentPage
    }
    that.setData({
      loadData: {
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
      }
    })
    wx.stopPullDownRefresh()
  })
}
/**
 * 上传背景图
 */
function groupPic() {
  var params = { 'group_id': mGroupId }
  if (!that.data.imgSrc && mMaterialId == -1) {
    toolUtils.showToast("请选择背景图")
    return
  }
  if (that.data.ckIndex != -1) {
    params.material_id = mMaterialId
  } else {
    params.group_pic = that.data.imgSrc;
    params.current_page = 1;
    params.page_size = 1000;
  }
  httpsUtils.groupPic(params, function (res) {
    var pages = getCurrentPages()
    if (params.group_pic) {
      pages[pages.length - 3].refreshData()
      wx.navigateBack({
        delta: 2
      })
    } else {
      pages[pages.length - 2].refreshData()
      wx.navigateBack({
        delta: 1
      })
    }
    toolUtils.showToast("修改成功")
  }, function (e) {
    toolUtils.showToast(e.data.msg)
  })
}
