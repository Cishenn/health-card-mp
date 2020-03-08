/* eslint-disable no-shadow */
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
    console.log(groupId);
    console.log(options);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    // open-type 触发 对分享者而言, 不是被分享者!!!
    return {
      title: `Hi,你的好友创建了${this.data.groupDetail.name}健康打卡，快来加入吧！`,
      imageUrl: 'https://care-health-card.oss-cn-shanghai.aliyuncs.com/public/share.jpeg',
      path: `/pages/group/group-info/group-info?id=${this.data.groupDetail.id}`,
      success: res => {
        console.log(res);
      },
      fail: res => {
        console.log(res);
      }
    };
  }
});
