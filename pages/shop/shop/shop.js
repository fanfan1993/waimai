// 获取到小程序实例
var app = getApp();
var that;
Page({
  data: {
    page: 0, //分页
    currentPage: 0,//swiper ID
    swiperTitle: [
      {
        text: "商品",
        id: 1
      },
      {
        text: "评价",
        id: 2
      }],
    commentTitle: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    tabArr: {
      curBdIndex: 1
    },
    shop: {
      name: '',
      desc: '',
      shop_id: "",
      carry_time:"45",
      activity: [],
      stat_price: '0',
      full_price: "0"
    },
    commentArr: [],
    allGood: [],
  
    goodsList:[],
    cart: {
      count: 0,
      total: 0,
      list: {}
    },
    cartList: { list: [] },
    showCartDetail: false,
    showSkuDetail: false,
    showGoodDetail:false,
    comment_hasMore: true,
    showMoreActivity: true
  },
  // 生命周期函数--监听页面加载
  // 一个页面只会调用一次。
  onLoad(options) {
    var that = this;
    new app.WeToast();//弹出
    if (options.shop_id) {
      this.data.shop.shop_id = options.shop_id;
      for (var i = 0; i < this.data.goodsList.length; i++) {
        for (var j = 0; j < this.data.goodsList[i].item.length; j++) {
          for (var k = 0; k < this.data.goodsList[i].item[j].sku_list.length; k++) {
            if (k == 0) {
              this.data.goodsList[i].item[j].sku_list[k].is_active = true;
              this.data.goodsList[i].item[j].sku_list[k].num = 0;
            } else {
              this.data.goodsList[i].item[j].sku_list[k].is_active = false;
              this.data.goodsList[i].item[j].sku_list[k].num = 0;
            }
          }

        }
      }

      that.setData({
        goodsList: this.data.goodsList,
        shop: this.data.shop,
      });
    }
    //that.loadData();
    that.fetchCommentData();
    that.fetchData();
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady() { },
  // 每次打开页面都会调用一次
  onShow() {
    for (var i = 0; i < this.data.goodsList.length; i++) {
      for (var j = 0; j < this.data.goodsList[i].item.length; j++) {
        var newGood = {};
        newGood = this.data.goodsList[i].item[j];
        this.data.allGood.push(newGood);

        for (var k = 0; k < this.data.goodsList[i].item[j].sku_list.length; k++) {
          if (k == 0) {
            this.data.goodsList[i].item[j].sku_list[k].is_active = true;
          } else {
            this.data.goodsList[i].item[j].sku_list[k].is_active = false;
          }
        }

      }
    }
    var newList = [];
    this.data.allGood.forEach(function (data) {
      for (var i = 0; i < newList.length; i++) {
        if (newList[i].id === data.id) {
          newList[i].add++;
          return;
        }
      }
      newList.push({
        id: data.id,
        name: data.name,
        pic: data.pic,
        num: data.num,
        price: data.price,
        sold: data.sold,
        title: data.label,
        promo_limit_buy: data.promo_limit_buy,
        promo_setting: data.promo_setting,
        add: 1,
        sku_type: data.sku_type,
        sku_list: data.sku_list
      });
    });
    this.data.allGood = newList;

    this.setData({
      allGood: newList,
      classifySeleted: this.data.goodsList[0].id
    });
    console.log(this.data.allGood)
  },
  // 当navigateTo或底部tab切换时调用
  onHide() { },
  // 生命周期函数--监听页面卸载
  // 当redirectTo或navigateBack的时候调用。
  onUnload() { },
  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {
    this.loadData();
  },
  // 页面上拉触底事件的处理函数
  onReachBottom() {
    //this.fetchCommentData();
  },
  //评论滑动拉触底
  lower() {
    this.fetchCommentData();
  },
  //评论滑动到顶部
  upper(){
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    this.setData({
      page: 0,
      commentArr: [],
      comment_hasMore: true
    })
    this.fetchCommentData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  //  object 参数中，在页面的函数中用 this 可以访问
  //点击左边的分类
  checkOrderSame(id) {
    var list = this.data.goods;
    for (var index in list) {
      if (list[index].id === id) {
        return index;
      }
    }
    return false;
  },
  //点击顶部swiper的分类
  turnPage(e) {
    var dataId = e.currentTarget.dataset.id;
    var obj = {};
    obj.curBdIndex = dataId;
    this.setData({
      tabArr: obj,
      currentPage: e.currentTarget.dataset.index
    })
  },
  //多规格打开弹框按钮选择
  chooseSku(e) {
    var id = e.target.dataset.id;
    var title = e.target.dataset.name;
    var sku_list = e.target.dataset.sku;
    var skuArr = {
    };
    skuArr.id = id;
    skuArr.title = title;
    skuArr.sku_list = sku_list;
    this.setData({
      sku: skuArr,
      showSkuDetail: !this.data.showSkuDetail
    })
  },
  //多规格选择
  changeSku(e) {
    var that = this;
    var id = e.target.dataset.attr_ids;
    var index = e.target.dataset.index;

    for (var i = 0; i < that.data.sku.sku_list.length; i++) {
      if (index == i) {
        that.data.sku.sku_list[i].is_active = true;
      } else {
        that.data.sku.sku_list[i].is_active = false;
      }
    }
    this.setData({
      sku: that.data.sku
    })
  },
  //隐藏多规格弹框
  hideSkuDetail() {
    this.setData({
      showSkuDetail: !this.data.showSkuDetail
    })
  },
  //展现商品详情弹框
  showGoodDetail(e){  
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.name;
    var sold = e.currentTarget.dataset.sold;
    var sku_list = e.currentTarget.dataset.sku;
    var skuArr = {
    };
    skuArr.id = id;
    skuArr.title = title;
    skuArr.sold = sold;
    skuArr.sku_list = sku_list;
    console.log(skuArr)
    this.setData({
      sku: skuArr,
      showGoodDetail: !this.data.showGoodDetail
    })
  },
  hideGoodDetail(){
    this.setData({
      showGoodDetail: !this.data.showGoodDetail
    })
  },
  //切换展现和隐藏活动更多
  toggleActivity() {
    if (this.data.shop.activity.length > 1) {
      this.setData({
        showMoreActivity: !this.data.showMoreActivity
      })
    }
  },
  tapAddCart(e) {
    if (e.currentTarget.dataset.id != undefined) {
      this.addCart(e.currentTarget.dataset.name, e.currentTarget.dataset.id, e.currentTarget.dataset.attr_ids);
    }
  },
  tapReduceCart(e) {
    if (e.currentTarget.dataset.id != undefined) {
      this.reduceCart(e.currentTarget.dataset.name, e.currentTarget.dataset.id, e.currentTarget.dataset.attr_ids);
    }
  },
  addCart(name, id, attr_ids) {
    var count = 0;
    var sku_type = "";
    var cart_num = this.data.cart.list[id + '-' + attr_ids] || 0;

    //数据的数量发送变化
    for (var i = 0; i < this.data.goodsList.length; i++) {
      for (var j = 0; j < this.data.goodsList[i].item.length; j++) {
        if (id == this.data.goodsList[i].item[j].id) {
          //多规格判断
          sku_type = this.data.goodsList[i].item[j].sku_type;
          for (var k = 0; k < this.data.goodsList[i].item[j].sku_list.length; k++) {
            if (attr_ids == this.data.goodsList[i].item[j].sku_list[k].attr_ids) {
              var img = this.data.goodsList[i].item[j].pic;
              var use_stock_num = this.data.goodsList[i].item[j].sku_list[k].use_stock_num;
              var num = this.data.goodsList[i].item[j].sku_list[k].num;
              if (num >= use_stock_num) {
                this.wetoast.toast({
                  title: '库存不足',
                  duration: 500
                })
                this.data.goodsList[i].item[j].sku_list[k].num = num;
                return false;
              } else {
                this.data.goodsList[i].item[j].sku_list[k].num = num + 1;
                this.data.cart.list[id + '-' + attr_ids] = cart_num + 1;
              }

            }
          }
        }
      }
    }

    //多规格数量
    if (sku_type == "1") {
      if (id = this.data.sku.id) {
        for (var b = 0; b < this.data.sku.sku_list.length; b++) {
          if (attr_ids == this.data.sku.sku_list[b].attr_ids) {
            var sku_num = this.data.sku.sku_list[b].num;
            var stock_num = this.data.sku.sku_list[b].use_stock_num;
            if (sku_num >= stock_num) {
              this.wetoast.toast({
                title: '库存不足',
                duration: 500
              })
              this.data.sku.sku_list[b].num = sku_num;
              return false;
            } else {
              this.data.sku.sku_list[b].num = sku_num + 1;
            }

          }
        }

      }

    }

    this.data.cart.count = count;

    var list = this.data.cartList;
    var sortedList = [];
    var index;
    // if(index = this.checkOrderSame(id)){
    // 	sortedList = list[index];
    // 	var num = this.data.cart.list[id] || 0;
    //   this.data.goodsList[$index].item[id].num = num;
    // 	num = num + 1;

    // }
    // else{
    // 	var order = {
    // 		"price" : price,
    // 		"num" : 1,
    // 		"name": name,
    // 		'img':  img,
    // 		"shopId": this.data.shopId,
    // 		"shopName": this.data.shop.restaurant_name,
    // 		"pay": 0,
    // 	}
    // 	list.push(order);

    // 	sortedList = order;
    // }

    //关闭商品详情弹框
    if (this.data.showGoodDetail){
      this.setData({
        showGoodDetail: !this.data.showGoodDetail
      });
    }
   
    this.setData({
      //cart: this.data.cart,
      cartList: list,
      sku: this.data.sku, //弹出多规格数据
      goodsList: this.data.goodsList
    });
    this.countCart();
  },
  reduceCart(name, id, attr_ids) {
    var sku_type = "";
    //商品数量变化
    for (var i = 0; i < this.data.goodsList.length; i++) {
      for (var j = 0; j < this.data.goodsList[i].item.length; j++) {
        if (id == this.data.goodsList[i].item[j].id) {
          //多规格判断
          sku_type = this.data.goodsList[i].item[j].sku_type;
          for (var k = 0; k < this.data.goodsList[i].item[j].sku_list.length; k++) {
            if (attr_ids == this.data.goodsList[i].item[j].sku_list[k].attr_ids) {
              var num = this.data.goodsList[i].item[j].sku_list[k].num;
              var img = this.data.goodsList[i].item[j].pic;
              if (num <= 1) {
                this.data.goodsList[i].item[j].sku_list[k].num = 0;
                //delete this.data.cart.list[id];
              } else {
                this.data.goodsList[i].item[j].sku_list[k].num = num - 1;
              }
            }

          }
        }
      }
    }

    //多规格数量
    if (sku_type == "1") {
      if (id = this.data.sku.id) {
        for (var b = 0; b < this.data.sku.sku_list.length; b++) {
          if (attr_ids == this.data.sku.sku_list[b].attr_ids) {
            var sku_num = this.data.sku.sku_list[b].num;
            if (sku_num <= 1) {
              this.data.sku.sku_list[b].num = 0;
            } else {
              this.data.sku.sku_list[b].num = sku_num - 1;
            }

          }
        }

      }

    }

    var num = this.data.cart.list[id + '-' + attr_ids] || 0;
    if (num <= 1) {
      for (var i = 0; i < this.data.allGood.length; i++) {
        var f_id = this.data.allGood[i].id;
        for (var j = 0; j < this.data.allGood[i].sku_list.length; j++) {
          var attr_id = this.data.allGood[i].sku_list[j].attr_ids;
          if ((id + '-' + attr_ids) == (f_id + '-' + attr_id)) {
            this.data.allGood[i].sku_list[j].num = 0;
          }
        }
      }
      delete this.data.cart.list[id + '-' + attr_ids];
    } else {
      this.data.cart.list[id + '-' + attr_ids] = num - 1;
    }
    this.setData({
      goodsList: this.data.goodsList,
      sku: this.data.sku, //弹出多规格数据
      allGood: this.data.allGood
    });
    this.countCart();
  },
  //计算下面购物车的列表
  countCart(id, attr_ids) {
    var count = 0,
      total = 0;
    var goods;
    var selectGood = [];
    for (var id in this.data.cart.list) {
      for (var i = 0; i < this.data.allGood.length; i++) {
        //name 赋值
        var good_name = this.data.allGood[i].name;
        var f_id = this.data.allGood[i].id;
        for (var j = 0; j < this.data.allGood[i].sku_list.length; j++) {
          this.data.allGood[i].sku_list[j].name = good_name;
          var attr_ids = this.data.allGood[i].sku_list[j].attr_ids;
          if (id == (f_id + '-' + attr_ids)) {
            this.data.allGood[i].sku_list[j].num = this.data.cart.list[id];
            goods = this.data.allGood[i].sku_list[j];
          }
        }
      }
      count += this.data.cart.list[id];
      total += goods.sale_price * this.data.cart.list[id];
    }


    selectGood.push(goods);

    this.data.cart.count = count;
    this.data.cart.total = total;
    this.setData({
      cart: this.data.cart,
      allGood: this.data.allGood
    });
    // 存储订单页所需要的数据
    wx.setStorage({
      key: 'orderList',
      data: {
        count: this.data.cart.count,
        total: this.data.cart.total,
        list: this.data.cart.list,
      }
    })

  },
  follow() {
    this.setData({
      followed: !this.data.followed
    });
  },
  onGoodsScroll(e) {
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      //隐藏下滑活动
      if (!this.data.showMoreActivity) {
        this.setData({
          showMoreActivity: !this.data.showMoreActivity
        })
      }
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }

    var scale = e.detail.scrollWidth / 570,
      scrollTop = e.detail.scrollTop / scale,
      h = 0,
      classifySeleted,
      len = this.data.goodsList.length;
    this.data.goodsList.forEach(function (classify, i) {
      // var _h = 66 + classify.item.length * (46 * 3 + 20 * 2);
      var _h = 66 + classify.item.length * (202 + 20 * 2);
      // console.log(h - 100 / scale)
      if (scrollTop >= h) {
        classifySeleted = classify.id;
      }
      h += _h;
    });
    this.setData({
      classifySeleted: classifySeleted
    });
  },
  // 左边点击分类切换
  tapClassify(e) {
    var id = e.target.dataset.id;
    this.setData({
      classifyViewed: id
    });
    var self = this;
    setTimeout(function () {
      self.setData({
        classifySeleted: id
      });
    }, 100);
  },
  showCartDetail() {
     //判断多规格弹框是否打开
    if(this.data.showSkuDetail){
      this.setData({
        showSkuDetail: !this.data.showSkuDetail
      });
    }
    //判断商品弹框是否打开
    if (this.data.showGoodDetail) {
      this.setData({
        showGoodDetail: !this.data.showGoodDetail
      });
    }
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
  },
  hideCartDetail() {
    this.setData({
      showCartDetail: false
    });
  },
  //评论切换
  tabFun(e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    var _obj = {};
    //当点击其他地方空白
    if (_datasetId==undefined){
    }else{
      _obj.curHdIndex = _datasetId;
      _obj.curBdIndex = _datasetId;
      this.setData({
        commentTitle: _obj
      });
    }  
  },
  //跳转到店铺详情
  jumpToShop(e) {
    var that = this;
    //var index = e.currentTarget.dataset.index;
    var shop_id = that.data.shop.shop_id;
    wx.navigateTo({
      url: '/pages/shop/info/info?shop_id=' + shop_id
    })
  },
  submit(e) {
    var agrs = JSON.stringify(this.data.cart);
    console.log(agrs)
    wx.navigateTo({
      url: '/pages/order/submit/submit?submit=' + agrs
    })
  },
  //加载页面动画
  loadData() {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  //加载评论信息
  fetchCommentData() {
    //评论数据
    let _this = this;
    const perpage = 5;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    if (_this.data.commentArr.length >= 10) {
      _this.setData({
        comment_hasMore: false
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
            pic: "http://static.waimai.com/mshop/img/avatar.jpg",
            name: "匿名用户",
            shop_comment: "非常满意",
            good_comment: "非常满意",
            time_comment: "2017-11-30 20:03:02",
            phooto_comment: [{
              pic: "http://oydp172vs.bkt.clouddn.com/comment_pic/1512043374714_4704.png"
            },
            {
              pic: "http://oydp172vs.bkt.clouddn.com/comment_pic/1512043374714_4704.png"
            }],
            comment_tag: [
              { name: "干净卫生" }, { name: "分量足" }, { name: "包装精美" }, { name: "非常实惠" },
            ],
            comment_text: "好吃"
          }
        )
      }

      setTimeout(() => {
        _this.setData({
          commentArr: _this.data.commentArr.concat(newlist),
          comment_hasMore: true
        })
      }, 1500)
    }
  },
  //加载商品详情数据
  fetchData(){
    let _this = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    _this.data.shop={
      name: '东京食虫',
      desc: '凡在本店办理会员，一律享受8.8折优惠',
      shop_id: "",
      carry_time: "45",
      stat_price: '200',
      full_price: "600",
      activity:[
        {
          full_dec: true,
          decArr: [
            { full_price: "200", dec_price: "20" },
            { full_price: "100", dec_price: "10" }
          ]
        },
        {
          full_dec: false,
          new_dec_price: "10",
        }
      ]
    }
    _this.data.goodsList= [
      {
        id: 'hot',
        classifyName: '热销',
        goods: [1, 2, 3, 4, 5],
        item: [
          {
            id: 9,
            name: '芝士华',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 102,
            price: 300,
            num: 0,
            sku_type: "1",
            sku_list: [
              {
                id: 10,
                attr_ids: 10,
                attr_names: "黑色",
                sale_price: "105",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              },
              {
                id: 11,
                attr_ids: 11,
                attr_names: "红色",
                sale_price: "100",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              }
            ]
          },
          {
            id: 8,
            name: '尊尼获加',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 124,
            price: 220,
            num: 0,
            sku_type: "0",
            promo_limit_buy:"6",
            promo_setting:{
              dec_input:"0.5",
              discount_name:"打折",
            },
            sku_list: [
              {
                id: 14,
                attr_ids: 14,
                attr_names: "冷的",
                sale_price: "120",
                use_stock_num: "10",
                box_fee: "20",
                num: 0,
              }
            ]
          },
          {
            id: 1,
            name: '果盘3',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 1014,
            price: 120,
            num: 0,
            sku_type: "1",
            sku_list: [
              {
                id: 12,
                attr_ids: 12,
                attr_names: "M",
                sale_price: "120",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              },
              {
                id: 13,
                attr_ids: 13,
                attr_names: "L",
                sale_price: "110",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              }
            ]
          },
          {
            id: 5,
            name: '果盘1',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 1029,
            price: 130,
            num: 0,
            sku_type: "0",
            sku_list: [
              {
                id: 15,
                attr_ids: 15,
                attr_names: "冷的",
                sale_price: "120",
                use_stock_num: "10",
                box_fee: "5",
                num: 0,
              }
            ]
          }
        ]
      },
      {
        id: 'new',
        classifyName: '小吃',
        goods: [1, 3],
        item: [
          {
            id: 3,
            name: '方便面',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 1030,
            price: 5,
            num: 0,
            sku_type: "0",
            sku_list: [
              {
                id: 13,
                attr_ids: 13,
                attr_names: "小桶",
                sale_price: "120",
                use_stock_num: "4",
                box_fee: "10",
                num: 0,
              }
            ]
          },
          {
            id: 1,
            name: '果盘3',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 1014,
            price: 120,
            num: 0,
            sku_type: "1",
            sku_list: [
              {
                id: 12,
                attr_ids: 12,
                attr_names: "M",
                sale_price: "120",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              },
              {
                id: 13,
                attr_ids: 13,
                attr_names: "L",
                sale_price: "110",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              }
            ]
          },

        ]
      },
      {
        id: 'vegetable',
        classifyName: '果盘',
        goods: [1, 5],
        item: [
          {
            id: 1,
            name: '果盘3',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 1014,
            price: 120,
            num: 0,
            sku_type: "1",
            sku_list: [
              {
                id: 12,
                attr_ids: 12,
                attr_names: "M",
                sale_price: "120",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              },
              {
                id: 13,
                attr_ids: 13,
                attr_names: "L",
                sale_price: "110",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              }
            ]
          },
          {
            id: 5,
            name: '果盘1',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 1029,
            price: 130,
            num: 0,
            sku_type: "0",
            sku_list: [
              {
                id: 15,
                attr_ids: 15,
                attr_names: "冷的",
                sale_price: "120",
                use_stock_num: "10",
                box_fee: "5",
                num: 0,
              }
            ]
          }
        ]
      },
      {
        id: 'mushroom',
        classifyName: '鸡尾酒',
        goods: [1, 7, 8, 9],
        item: [
          {
            id: 9,
            name: '芝士华',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 102,
            price: 300,
            num: 0,
            sku_type: "1",
            sku_list: [
              {
                id: 10,
                attr_ids: 10,
                attr_names: "黑色",
                sale_price: "105",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              },
              {
                id: 11,
                attr_ids: 11,
                attr_names: "红色",
                sale_price: "100",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              }
            ]
          },
          {
            id: 8,
            name: '尊尼获加',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 124,
            price: 220,
            num: 0,
            sku_type: "0",
            promo_limit_buy: "6",
            promo_setting: {
              dec_input: "0.5",
              discount_name: "打折",
            },
            sku_list: [
              {
                id: 14,
                attr_ids: 14,
                attr_names: "冷的",
                sale_price: "120",
                use_stock_num: "10",
                box_fee: "20",
                num: 0,
              }
            ]
          },
          {
            id: 1,
            name: '果盘3',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 1014,
            price: 120,
            num: 0,
            sku_type: "1",
            sku_list: [
              {
                id: 12,
                attr_ids: 12,
                attr_names: "M",
                sale_price: "120",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              },
              {
                id: 13,
                attr_ids: 13,
                attr_names: "L",
                sale_price: "110",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              }
            ]
          },
          {
            id: 7,
            name: '锐澳',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 814,
            price: 200,
            num: 0,
            sku_type: "0",
            sku_list: [
              {
                id: 17,
                attr_ids: 17,
                attr_names: "鸡肉",
                sale_price: "100",
                use_stock_num: "4",
                box_fee: "10",
                num: 0,
              }
            ]

          }
        ]
      },
      {
        id: 'food',
        classifyName: '主食',
        goods: [1, 3, 6, 8],
        item: [
          {
            id: 3,
            name: '方便面',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 1030,
            price: 5,
            num: 0,
            sku_type: "0",
            sku_list: [
              {
                id: 13,
                attr_ids: 13,
                attr_names: "小桶",
                sale_price: "120",
                use_stock_num: "4",
                box_fee: "10",
                num: 0,
              }
            ]
          },
          {
            id: 6,
            name: '果盘2',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 1064,
            price: 150,
            num: 0,
            sku_type: "0",
            sku_list: [
              {
                id: 16,
                attr_ids: 16,
                attr_names: "大盘",
                sale_price: "80",
                use_stock_num: "4",
                box_fee: "15",
                num: 0,
              }
            ]
          },
          {
            id: 1,
            name: '果盘3',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 1014,
            price: 120,
            num: 0,
            sku_type: "1",
            sku_list: [
              {
                id: 12,
                attr_ids: 12,
                attr_names: "M",
                sale_price: "120",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              },
              {
                id: 13,
                attr_ids: 13,
                attr_names: "L",
                sale_price: "110",
                use_stock_num: "10",
                box_fee: "10",
                num: 0,
              }
            ]
          },
          {
            id: 8,
            name: '尊尼获加',
            pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
            sold: 124,
            price: 220,
            num: 0,
            sku_type: "0",
            promo_limit_buy: "6",
            promo_setting: {
              dec_input: "0.5",
              discount_name: "打折",
            },
            sku_list: [
              {
                id: 14,
                attr_ids: 14,
                attr_names: "冷的",
                sale_price: "120",
                use_stock_num: "10",
                box_fee: "20",
                num: 0,
              }
            ]
          },
        ]
      }
    ],
      setTimeout(() => {
        _this.setData({
          goodsList: _this.data.goodsList,
          shop: _this.data.shop
        })
      }, 1500)
    }
});