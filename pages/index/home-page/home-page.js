// pages/index/home-page/home-page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showJoin: false,
    joiningGroupId: '',
    joiningName: '',
    joiningPhone: '',
    joinedGroupList: [
      {
        id: 1,
        type: 'school',
        name: '兰州大学计算机学院一班',
        digest: '兰州大学计算机学院学生疫情期间打卡群',
        post: '请大家于明天中午12点之前在XXX地点统一领取口罩。',
        maintainer: {
          name: '小明',
          phone: 13766668888,
        }
      },
      {
        id: 2,
        type: 'community',
        name: '监利县xx小区',
        digest: '',
        post: '',
        maintainer: {
          name: '小明',
          phone: 13766668888,
        }
      }
    ],
    maintainedGroupList: [
      {
        id: 3,
        type: 'community',
        name: '监利县书香四季城A栋小区',
        digest: '',
        post: "",
        maintainer: {
          name: '小明',
          phone: 13766668888,
        }
      }
    ]
  },

  showJoinDialog: function() {
    this.setData({
      showJoin: true
    })
  },

  onClose() {
    this.setData({ show: false });
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