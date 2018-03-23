/**
 * @author jinmu
 */

var Bmob = require('../../../utils/bmob.js');
var WxNotificationCenter = require('../../../utils/WxNotificationCenter.js');

var that;

Page({
  data: {
    visual: false,
    addressList: [
      {
        id: "1",
        realname: "杭州市城西银泰",
        gender: 1,
        mobile: "18358588354",
        detail: "门牌号120号",
        defalut: true
      },
      {
        id: "2",
        realname: "杭州市郡原里",
        gender: 0,
        mobile: "13358588354",
        detail: "门牌号110号",
        defalut: false
      },
      {
        id: "3",
        realname: "美丽的武林广场",
        gender: 0,
        mobile: "13358588354",
        detail: "门牌号001号",
        defalut: false
      }
    ]
  },
  onLoad: function (options) {
    that = this;
    visual: (options.visual == "true" ? true : false)
    if (options.isSwitchAddress) {
      that.setData({
        isSwitchAddress: true

      });
    }
  },
  onShow: function () {
    that.getAddress();
  },
  add: function () {
    wx.navigateTo({
      url: '/pages/address/add/add'
    });
  },
  getAddress: function () {
    var query = new Bmob.Query('Address');
    query.equalTo('user', Bmob.User.current());
    query.limit(Number.MAX_VALUE);
    // query.find().then(function (results) {
    // 	that.setData({
    // 		addressList: results,
    // 		visual: results.length ? 'hidden' : 'show'
    // 	});
    // });
    that.setData({
      addressList: this.data.addressList,
      visual: this.data.addressList.length ? false : true
    });
    console.log(this.data.visual)
  },
  edit: function (e) {
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.addressList[index].id;
    wx.navigateTo({
      url: '/pages/address/add/add?objectId=' + objectId
    })
  },
  del: function (e) {
    var id = e.currentTarget.dataset.id;
    //var objectId = that.data.addressList[index].id;
    that.data.addressList.forEach(function (value, index) {
      if (value.id == id) {
        that.data.addressList.splice(index, 1);
        that.setData({
          addressList: that.data.addressList,
          visual: that.data.addressList.length ? false : true
        });
      }
    });
  },
  selectAddress: function (e) {
    if (!that.data.isSwitchAddress) {
      return;
    }
    var index = e.currentTarget.dataset.index;
    WxNotificationCenter.postNotificationName("addressSelectedNotification", that.data.addressList[index].id);
    wx.navigateBack();
  },
  set_defalut: function (e) {

    var id = e.currentTarget.dataset.id;
    that.data.addressList.forEach(function (value, index) {
      if (value.id == id) {
        console.log(value);
        that.data.addressList[index].defalut = true;
        that.setData({
          addressList: that.data.addressList,
        });
        console.log(that.data.addressList)
      } else {
        that.data.addressList[index].defalut = false;
        that.setData({
          addressList: that.data.addressList,
        });
      }
    });

  }

})