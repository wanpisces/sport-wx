const QQMapWX = require('../libs/qqmap-wx-jssdk.js');
const my_configure = require('../utils/my-configure.js');
const toolUtils = require('../utils/tool-utils.js')
module.exports = {
  nearby_search: nearby_search,
  getSuggestion: getSuggestion,
  reverseGeocoder: reverseGeocoder,
}
//初始化
function initMap() {
  return new QQMapWX({
    key: my_configure.TX_MAP_KEY // 必填
  });
}
//搜索附近
function nearby_search(key, location, params, success) {
  var qqmapsdk = initMap()
  // 调用接口
  qqmapsdk.search({
    keyword: key || '小区', //搜索关键词
    page_size: params.page_size || '20',
    page_index: params.current_page || '1',
    location: location, //设置周边搜索中心点
    success: function (res) { //搜索成功后的回调
      success(res)
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) {
      console.log(res);
    }
  });
}
//用于获取输入关键字的补完与提示，帮助用户快速输入
function getSuggestion(key, region, success) {
  var qqmapsdk = initMap()
  qqmapsdk.getSuggestion({
    keyword: key || '小区',
    region: region || '成都市',
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) {
      console.log(res);
    }
  });
}
//逆地理编码
function reverseGeocoder(lat, lng, _success, _fail) {
  var qqmapsdk = initMap()
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: lat,
      longitude: lng
    },
    success: function (res) {
      console.log('成功', res);
      _success(res)
    },
    fail: function (e) {
      console.log('失败', e);
      _fail(e)
    },
    complete: function (c) {
      console.log(c);
    }
  });
}