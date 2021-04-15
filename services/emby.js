const { createInstance, randomString } = require('../utils');
const instance = createInstance(process.env.VIDEO_HOST);

instance.interceptors.response.use(
  res => {
    const {
      data,
      status
    } = res;
    return data;
  },
  error => {
    return Promise.reject(new Error(error.response.data));
  }
);

const info = 'X-Emby-Client=Emby%20Web&X-Emby-Device-Name=Chrome&X-Emby-Client-Version=4.5.4.0&X-Emby-Device-Id=f53ae843-50d9-484d-ad20-0a892d329962';

function login(username, password) {
  return instance.post(`Users/authenticatebyname?${info}`, {
    Username: username,
    Pw: password,
  }).then(res => {
    return res.AccessToken;
  })
}

function create(username, token) {
  const params = new URLSearchParams();
  params.append('Name', username);
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  return instance.post(
    `Users/New?${info}&X-Emby-Token=${token}`,
    params,
    config,
  )
    .then((res) => {
      const id = res.Id;
      const password = randomString();
      return instance.post(`Users/${id}/Password?${info}&X-Emby-Token=${token}`, {
        CurrentPw: "",
        NewPw: password
      }).then(() => password)
    })
}

module.exports.create = create;
module.exports.login = login;