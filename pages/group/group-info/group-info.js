// pages/groupInfo/groupInfo.js

import Toast from '@vant/weapp/toast/toast';
import { validatePhoneNumber } from '../../../utils/validate.js';
import Dialog from '@vant/weapp/dialog/dialog';
import { getGroupDetail, joinGroup, getJoinedGroups } from '../../../api/service/group.js';
import { onLogin } from '../../../utils/events.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    groupDetail: null,
    joinedGroupList: null,
    invitationCode: null,
    isShown: false,

    name: null,
    phone: null,
  },

  /**
   * 按钮事件
   */
  applyTo: function() {
    // console.log(this.data.joinedGroupList);
    if ( this.data.joinedGroupList.total > 10) {
      Dialog.alert({
        message: '最多只能加入 10 个小组。'
      });
    }
    else {
      this.setData({
        isShown: true
      });
    }
  },

  /**
   * 对话框确认加入小组
   */
  clickConfirm: function() {
    const name = this.data.name;
    const phone = this.data.phone;
    const invitationCode = this.data.groupDetail.invitationCode;
    if (!name || !phone) {
      Toast('请完整输入您的真实姓名和手机号码!');
      this.setData({ isShown: true });
      console.log(name, phone);
      this.selectComponent('#dialog').stopLoading();
    }
    else if (!validatePhoneNumber(phone)) {
      Toast('请输入正确的手机号码!');
      console.log(phone);
      this.setData({ isShown: true });
      this.selectComponent('#dialog').stopLoading();
    }
    else {
      // phone & name 数据传请求
      // ...
      console.log(this.data.groupDetail);
      console.log(this.data.groupDetail.invitationCode);
      joinGroup({
        name,
        phone,
        invitationCode
      }).then(res => {
        // reset the related data
        Toast.success('申请成功,等待审核');
        console.log('申请成功,等待审核');
        this.setData({
          isShown: false,
          name: null,
          phone: null
        });
        wx.switchTab({
          url: `/pages/index/home-page/home-page?id=${this.data.groupDetail.id}`,
        });
        console.log(res);
      }).catch(error => {
        if (error.data.code === 1003) {
          this.setData({
            isShown: true,
          });
          this.selectComponent('#van-dialog').stopLoading();
          Toast(`${error.data.message}`);
          console.log(error.data.message);
        }
        else if (error.data.code === 1004) {
          this.setData({
            isShown: true,
          });
          this.selectComponent('van-toast').stopLoading();
          Toast(`${error.data.message}`);
          console.log(error.data.message);
        }
        else {
          Toast('请检查网络!');
          console.error(error);
          this.setData({
            isShown: true,
          });
          this.selectComponent('#van-dialog').stopLoading();
        }
      });
    }
  },

  clickCancel: function() {
    this.setData({
      isShown: false,
      name: null,
      phone: null
    });
  },

  getName: function(e) {
    // console.log('1');
    this.setData({
      name: e.detail
    });
  },

  getPhone: function(e) {
    // console.log('2');
    this.setData({
      phone: e.detail
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const groupId = options.id;
    let groupDetail = null;
    onLogin(() => {
      getJoinedGroups().then(res => {
        this.setData({
          joinedGroupList: res.data,
        });
        // console.log(this.data.joinedGroupList);
      }).catch(error => {
        console.log(error);
      });
    });
    getGroupDetail(groupId).then(res => {
      groupDetail = res.data;
      this.setData({
        groupDetail,
      });
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
  onShareAppMessage: function() {

  }
});