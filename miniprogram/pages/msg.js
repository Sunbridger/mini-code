// miniprogram/pages/msg.js
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
    this.onQuery();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onQuery: async function () {
    const db = wx.cloud.database()
    const countResult = await db.collection('messages').count()
    const total = countResult.total
    const batchTimes = Math.ceil(total / 20)
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('messages').skip(i * 20).limit(20).get()
      tasks.push(promise)
    }
    const res = (await Promise.all(tasks)).reduce((acc, cur) => {
      console.log(cur.data)
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    });
    this.setData({
      msgs: res.data
    });
    // db.collection('messages').where({
    //   _openid: this.data.openid
    // }).get().then(res => {
    //   console.log(res, '---res')
    //   this.setData({
    //     msgs: res.data
    //   });
    // })
  },
})