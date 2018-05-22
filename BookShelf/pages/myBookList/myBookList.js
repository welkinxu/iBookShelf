//myBookList.js
//获取应用实例

//var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const util = require('../../utils/util.js')
const app = getApp()
//var util.verfiedwwid =''
/*var activeIndex ;*/



Page({
  data: {
    BookListReturnFromServer_all: "",
    BookListReturnFromServer_rent: "",
    BookListReturnFromServer_unrent: "",
    BookListReturnFromServer_borrow: "",
    BookListReturnFromServer_memo: "",
    tabs: ["全部", "已借出", "未借出", "我借的", "待办事项"],
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth: 0,
    activeIndex: 0,
    userNoLogin: true,
    username: '',
    userwwid: '',
    memocount: 0 //代办事项的数量
  },

  onLoad: function () {
    //util.verfiedwwid = userwwid
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          //sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderLeft: 0,
          sliderWidth: res.windowWidth / that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        })
      }
    })

    SelectTab.call(this, 0)
  },
  onShow: function () {
    //util.debugp('mybook page on show active: ')   
    SelectTab.call(this, this.data.activeIndex)
  },

  addNewBook: function (e) {

    wx.navigateTo({
      url: '../addNewBook/addNewBook',
    })
  },

  tabClick: function (e) {
    util.debugp('tab click')
    console.log(e)
    var k = parseInt(e.currentTarget.id)
    util.debugp('active sheet = ' + k)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: k
    })

    SelectTab.call(this, k)

  },
  //清除页面缓存
  clearPages: function (e) {
    this.setData({
      BookListReturnFromServer: "",
      BookListReturnFromServer_all: "",
      BookListReturnFromServer_rent: "",
      BookListReturnFromServer_unrent: "",
    })
  },

  //允许借书与否
  allowRent: function (e) {
    var that = this
    var allowID = parseInt(e.currentTarget.dataset.id)
    util.debugp('enter allow rent mode')

    if (util.verfiedwwid() == '') {
      util.debugp('allow rent book: user no login, quit.')
      wx.showToast({
        title: '抱歉，您未登陆。',
        icon: 'none'
      })
      return
    }


    //util.debugp(e)
    if (e.currentTarget.dataset.allowrent == 'true') {

      wx.showModal({
        title: '借出确认',
        content: '您确认借出 《' + e.currentTarget.dataset.bkname + '》 吗？',
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
            //util.debugp('用户点击主操作')          
            wx.request({
              url: util.ulrAPI,
              data: { 'doWhat': 'allowRent', 'ans': true, 'allowID': allowID },
              method: 'POST',
              header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              success: function (res) {
                util.debugp('allow rent book return from server:')
                console.log(res)
                if (res.data.allowRentIsOK == true) {
                  wx.showToast({
                    title: '借出成功',
                  })
                }
                else {
                  wx.showToast({
                    title: '抱歉，借出失败。',
                    icon: 'none'
                  })
                }

                //util.SendMsgToServer.call(that, { 'doWhat': 'getAllBooks' });
                //that.tabClick()

              }
            })

            var k = that.data.activeIndex
            SelectTab.call(that, k)

          } else {
            //util.debugp('用户点击辅助操作')
          }
        }
      });

    }
    else {
      wx.showModal({
        title: '拒绝借出',
        content: '您确认不借出 《' + e.currentTarget.dataset.bkname + '》 吗？',
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          util.debugp(res);
          if (res.confirm) {
            //util.debugp('用户点击主操作')          
            wx.request({
              url: util.ulrAPI,
              data: { 'doWhat': 'allowRent', 'ans': false, 'allowID': allowID },
              method: 'POST',
              header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              success: function (res) {
                util.debugp('dont allow rent book return from server:')
                console.log(res)
                if (res.data.allowRentIsOK == true) {
                  wx.showToast({
                    title: '拒绝成功',
                  })
                }
                else {
                  wx.showToast({
                    title: '抱歉，尝试拒绝借出时失败，请重试。',
                    icon: 'none'
                  })
                }
                //util.SendMsgToServer.call(that, { 'doWhat': 'getAllBooks' });
                //that.tabClick()
                var k = that.data.activeIndex
                SelectTab.call(that, k)
              }
            })

          } else {
            //util.debugp('用户点击辅助操作')
          }
        }
      });
    }


  },

  //确认归还

  comfirmReturn: function (e) {
    var that = this
    var allowID = parseInt(e.currentTarget.dataset.id)
    util.debugp('enter comfirm renturn')
    //util.debugp(e)

    if (util.verfiedwwid() == '') {
      util.debugp('comfirm return book: user no login, quit.')
      wx.showToast({
        title: '抱歉，您未登陆。',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '归还确认',
      content: '请确认是否已经收到 《' + e.currentTarget.dataset.bkname + '》？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        util.debugp(res);
        if (res.confirm) {
          //util.debugp('用户点击主操作')          
          wx.request({
            url: util.ulrAPI,
            data: { 'doWhat': 'comfirmReturn', 'allowID': allowID },
            method: 'POST',
            header: {
              //设置参数内容类型为x-www-form-urlencoded
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            success: function (res) {
              util.debugp('comfirm return feedback:')
              util.debugp(res)
              if (res.data.comfirmReturnIsOK == true) {
                wx.showToast({
                  title: '已确认归还。',
                })
              }
              else {
                wx.showToast({
                  title: '抱歉，归还确认失败。',
                  icon: 'none'
                })
              }
              //util.SendMsgToServer.call(that, { 'doWhat': 'getAllBooks' });
              var k = that.data.activeIndex
              SelectTab.call(that, k)
            }
          })

        } else {
          //util.debugp('用户点击辅助操作')
        }
      }
    });

  },

  //获取待办事项个数
  getMeomoCount: function (e) {
    //var temp = util.SendMsgToServer.call(this, { 'doWhat': 'getMemo', 'who': this.data.userwwid },true);
    var that = this
    util.debugp('get memo count enter: ')
    wx.request({
      url: util.ulrAPI,
      data: { 'doWhat': 'getMemo', 'who': that.data.userwwid },
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        util.debugp('get memo count feedback. count= ' + res.data.length)
        console.log(res)
        that.setData({
          memocount: res.data.length
        })
      }
    })

  },



  //归还书籍
  returnBK: function (e) {
    var that = this
    var allowID = parseInt(e.currentTarget.dataset.id)
    util.debugp('enter renturn book')
    //util.debugp(e)

    if (util.verfiedwwid() == '') {
      util.debugp('return book: user no login, quit.')
      wx.showToast({
        title: '抱歉，您未登陆。',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '归还书籍',
      content: '您将要归还 《' + e.currentTarget.dataset.bkname + '》？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        util.debugp(res);
        if (res.confirm) {
          //util.debugp('用户点击主操作')          
          wx.request({
            url: util.ulrAPI,
            data: { 'doWhat': 'returnBK', 'allowID': allowID },
            method: 'POST',
            header: {
              //设置参数内容类型为x-www-form-urlencoded
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            success: function (res) {
              util.debugp('return book feedback..')
              util.debugp(res)
              if (res.data.returnBKIsOK == true) {
                wx.showToast({
                  title: '已提交归还申请。',
                })
              }
              else {
                wx.showToast({
                  title: '抱歉，提交归还申请失败。',
                  icon: 'none'
                })
              }
              //util.SendMsgToServer.call(that, { 'doWhat': 'getAllBooks' });
              var k = that.data.activeIndex
              SelectTab.call(that, k)
            }
          })
        } else {
          //util.debugp('用户点击辅助操作')
        }
      }
    });
  }
});

//根据k值选择当前显示的内容
function SelectTab(k) {
  this.getMeomoCount()

  var that = this
  util.debugp('start to select tab. k= ' + k)
  util.debugp('util.verfiedwwid= ' + that.data.userwwid + '   ' + 'util.verfiedname= ' + that.data.username)
  if (util.verfiedwwid() == '') {
    this.clearPages()
    this.setData({
      userNoLogin: true,
      username: '',
      userwwid: ''
    })

    return 1
  }
  else {
    this.setData({
      userNoLogin: false,
      username: util.verfiedname(),
      userwwid: util.verfiedwwid()
    })
    switch (k) {
      case 0://全部
        util.SendMsgToServer.call(that, { 'doWhat': 'getAllBooks', 'who': that.data.userwwid }, false, 0);
        break;
      case 1://已借出
        util.SendMsgToServer.call(that, { 'doWhat': 'getAllBooksRent', 'who': that.data.userwwid }, false, 1);
        break;
      case 2://未借出
        util.SendMsgToServer.call(that, { 'doWhat': 'getAllBooksUnRent', 'who': that.data.userwwid }, false, 2);
        break;
      case 3://我借的
        util.SendMsgToServer.call(that, { 'doWhat': 'getBooksIBorrow', 'who': that.data.userwwid }, false, 3);
        break;
      case 4://待办事项
        util.SendMsgToServer.call(that, { 'doWhat': 'getMemo', 'who': that.data.userwwid }, false, 4);
        break;
      default:
    }
  }

}










