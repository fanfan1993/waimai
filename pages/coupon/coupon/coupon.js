// pages/coupon/coupon/coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon: [],
    hasMore: true,
    page: 0  //分页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //that.loadData();
    that.fetchData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadData();
  },
  /** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    this.fetchData();
  },
  //加载页面动画
  loadData: function () {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    this.setData({
      page: 0,
      coupon: [],
      hasMore: true
    })
    this.fetchData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  toShopIndex: function () {
    //跳转带有tab的用这个switchTab
    wx.switchTab({
      url: '/pages/home/home/home'
      //url: '/pages/my/index/index?shop_id=' + shop_id
    });

  },
  fetchData: function () {
    let _this = this;
    const perpage = 10;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    if (_this.data.coupon.length >= 20) {
      _this.setData({
        hasMore: false
      })
    } else {
      //没有内容了
      this.setData({
        page: this.data.page + 1
      })
      const page = this.data.page;
      const newlist = [];
      for (var i = (page - 1) * perpage; i < page * perpage; i++) {
        newlist.push({
          amount: 42,
          condition_limit: i + 1,
          expire_time_show: "已过期",
          id: "45",
          mobile: "18867792018",
          title: "我的优惠券",
          use_end_time: "2017-12-08 23:55:56",
        })
      }

      setTimeout(() => {
        _this.setData({
          coupon: _this.data.coupon.concat(newlist),
          hasMore: true
        })
      }, 1500)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})