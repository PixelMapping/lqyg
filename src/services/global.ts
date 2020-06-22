import request from '@/utils/request.js';

//首页信息
export async function homeInfo(params: any) {
  return request('/client/enterprise/homeInfo.do', {
    method: 'GET',
    params: params,
  });
}


//模板列表
export async function tempPage(params: any) {
  return request('/client/template/tempList.do', {
    method: 'GET',
    params: params,
  });
}

//首页动态
export async function actions(params: any) {
  return request('/client/enterprise/actions.do', {
    method: 'GET',
    params: params,
  });
}
