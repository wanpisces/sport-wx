// widget/view-picker/view-picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    colors:{
      type:String,
      value:''
    },
    listData: {
      type: Array,
      value: []
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
      myEventDetail.attr_value = this.data.colors
      myEventDetail.attr_id = this.data.attr_id
      var myEventOption = {}
      this.triggerEvent('onclick', myEventDetail, myEventOption)
    },
    preventD: function (e) {
      //阻止蒙版事件传递
    },
    onColor: function (e) {
      var index = e.currentTarget.dataset.index
      this.setData({
        colors: this.data.listData[index].name,
        attr_id: this.data.listData[index].id
      })
    }

  }
})
