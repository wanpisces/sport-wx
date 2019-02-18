// widget/choose-team/choose-team.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData:{
        type:Array,
        value: [
           {
             group_id: '2',
             group_name: '最强队',
             attr_id: 'ss',
           }
         ]
     },
     curLabelIndex: {
       type: Number,
       value: '-1'
     },
     show:{
       type:Boolean,
       value:false,
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
    bindTeam(e){
      let that= this
      let index=e.currentTarget.dataset.index
      this.setData({
        curLabelIndex: index,
        group_id: e.currentTarget.dataset.id
      })
      this.triggerEvent('myevent', { group_id: e.currentTarget.dataset.id }, {})
    },
    // 取消
    bindCancle() {
      this.setData({
        show: false
      })
    },
    // 确定约战
    bindSure(){
      let id = this.data.group_id
      this.triggerEvent('bindsure', { group_id: id}, {})
    }
  }
})
