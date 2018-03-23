// pages/order/refund/refund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRefund:true,
    selectRefund:"",
    isTouch:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /*** 生命周期函数--监听页面显示*/
  onShow () {},
  /*** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh () {},
  /*** 页面上拉触底事件的处理函数*/
  onReachBottom () {},
  //点击选择退款原因
  clickRefund(){
    var that=this;
    that.setData({
      showRefund: !that.data.showRefund
    });
  },
  //选择原因
  mySelect(e){
    var that = this;
    var name = e.currentTarget.dataset.me;
    that.setData({
      selectRefund: name,
      showRefund: !that.data.showRefund
    });
  },
  //触碰
  touchSelect(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    that.setData({
      isTouch: id
    });
  },
  changeInput(e){
    console.log(e.detail.value)
  },
  /** * 用户点击右上角分享 */
  onShareAppMessage: function () {}
})