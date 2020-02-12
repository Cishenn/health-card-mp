// pages/index/home-page/home-page.js

import Toast from '@vant/weapp/toast/toast';
import { validatePhoneNumber } from '../../../utils/validate';
import { getJoinedGroups, getManagedGroups, joinGroup } from '../../../api/service/group.js';

Page({

  data: {
    showJoin: false,
    joiningGroupInviteCode: null,
    joiningName: null,
    joiningPhone: null,
    joinedGroupList: [],
    managedGroupList: []
  },

  onLoad: function() {
    getJoinedGroups().then(res => {
      this.setData({
        joinedGroupList: res.data
      });
    }).catch(err => {
      console.error(err);
    });
    getManagedGroups().then(res => {
      this.setData({
        managedGroupList: res.data
      });
    }).catch(err => {
      console.error(err);
    });
    // TODO: 在使用应用的过程中，如果某管理员通过的用户加小组申请
    // 怎么及时地刷新加入的小组列表，还是用户手动下拉刷新
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
      joinGroup({
        name,
        phone,
        invitationCode
      }).then(() => {
        this.setData({
          showJoin: false,
          joiningGroupInviteCode: null,
          joiningName: null,
          joiningPhone: null
        });
      }).catch(err => {
        if (err.data.code === 1001) {
          this.setData({ showJoin: true, });
          this.selectComponent('#van-dialog').stopLoading();
          Toast(`${err.data.message}`);
        }
        else {
          this.setData({ showJoin: true, });
          this.selectComponent('#van-dialog').stopLoading();
          console.error(err);
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