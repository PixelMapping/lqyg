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
