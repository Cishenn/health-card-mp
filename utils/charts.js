export function getPie1Data(healthData, total) {
  const chartData = [{
    value: healthData.fine,
    name: '正常',
  }, {
    value: healthData.selfDanger,
    name: '自查异常',
  }, {
    value: healthData.danger,
    name: '疑似',
  }, {
    value: healthData.ill,
    name: '确诊',
  }];
  chartData.forEach(item => {
    item.const = 'const';
    item.percent = toPercentage(item.value, total);
  });

  return chartData;
}

export function getPie2Data(groupType, distributeData, total) {
  const chartData = [{
    value: distributeData.inWuHan,
    name: '武汉市内'
  }, {
    value: distributeData.inHuBei,
    name: '湖北省内'
  }, {
    value: distributeData.other,
    name: '其他地区'
  }];
  chartData.forEach(item => {
    item.const = 'const';
    item.percent = toPercentage(item.value, total);
  });

  return chartData;
}

export function getPie3Data(contactData, total) {
  const chartData = [{
    value: contactData.isContact,
    name: '是'
  }, {
    value: contactData.noContact,
    name: '否'
  }];
  chartData.forEach(item => {
    item.const = 'const';
    item.percent = toPercentage(item.value, total);
  });

  return chartData;
}

function toPercentage(item, total) {
  return `${Number(Number(item) / Number(total) * 100).toFixed(2)}%`;
}
