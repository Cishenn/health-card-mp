// pages/group/group.js

import Toast from '@vant/weapp/toast/toast';
import { validatePhoneNumber } from '../../../utils/validate';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupName: null,
    introduction: null,
    creatorName: null,
    creatorPhone: null,
    type: '',

    hasType: false,
    hasStatus: false,

    typeList: ['社区','学校','其他']
    // raido here to complemented.
  },

  /**
   * 自定义事件 --- 按钮事件
   */
  show(e) {
    const key=e.currentTarget.dataset.status;
    this.setData({
      [key]: true
    })
  },

  close(e){
    const key=e.currentTarget.dataset.status;
    this.setData({
      [key] :false
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
      var name=this.data.groupName;
      var intro=this.data.introduction;
      var creator=this.data.creatorName;
      var phone=this.data.creatorPhone;
      if(!name||!intro||!creator||!phone||!this.data.type){
        Toast("请将以上信息填充完整!");
        console.log(name, intro, creator, phone, this.data.type);
        return;
      }
      else if(!validatePhoneNumber(phone)){
        Toast('请输入正确的手机号码!');
        return;
      }
      else{
        // 向后台发送数据 ... 待参考其他界面
        // ...

        // reset the related data
        Toast.success('创建成功');
        this.setData({
          groupName: null,
          introduction: null,
          creatorName: null,
          creatorPhone: null,
          type: ''
        });
      }
    

    // 跳转创建成功页面
    wx.navigateTo({
      url: '../created/created',
    })
  },

  getName: function(e){
    this.setData({
      groupName:e.detail
    });
  },

  getIntro: function(e){
    this.setData({
      introduction:e.detail
    });
  },

  getCreator: function(e){
    this.setData({
      creatorName:e.detail
    });
  },

  getPhone: function(e){
    this.setData({
      creatorPhone:e.detail
    });
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