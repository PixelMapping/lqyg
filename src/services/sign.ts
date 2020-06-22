import request from '@/utils/request.js';

//个体信息
export async function signUserPage(params: any) {
  return request('/client/sign/signUserPage.do', {
    method: 'GET',
    params: params,
  });
}

//签约信息
export async function signPage(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/signPage.do', {
    method: 'GET',
    params: params,
  });
}

//签约批次
export async function signBatchPage(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/signBatchPage.do', {
    method: 'GET',
    params: params,
  });
}


//签约明细
export async function signDetailPage(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/signDetailPage.do', {
    method: 'GET',
    params: params,
  });
}


//个体信息详情
export async function personDetailBasic(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/personUser/personDetailBasic.do', {
    method: 'GET',
    params: params,
  });
}


//导入数据校验
export async function importBatchSign(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/importBatchSign.do', {
    method: 'POST',
    data: params,
  });
}

//导入数据校验
export async function batchSign(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/batchSign.do', {
    method: 'POST',
    data: params,
  });
}

//撤销合同
export async function cancelContract(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/cancelContract.do', {
    method: 'PUT',
    data: params,
  });
}

//下载合同
export async function downContract(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/downContract.do', {
    method: 'GET',
    params: params,
  });
}

//撤销签约列表
export async function cancelSignList(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/cancelSignList.do', {
    method: 'GET',
    params: params,
  });
}

//发起签约列表
export async function sendSignList(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/sendSignList.do', {
    method: 'GET',
    params: params,
  });
}

//单个签约
export async function sendOneSign(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/sendOneSign.do', {
    method: 'POST',
     data: params,
  });
}


//禁止恢复签约
export async function setBlacklist(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/signBlacklist/setBlacklist.do', {
    method: 'POST',
     data: params,
  });
}

//获取预览地址
export async function getPreviewURL(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/getPreviewURL.do', {
    method: 'GET',
    params: params,
  });
}

//获取预览地址
export async function smsAlert(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/smsAlert.do', {
    method: 'PUT',
    data: params,
  });
}