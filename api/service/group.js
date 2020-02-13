import config from '../config';
const baseDocment = `${config.host}/group`;
import { requestAsync } from '../../utils/request.js';

// 创建小组
export function createGroup(data) {
  return requestAsync({
    url: `${baseDocment}`,
    method: 'POST',
    data
  });
}

// 修改小组
export function modifyGroup(data, groupId) {
  return requestAsync({
    url: `${baseDocment}/${groupId}`,
    method: 'PUT',
    data
  });
}

// 得到管理的小组
export function getManagedGroups() {
  return requestAsync({
    url: `${baseDocment}/manage`,
    method: 'GET',
  });
}

// 得到加入的小组
export function getJoinedGroups() {
  return requestAsync({
    url: `${baseDocment}/join`,
    method: 'GET',
  });
}

// 得到小组详情
export function getGroupDetail(groupId) {
  return requestAsync({
    url: `${baseDocment}/${groupId}`,
    method: 'GET',
  });
}

// 创建公告
export function setAnnouncement(groupId, content) {
  return requestAsync({
    url: `${baseDocment}/${groupId}/announcement`,
    method: 'POST',
    data: { content: content }
  });
}

// 得到当前公告
export function getAnnouncement(groupId) {
  return requestAsync({
    url: `${baseDocment}/${groupId}/announcement`,
    method: 'GET',
  });
}

// 得到小组打卡数据 date:20200211
export function getClockInData(groupId, date) {
  return requestAsync({
    url: `${baseDocment}/report-number-data/${groupId}?time=${date}`,
    method: 'GET'
  });
}

// 得到小组健康数据
export function getHealthData(groupId, date) {
  return requestAsync({
    url: `${baseDocment}/report-health-data/${groupId}?time=${date}`,
    method: 'GET'
  });
}

// 得到小组分布数据
export function getDistributeData(groupId, date) {
  return requestAsync({
    url: `${baseDocment}/report-distribute-data/${groupId}?time=${date}`,
    method: 'GET'
  });
}

// 得到小组打卡详细信息
export function getClockInDetail(groupId, date) {
  return requestAsync({
    url: `${baseDocment}/${groupId}/member/report?time=${date}`,
    method: 'GET'
  });
}

// 得到小组所有成员
export function getMembers(groupId) {
  return requestAsync({
    url: `${baseDocment}/${groupId}/member`,
    method: 'GET'
  });
}

// 加入小组
export function joinGroup(data) {
  return requestAsync({
    url: `${baseDocment}/join`,
    method: 'POST',
    data
  });
}

// 导出数据
export function exportData(groupId, date) {
  return requestAsync({
    url: `${baseDocment}/report-excel/${groupId}?time=${date}`,
    method: 'GET',
  });
}
