const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 常用正则表达式
const PregRule = {
  Email: /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, //邮箱
  Account: /^[a-zA-Z0-9_]{2,20}$/, // 账户
  Pwd: /^[a-zA-Z0-9_~!@#$%^&*()]{6,25}$/i, // 密码
  Tel: /^(13|15|18|17)[0-9]{9}$/, //手机
  IDCard: /^\d{17}[\d|X|x]|\d{15}$/, //身份证 
  Number: /^\d+$/, //数字
  Integer: /^[-\+]?\d+$/, //正负整数
  IntegerZ: /^[1-9]\d*$/, //正整数
  IntegerF: /^-[1-9]\d*$/, //负整数
  Chinese: /^[\u0391-\uFFE5]+$/,
  Zipcode: /^\d{6}$/, //邮编
  Authcode: /^\d{6}$/, //验证码
  QQ: /^\d{4,12}$/, // QQ
  Price: /^(0|[1-9]\d*)(\.\d{1,2})?$/, // 价格
  Money: /^(0|[1-9]\d*)(\.\d{1,4})?$/, // 金额
  Letter: /^[A-Za-z]+$/, //字母
  LetterU: /^[A-Z]+$/, //大写字母
  LetterL: /^[a-z]+$/, //小写字母
  Url: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/, // URL
  Date: /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/, //日期
  Domain: /^[a-zA-Z0-9]{4,}$/ //自定义域名
};

function getAuthCode($obj, mobile, type, time) {
  var timer = null;

  time = time || 60;

  if (!mobile) {
    wx.showModal({
      title: '手机号不能为空',
      showCancel: false
    });
    return;
  } else if (!PregRule.Tel.test(mobile)) {
    wx.showModal({
      title: '手机号格式不正确',
      showCancel: false
    });
    return;
  }

  function countDown() {
    if (time <= 0) {
      clearTimeout(timer);
      $obj.prop('disabled', false).text('获取验证码');
      return false;
    }

    $obj.prop('disabled', true).text(time + 's后重发');
    time--;
  }

  // 获取验证码
  // $.post(
  //   __BASEURL__ + "mobile_api/send_code",
  //   autoCsrf({
  //     mobile: mobile,
  //     type: type
  //   }),
  //   function (data) {
  //     if (data.success) {
  //       new Msg({
  //         type: "success",
  //         msg: "获取成功",
  //         delay: 1
  //       });

  //       countDown();
  //       timer = setInterval(countDown, 1000);
  //     } else {
  //       new Msg({
  //         type: "danger",
  //         msg: data.msg
  //       });

  //       $obj.prop('disabled', false).text('获取验证码');
  //     }
  //   },
  //   "json"
  // );
}

function getPromission(){
  wx.openSetting({
    success: function (data) {
      if (data) {
        if (data.authSetting["scope.userInfo"] == true) {
          //loginStatus = true;
          wx.getUserInfo({
            withCredentials: false,
            success: function (data) {
              console.info("2成功获取用户返回数据");
              console.info(data.userInfo);
              var userInfo = data.userInfo;
              userInfo = {
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
              };
              wx.setStorageSync('userInfo', userInfo);
            },
            fail: function () {
              console.info("2授权失败返回数据");
            }
          });
        }else{
          // 显示提示弹窗
          wx.showModal({
            title: '用户未授权',
            content: '您未点击授权按钮，将无法正常使用小程序功能。如需正常，请按确定并在【设置】页面中点击授权按钮。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                console.log(this)
                getPromission();
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


function wxLogin(){
  var loginStatus = true;
  if (!loginStatus) {
    wx.openSetting({
      success: function (data) {
        if (data) {
          if (data.authSetting["scope.userInfo"] == true) {
            loginStatus = true;
            wx.getUserInfo({
              withCredentials: false,
              success: function (data) {
                console.info("2成功获取用户返回数据");
                console.info(data.userInfo);
                var userInfo = data.userInfo;
                userInfo = {
                  nickName: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl,
                };
                wx.setStorageSync('userInfo', userInfo);
              },
              fail: function () {
                console.info("2授权失败返回数据");
              }
            });
          }else{
            getPromission();
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
              console.info(data.userInfo);
              var userInfo = data.userInfo;
              userInfo = {
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
              };
              wx.setStorageSync('userInfo', userInfo);
            },
            fail: function () {
              console.info("1授权失败返回数据");
              loginStatus = false;
              // 显示提示弹窗
              wx.showModal({
                title: '用户未授权',
                content: '您点击了拒绝授权,将无法正常使用小程序功能。如需正常，请按确定并在【设置】页面中点击授权按钮。',
                 showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    getPromission();
                  } else if (res.cancel) {
                    wx.openSetting({
                      success: function (data) {
                        if (data) {
                          if (data.authSetting["scope.userInfo"] == true) {
                            loginStatus = true;
                            wx.getUserInfo({
                              withCredentials: false,
                              success: function (data) {
                                console.info("3成功获取用户返回数据");
                                console.info(data.userInfo);
                              },
                              fail: function () {
                                console.info("3授权失败返回数据");
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
}

module.exports = {
  formatTime: formatTime,
  getAuthCode:getAuthCode,
  PregRule: PregRule,
  wxLogin: wxLogin
}
