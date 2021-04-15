const axios = require('axios');

module.exports.createInstance = (host) => {
  const instance = axios.create({
    baseURL: host,
    proxy: process.env.NODE_ENV === 'development' ? {
      host: '127.0.0.1',
      port: 8888
    } : undefined,
  });

  return instance;
}

module.exports.randomString = (num) => {
  let e = num || 10;
  let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let a = t.length;
  let n = "";
  for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}