import { stringify as queryStringify } from 'qs';

const validStatusCodes = new Set([200]);

function request(options, cb) {
  if ( !options.noCookie ) {
    const token = wx.getStorageSync('health-card-token');

    if (token) {
      if (!options.header) {
        options.header = {};
      }

      options.header.authorization = token;
    }
  }

  if ( options.method === 'GET' &&
      options.data ) {
    const querystring = queryStringify(options.data, {
      arrayFormat: 'repeat',
    });

    delete options.data;
    options.url = `${options.url}?${querystring}`;
  }

  options.complete = function(res) {
    if (!cb || typeof cb !== 'function') {
      return;
    }

    if ( validStatusCodes.has(res.statusCode) ) {
      cb(null, res);

      return;
    }

    cb(res);
  };

  wx.request(options);
}

function requestAsync(options) {
  return new Promise((resolve, reject) => {
    request(options, function(err, res) {
      if (err) {
        return reject(err);
      }

      resolve(res);

      return null;
    });
  });
}

// eslint-disable-next-line no-undef
module.exports = {
  request,
  requestAsync
};
