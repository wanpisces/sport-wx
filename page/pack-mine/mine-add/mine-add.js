// page/pack-mine/mine-add/mine-add.js
var httpsUtils = require('../../../utils/https-utils.js')
var toolUtils = require("../../../utils/tool-utils.js")
var that
var page_size = 10 //每页条数
var total_num //总条数
var current_page = 1
var uid
var item
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ckId: -1,
        isColoseShare: true,
        isLoading1: true,
        visitLoadData: {
            searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
            searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
        },
        bgUrl1: getApp().data.bgUrl1,
        bgUrl2: getApp().data.bgUrl2,
        empty: {
            icon: '/pic/no-content.png',
            txt: '暂无我加入的队伍'
        },
        user: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this
        var pages = getCurrentPages()
        console.log(pages)
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    isLoading1: true,
                    statusBarHeight: res.statusBarHeight,
                    minHeight: res.windowHeight - 90 - res.statusBarHeight
                })
            }
        })
        uid = options.uid
        if (uid) {
            that.setData({
                isLoading1: true,
                user_avatar: options.user_avatar || '/pic/default_logo.png',
                user_name: options.user_name,
                isShare: options.isShare && options.isShare == 1 && true || false,
                empty: {
                    icon: '/pic/no-content.png',
                    txt: '暂无' + options.user_name + '加入的队伍'
                }
            })
        } else {
            that.setData({
                user: pages[pages.length - 2].data.user,
                user_avatar: pages[pages.length - 2].data.user.user_avatar || '/pic/default_logo.png',
                isShare: options.isShare && options.isShare == 1 && true || false
            })
        }
        getJoinTeamData()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    onButShare: function(e) {
        that.setData({
            isColoseShare: !that.data.isColoseShare
        })
    },

    onCkShare: function(e) {
        item = e.currentTarget.dataset.item
        var index = e.currentTarget.dataset.index
        that.setData({
            ckId: that.data.ckId == index ? -1 : index
        })
    },
    onNewTeam: function(e) {
        toolUtils.pageTo("/page/pack-find/find-team/find-team")
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // try {
        //   var value = wx.getStorageSync('userInfo')
        //   if (value) {
        //     that.setData({
        //       user: value.data,
        //     })
        //   } else {
        //   }
        // } catch (e) {
        // }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },
    /**
     * 返回首页
     */
    goHome: function() {
        wx.switchTab({
            url: '/page/tabBar/about-movement/about-movement'
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        // if (res.from === 'button') {
        //   // 来自页面内转发按钮
        //   console.log(res.target)
        // }
        // if (that.data.isShare && uid) {
        //   return {
        //     title: that.data.user_name + '加入的队伍',
        //     path: `/page/pack-mine/mine-add/mine-add?isShare=1&uid=${uid}&user_avatar=${that.data.user_avatar}&user_name=${that.data.user_name}`
        //   }

        // } else {
        //   var userInfo = that.data.user
        //   return {
        //     title: userInfo.user_nickname + '加入的队伍',
        //     path: `/page/pack-mine/mine-add/mine-add?isShare=1&uid=${userInfo.user_id}&user_avatar=${userInfo.user_avatar}&user_name=${userInfo.user_nickname}`
        //   }

        // }
        that.setData({
            isColoseShare: true,
            ckId: -1
        })
        var url
        if (item.attr_id == 2 || item.attr_id == "2") {
            url = '/page/pack-index/pages/team-page/team-page?share=1&group_id=' + item.group_id
        } else {
            url = '/page/pack-index/pages/currency-team-page/team-page?share=1&group_id=' + item.group_id
        }
        return {
            title: `${that.data.user.user_nickname}邀请你参加一个很棒的队伍`,
            path: url,
            imageUrl: item.group_badge,
            success: (res) => {
                wx.showToast({
                    title: '分享成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: (res) => {
                console.log("转发失败", res);
            }
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (total_num > page_size * current_page) {
            ++current_page
            that.setData({
                visitLoadData: {
                    searchLoading: true, //"上拉加载"的变量，默认false，隐藏  
                    searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
                }
            })
            getJoinTeamData()
        } else {
            that.setData({
                visitLoadData: {
                    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
                    searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
                }
            })
        }
    },

})

function getJoinTeamData(msg) {
    var params = {}
    params.current_page = current_page
    params.page_size = page_size
    if (uid) {
        params.uid = uid
    }
    httpsUtils.myJoinGroup(params, function(res) {
        total_num = res.total_num
        var list = that.data.joinTeam
        if (current_page == 1) {
            list = []
        }
        list = list.concat(res.list)
        if (list.length == total_num) {
            that.setData({
                joinTeam: list,
                visitLoadData: {
                    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
                    searchLoadingComplete: true //“没有数据”的变量，默认false，隐藏  
                }
            })
        } else {
            that.setData({
                joinTeam: list,
                visitLoadData: {
                    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
                    searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
                }
            })
        }
        wx.stopPullDownRefresh()

    }, function(e) {
        if (current_page > 1) {
            --current_page
        }
        that.setData({
            visitLoadData: {
                searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
                searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
            }
        })
        wx.stopPullDownRefresh()
    }, msg)
}