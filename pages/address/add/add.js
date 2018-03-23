
var Bmob = require('../../../utils/bmob.js');
var WxNotificationCenter = require('../../../utils/WxNotificationCenter.js');
var that;

Page({
  data: {
    area:"",
    items: [
      { name: 'home', value: '家' },
      { name: 'company', value: '公司', checked: 'true' },
      { name: 'school', value: '学校' },
    ]
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  onLoad: function (options) {
    that = this;
    // 注册通知
    WxNotificationCenter.addNotification("poiSelectedNotification", that.getAddress, that);
    // 属于编辑状态
    if (options.objectId) {
      that.loadAddress(options.objectId);
      that.setData({
        isEdit: true
      });
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加地址'
      })
    }
  },
  selectAddress: function () {
    console.log('tapped')
    // 跳转选择poi
    wx.navigateTo({
      url: '../search/search'
    });
  },
  getAddress: function (area, lat, lng) {
    // 选择poi地址回调
    that.setData({
      area: area,
      lat: lat,
      lng: lng,
    });
    console.log(that.data);
  },
  add: function (e) {
    var form = e.detail.value;
    // console.log(form);
    // 表单验证
    if (form.realname == '') {
      wx.showModal({
        title: '请填写收件人姓名',
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

    if (form.detail == '') {
      wx.showModal({
        title: '请填写详细地址',
        showCancel: false
      });
      return;
    }

    form.gender = parseInt(form.gender);
    form.user = Bmob.User.current();
    var address = new Bmob.Object('Address');
    // 是否处在编辑状态
    if (that.data.isEdit) {
      address = that.data.address;
    }
    address.save(form).then(function (res) {
      // console.log(res)
      wx.showModal({
        title: '保存成功',
        showCancel: false,
        success: function () {
          wx.navigateBack();
        }
      });
    }, function (res) {
      // console.log(res)
      wx.showModal({
        title: '保存失败',
        showCancel: false
      });
    });
  },
  loadAddress: function (objectId) {
    var query = new Bmob.Query('Address');
    // query.get(objectId).then(function (addressObject) {
    //   that.setData({
    //       address: addressObject
    //   });
    // });
    var addressList =
      {
        id: "3",
        realname:"金木",
        area: "美丽的武林广场",
        gender: 0,
        mobile: "13358588354",
        detail: "门牌号001号",
        name: 'school',
        defalut: false
      }
      that.data.items.forEach(function (value, index) {
        if (value.name == addressList.name) {
          that.data.items[index].checked = true
        }else{
          that.data.items[index].checked = false
        }
        that.setData({
          items: that.data.items,
          address: addressList
        });
      })
    console.log(that.data.address)
  },
  cancel: function () {
    if (that.data.area!=""){
      wx.navigateBack({ delta: 2 });
    }else{
      wx.navigateBack({ delta: 1 });
    }
   
    // wx.redirectTo({
    //   url: '../list/list'
    // });
  },
  delete: function () {
    // 确认删除对话框
    wx.showModal({
      title: '确认删除',
      success: function (res) {
        if (res.confirm) {
          var address = that.data.address;
          address.destroy().then(function (result) {
            wx.showModal({
              title: '删除成功',
              showCancel: false,
              success: function () {
                wx.navigateBack();
              }
            });
          });
        }
      }
    });

  }
})