const ulrAPI = 'https://niceday.vicp.io/BookShelf/index.php';//服务器API人口
var verfiedwwid_raw = ''
var verfiedname_raw = ''

var BookListReturnFromServer = ''

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function verfiedwwid() {
  wx.getStorage({
    key: 'verfiedwwid',
    success: function (res) {
      debugp('successfuly get verfied wwid= ' + res.data)
      verfiedwwid_raw = res.data
    },
    fail: function (res) {
      debugp('failed to read verfiedwwid in local storage. ')
      verfiedwwid_raw = ''
    }
  })
  return verfiedwwid_raw
}

function verfiedname() {
  wx.getStorage({
    key: 'verfiedname',
    success: function (res) {
      debugp('successfuly get verfied name= ' + res.data)
      verfiedname_raw = res.data
    },
    fail: function (res) {
      debugp('failed to read verfiedname in local storage. ')
      verfiedname_raw = ''
    }
  })
  return verfiedname_raw
}


//向服务器发送信息：
function SendMsgToServer(e, onlyPost, k) {
  debugp('send data to server...')
  var that = this
  wx.request({
    url: ulrAPI,
    data: e,
    method: 'POST',
    header: {
      //设置参数内容类型为x-www-form-urlencoded
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    success: function (res) {
      if (onlyPost != true) {

        switch (k) {
          case 0:
            that.setData({ BookListReturnFromServer_all: res.data })
            break
          case 1:
            that.setData({ BookListReturnFromServer_rent: res.data })
            break
          case 2:
            that.setData({ BookListReturnFromServer_unrent: res.data })
            break
          case 3:
            that.setData({ BookListReturnFromServer_borrow: res.data })
            break
          case 4:
            that.setData({ BookListReturnFromServer_memo: res.data })
            break
          default:
            that.setData({ BookListReturnFromServer: res.data })
        }

      }
      else {
        debugp('just post, do not set data value')
        debugp('data feedback from server...')
        console.log(res)
        return res.data
      }

    }
  })
}

function debugp(e) {
  var mydate = new Date
  var h = mydate.getHours() > 10 ? mydate.getHours() : '0' + mydate.getHours()
  var m = mydate.getMinutes() > 10 ? mydate.getMinutes() : '0' + mydate.getMinutes()
  var s = mydate.getSeconds() > 10 ? mydate.getSeconds() : '0' + mydate.getSeconds()
  console.log(h + ':' + m + ':' + s + '  ' + e)
}

module.exports = {
  formatTime: formatTime,
  SendMsgToServer: SendMsgToServer,
  ulrAPI: ulrAPI,
  BookListReturnFromServer: BookListReturnFromServer,
  debugp: debugp,
  verfiedwwid: verfiedwwid,
  verfiedname: verfiedname
}



