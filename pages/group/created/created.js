// pages/group/created/created.js
import { getGroupInfo } from '../../../api/service/group.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    name: "",
    managerName: "",
    invitationCode: ""
    
  },
  /**
   * 请求数据
   */
   

  /**
   * 按钮事件
   */

  toBack: function(){
    wx.navigateTo({
      url: '/pages/index/home-page/home-page',
    })
  },

  toInvite: function(){
    // TODO:
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
    getGroupInfo().then(res => {
      console.log('here'),
        this.setData({
          name: res.data.name,
          managerName: res.data.managerName,
          invitationCode: res.data.invitationCode,
        });

      resolve();
    }).catch(error => {
      reject(error);
    });
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
  onShareAppMessage: function (res) {
    //open-type 触发 对分享者而言, 不是被分享者!!!
    return{
      title: '健康打卡, 快来加入我的小组吧',
      path: '/pages/group/group-info/group-info',
      success: (res) =>{
        console.log(res)
      },
      fail: (res) =>{
        console.log(res)
      }
    }
  }
})