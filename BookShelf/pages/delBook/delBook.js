//myBookList.js
//获取应用实例

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var ulrAPI = 'http://t.firg.top/test.php';
const util = require('../../utils/util.js')
const app = getApp();
/*var activeIndex ;*/


Page({
  data: {
    BookListReturnFromServer: "",
    BookListReturnFromServer_all: "",
    BookListReturnFromServer_rent: "",
    BookListReturnFromServer_unrent: "",
    tabs: ["全部", "已借出", "未借出"],
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth: 0,
    activeIndex: 0,
    inputShowed: false,
    userNoLogin:true,
    inputVal: ""
  },

  onLoad: function () {
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

    util.debugp("All onload")
    SelectTab.call(this, 0)

  },
  onShow: function () {
    SelectTab.call(this, this.data.activeIndex)
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

  tabClick: function (e) {
    var k = parseInt(e.currentTarget.id)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: k
    })    
    SelectTab.call(this, k)

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  //删除书籍
  removeBook: function (e) {
    var that = this

    util.debugp('remove book start')
    //util.debugp(e)
    if (util.verfiedwwid() == '') {
      util.debugp('remove book: user no login, quit.')
      wx.showToast({
        title: '抱歉，您未登陆。',
        icon: 'none'
      })
      return
    }
    //util.SendMsgToServer.call(this, { 'doWhat': 'removeBook', 'removeID': e.target.id });
    wx.showModal({
      title: '删除书籍',
      content: '您确认要删除 《' + e.currentTarget.dataset.bkname + '》 吗？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        util.debugp(res);
        if (res.confirm) {
          //util.debugp('用户点击主操作')          
          wx.request({
            url: util.ulrAPI,
            data: { 'doWhat': 'removeBook', 'removeID': e.target.id },
            method: 'POST',
            header: {
              //设置参数内容类型为x-www-form-urlencoded
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            success: function (res) {
              util.debugp('remove book return:')
              util.debugp(res)
              if (res.data.removeBKIsOK == true) {
                wx.showToast({
                  title: '删除成功',
                })                
              }
              else {
                wx.showToast({
                  title: '抱歉，删除失败。',
                  icon: 'none'
                })
              }              
              var k = that.data.activeIndex
              SelectTab.call(that,k)
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
  var that = this
  util.debugp('start to select tab. k= ' + k)
  util.debugp('util.verfiedwwid= ' + util.verfiedwwid() + '   ' + 'util.verfiedname= ' + util.verfiedname())
  
  if (util.verfiedwwid() == '') {
    this.clearPages()
    this.setData({
      userNoLogin: true      
    })
    return 1
  }
  else {
    that.setData({
      userNoLogin: false
    })
    switch (k) {
      case 0://全部
        util.SendMsgToServer.call(that, { 'doWhat': 'getAllBooks', 'who': util.verfiedwwid() },false,0);
        break;
      case 1://已借出
        util.SendMsgToServer.call(that, { 'doWhat': 'getAllBooksRent', 'who': util.verfiedwwid() }, false, 1);
        break;
      case 2://未借出
        util.SendMsgToServer.call(that, { 'doWhat': 'getAllBooksUnRent', 'who': util.verfiedwwid() }, false, 2);
        break;      
      default:
    }
  }

}










