//setting.js
//获取应用实例
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputname: '',
    inputwwid: '',
    verfiedname: '',
    verfiedwwid: '',
    UserisRegisted: true
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    //this.checkUserReg()



    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }




  },

  onShow: function () {
    // this.checkUserReg()
    this.checkUserReg(this,true)
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  delBook: function (e) {

    wx.navigateTo({
      url: '../delBook/delBook',
    })

  },

  getOpenID: function (e) {
    var that = this

    if (this.data.inputname == '' || this.data.inputwwid == '') {
      wx.showToast({
        title: '请输入完整的姓名和编号。',
        icon: 'none'
      })
      return 1
    }

    wx.showModal({
      title: '注册信息确认',
      content: '名字: ' + that.data.inputname + '  编号：' + that.data.inputwwid,
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        //util.debugp(res);
        if (res.confirm) {
          //util.debugp('用户点击主操作') 
          wx.login({
            success: function (res) {
              util.debugp('login info feedback:' + res.code)
              wx.request({
                url: util.ulrAPI,
                data: { 'doWhat': 'getOpenID', 'code': res.code, 'name': that.data.inputname, 'wwid': that.data.inputwwid },
                method: 'POST',
                header: {
                  //设置参数内容类型为x-www-form-urlencoded
                  'content-type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/json'
                },
                success: function (res2) {
                  console.log('feedback from server...')
                  console.log(res2)
                  if (res2.data.length != 0) {

                    wx.showToast({
                      title: '设置个人信息失败.' + res2.data,
                      icon: 'none',
                      duration: 8000

                    })
                    //console.log('feedback inputname: ' + res.data.name)
                  }
                  else {
                    wx.showToast({
                      title: '设置个人信息成功',
                    })
                    that.checkUserReg()
                  }
                }
              })
            }
          })

        } else {
          //util.debugp('用户点击辅助操作')
        }
      }
    });
  },

  cinputname: function (e) {
    this.setData({ inputname: e.detail.value })
  },
  cinputwwid: function (e) {
    this.setData({ inputwwid: e.detail.value })
  },

  checkUserReg: function (e, notshowtips) {
    var that = this
    wx.login({
      success: function (res) {
        util.debugp('login info feedback:' + res.code)
        //util.SendMsgToServer.call(this, , true)
        util.debugp('send user code for openid to server...')
        wx.request({
          url: util.ulrAPI,
          data: { 'doWhat': 'checkUser', 'code': res.code, 'name': that.data.inputname, 'wwid': that.data.inputwwid },
          method: 'POST',
          header: {
            //设置参数内容类型为x-www-form-urlencoded
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          success: function (res) {
            util.debugp('user openid feedback from server...')
            console.log(res)
            if (res.data.length != 0) {
              that.setData({
                UserisRegisted: true,
                verfiedname: res.data["0"].name,
                verfiedwwid: res.data["0"].wwid
              })
              wx.setStorage({
                key: 'verfiedname',
                data: res.data["0"].name,
              })
              wx.setStorage({
                key: 'verfiedwwid',
                data: res.data["0"].wwid,
              })

              //console.log('feedback inputname: ' + res.data.name)
              if (!notshowtips) {
                wx.showToast({
                  title: '已更新用户信息',
                })
              }
              
            }
            else {
              that.setData({
                UserisRegisted: false,
                verfiedname: '',
                verfiedwwid: ''
              })
              wx.setStorage({
                key: 'verfiedname',
                data: '',
              })
              wx.setStorage({
                key: 'verfiedwwid',
                data: '',
              })

              wx.showToast({
                title: '更新用户信息失败',
                icon: 'none'
              })

            }
          }
        })
      }
    })
  },

  refreshUserInfo: function (e) {
  }
})
