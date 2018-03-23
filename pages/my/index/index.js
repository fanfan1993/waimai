
var Bmob = require('../../../utils/bmob.js');
var that;
// 获取应用实例
let app = getApp();
Page({
  data:{

  },
  onLoad (options) {
    that = this;
    that.loadData();
    new app.WeToast();//弹出
    // wx.getUserInfo({
    //   success: function (res) {
    //     var userInfo = res.userInfo;
    //     that.setData({
    //       userInfo:{
    //         nickName: userInfo.nickName,
    //         avatarUrl: userInfo.avatarUrl,
    //       }
    //     })
    //     wx.setStorageSync('userInfo', that.data.userInfo);
    //   }, fail: function () {
    //     wx.showModal({
    //       title: '警告',
    //       content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
    //       success: function (res) {
    //         if (res.confirm) {
    //           wx.openSetting({
    //             success: (res) => {
    //               if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
    //                 wx.getUserInfo({
    //                   success: function (res) {
    //                     var userInfo = res.userInfo;
    //                     that.setData({
    //                       nickName: userInfo.nickName,
    //                       avatarUrl: userInfo.avatarUrl,
    //                     })
    //                   }
    //                 })
    //               }
    //             }, fail: function (res) {

    //             }
    //           })

    //         }
    //       }
    //     })
    //   }, complete: function (res) {
    //   }
    // })
    // wx.login({
    //   success: function (res) {
    //     if (res.code) {
    //       //获取openId
    //       wx.request({
    //         url: 'https://api.weixin.qq.com/sns/jscode2session',
    //         data: {
    //           　　　　　　　//小程序唯一标识
    //           appid: '',
    //           //小程序的 app secret
    //           secret: '',
    //           grant_type: 'authorization_code',
    //           js_code: res.code
    //         },
    //         method: 'GET',
    //         header: { 'content-type': 'application/json' },
    //         success: function (openIdRes) {
    //           console.info("登录成功返回的openId：" + openIdRes.data.openid);
    //           weChatUserInfo.openId = openIdRes.data.openid;
    //           // 判断openId是否获取成功
    //           if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
    //             　　　　　　　　// 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
    //             wx.getUserInfo({
    //               success: function (data) {
    //                 // 自定义操作
    //                 // 绑定数据，渲染页面
    //                 that.setData({

    //                 });
    //               },
    //               fail: function (failData) {
    //                 console.info("用户拒绝授权");
    //               }
    //             });
    //           } else {
    //             console.info("获取用户openId失败");
    //           }
    //         },
    //         fail: function (error) {
    //           console.info("获取用户openId失败");
    //           console.info(error);
    //         }
    //       })
    //     }
    //   }
    // });
  },
  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh(){
    that.loadData();
  },
	logout () {
		// 确认退出登录
		wx.showModal({
			title: '确定退出登录',
			success: function (res) {
				if (res.confirm) {
					// 退出操作
					Bmob.User.logOut();
					that.setData({
						user: Bmob.User.current()
					});
				}
			}
		});
	},
  onShow () {
    var that = this;
    userInfo: wx.getStorageSync('userInfo');
  },
  changeData(){
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
      }
    })
  },
  //加载页面动画
  loadData () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    that.changeData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  //跳转页面
  jumpTo(e) {
    const that = this;
    const id = e.currentTarget.dataset.id;
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      switch (id) {
        case '1':
          wx.navigateTo({
            url: '/pages/order/list/list'
          })
          break;
        case '2':
          wx.navigateTo({
            url: '/pages/coupon/coupon/coupon'
          })
          break;
        case '3':
          wx.navigateTo({
            url: '/pages/address/list/list'
          })
          break;
        case '4':
          wx.navigateTo({
            url: '/pages/my/info/info'
          })
          break;
      }
     
    } else {
      that.wetoast.toast({
        title: '请您先授权用户',
        duration: 500
      })
    }
  }
}) 