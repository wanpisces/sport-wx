// widget/marquee-view/marquee-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    marqueeStyle: {
      type: String,
      value: ""
    },
    text: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    text: '这是一条会滚动的文字滚来滚去的文字跑马灯，哈哈哈哈哈哈哈哈',
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval: 35 // 时间间隔
  },
  attached: function () {
    var vm = this;
    var length = vm.data.text.length * vm.data.size;//文字长度
    var systemInfo = wx.getSystemInfoSync()
    var windowWidth = systemInfo.windowWidth - (systemInfo.windowWidth / 750) * 120;// 屏幕宽度
    vm.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
    });
    if (length > windowWidth) {
      vm.run1();// 水平一行字滚动完了再按照原来的方向滚动
      vm.run2();// 第一个字消失后立即从右边出现
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {
    run1: function () {
      var vm = this;
      var interval = setInterval(function () {
        if (-vm.data.marqueeDistance < vm.data.length) {
          vm.setData({
            marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
          });
        } else {
          clearInterval(interval);
          vm.setData({
            marqueeDistance: vm.data.windowWidth
          });
          vm.run1();
        }
      }, vm.data.interval);
    },
    run2: function () {
      var vm = this;
      var interval = setInterval(function () {
        if (-vm.data.marqueeDistance2 < vm.data.length) {
          // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
          vm.setData({
            marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
            marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
          });
        } else {
          if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
            vm.setData({
              marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
            });
            clearInterval(interval);
            vm.run2();
          } else {
            clearInterval(interval);
            vm.setData({
              marqueeDistance2: -vm.data.windowWidth
            });
            vm.run2();
          }
        }
      }, vm.data.interval);
    }
  }

})
