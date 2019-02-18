// widget/navBar/navBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    statusBarHeight: {
      type: Number,
      value: 20
    },
    imgUrl: {
      type: String,
      value: ''
    },
    labelList: {
      type: Array,
      value: ['let']
    },
    curLabelIndex:{
      type: Number,
      value:0
    },
    scrollHeight:{
      type: Number,
      value:0
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
    switchTab(e){
      let that = this
      this.setData({
        curLabelIndex: e.currentTarget.dataset.index
      })
      this.triggerEvent('myevent', {curLabelIndex: e.currentTarget.dataset.index}, {})
    },

  }
})
