import request from '@/utils/request.js';


//添加子账号
export async function addSubUser(params: any) {
  return request('/client/userManger/addSubUser.do', {
    method: 'post',
    data: params,
  });
}

//获取企业子账户
export async function userList(params: any) {
  return request('/client/userManger/userList.do', {
    method: 'post',
    data: params,
  });
}

//禁止用户登录
export async function forbidLogin(params: any) {
  return request('/client/userManger/forbidLogin.do', {
    method: 'get',
    params: params,
  });
}


//删除用户
export async function disableUser(params: any) {
  return request('/client/userManger/disableUser.do', {
    method: 'get',
    params: params,
  });
}

//获取企业列表
export async function getRoleList(params: any) {
  return request('/client/userManger/getRoleList.do', {
    method: 'get',
    params: params,
  });
}

//添加用户角色
export async function addUserRole(params: any) {
  return request('/client/userManger/addUserRole.do', {
    method: 'get',
    params: params,
  });
}

//添加修改角色信息
export async function addOrUpdateRole(params: any) {
  return request('/client/roleManager/addOrUpdateRole.do', {
    method: 'post',
    data: params,
  });
}

//角色列表
export async function roleList(params: any) {
  return request('/client/roleManager/roleList.do', {
    method: 'post',
    data: params,
  });
}

//角色删除
export async function deleteRole(params: any) {
  return request('/client/roleManager/deleteRole.do', {
    method: 'get',
    params: params,
  });
}

//菜单list
export async function menuList(params: any) {
  return request('/client/roleManager/menuList.do', {
    method: 'get',
    params: params,
  });
}

//编辑角色菜单权限
export async function saveRoleMenut(params: any) {
  return request('/client/roleManager/saveRoleMenut.do', {
    method: 'post',
    data: params,
  });
} 


//获取角色权限
export async function configRoleMenu(params: any) {
  return request('/client/roleManager/configRoleMenu.do', {
    method: 'get',
    params: params,
  });
} 