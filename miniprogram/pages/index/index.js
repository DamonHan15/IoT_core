// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({
  userNameInput:function(e){
    this.setData({
      userN:e.detail.value
    })
  },
  scanCode:function(){
    var Mythis = this;
    wx.scanCode({
      success(res) {
        Mythis.setData({
          result: res.result
        })
      }
    })
  },

  send_data_to_server:function(){
    var goods = {};
    goods.goodsId = this.data.userN + this.data.result;
    wx.request({
      url: 'http://192.168.' + this.data.userN + ':1001',
      data: {
        goods
      },
    }),
    wx.showToast({
      title: '发送',
      duration: 2000,
      icon: 'loading',
      mask: true
    })
//    wx.navigateTo({
//      url: '/pages/ranking/ranking',
//    })
  }

});