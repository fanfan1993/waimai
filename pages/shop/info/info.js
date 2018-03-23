// pages/shop/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 属于编辑状态
    this.loadData();
    if (options.shop_id){
      //that.loadAddress(options.shop_id);
      // that.setData({
      //   isEdit: true
      // });
      wx.setNavigationBarTitle({
        title: '门店详情'
      })
    } 
  },
  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    this.loadData();
  },
  //跳转个人中心
  junpToUser:function(){
    //跳转带有tab的用这个switchTab
    wx.switchTab({
      url: '/pages/my/index/index'
      //url: '/pages/my/index/index?shop_id=' + shop_id
    });
  },
  //返回点餐
  backToShop: function () {
    wx.navigateBack(1);
  },
  //加载页面动画
  loadData: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})