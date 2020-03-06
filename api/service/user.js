import config from '../config';
const loginUrl = `${config.host}/account/login`;

import { requestAsync } from '../../utils/request.js';

function wechatLogin() {
  return wxLogin()
    .then(code => {
      return requestAsync({
        url: `${loginUrl}`,
        data: {
          code: code
        },
        method: 'POST'
      });
    })
    .then(res => {
      const { data } = res;
      const authorization = 'authorization' in res.header ? res.header.authorization : res.header.Authorization;
      wx.setStorageSync('health-card-token', authorization);

      return data;
    });
}

function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function(res) {
        if (res.code) {
          resolve(res.code);

          return;
        }

        reject({
          error: {
            id: -2,
            message: res.errMsg
          }
        });
      },
      fail: function(res) {
        reject({
          error: {
            id: -2,
            message: res.errMsg
          }
        });
      }
    });
  });
}

export {
  wechatLogin
};

export function getUserInfo() {
  return requestAsync({
    url: `${config.host}/account/getAccount`,
    method: 'GET',
  });
}
