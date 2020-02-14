// pages/index/home-page/home-page.js

import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
import { validatePhoneNumber } from '../../../utils/validate';
import { getJoinedGroups, getManagedGroups, joinGroup } from '../../../api/service/group.js';
import { onLogin } from '../../../utils/events';

Page({

  data: {
    showJoin: false,
    joiningGroupInviteCode: null,
    joiningName: null,
    joiningPhone: null,
    joinedGroupList: null,
    managedGroupList: null
  },

  onShow: function() {
    onLogin(() => {
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
    });
  },

  onPullDownRefresh: function() {
    this.onShow();
  },

  showJoinDialog: function() {
    if (this.data.joinedGroupList.total === 10) {
      Dialog.alert({
        message: '最多只能加入 10 个小组。'
      });
    }
    else {
      this.setData({
        showJoin: true
      });
    }
  },

  createGroup: function() {
    wx.navigateTo({
      url: '../../group/create-group/create-group',
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
      this.selectComponent('#join-dialog').stopLoading();
    }
    else if (!validatePhoneNumber(phone)) {
      Toast('手机号码有误');
      this.setData({ showJoin: true });
      this.selectComponent('#join-dialog').stopLoading();
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
        this.onShow();
      }).catch(err => {
        if (err.data.code === 1001) {
          this.setData({ showJoin: true, });
          this.selectComponent('#join-dialog').stopLoading();
          Toast(`${err.data.message}`);
        }
        else {
          this.setData({ showJoin: true, });
          this.selectComponent('#join-dialog').stopLoading();
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
    if (this.data.managedGroupList.total === 10) {
      Dialog.alert({
        message: '最多只能创建 10 个小组。'
      });
    }
    else {
      wx.navigateTo({
        url: '/pages/group/create-group/create-group'
      });
    }
  },

  onShareAppMessage: function(res) {
    const id = res.target.dataset.id;
    const name = res.target.dataset.name;

    return {
      title: `Hi,你的好友创建了${name}健康打卡，快来加入吧！`,
      imageUrl: '/assets/share.jpeg',
      path: `/pages/group/group-info/group-info?id=${id}`,
      // eslint-disable-next-line no-shadow
      success: res => {
        console.log(res);
      },
      // eslint-disable-next-line no-shadow
      fail: res => {
        console.log(res);
      }
    };
  }
});
