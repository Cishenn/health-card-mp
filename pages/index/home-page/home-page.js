// pages/index/home-page/home-page.js

import Toast from '@vant/weapp/toast/toast';
import { validatePhoneNumber } from '../../../utils/validate';

Page({

  data: {
    showJoin: false,
    joiningGroupId: null,
    joiningName: null,
    joiningPhone: null,
    joinedGroupList: [
      {
        id: 1,
        type: 'school',
        name: '兰州大学计算机学院一班',
        digest: '兰州大学计算机学院学生疫情期间打卡群',
        post: '请大家于明天中午12点之前在XXX地点统一领取口罩。',
        maintainer: {
          name: '小明',
          phone: '13766668888',
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
          phone: '13766668888',
        }
      }
    ],
    maintainedGroupList: [
      {
        id: 3,
        type: 'community',
        name: '监利县书香四季城A栋小区',
        digest: '',
        post: '',
        maintainer: {
          name: '小明',
          phone: '13766668888',
        }
      },
      {
        id: 4,
        type: 'community',
        name: '监利县书香四季城A栋小区',
        digest: '',
        post: '',
        maintainer: {
          name: '小明',
          phone: '13766668888',
        }
      }
    ]
  },

  showJoinDialog: function() {
    this.setData({
      showJoin: true
    });
  },

  createGroup: function(){
    wx.navigateTo({
      url: '../../group/create-group/create-group',
    })
  },

  joinGroup: function() {
    const id = this.data.joiningGroupId;
    const name = this.data.joiningName;
    const phone = this.data.joiningPhone;
    if (!id || !name || !phone) {
      console.log(id, name, phone);
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
      // TODO: 发送申请加入小组的网络请求
      this.setData({
        showJoin: false,
        joiningGroupId: null,
        joiningName: null,
        joiningPhone: null
      });
    }
  },

  cancelJoinGroup: function() {
    this.setData({
      showJoin: false,
      joiningGroupId: null,
      joiningName: null,
      joiningPhone: null
    });
  },

  inputId: function(e) {
    this.setData({
      joiningGroupId: e.detail
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
  }
});