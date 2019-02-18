// var httpUtils = require("../../../utils/httpUtils.js")
var toolUtils = require("../../utils/tool-utils.js")
var that
var app = getApp()
var url
Component({
  properties: {
    commmentData: {
      type: Array,
      value: []
    },
    commentNum: {
      type: Number,
      value: 0
    },
    starNum: {
      type: Number,
      value: 0
    },
    favoriteNum: {
      type: Number,
      value: 0
    },
    isFavorite: {
      type: Number,
      value: 0
    },
    isStar: {
      type: Number,
      value: 0
    },
    types: {
      type: Number,
      value: 0
    },
    pid: {
      type: String,
      value: ''
    }
  },
  data: {
    // 这里是一些组件内部数据

  },
  ready: function () {
    that = this
  
    switch (that.data.types) {
      case 1://资讯
        url = '/pages/index/news_details?newsId='
        break
      case 2://活动
        url = '/pages/party/active/active?id='
        break
      case 3://学习
        url = '/pages/party/learn/learn?id='
        break
    }
  },
  methods: {
    //点赞
    bindFavorite: function (e) {
      app.getUserInfo(function () {
        var dataset = e.target.dataset;
        var num = parseInt(dataset.num);       // 点赞次数
        var status = parseInt(dataset.status); // 点赞状态 
        // httpUtils.putStar({
        //   branchID: that.data.pid,
        //   starType: that.data.types,
        // }, function (data) {
        //   that.setData({
        //     isStar: status == 1 ? 2 : 1,
        //     starNum: status == 1 ? num - 1 : num + 1
        //   });
        // });
      }, { url: url+ that.data.pid, type: 1 });
    },
    bindCommentFavorite: function (e) {
      // 评论点赞
      app.getUserInfo(function () {
        var dataset = e.target.dataset;
        var num = parseInt(dataset.num);       // 点赞次数
        var status = parseInt(dataset.status); // 点赞状态
        var commentId = parseInt(dataset.commentid); // 点赞状态
        var idx = parseInt(dataset.idx);
        console.log(dataset);
        // httpUtils.putStar({
        //   branchID: commentId,
        //   starType: 5
        // }, function (e) {
        //   var _comment = that.data.commmentData;
        //   console.log(_comment)
        //   _comment[idx]['isStar'] = status == 1 ? 2 : 1;
        //   _comment[idx]['starNum'] = status == 1 ? num - 1 : num + 1;
        //   that.setData({ commmentData: _comment });
        // });
      }, { url: url + that.data.pid, type: 1 });
    }

    // 收藏事件
    , bindCollect: function (e) {
      console.log(e)
      app.getUserInfo(function () {
        var dataset = e.target.dataset;
        var num = parseInt(dataset.num);       // 收藏次数
        var status = parseInt(dataset.status); // 收藏状态 
        // httpUtils.putCollect({
        //   branchID: that.data.pid,
        //   favoritesType: that.data.types,
        //   favoritesModel: 1,
        // }, function (data) {
        //   that.setData({
        //     isFavorite: status == 1 ? 2 : 1,
        //     favoriteNum: status == 1 ? num - 1 : num + 1
        //   });
        // });
      }, { url: url + that.data.pid, type: 1 });
    }
    // 留言输入事件
    , bindInputMessage: function (e) {
      that.setData({
        content: e.detail.value
      });
    }
    // 点击评论
    , bindComment: function (e) {
      app.getUserInfo(function (user) {
        that.setData({
          focus: true,
          showCommentBox: true
        });
      }, { url: url + that.data.pid, type: 1 });
    }
    // 留言提交事件
    , bindSendMessage: function (e) {
      app.getUserInfo(function (user) {
        // 留言逻辑 
        var dataset = e.target.dataset;
        if (!dataset.content) {
          toolUtils.showFailToast("请输入评论内容")
          that.setData({
            focus: true
          });
          return
        }
        var content = dataset.content;
        // httpUtils.postComment({
        //   commentType: that.data.types,
        //   commentContent: content,
        //   branchID: that.data.pid
        // }, function (e) {
        //   toolUtils.showSuccessToast("评论成功")
        //   that.setData({
        //     focus: false,
        //     showCommentBox: false
        //   });
        //   switch (that.data.types) {
        //     case 1://资讯
        //       httpUtils.getNewsDetails(that.data.pid, { no_content_filter: 1 }, function (reData){
        //         that.setData({
        //           commmentData: reData.comment,
        //           commentNum: reData.commentNum,
        //           starNum: reData.starNum,
        //           favoriteNum: reData.isFavorite
        //         })
        //       })
        //       break
        //     case 2://活动
        //       httpUtils.getActiveInfo(that.data.pid, function (reData) {
        //         that.setData({
        //           commmentData: reData.comment,
        //           commentNum: reData.commentNum,
        //           starNum: reData.starNum,
        //           favoriteNum: reData.isFavorite
        //         })
        //       })
        //       break
        //     case 3://学习
        //       httpUtils.getLearnInfo(that.data.pid, function (reData) {
        //         that.setData({
        //           commmentData: reData.comment,
        //           commentNum: reData.commentNum,
        //           starNum: reData.starNum,
        //           favoriteNum: reData.isFavorite
        //         })
        //       })
        //       break
        //   }
        // });
      }, { url: url + that.data.pid, type: 1 });
    }
    , bindBack: function (e) {
      // 返回
      that.setData({
        focus: false,
        showCommentBox: false
      });
    }
  }
})
