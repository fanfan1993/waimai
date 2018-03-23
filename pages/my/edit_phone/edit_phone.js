// pages/my/edit_phone/edit_phone.js
var util = require('../../../utils/util.js');
var that;
var countdown = 60;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{
      mobile:"",
      code:""
    },
    last_time: '',
    is_show: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  //填写手机号
  bindPhone:function(e){
    var that = this;
    this.setData({
      //show_Name: !that.data.show_Name,
      user: {
        mobile: e.detail.value,
        code: ""
      }
    })
  },
  //倒计时
  settime : function (that) {
    if (countdown == 0) {
      that.setData({
        is_show: true
      })
      countdown = 60;
      return;
    } else {
      that.setData({
        is_show: false,
        last_time: countdown
      })

      countdown--;
    }
    setTimeout(function () {
      that.settime(that)
    }
      , 1000)
  },
  //点击获取验证码
  getCode:function(e){
    var that = this;
    console.log("dad");
    var mobile = that.data.user.mobile;

    if (!mobile) {
      wx.showModal({
        title: '手机号不能为空',
        showCancel: false
      });
      return;
    } else if (!util.PregRule.Tel.test(mobile)) {
      wx.showModal({
        title: '手机号格式不正确',
        showCancel: false
      });
      return;
    }

    that.setData({
      is_show: (!that.data.is_show)   //false
    })
    that.settime(that);
    
    //util.getAuthCode(e, "1835858835", 'normal', 60);
  },
  phone_Code:function(e){
    var form = e.detail.value;
    // console.log(form);
    // 表单验证
    if (form.code == '') {
      wx.showModal({
        title: '请输入验证码',
        showCancel: false
      });
      return;
    }

    if (!(/^1[34578]\d{9}$/.test(form.mobile))) {
      wx.showModal({
        title: '请填写正确手机号码',
        showCancel: false
      });
      return;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})