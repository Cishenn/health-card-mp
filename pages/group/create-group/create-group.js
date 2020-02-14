/* eslint-disable no-empty-function */
// pages/group/group.js

import Toast from '@vant/weapp/toast/toast';
import { validatePhoneNumber } from '../../../utils/validate';
import { createGroup, modifyGroup } from '../../../api/service/group';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    description: null,
    managerName: null,
    managerPhone: null,
    type: '',
    groupId: '',
    changedGroupId: '',
    isModified: false,


    hasType: false,
    hasStatus: false,

    typeList: ['社区', '学校', '其他']
    // raido here to complemented.
  },

  /**
   * 自定义事件 --- 按钮事件
   */
  show(e) {
    const key = e.currentTarget.dataset.status;
    this.setData({
      [key]: true
    });
  },

  close(e) {
    const key = e.currentTarget.dataset.status;
    this.setData({
      [key]: false
    });
  },

  changeValue(e) {
    const key = e.currentTarget.dataset.source;
    console.log(key);
    this.setData({
      [key]: e.detail,
      hasType: false,
      hasStatus: false
    });
    console.log(this.data);
  },

  clickShow(e) {
    const { name } = e.currentTarget.dataset;
    const key = e.currentTarget.dataset.source;
    this.setData({
      [key]: name,
      hasType: false,
      hasStatus: false
    });
    console.log(this.data[key]);
  },

  toSubmit: function() {
    const name = this.data.name;
    const description = this.data.description;
    const managerName = this.data.managerName;
    const managerPhone = this.data.managerPhone;
    const type = this.data.type;
    if (!name || !description || !managerName || !managerPhone || !type) {
      Toast('请将以上信息填充完整!');
      console.log(name, description, managerName, managerPhone, type);

      return;
    }
    else if (!validatePhoneNumber(managerPhone)) {
      Toast('请输入正确的手机号码!');
      console.log(managerPhone);

      return;
    }

    if ( this.data.isModified ) {
      console.log(this.data.isModified);
      modifyGroup({
        name,
        description,
        managerName,
        managerPhone,
        type,
      }, this.data.changedGroupId).then(res => {
        // reset related data
        Toast('修改成功');
        console.log('修改成功');
        this.setData({
          name: null,
          description: null,
          managerName: null,
          managerPhone: null,
          type: null,
          isModified: false,
        });
        console.log(res.data);
        // 跳转回去
        wx.navigateTo({
          url: `/pages/group/group-management/group-management?id=${this.data.changedGroupId}`
        });
      }).catch(error => {
        console.log(error);
        Toast('error');
      });
    }
    else {
      createGroup({
        name,
        description,
        managerName,
        managerPhone,
        type,
      }).then(res => {
      // reset the related data
        console.log('创建成功');
        Toast('创建成功');
        console.log(res.data);
        this.setData({
          name: null,
          description: null,
          managerPhone: null,
          type: '',
          groupId: res.data.id,
        });
        // 跳转创建成功页面
        wx.navigateTo({
          url: `/pages/group/created/created?id=${this.data.groupId}`,
        });
      }).catch(error => {
        console.log(error);
        Toast(error);
      });
    }
  },

  getName: function(e) {
    this.setData({
      name: e.detail
    });
  },

  getIntro: function(e) {
    this.setData({
      description: e.detail
    });
  },

  getCreator: function(e) {
    this.setData({
      managerName: e.detail
    });
  },

  getPhone: function(e) {
    this.setData({
      managerPhone: e.detail
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if ( options.type ) {
      wx.setNavigationBarTitle({
        title: '修改小组信息',
      });
      this.setData({
        // 提交时是修改小组的请求.
        isModified: true,
        name: options.name,
        description: options.description,
        managerName: options.managerName,
        managerPhone: options.managerPhone,
        type: options.type,
        changedGroupId: options.id,
      });
      console.log(this.data);
    }
    else {
      wx.setNavigationBarTitle({
        title: '创建小组',
      });
    }
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