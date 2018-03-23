// pages/home/index/index.js
var amapGaoDe = require('../../../libs/amap-wx.js');
var markersData = [];
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {}
  },
  makertap: function (e) {
    var id = e.markerId;
    var that = this;
    //that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
  },
  onLoad: function () {
    var that = this;
    var myAmapFun = new amapGaoDe.AMapWX({ key: '82ce66910de0fd8dc03dc80870bd7226' });
    myAmapFun.getPoiAround({
      //iconPathSelected: '/images/location.png', //如： 选中 marker 图标的相对路径
      //iconPath: '­­/images/location.png', //如：..­/..­/img/marker.png 未选中 marker 图标的相对路径
      success: function (data) {
        markersData = data.markers;
        console.log(markersData)
        that.setData({
          markers: markersData
        });
        that.setData({
          latitude: markersData[0].latitude
        });
        that.setData({
          longitude: markersData[0].longitude
        });
        that.showMarkerInfo(markersData, 0);
      },
      fail: function (info) {
        wx.showModal({ title: info.errMsg })
      }
    })
  },
  controltap: function (e) {
    console.log(e);
    var that = this;
    wx.openLocation({
      latitude: e.target.dataset.latitude,
      longitude: e.target.dataset.longitude,
      name: e.target.dataset.name,
      address: e.target.dataset.address
    })

  },
  showMarkerInfo: function (data, i) {
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        data[j].iconPath = "/images/location.png"; //如：..­/..­/img/marker_checked.png 选中 marker 图标的相对路径
      } else {
        data[j].iconPath = "/images/location.png"; //如：..­/..­/img/marker.png未选中 marker 图标的相对路径
      }
      markers.push(data[j]);
    }
    that.setData({
      markers: markers
    });
  }
})