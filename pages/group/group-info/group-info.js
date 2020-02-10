// pages/groupInfo/groupInfo.js

import Toast from '@vant/weapp/toast/toast';
import {validatePhoneNumber} from '../../../utils/validate.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo: {
      groupName: "兰州",
      creatorName: "somebody",
      invitationCodes: "66666", // temporary five
      introduction: "It's a strong group"
    },

    isShown:false,

    personalName: null,
    personalPhone: null,
  },

  /**
   * 按钮事件
   */
  applyTo: function(){
    this.setData({
      isShown:true
    });
  },

  /**
   * 对话框确认加入小组
   */
  clickConfirm: function(){
    const name=this.data.personalName;
    const phone=this.data.personalPhone;
    if(!name||!phone){
      Toast('请完整输入您的真实姓名和手机号码!');
      this.setData({isShown:true});
      
      this.selectComponent('#dialog').stopLoading();
    }
    else if(!validatePhoneNumber(phone)){
      Toast('请输入正确的手机号码!');
      console.log('请输入正确的手机号码!');
      this.setData({isShown:true});
      this.selectComponent('#dialog').stopLoading();
    }
    else{
      // phone & name 数据传请求
      // ...
      
      //reset the related data
      this.setData({
        isShown: false,
        personalName: null,
        personalPhone: null
      })
    }
  },
  
  clickCancel: function(){
    this.setData({
      isShown: false,
      personalName: null,
      personalPhone: null
    }); 
  },

  getName: function(e){
    console.log('1');
    this.setData({
      personalName: e.detail
    });
  },

  getPhone: function(e){
    console.log('2');
    this.setData({
      personalPhone: e.detail
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