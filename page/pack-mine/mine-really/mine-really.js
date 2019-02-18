var httpsUtils = require('../../../utils/https-utils.js');
var toolUtils = require("../../../utils/tool-utils.js")
var that


Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    auditState: '0',
    really_userInfo: {
      reallyName: '',
      reallyNum: '',
      really_headImg: '',
      really_phoneImg: '',
      really_reserveImg: '',
      really_headImg_url: '',
      really_phoneImg_url: '',
      really_reserveImg_url: '',
      really_name: '',
      really_num: '',
    },
    imageOneState: true,
    imageTwoState: true,
    idPhoneState: true,
  },

  //真实姓名
  reallyNameEvt: function (e) {
    this.data.really_userInfo.reallyName = e.detail.value;
  },
  //身份证号码
  reallyNumEvt: function (e) {
    this.data.really_userInfo.reallyNum = e.detail.value;
  },
  //身份证图片上传
  chooseImgEvt: function (e) {
    that.data.really_userInfo.head_img = "";
    var title = e.currentTarget.dataset.title
    that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        if (res.tempFilePaths[0].indexOf('gif') < 0) {
          var tempFilePaths = res.tempFilePaths;
          switch (title) {
            //上传白底证件照
            case 'headimg':
              {
                that.data.really_userInfo.really_headImg = tempFilePaths;
                that.setData({
                  idPhoneState: false
                });
                break
              }
            //身份证头像面
            case 'indentFront':
              {
                that.data.really_userInfo.really_phoneImg = tempFilePaths;
                that.setData({
                  imageOneState: false
                });
                break
              }
            //身份证国徽面
            case 'indentReverse':
              {
                that.data.really_userInfo.really_reserveImg = tempFilePaths;
                that.setData({
                  imageTwoState: false
                })
              }
          }
          that.setData({
            really_userInfo: that.data.really_userInfo
          })
          console.log(that.data.really_userInfo)
          httpsUtils.uploadImgs(tempFilePaths, function (res) {
            var user_phone = res[0].key;
            switch (title) {
              //上传白底证件照
              case 'headimg':
                {
                  that.data.really_userInfo.really_headImg_url = user_phone;
                  that.userAuditCertPicEvt();
                  break
                }
              //身份证头像面
              case 'indentFront':
                {
                  that.data.really_userInfo.really_phoneImg_url = user_phone;
                  break
                }
              //身份证国徽面
              case 'indentReverse':
                {
                  that.data.really_userInfo.really_reserveImg_url = user_phone;
                }
            }
          }, function (e) {
            toolUtils.showToast("照片上传失败")
          })
        } else {
          toolUtils.showToast("照片格式错误")
        }
      }
    })
  },

  // 提交证件照
  userAuditCertPicEvt: function () {
    httpsUtils.userAuditCertPic({ cert_pic: that.data.really_userInfo.really_headImg_url }, function (res) {
      toolUtils.showToast("上传成功");
    }, function (e) {
      toolUtils.showToast(e.data.msg)
    })
  },
  //提交用户信息
  submitInfoEvt: function (e) {
    var params = {};
    var title = e.currentTarget.dataset.title;
    var cert_more = {
      url: this.data.really_userInfo.really_phoneImg_url,
      title: '标题',
      desc: '描述'
    }
    params.cert_pic_more = JSON.stringify(cert_more);
    if (title == 'submit') {
      params.cert_pic = this.data.really_userInfo.really_headImg_url;
      params.cert_pic_front = this.data.really_userInfo.really_phoneImg_url;
      params.cert_pic_back = this.data.really_userInfo.really_reserveImg_url;
      params.user_realname = this.data.really_userInfo.reallyName;
      params.cert_id = this.data.really_userInfo.reallyNum;
      if (!toolUtils.IdentityCodeValid(params.cert_id)) {
        toolUtils.showToast("请输入正确的身份证号")
        return
      } else if (params.user_realname == "") {
        toolUtils.showToast("请输入真实姓名")
        return
      } else if (params.cert_pic_front == "" || params.cert_pic_back == "") {
        toolUtils.showToast("请上传身份证照片")
        return
      } else {
        console.log('params', params)
        httpsUtils.submitUserAudit(params, function (res) {
          toolUtils.showToast("提交成功")
          setTimeout(function (res) {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }, function (err) {
          toolUtils.showToast(err.data.msg)
        })
      }
      //重新提交
    } else {
      that.data.really_userInfo.head_img = "";
      that.data.really_userInfo.reallyName = "";
      that.data.really_userInfo.reallyNum = "";
      that.setData({
        auditState: 0,
        idPhoneState: true,
        really_userInfo: that.data.really_userInfo
      })
    }

  },
  //名字和身份证号码中间用*代替
  plusXing: function (str, frontLen, endLen) {
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          isLoading: true,
          statusBarHeight: res.statusBarHeight,
          minHeight: res.windowHeight - 90 - res.statusBarHeight
        })
      }
    })
    if (options.audit_status == '0') {
      that.setData({
        auditState: options.audit_status,
        isLoading: false,
      })
    } else {
      httpsUtils.checkUserAudit(function (res) {
        console.log(res)
        //审核状态页面渲染的数据
        that.data.really_userInfo.really_num = that.plusXing(res.cert_id, 1, 1)
        that.data.really_userInfo.really_name = that.plusXing(res.user_realname, 0, 1);
        //重新提交的数据
        that.data.really_userInfo.reallyName = res.user_realname;
        that.data.really_userInfo.reallyNum = res.cert_id;
        that.data.really_userInfo.head_img = res.cert_pic;
        if (that.data.really_userInfo.head_img) {
          that.data.idPhoneState = false
        } else {
          that.data.idPhoneState = true
        }
        that.setData({
          idPhoneState: that.data.idPhoneState,
          auditState: res.audit_status,
          audit_remark: res.audit_remark,
          really_userInfo: that.data.really_userInfo,
        })
        console.log(that.data.really_userInfo, that.data.auditState)
      }, function (e) { })
      that.setData({
        isLoading: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    mCurrentPage = 1
    getData("加载中...")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

})