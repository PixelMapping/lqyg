import request from '@/utils/request.js';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: any) {
  return request('/client/login/login.do', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/login/loginSmsCode.do', {
    method: 'GET',
    params: params,
  });
}

//获取微信扫码信息
export async function qrcode(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/login/qrcode.do', {
    method: 'GET',
    params: params,
  });
}

//获取绑定验证码
export async function bindCode(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/login/bindCode.do', {
    method: 'GET',
    params: params,
  });
}

//微信登录
export async function wechatLogin(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/login/wechatLogin.do', {
    method: 'POST',
    data: params,
  });
}

//登录绑定
export async function bind(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/login/bind.do', {
    method: 'POST',
    data: params,
  });
}

//解除微信绑定
export async function removeWeChat(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/personalSetting/removeWeChat.do', {
    method: 'get',
    params: params,
  });
}