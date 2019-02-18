// page/widget/street/street.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    location: { //位置信息
      type: Object,
      value: {}
    },
    changePosition: { //位置是否变化
      type: Boolean,
      value: false
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
    onClicks: function(e) {
      var myEventDetail = e.currentTarget
      var myEventOption = {}
      this.triggerEvent('onclick', myEventDetail, myEventOption)
    },
    preventD: function(e) {
      //阻止蒙版事件传递
    }
  }
})