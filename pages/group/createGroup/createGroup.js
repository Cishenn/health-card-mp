// pages/group/group.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupName: "xxx",
    introduction: "xxx",
    creatorName: "xxx",
    creatorPhone: "13855146666",
    // raido here to complemented.
  },

  /**
   * 自定义事件 --- 按钮事件
   */
  toSubmit: function() {
    // 向后台发送数据 ... 怎么判断是否有空选项?等问题, 待参考其他界面
    // ...

    // 跳转创建成功页面
    wx.navigateTo({
      url: '../created/created',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})