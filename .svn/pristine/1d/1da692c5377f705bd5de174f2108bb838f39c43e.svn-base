import request from '@/utils/request.js';


//批次列表
export async function bathList(params: any) {
  return request('/client/enterprise/bath/bathList.do', {
    method: 'POST',
    data: params,
  });
}

//获取用户的打款渠道
export async function enterpriseChannels(params: any) {
  return request('/client/enterprise/enterpriseChannels.do', {
    method: 'GET',
    params: params,
  });
}

//确认打款
export async function confirmPpayment(params: any) {
  return request('/client/enterprise/confirmPpayment.do', {
    method: 'POST',
    data: params,
  });
}

//获取打款信息
export async function enBatchPaymentInfo(params: any) {
  return request('/client/enterprise/enBatchPaymentInfo.do', {
    method: 'GET',
    params: params,
  });
}

//明细列表
export async function taskList(params: any) {
  return request('/client/enterprise/bath/taskList.do', {
    method: 'GET',
    params: params,
  });
}

//批量结算
export async function batchPaymentSumit(params: any,headers={}) {
  return request('/client/enterprise/batchPaymentSumit.do', {
    method: 'POST',
    data: params,
    headers:headers
  });
}

//审核结算导入
export async function checkSetleTaskInfo(params: any,headers={}) {
  return request('/client/enterprise/bath/checkSetleTaskInfo.do', {
    method: 'GET',
    params: params,
    headers:headers
  });
}

