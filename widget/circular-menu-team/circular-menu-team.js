// widget/circular-menu/circular-menu.js
var toolUtils = require("../../utils/tool-utils.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPopping: false,//是否已经弹出
    animPlus: {},//旋转动画
    animCollect: {},//item位移,透明度
    animTranspond: {},//item位移,透明度
    animInput: {},//item位移,透明度
  },
  detached: function () {
    this.takeback();
    this.setData({
      isPopping: false
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //点击弹出
    plus: function () {
      if (this.data.isPopping) {
        //缩回动画
        this.takeback();
        this.setData({
          isPopping: false
        })
      } else if (!this.data.isPopping) {
        //弹出动画
        this.popp();
        this.setData({
          isPopping: true
        })
      }
    },
    transpond: function () {
      // toolUtils.pageTo("/page/pack-find/yue-release/yue-release")
      this.takeback();
      this.setData({
        isPopping: false
      })
    },
    /**
     * 找队伍
     */
    findTeam: function () {
      toolUtils.pageTo("/page/pack-find/find-team/find-team")
      this.takeback();
      this.setData({
        isPopping: false
      })
    },
    //弹出动画
    popp: function () {
      //plus顺时针旋转
      var animationPlus = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      var animationcollect = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      var animationcollectImg = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      var animationTranspond = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      var animationTranspondImg = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      // var animationInput = wx.createAnimation({
      //   duration: 500,
      //   timingFunction: 'ease-out'
      // })
      animationPlus.rotateZ(180).step();
      animationcollect.translate(0, -140).opacity(1).step();
      animationcollectImg.rotateZ(360).step();
      animationTranspond.translate(-121, -70).opacity(1).step();
      animationTranspondImg.rotateZ(360).step();
      // animationInput.translate(-100, 100).rotateZ(360).opacity(1).step();
      this.setData({
        animPlus: animationPlus.export(),
        animCollect: animationcollect.export(),
        animCollectImg: animationcollectImg.export(),
        animTranspond: animationTranspond.export(),
        animTranspondImg: animationTranspondImg.export(),
        // animInput: animationInput.export(),
      })
    },
    //收回动画
    takeback: function () {
      //plus逆时针旋转
      var animationPlus = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      var animationcollect = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      var animationcollectImg = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      var animationTranspond = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      var animationTranspondImg = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      // var animationInput = wx.createAnimation({
      //   duration: 500,
      //   timingFunction: 'ease-out'
      // })
      animationPlus.rotateZ(0).step();
      animationcollect.translate(0, 0).opacity(0).step();
      animationcollectImg.rotateZ(0).step();
      animationTranspond.translate(0, 0).opacity(0).step();
      animationTranspondImg.rotateZ(0).step();
      // animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
      this.setData({
        animPlus: animationPlus.export(),
        animCollect: animationcollect.export(),
        animCollectImg: animationcollectImg.export(),
        animTranspond: animationTranspond.export(),
        animTranspondImg: animationTranspondImg.export(),
        // animInput: animationInput.export(),
      })
    },

  }
})

