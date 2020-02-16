const getPie1Option = healthData => {
  return {
    series: [{
      label: {
        rich: {
          fontSize: 18
        },
        formatter: '{b}: {c} ({d}%)',
      },
      type: 'pie',
      radius: '60%',
      avoidLabelOverlap: true,
      data: [{
        value: healthData.fine,
        name: '正常'
      }, {
        value: healthData.selfDanger,
        name: '自查异常'
      }, {
        value: healthData.danger,
        name: '疑似'
      }, {
        value: healthData.ill,
        name: '确诊'
      }]
    }]
  };
};

const getPie2Option = (groupType, distributeData) => {
  let chartData = null;
  if (groupType === '社区') {
    chartData = [{
      value: distributeData.inWuHan,
      name: '武汉市内'
    }, {
      value: distributeData.inHuBei,
      name: '湖北省内'
    }, {
      value: distributeData.inCountry,
      name: '国内'
    }, {
      value: distributeData.outCountry,
      name: '国外'
    }, {
      value: distributeData.localCommunity,
      name: '本社区'
    }];
  }
  else if (groupType === '学校') {
    chartData = [{
      value: distributeData.inWuHan,
      name: '武汉市内'
    }, {
      value: distributeData.inHuBei,
      name: '湖北省内'
    }, {
      value: distributeData.inCountry,
      name: '国内'
    }, {
      value: distributeData.outCountry,
      name: '国外'
    }, {
      value: distributeData.localSchool,
      name: '本学校'
    }];
  }
  else {
    chartData = [{
      value: distributeData.inWuHan,
      name: '武汉市内'
    }, {
      value: distributeData.inHuBei,
      name: '湖北省内'
    }, {
      value: distributeData.inCountry,
      name: '国内'
    }, {
      value: distributeData.outCountry,
      name: '国外'
    }];
  }

  return {
    series: [{
      label: {
        rich: {
          fontSize: 18
        },
        formatter: '{b}: {c} ({d}%)',
      },
      type: 'pie',
      radius: '60%',
      avoidLabelOverlap: true,
      data: chartData
    }]
  };
};

export {
  getPie1Option,
  getPie2Option
};
