// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({
  //全局变量
  globalData:{
    ACCESS_TOKEN:'',
    OPENID:''
  },

  //按钮
  scanCode:function(){
    var Mythis = this;
    wx.scanCode({ //调用微信扫码功能
      success(res) {
        Mythis.setData({
          result: res.result// res.result是扫二维码解析得到的字符串，result是字符串显示区，这个动作完成了把扫码得到的字符串放到显示区
        })
      }
    })
  },

  // 按钮
  user_agree:function(){
    var Mythis = this;
      wx.requestSubscribeMessage({//调用窗口，让用户看是否同意给用户发送消息
        tmplIds: ['LiEfzrz0jXfIo3K-W0JquNO4IwmSF4reDPIUD9B_wQw'],//待发送的消息模版的id，从微信公众平台的订阅消息中启用并获取到id
        success (res) { }
      })
  },

  //按钮
  Login:function(){
    var that = this;
    //获取登录凭证（code）
    wx.login({
      success(res) {
        console.log(res.code);
        if (res.code) {
          //发起网络请求
          wx.request({
          //URL代表服务器地址
            url: 'https://www.damonhan.top/Login.php',
            data: {
            //传入参数为code
              code: res.code
            },
            success(res){
              console.log(res.data);
              that.globalData.OPENID= res.data.openid;
              that.setData({
                //showopenid: res.data.openid,
                //showsession_key: res.data.session_key,
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  getAccessToken:function(){
    var that = this;
    wx.request({
      url: 'https://www.damonhan.top/accessToken.php',
      data: {},
      success(res) {
        console.log(res.data);
        that.globalData.ACCESS_TOKEN= res.data.access_token;
        that.setData({
          //accessToken: res.data.access_token,
        })
      }
    })
  },

  //发送订阅消息
  message: function () {
    var that = this;
    //订阅消息模板id
    var template_id ="LiEfzrz0jXfIo3K-W0JquNO4IwmSF4reDPIUD9B_wQw";
    wx.requestSubscribeMessage({
      tmplIds: ['LiEfzrz0jXfIo3K-W0JquNO4IwmSF4reDPIUD9B_wQw'],
      success(res) {
        that.setData({
          accessToken: that.globalData.ACCESS_TOKEN,
          showopenid: that.globalData.OPENID
        }),
      //发送access_token请求
        wx.request({
          
          url: 'https://www.damonhan.top/message.php',
          //method: 'POST',
          data:{
            access_token: that.globalData.ACCESS_TOKEN,
            //数据包
            data:{
            //openid
              "touser": that.globalData.OPENID,
            //模板id
              "template_id": template_id,
              "page": "index",
              "miniprogram_state": "developer",
              "lang": "zh_CN",
              "data": {
                "thing4": {
                  "value": "2024年03月03日"
                },
                "character_string5": {
                  "value": "15℃"
                }
              }
            }
          },
          success: function(res) {
            console.log("订阅成功");
            console.log(res);
            
          },
          fail: function(res) {
            console.log("订阅失败");
          },
        })
      }
    })
  },
  userNameInput:function(e){
    this.setData({
      userN:e.detail.value
    })
  },
  send_data_to_server:function(){
  //onReady: function () {
    var myThis = this;
    
    
    if (this.data.userN.slice(1, 18) == 'damonhan_terminal')
    {
      wx.request({
        url: 'https://www.damonhan.top/', //仅为示例，并非真实的接口地址
        method: "GET",
        // data: { 'get': 'get'},
        data: { 'damonhan_terminal': this.data.userN},
        // data: { 'damonhan_terminal_1': this.data.result},
        success(res) {
          myThis.setData({
            request: res.data.status,
            array: res.data.Message,         
            server_info: res.data.Message[0].car
            
          })
        }
      }),
      wx.showToast({
        title: '魔法生成中',
        duration: 1000,
        icon: 'loading',
        mask: true
      })
  }
  },
});