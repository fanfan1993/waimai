// pages/order/list/list.js
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order:[],
    page:0, //分页
    hasMore:true,
    showLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var order=[
      {
        price: 15,
        name: "米饭",
        sales: 1161,
        status: false,
        order_tag: "已完成",
        time: 30
      }
    ];
    that.loadData();
  console.log(that.data);
  },
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
      order: [],
      hasMore: true
    })
    this.fetchData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  toShopIndex: function (e) {
    //跳转带有tab的用这个switchTab
    var that = this;
    var index = e.currentTarget.dataset.index;
    var shop_id = that.data.order[index].shop_id;
    wx.navigateTo({
      url: '/pages/shop/shop/shop?shop_id=' + shop_id
    })
  },
  fetchData: function () {
    let _this = this;
    const perpage = 10;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    if (_this.data.order.length >= 40) {
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
        newlist.push(
          {
            price: i+1,
            name: "正新鸡排",
            sales: 1161,
            status: true,
            order_tag: "待付款",
            time: 30,
            shop_id:i+1,
          },
          {
            price: 15,
            name: "美味的奶酪",
            sales: 1161,
            status: false,
            order_tag: "已完成",
            time: 30,
            shop_id: i + 1,
          }
        )
      }

      setTimeout(() => {
        _this.setData({
          order: _this.data.order.concat(newlist),
          hasMore: true
        })
      }, 1500)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})