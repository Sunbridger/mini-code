//index.js
const app = getApp()

Page({
  data: {
    // avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    msg: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    wx.getSetting({
      success: (res) => {
        console.log(res, '---=-=')
      } 
    })
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          console.log(res.code, '--code')
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    // wx.authorize({
    //   scope: 'scope.userInfo',
    //   success: () => {
    //     console.log(111)
    //     wx.getUserInfo({
    //       success: res => {
    //         this.setData({
    //           avatarUrl: res.userInfo.avatarUrl,
    //           userInfo: res.userInfo
    //         })
    //       }
    //     })
    //   },
    //   fail: () => {
    //     console.log(22)
    //   }
    // })
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  getNowTime() {
    const dateTime = new Date();
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const day = dateTime.getDate();
    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();
    const second = dateTime.getSeconds();
    const now = new Date();
    const now_new = Date.parse(now.toDateString());  //typescript转换写法
    const milliseconds = now_new - dateTime;
    const timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    return timeSpanStr;
  },
  bindFormSubmit: function (e) {
    const msg = e.detail.value.textarea;
    if (msg.trim().length) {
      wx.showToast({
        title: '正在提交中...',
        icon: 'loading',
        duration: 500
      });
      const db = wx.cloud.database();
      db.collection('messages').add({
        data: {
          msg,
          avatar: this.data.avatarUrl,
          time: this.getNowTime()
        }
      }).then(() => {
        this.setData({
          msg: ''
        });
        wx.showToast({
          title: '留言成功'
        });
      });
    } else {
      wx.showToast({
        title: '请输入留言内容',
        icon: 'loading',
        duration: 500
      });
    }
  },

})
