// widget/navigationBar/navigationBar.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['navigationBar'],
  properties: {
    statusBarHeight: {
      type: Number,
      value: 20
    },
    imgUrl: {
      type: String,
      value: ''
    },
    isBack: {
      type: Boolean,
      value: true
    },
    titleName: {
      type: String,
      value: '八分钟运动'
    },
    tag: {
      type: Number,
      value: 0
    },
    bgColor: {
      type: String,
      value: '#202020'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateBack: function (e) {
      try {
        var pages = getCurrentPages()
        var localPages = pages[pages.length - 1]; // 当前页
        var prePages = pages[pages.length - 2]; //上一页
        var prPages = pages[pages.length - 3]; //上两页
        console.log('当前页', pages[pages.length - 1])
        console.log('上一页', pages[pages.length - 2])
        if (pages.length == 1) {
          wx.switchTab({
            url: '/page/tabBar/about-movement/about-movement',
          })
        } else if (prePages.route == "page/pages/active/active") {
          wx.switchTab({
            url: '/page/tabBar/about-movement/about-movement',
          })
        } else if (localPages.route == "page/pack-organizer/yd-detail/yd-detail" && prePages.route == "page/pack-organizer/organizer-appointment/organizer-appointment") {
          wx.switchTab({
            url: '/page/tabBar/about-movement/about-movement',
          })
        } else if (localPages.route == "page/pack-find/yue-sport/yue-sport" && prePages.route == "page/pack-find/yue-release/yue-release" && prPages.route == "page/tabBar/about-movement/about-movement") {
          wx.switchTab({
            url: '/page/tabBar/about-movement/about-movement',
          })
        } else if (localPages.route == "page/pack-find/yue-sport/yue-sport" && prePages.route == "page/pack-find/yue-release/yue-release" && prPages.route == "page/pack-index/pages/team-page/team-page") {
          wx.navigateBack({
            delta: 2
          })
        } else if (localPages.route == "page/pack-find/yue-data/yue-data" && prePages.route == "page/pack-find/yue-score/yue-score") {
          wx.navigateBack({
            delta: 2
          })
        } else if (localPages.route == "page/pack-mine/mine-team/mine-team") {
          wx.switchTab({
            url: '/page/tabBar/mine/mine',
          })
        }
        else {
          wx.navigateBack({
            delta: 1,
          })
        }
      } catch (e) {
        console.log(e)
      }

    }
  }
})