import config from '../config';
const baseDocment = `${config.host}/report`;

import { requestAsync } from '../../utils/request.js';

// 创建打卡日报
export function createGroup(data) {
  return requestAsync({
    url: `${baseDocment}`,
    method: 'POST',
    data
  });
}