// pages/my/info/info.js
var util = require('../../../app.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{

    },
    show_Name:false,
    focus:false
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
    var that = this;
    var info = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: {
        avatarUrl: info.avatarUrl,
        nickName: info.nickName
      }
    })
  },
  changeAvatar:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片，只有一张图片获取下标为0  
        var tempFilePaths = res.tempFilePaths[0];
        var userInfo = wx.getStorageSync('userInfo');
        that.setData({
          userImg: tempFilePaths,
          actionSheetHidden: !that.data.actionSheetHidden
        })
        that.setData({
          userInfo:{
            nickName: userInfo.nickName,
            avatarUrl: tempFilePaths,
          }
        })
        userInfo.avatarUrl = tempFilePaths;
        wx.setStorageSync('userInfo', userInfo);

        that.change_data(); //刷新
        //this.onshow();
        // util.uploadFile('/itdragon/uploadImage', tempFilePaths, 'imgFile', {}, function (res) {
        //   console.log(res);
        //   if (null != res) {
        //     that.setData({
        //       userImg: res
        //     })
        //   } else {
        //     // 显示消息提示框  
        //     wx.showToast({
        //       title: '上传失败',
        //       icon: 'error',
        //       duration: 2000
        //     })
        //   }
        // });
      }
    })  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //编辑用户名
  edit_name:function(){
    var that = this;
    that.setData({
      show_Name: !that.data.show_Name,
      focus:true
    })
  },
  //触发输入编辑用户名
  bindKeyInput:function(e){
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    wx.setStorageSync('userInfo', userInfo);
    this.setData({
      show_Name: !that.data.show_Name,
      userInfo: {
        nickName: e.detail.value,
        avatarUrl: userInfo.avatarUrl,
      }
    })
    userInfo.nickName = e.detail.value;
    wx.setStorageSync('userInfo', userInfo);
    that.change_data();
  },
  //返回刷新数据
  change_data:function(){
    // 使返回刷新获
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      //prePage.changeData(e.detail.value);
      prePage.changeData();

    }
  }

})