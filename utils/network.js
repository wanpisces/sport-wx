var toolUtils = require("../utils/tool-utils.js");
const my_configure = require('../utils/my-configure.js');
var requestTask
//网络请求基类
const app = getApp()
//get请求，不带加载框的
function requestGet(url, params, success, fail, isRestart) {
  requestLoading('GET', url, params, "", success, fail, isRestart)
}
//post请求，不带加载框的
function requestPost(url, params, success, fail, isRestart) {
  requestLoading('POST', url, params, "", success, fail, isRestart)
}
//get请求，带加载框的
function requestGetLoading(url, params, message, success, fail, isRestart) {
  requestLoading('GET', url, params, message, success, fail, isRestart)
}
//put请求，带加载框的
function requestPutLoading(url, params, message, success, fail, isRestart) {
  requestLoading('PUT', url, params, message, success, fail, isRestart)
}
//post请求，带加载框的`
function requestPostLoading(url, params, message, success, fail, isRestart) {
  requestLoading('POST', url, params, message, success, fail, isRestart)
}
//Delete请求，带加载框的
function requestDeleteLoading(url, params, message, success, fail, isRestart) {
  requestLoading('DELETE', url, params, message, success, fail, isRestart)
}
// 网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
function requestLoading(method, url, params, message, success, _fail, isRestart) {
  params = params || {}
  params.version = my_configure.VERSION
  wx.showNavigationBarLoading()
  if (!!message) {
    wx.showLoading({
      title: message,
      mask: true
    })
  }
  if (params.token) {
    var formIds = toolUtils.getFormId()
    if (formIds != null) {
      params.formIds = formIds
      toolUtils.removeStorage('formIdList')
    }
  }
  requestTask = wx.request({
    url: url,
    data: params,
    header: {
      'Content-Type': 'application/json'
    },
    method: method,
    success: function (res) {
      console.log("success", res)
      wx.hideNavigationBarLoading()
      if (!!message) {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        switch (res.data.code) {
          case 2000:
            success(res.data.data)
            break
          case 4000:
            toolUtils.showToast(res.data.msg)
            typeof (_fail) == 'function' && _fail(res)
            break
          case 4004:
            toolUtils.showToast(res.data.msg)
            typeof (_fail) == 'function' && _fail(res)
            break
          case 4010:
          case 4003:
            // toolutils.showFailToast('token过期')
            getApp().getRefreshToken(function (token) {
              params.token = token
              requestLoading(method, url, params, message, success, _fail, isRestart)
            })
            typeof (_fail) == 'function' && _fail(res)
            break
          case 5000:
            // toolutils.showFailToast(res.data.msg)
            console.log('服务器内部错误')
            break
          default:
            typeof (_fail) == 'function' && _fail(res)
            break
        }
      } else {
        // _fail()
      }

    },
    fail: function (res) {
      console.log("fail", res)
      wx.hideNavigationBarLoading()
      if (!!message) {
        wx.hideLoading()
      }
    },
    complete: function (res) {
      try {
        var pages = getCurrentPages()
        var pageNow = pages[pages.length - 1]
        if (pageNow.data.isLoading && url.indexOf('loginByCode') < 0 && url.indexOf('public/attr') < 0) {
          setTimeout(function () {
            pageNow.setData({
              isLoading: false
            })
          }, 50)
        }
      } catch (e) {
        console.log(e)
      }
      if (!isRestart) {
        return
      }
      if (Math.floor(res.statusCode / 100) == 5 || Math.floor(res.statusCode / 100) == 4) {
        wx.showModal({
          title: '提示',
          content: '服务器错误,点击确定重新获取数据',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              requestLoading(method, url, params, message, success, _fail, isRestart)
            } else if (res.cancel) {

            }
          }
        })

      }
    },
  })
}
//递归上传图片知道成功
function uploadFiles(url, message, fileUrls, success) {
  if (!!message) {
    wx.showLoading({
      title: message,
      mask: false
    })
  }
  var i = 0;
  var imgs = []
  var s = function (res) {
    i++
    if (i < fileUrls.length) {
      if (res.code == 2000) {
        imgs.push(res.data)
        if (fileUrls[i] != '') {
          uploadMyFile(url, fileUrls[i], s)
        } else {
          wx.hideLoading()
          success(imgs)
        }
      } else {
        i--
        uploadMyFile(url, fileUrls[i], s)
      }
    } else {
      if (res.code == 2000) {
        imgs.push(res.data)
        wx.hideLoading()
        success(imgs)
      } else {
        i--
        uploadMyFile(url, fileUrls[i], s)
      }
    }
  }
  uploadMyFile(url, fileUrls[0], s)

}
//文件上传
function uploadMyFile(url, fileUrl, success) {
  wx.uploadFile({
    url: url,
    filePath: fileUrl,
    name: 'file',
    header: {
      'content-type': 'application/json'
    },
    formData: {
      version: "v0.0.2"
    },
    success: function (res) {
      try {
        success(JSON.parse(res.data))
      } catch (e) {
        success(e)
      }

      //do something
    },
    fail: function (e) {
      wx.hideLoading()
      // toolutils.showFailToast('图片上传失败')
    }
  })

}

module.exports = {
  requestGet: requestGet,
  requestPost: requestPost,
  requestGetLoading: requestGetLoading,
  requestPostLoading: requestPostLoading,
  requestPutLoading: requestPutLoading,
  requestDeleteLoading: requestDeleteLoading,
  uploadFiles: uploadFiles,
  requestTask: requestTask
}