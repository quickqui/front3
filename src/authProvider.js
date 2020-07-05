import {
  AUTH_LOGIN,
  AUTH_CHECK,
  AUTH_ERROR,
  AUTH_LOGOUT,
  AUTH_GET_PERMISSIONS
} from "react-admin";
import { request } from "graphql-request";

export default (type, params) => {
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    //TODO 应该用username登陆，比较符合中国习惯。
    //TODO 实现手机号、微信等登入。
    /* GraphQL */
    const query = `
    mutation login($username: String!, $password: String!){
        login(email:$username,password:$password){
            token,
            user {
                id,
                name
        }
    }
}
  `;
    request("/app", query, { username, password })
      .then(data => {
        console.log(data);
        return data;
      })
      .then(data => {
        localStorage.setItem("login", JSON.stringify(data.login));
      });
    //TODO 没有测试login失败的情况。
    // const request = new Request('https://mydomain.com/authenticate', {
    //     method: 'POST',
    //     body: JSON.stringify({ username, password }),
    //     headers: new Headers({ 'Content-Type': 'application/json' }),
    // })
    // return fetch(request)
    //     .then(response => {
    //         if (response.status < 200 || response.status >= 300) {
    //             throw new Error(response.statusText);
    //         }
    //         return response.json();
    //     })
    //     .then(({ token }) => {
    //         localStorage.setItem('token', token);
    //     });
    //TODO 这里貌似有bug，Promise.resolve是不是在没有then的情况下就返回了？
    return Promise.resolve();
  }
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem("login");
    return Promise.resolve();
  }
  if (type === AUTH_ERROR) {
    const status = params.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("login");
      return Promise.reject();
    }
    return Promise.resolve();
  }
  if (type === AUTH_CHECK) {
    return localStorage.getItem("login") ? Promise.resolve() : Promise.reject();
  }

  if (type === AUTH_GET_PERMISSIONS) {
    const login = localStorage.getItem("login");
    return login ? Promise.resolve(JSON.parse(login)) : Promise.reject();
  }
  return Promise.reject("Unknown method");
};
