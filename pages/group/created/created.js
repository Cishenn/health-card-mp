/* eslint-disable no-empty-function */
// pages/group/created/created.js
import { getGroupDetail } from '../../../api/service/group.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    groupDetail: null,

  },
  /**
   * 请求数据
   */


  /**
   * 按钮事件
   */

  toBack: function() {
    // console.log("111");
    wx.switchTab({
      url: `/pages/index/home-page/home-page?id=${this.data.groupDetail.id}`,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const groupId = options.id;
    // console.log(groupId);
    // console.log(options);
    let groupDetail = null;
    getGroupDetail(groupId).then(res => {
      groupDetail = res.data;
      console.log(res.data);
      this.setData({
        groupDetail
      });
      console.log(groupDetail);
    }).catch(error => {
      console.log(error);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  // eslint-disable-next-line no-empty-function
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    // open-type 触发 对分享者而言, 不是被分享者!!!
    return {
      title: '健康打卡, 快来加入我的小组吧',
      path: `/pages/group/group-info/group-info?id=${this.data.groupDetail.id}`,
      // success: res => {
      //   console.log(res);
      // },
      // fail: res => {
      //   console.log(res);
      // }
    };
  }
});