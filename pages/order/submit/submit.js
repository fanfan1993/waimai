// pages/order/submit/submit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {},

  /*** 生命周期函数--监听页面显示*/
  onShow () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () { },

  /** * 页面上拉触底事件的处理函数*/
  onReachBottom () {},
  //跳转商品详情
  jumpShop (e) {
    var that = this;
    //var index = e.currentTarget.dataset.index;
   // var shop_id = that.data.restaurant[index].id;
    var shop_id =20;
    wx.navigateTo({
      url: '/pages/shop/shop/shop?shop_id=' + shop_id
    })
  },
  //去支付
  gotoPay(){
    wx.navigateTo({
      //url: '/pages/pay/index/index'
      url: '/pages/order/refund/refund'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})