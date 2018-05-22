//setting.js
//获取应用实例
const util = require('../../utils/util.js')
const app = getApp()
var newBKname = ''
var newBKauthor = ''


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    BookListReturnFromServer: ''

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
    //开始我的函数

    newBKname = ''
    newBKauthor = ''




  },
  getUserInfo: function (e) {
    util.debugp(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //设置新书的名字
  setNwBkName: function (e) {
    newBKname = e.detail.value

  },

  //设置新书作者的名字
  setNwBkAuthor: function (e) {
    newBKauthor = e.detail.value
  },

  //添加新书到数据库
  addNewBk: function (e) {

    var that = this

    if (newBKname == '' || newBKauthor == '') {
      wx.showToast({
        title: '请完整地输入书名和作者',
        icon: 'none'
      })
      return 1
    }

    util.debugp('newBKname= ' + newBKname + ' newBKauthor= ' + newBKauthor)

    wx.showModal({
      title: '添加书籍',
      content: '您确认要添加《' + newBKname + '》 作者：' + newBKauthor + ' 吗？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        util.debugp(res);
        if (res.confirm) {
          //util.debugp('用户点击主操作')
          var sendData = { 'doWhat': 'addNewBook', 'newBKauthor': newBKauthor, 'newBkName': newBKname, 'owner': util.verfiedname(), 'wwid': util.verfiedwwid() }
          wx.request({
            url: util.ulrAPI,
            data: sendData,
            method: 'POST',
            header: {
              //设置参数内容类型为x-www-form-urlencoded
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            success: function (res) {
              util.debugp('add new book return:')
              util.debugp(res)
              if (res.data.addNewIsOK == true) {
                wx.showToast({
                  title: '添加成功',
                })
              }
              else {
                wx.showToast({
                  title: '抱歉，添加失败。',
                  icon: 'none'
                })
              }
            }
          })

        } else {
          //util.debugp('用户点击辅助操作')
        }
      }
    });




  }
})
