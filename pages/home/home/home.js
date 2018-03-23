// pages/home/home/home.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var Bmob = require('../../../utils/bmob.js');
var util = require('../../../utils/util.js');
var WxNotificationCenter = require('../../../utils/WxNotificationCenter.js');
// 获取应用实例
let app = getApp();
var that;
var qqmapsdk;
var loginStatus = true;
Page({
  /* 页面的初始数据*/
  data: {
    hasMore: true,
    page: 0,  //分页
    hasUserInfo: false,
    restaurant: [],
    address: {},
    distance_data: []
  },
  onLoad(options) {
    that = this;
    new app.WeToast();//弹出
    // 注册通知
    WxNotificationCenter.addNotification("poiSelectedNotification", that.getAddress, that);
    wx.setNavigationBarTitle({
      title: '首页'
    })
    //调数据
    //util.wxLogin();
    that.wxLogin();
  },
  reloadCurrent() {
    that.setData({
      area: '正在定位中...',
    });
    // 调用接口
    qqmapsdk.reverseGeocoder({
      poi_options: 'policy=2',
      get_poi: 1,
      success: function (res) {
        // 渲染给页面
        that.setData({
          area: res.result.formatted_addresses.recommend,
          lat: res.result.location.lat,
          lng: res.result.location.lng,
          address: {
            area: res.result.formatted_addresses.recommend,
            lat: res.result.location.lat,
            lng: res.result.location.lng,
          },
        });
        wx.setStorageSync('location', that.data.address)
        setTimeout(() => {
          that.change_address();
        }, 1500)

      },
      fail: function (res) {
        //         console.log(res);
      },
      complete: function (res) {
        //         console.log(res);
      }
    });
  },
  getAddress (area, lat, lng) {
    console.log(area);
    // 选择poi地址回调
    that.setData({
      area: area,
      lat: lat,
      lng: lng,
    });
    console.log(that.data);
  },
  loadData () {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    this.setData({
      page: 0,
      restaurant: [],
      address: {},
      location: {},
      hasMore: true
    })
    this.fetchData();
    wx.request({
      url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/filter",
      method: "GET",
      success: function (res) {
        // that.setData({
        //   restaurant: res.data.data.restaurant,
        // })
        //console.log(res.data.data.restaurant)
      }
    });

    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)

  },
  onShow () {

  },
  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {
    //this.test();
    this.loadData();
    //this.getPromission();
  },
  /** 页面上拉触底事件的处理函数*/
  onReachBottom() {
  },
  //跳转商品详情
  jumpShop(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var shop_id = that.data.restaurant[index].id;
    if (that.data.hasUserInfo) {
      wx.navigateTo({
        url: '/pages/shop/shop/shop?shop_id=' + shop_id
      })
    } else {
      that.wetoast.toast({
        title: '请您先授权用户',
        duration: 500
      })
    }
  },
  //选择地址跳转
  choose_address() {
    //是否获取用户授权
    var location = wx.getStorageSync('location');
    if (location) {
      wx.navigateTo({
        url: '/pages/home/position/position'
      })
    } else {
      this.getAddressPromisson();
    }

  },
  //改变地址
  change_address() {
    var that = this;
    that.setData({
      location: wx.getStorageSync('location')
    })
  },
  test() {
    wx.setNavigationBarTitle({ title: '首页' });
    wx.showNavigationBarLoading();
    setTimeout(function () { wx.hideNavigationBarLoading(); }, 3000);
  },
  // 加载数据列表
  getDistance(data) {
    return new Promise((resolve) => {
      // const latitude = data.split(',')
      const latitude = [
        {
          lat: '30.2872', long: '120.0602'
        },
        {
          lat: '32.3872', long: '150.0602'
        },
      ]
      for (var i = 0; i < latitude.length; i++) {
        qqmapsdk.calculateDistance({
          to: [{
            latitude: latitude[i].lat,
            longitude: latitude[i].long
          }],
          success(res) {
            const distance = Math.floor(res.result.elements[0].distance / 1000 * 100) / 100
            resolve(distance)
            console.log(distance)
          },
          fail() {
            resolve('')
          }
        })

      };

    })
  },
  fetchData() {
    let _this = this;
    const perpage = 10;
    //是否获取用户授权
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
      if (_this.data.restaurant.length >= 20) {
        _this.setData({
          hasMore: false
        })
      } else {
        //没有内容了
        this.setData({
          page: this.data.page + 1
        })
        const page = this.data.page;

        _this.data.restaurant = [
          {
            distance: "1.5km",
            distribution_price: 0,
            initial_price: 20,
            name: "正新鸡排",
            sales: 1161,
            src: "http://i4.piimg.com/601998/a88338a6d392a569.jpg",
            star: 5,
            time: 30,
            id: 10,
            address: "浙江省杭州市西湖区",
            lat: 30.2857,
            long: 120.8457,
            service_radius: 10
          },
          {
            name: "正新鸡排", distance: "3.5km", src: "http://i4.piimg.com/601998/a88338a6d392a569.jpg", time: 50, address: "浙江省杭州市西湖区", id: 11, lat: 32.2857, long: 121.8457, service_radius: 5
          },

          {
            name: "板凳烧烤", distance: "3.1km", src: "http://i4.piimg.com/601998/473847a250bb0186.jpg", time: 35, address: "浙江省杭州市西湖区", id: 12, lat: 31.2857, long: 120.8457, service_radius: 6
          },

          { name: "味多美炸鸡", src: "http://i4.piimg.com/601998/a014d6160fd7b504.jpg", distance: "1.5km", time: 20, address: "浙江省杭州市西湖区", id: 13, lat: 30.1857, long: 120.8457, service_radius: 2 },

          { name: "精武鸭脖", distance: "2.6km", src: "http://i4.piimg.com/601998/23f361491b45ddf2.jpg", time: 40, address: "浙江省杭州市西湖区", id: 14, lat: 30.2657, long: 120.8457, service_radius: 20 },

          { name: "御膳房", src: "http://i2.kiimg.com/601998/a955867016875a41.jpg", distance: "1.5km", time: 42, address: "浙江省杭州市西湖区", id: 15, lat: 30.1887, long: 120.4457, service_radius: 6 },

          { name: "韩式炸鸡啤", distance: "160m", src: "http://i4.piimg.com/601998/9ce47f2f19d7717d.jpg", time: 46, address: "浙江省杭州市西湖区", id: 16, lat: 36.1887, long: 125.4457, service_radius: 40 },

          { name: "榴芒先生", distance: "6.0km", src: "http://i4.piimg.com/601998/da9e00c0bccd6fb0.jpg", time: 26, address: "浙江省杭州市西湖区", id: 17, lat: 34.1887, long: 120.4457, service_radius: 30 }
        ]
        qqmapsdk = new QQMapWX({
          //key: 'BJFBZ-ZFTHW-Y2HRO-RL2UZ-M6EC3-GMF4U'
          key: 'GNABZ-BVYKX-VUH4N-7FQUU-DLSZ7-WIFCT'
        });
        that.reloadCurrent();
        setTimeout(() => {
          _this.setData({
            location: wx.getStorageSync('location'),
            restaurant: _this.data.restaurant,
            hasMore: true
          })
        }, 1500)
      }
    } else {
      //that.reloadCurrent();
    }


  },
  //获取用户登入
  changeData() {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      that.setData({
        hasUserInfo: true
      })
    } else {
      that.setData({
        hasUserInfo: false
      })
    }

  },
  //用户登录接口
  wxLogin() {
    if (!loginStatus) {
      wx.openSetting({
        success: function (data) {
          if (data) {
            if (data.authSetting["scope.userInfo"] == true) {
              loginStatus = true;
              wx.getUserInfo({
                withCredentials: false,
                success: function (data) {
                  var userInfo = data.userInfo;
                  userInfo = {
                    nickName: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl,
                  };
                  wx.setStorageSync('userInfo', userInfo);
                  that.fetchData();//再次加载数据
                },
                fail: function () {
                  console.info("2授权失败返回数据");
                }
              });
            }
          }
        },
        fail: function () {
          console.info("设置失败返回数据");
        }
      });
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              withCredentials: false,
              success: function (data) {
                console.info("1成功获取用户返回数据");
                var userInfo = data.userInfo;
                userInfo = {
                  nickName: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl,
                };
                wx.setStorageSync('userInfo', userInfo);
                that.fetchData();//再次加载数据
                that.changeData();
              },
              fail: function () {
                console.info("1授权失败返回数据");
                loginStatus = false;

                // setTimeout(() => {
                //   that.getPromission();
                // }, 0.001)         
                // that.wetoast.toast({
                //   title: '您点击了拒绝授权',
                //   duration: 500
                // })
                //显示提示弹窗
                wx.showModal({
                  title: '用户未授权',
                  content: '您点击了拒绝授权,将无法正常使用小程序功能。如需正常，请按确定并在【设置】页面中点击授权按钮',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      setTimeout(() => {
                        that.getPromission();
                      }, 0.001)
                    }
                  }
                });

              }
            });
          }
        },
        fail: function () {
          console.info("登录失败返回数据");
        }
      });
    }
  },
  //用户再次授权
  getPromission() {
    wx.openSetting({
      success: function (data) {
        if (data) {
          if (data.authSetting["scope.userInfo"] == true) {
            //loginStatus = true;
            wx.getUserInfo({
              withCredentials: false,
              success: function (data) {
                var userInfo = data.userInfo;
                userInfo = {
                  nickName: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl,
                };
                wx.setStorageSync('userInfo', userInfo);
                that.fetchData();//再次加载数据
                that.changeData();

              },
              fail: function () {
                console.info("2授权失败返回数据");
              }
            });
          } else {
            // 显示提示弹窗
            wx.showModal({
              title: '用户未授权',
              content: '您未点击授权按钮，将无法正常使用小程序功能。如需正常，请按确定并在【设置】页面中点击授权按钮。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  setTimeout(() => {
                    that.getPromission();
                  }, 0.001)
                }
              }
            });

          }
        }
      },
      fail: function () {
        console.info("设置失败返回数据");
      }
    });
  },
  //地址再次授权
  getAddressPromisson() {
    wx.openSetting({
      success: function (data) {
        if (data) {
          //用户授权
          if (data.authSetting["scope.userInfo"] == true) {
            //loginStatus = true;
            wx.getUserInfo({
              withCredentials: false,
              success: function (data) {
                var userInfo = data.userInfo;
                userInfo = {
                  nickName: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl,
                };
                wx.setStorageSync('userInfo', userInfo);
                that.fetchData();//再次加载数据
                that.changeData();
              },
              fail: function () {
                console.info("2授权失败返回数据");
              }
            });
          } else {
            wx.removeStorageSync('userInfo');
            that.changeData();
            // 显示提示弹窗
            wx.showModal({
              title: '用户未授权',
              content: '您拒绝用户授权，将无法正常使用小程序功能。如需正常，请按确定并在【设置】页面中点击授权按钮。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.getAddressPromisson();
                }
              }
            });
          }
          //地址授权
          if (data.authSetting["scope.userLocation"] == true) {
            //loginStatus = true;
            wx.getUserInfo({
              withCredentials: false,
              success: function (data) {
                //that.fetchData();//再次加载数据
                that.reloadCurrent();
              },
              fail: function () {
                console.info("2授权失败返回数据");
              }
            });
          } else {
            // 显示提示弹窗
            wx.showModal({
              title: '地址未授权',
              content: '您未授权地址，将无法正常使用小程序功能。如需正常，请按确定并在【设置】页面中点击授权按钮。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.getAddressPromisson()
                }
              }
            });
          }
        }
      },
      fail: function () {
        console.info("设置失败返回数据");
      }
    });
  }
})