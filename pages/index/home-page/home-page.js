// pages/index/home-page/home-page.js

import Toast from '@vant/weapp/toast/toast';
import { validatePhoneNumber } from '../../../utils/validate';

Page({

  data: {
    showJoin: false,
    joiningGroupInviteCode: null,
    joiningName: null,
    joiningPhone: null,
    joinedGroupList: [],
    maintainedGroupList: []
  },

  onLoad: function() {
    this.getJoinedGroupList();
    this.getMaintainedGroupList();
  },

  getJoinedGroupList: function() {
    wx.request({
      url: `${getApp().globalData.apiUrl}group/join`,
      succuess: res => {
        this.setData({
          joinedGroupList: res.data
        });
      },
      fail: err => {
        console.log(err);
      }
    });
    // TODO: 在使用应用的过程中，如果某管理员通过的用户加小组申请，怎么及时地刷新加入的小组列表
  },
  getMaintainedGroupList: function() {
    wx.request({
      url: `${getApp().globalData.apiUrl}group/manage`,
      succuess: res => {
        this.setData({
          maintainedGroupList: res.data
        });
      },
      fail: err => {
        console.log(err);
      }
    });
  },

  showJoinDialog: function() {
    this.setData({
      showJoin: true
    });
  },

  joinGroup: function() {
    const invitationCode = this.data.joiningGroupInviteCode;
    const name = this.data.joiningName;
    const phone = this.data.joiningPhone;
    if (!invitationCode || !name || !phone) {
      console.log(invitationCode, name, phone);
      Toast('请填写正确的信息');
      this.setData({ showJoin: true });
      this.selectComponent('#van-dialog').stopLoading();
    }
    else if (!validatePhoneNumber(phone)) {
      Toast('手机号码有误');
      this.setData({ showJoin: true });
      this.selectComponent('#van-dialog').stopLoading();
    }
    else {
      wx.request({
        url: `${getApp().globalData.apiUrl}/group/join`,
        method: 'POST',
        data: {
          name,
          phone,
          invitationCode
        },
        succuess: () => {
          this.setData({
            showJoin: false,
            joiningGroupInviteCode: null,
            joiningName: null,
            joiningPhone: null
          });
        },
        fail: err => {
          this.setData({ showJoin: true, });
          this.selectComponent('#van-dialog').stopLoading();
          console.log(err);
          Toast('网络错误，申请失败');
        }
      });
    }
  },

  cancelJoinGroup: function() {
    this.setData({
      showJoin: false,
      joiningGroupInviteCode: null,
      joiningName: null,
      joiningPhone: null
    });
  },

  inputId: function(e) {
    this.setData({
      joiningGroupInviteCode: e.detail
    });
  },
  inputName: function(e) {
    this.setData({
      joiningName: e.detail
    });
  },
  inputPhone: function(e) {
    this.setData({
      joiningPhone: e.detail
    });
  },

  goToCreateGroup: function() {
    wx.navigateTo({
      url: '/pages/group/create-group/create-group'
    });
  }
});