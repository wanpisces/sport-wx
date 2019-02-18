// widget/addNews/addNews.js
var toolUtils = require('../../utils/tool-utils.js')
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e){
      toolUtils.pageTo('/page/pack-index/pages/evaluate/evaluate?type='+2, 1)
    }
  }
})
