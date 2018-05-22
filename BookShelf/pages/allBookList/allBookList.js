//myBookList.js
//获取应用实例

//var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const util = require('../../utils/util.js')
const app = getApp();
/*var activeIndex ;*/


Page({
  data: {
    tabs: ["全部", "已借出", "未借出"],
    sliderOffset: 0,
    sliderLeft: 0,
    activeIndex: 0,
    sliderWidth: 0,
    inputShowed: false,
    inputVal: "",
    BookListReturnFromServer: "",
    BookListReturnFromServer_all: "",
    BookListReturnFromServer_rent: "",
    BookListReturnFromServer_unrent: "",
    userNoLogin: true
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

    util.debugp("All onload， start to load all book list...")
    //util.SendMsgToServer.call(this, { 'doWhat': 'getAllBooks' });
    SelectTab.call(this, 0)

  },

  onShow: function () {
    SelectTab.call(this, this.data.activeIndex)
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
      inputShowed: true,
      //BookListReturnFromServer: ""
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    SelectTab.call(this, this.data.activeIndex)
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
      BookListReturnFromServer: ""
    });
    SelectTab.call(this, this.data.activeIndex)

  },

  //向别人借书  
  rentBK: function (e) {
    var that = this
    var allowID = parseInt(e.currentTarget.dataset.id)
    util.debugp('rent a book')
    //util.debugp(e)
    if (util.verfiedwwid() == '') {
      util.debugp('rent a book: user no login, quit.')
      wx.showToast({
        title: '抱歉，您未登陆。',
        icon: 'none'
      })
      //this.clearPages()
      return
    }

    wx.showModal({
      title: '借书',
      content: '请确认借用 《' + e.currentTarget.dataset.bkname + '》？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        util.debugp(res);
        if (res.confirm) {
          //util.debugp('用户点击主操作')          
          wx.request({
            url: util.ulrAPI,
            data: { 'doWhat': 'rentBK', 'allowID': allowID, 'whoBorrow': util.verfiedname(), 'whoBorrowid': util.verfiedwwid() },
            method: 'POST',
            header: {
              //设置参数内容类型为x-www-form-urlencoded
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            success: function (res) {
              util.debugp('rent a book feedback:')
              console.log(res)
              if (res.data.rentBKIsOK == true) {
                wx.showToast({
                  title: '已提交借用申请，等待对方审批。',
                })
              }
              else {
                wx.showToast({
                  title: '抱歉，提交借用申请失败。',
                  icon: 'none'
                })
              }
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

  //清除页面缓存
  clearPages: function (e) {
    this.setData({
      BookListReturnFromServer: "",
      BookListReturnFromServer_all: "",
      BookListReturnFromServer_rent: "",
      BookListReturnFromServer_unrent: "",
    })
  }


});

function SelectTab(k) {
  util.debugp('enter tab select with k= ' + k)



  if (util.verfiedwwid() == '') {
    this.clearPages()
    this.setData({
      userNoLogin: true
    })
    return 1
  }
  else {
    this.setData({ userNoLogin: false })
  }

  if (this.data.inputShowed) {
    util.debugp('search box is showing, enter the search mode')
    switch (k) {
      case 0:
        //util.debugp(k);
        //util.SendMsgToServer.call(this, { 'doWhat': 'getAllBooks' });
        util.SendMsgToServer.call(this, { 'doWhat': 'searchBK', 'whatBK': this.data.inputVal, 'filter': 'all' }, false, 9)
        break;
      case 1:
        //util.debugp(k);
        //util.SendMsgToServer.call(this, { 'doWhat': 'getAllBooksRent' });
        util.SendMsgToServer.call(this, { 'doWhat': 'searchBK', 'whatBK': this.data.inputVal, 'filter': 'isRent' }, false, 9)
        break;
      case 2:
        //util.debugp(k);
        //util.SendMsgToServer.call(this, { 'doWhat': 'getAllBooksUnRent' });
        util.SendMsgToServer.call(this, { 'doWhat': 'searchBK', 'whatBK': this.data.inputVal, 'filter': 'Unrent' }, false, 9)
        break;
    }
  }
  else {
    util.debugp('search box is not showing, enter the normal mode. k= ' + k)
    switch (k) {
      case 0:
        //util.debugp(k);
        util.SendMsgToServer.call(this, { 'doWhat': 'getAllBooks', 'who': 'all' }, false, 0);
        break;
      case 1:
        //util.debugp(k);
        util.SendMsgToServer.call(this, { 'doWhat': 'getAllBooksRent', 'who': 'all' }, false, 1);
        break;
      case 2:
        //util.debugp(k);
        util.SendMsgToServer.call(this, { 'doWhat': 'getAllBooksUnRent', 'who': 'all' }, false, 2);
        break;

      default:
      //util.debugp(k);
    }
  }

}










