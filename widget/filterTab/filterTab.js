// widget/filterTab/filterTab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    typeArray:{
      type: Array,
      default:[{
        id:1,
        name:'筛选'
      }]
    },
    filterArray:{
      type: Array,
      default: [{
        id: 1,
        name: '筛选'
      }]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    reginText:'区域',
    region: ['广东省', '广州市', '海珠区'],
    typesOf: '类型',
    typeIndex:'0',
    typeArray: ['足球','其他'],
    filterIndex:0,
    filterText:'筛选',
    filterArray: ['活跃度最高', '队员数最多']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //区域
    bindRegionChange: function (e) {
      this.setData({
        reginText: e.detail.value[2]
      })
    },
    //类型
    bindTypeChange: function (e) {
      var that = this;
      that.setData({
        typesOf: that.data.typeArray[e.detail.value].name
      })
    },
    //筛选
    bindFilterChange: function (e) {
      var that = this;
      that.setData({
        filterText: that.data.filterArray[e.detail.value].name
      })
    }
  }
})
