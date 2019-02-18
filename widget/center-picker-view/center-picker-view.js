// widget/center-picker-view/center-picker-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData: {
      type: Array,
      value: []
    },
    selectId1:{
      type: Number,
      value: 0
    },
    selectId2: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClicks: function (e) {
      var myEventDetail = e.currentTarget
      var myEventOption = {}
      this.triggerEvent('onclick', myEventDetail, myEventOption)
    },
    onItem2:function(e){
      var index2 = e.currentTarget.dataset.index
      this.setData({
        selectId2: index2
      })
    },
    onItem1: function (e) {
      var index1 = e.currentTarget.dataset.index
      this.setData({
        selectId1:index1
      })
    },
    preventD: function (e) {
      //阻止蒙版事件传递
    }
  }
})

