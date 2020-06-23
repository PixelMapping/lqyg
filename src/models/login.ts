import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { fakeAccountLogin,bind } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      let response = {result:false};
      if(payload.bind){
        response = yield call(bind, {phone:payload.mobile,bindCode:payload.bindcode,openId:payload.openId})
      }else{
        response = yield call(fakeAccountLogin, {phone:payload.mobile,code:payload.captcha})
      }
      if (response.result) {
        localStorage.setItem('token',response.data.token) 
        localStorage.setItem('userInfo',JSON.stringify(response.data.user))
        localStorage.setItem('menuList',JSON.stringify(response.data.menuList||'[]'))
        window.location.href = '/';
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        history.replace({
          pathname: '/user/login',          
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
