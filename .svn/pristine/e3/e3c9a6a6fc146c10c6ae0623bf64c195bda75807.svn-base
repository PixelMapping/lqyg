import request from '@/utils/request.js';


//通道列表
export async function channelList(params: any) {
  return request('/client/enterChannel/channelList.do', {
    method: 'GET',
    params: params,
  });
}

//新增充值
export async function recharge(params: any) {
  return request('/client/rechargeRecord/recharge.do', {
    method: 'POST',
    data: params,
  });
}

//银行账户列表
export async function bankList(params: any) {
  return request('/client/bank/bankList.do', {
    method: 'GET',
    params: params,
  });
}

//充值记录列表
export async function recordPage(params: any) {
  return request('/client/rechargeRecord/recordPage.do', {
    method: 'GET',
    params: params,
  });
}

//充值记录详情
export async function getInfo(params: any) {
  return request('/client/rechargeRecord/getInfo.do', {
    method: 'GET',
    params: params,
  });
}

//银行账号列表
export async function bankPage(params: any) {
  return request('/client/bank/bankPage.do', {
    method: 'GET',
    params: params,
  });
}

//新增银行账号
export async function addBank(params: any) {
  return request('/client/bank/addBank.do', {
    method: 'POST',
    data: params,
  });
}

//修改银行账号
export async function uptBank(params: any) {
  return request('/client/bank/uptBank.do', {
    method: 'PUT',
    data: params,
  });
}

//禁用/启用
export async function switchBank(params: any) {
  return request('/client/bank/switchBank.do', {
    method: 'PUT',
    data: params,
  });
}

//删除卡号
export async function delBank(params: any) {
  return request('/client/bank/delBank.do', {
    method: 'DELETE',
    data: params,
  });
}

//默认/取消默认
export async function setDefault(params: any) {
  return request('/client/bank/setDefault.do', {
    method: 'PUT',
    data: params,
  });
}