import config from '../config';
const baseDocment = `${config.host}/report`;

import { requestAsync } from '../../utils/request.js';

// 创建打卡日报
export function createReport(data) {
  return requestAsync({
    url: `${baseDocment}`,
    method: 'POST',
    data
  });
}


// 获取打卡日报
export function getReport(groupId) {
  return requestAsync({
    url: `${baseDocment}/${groupId}`,
    method: 'GET'
  });
}



// 获取打卡基本信息
export function getInformation() {
  return requestAsync({
    url: `${baseDocment}/information`,
    method: 'GET'
  });
}

// 订阅
export function postSubscribe() {
  return requestAsync({
    url: `${baseDocment}/subscribe`,
    method: 'POST'
  });
}


// 获取小组是否接触过确诊人员
export function getContactData(groupId, date) {
  return requestAsync({
    url: `${baseDocment}/contact/${groupId}?time=${date}`,
    method: 'GET'
  });
}
