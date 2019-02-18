// widget/teamModule/teamModule.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataItem:{
      type:Object,
      default:{}
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
    followTeam(e){
      console.log(e)
    }
  }
})
