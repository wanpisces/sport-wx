Component({
  /**
   * 组件的属性列表
   */
  properties: {
    material_type: {
      type: Number,
      value: 2
    },
    material_url: {
      type: String,
      value: ''
    },
    material_title: {
      type: String,
      value: ''
    },
    material_pic: {
      type: String,
      value: ''
    },
    status: {
      type: Boolean,
      value: false
    },
    videoState:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgState: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击图标，相应其他事件
    tipIconEvt: function () {
      this.triggerEvent('onBut')
    },
    controlVideoEvt: function (e) {
      if (e.detail.fullScreen) {
        this.setData({
          imgState: true
        })
      } else {
        this.setData({
          imgState: false
        })
      }
    }
  }
})