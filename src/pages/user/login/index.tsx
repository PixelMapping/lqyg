import { Alert, Modal } from 'antd';
import React, { useState ,useEffect} from 'react';
import { connect, Dispatch } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType,qrcode,wechatLogin} from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/Login';
import {getSearchString} from '@/utils/utils'


import styles from './style.less';
import { values } from 'lodash';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState<string>('mobile');
  const [openId,setOpenId] = useState('')
  const [qrObj,setQrObj] = useState<any>({})
  const [visible,setVisible] = useState(false)

  useEffect(() => {
    getUrl()    
    if(type=='account'){
       /**
       * 微信内嵌二维码自定义样式有两种方式实现
       * 第一种是把自定义样式写在一个css文件里面，部署到一个https链接上
       * 第二种是把自定义样式通过base64加密后设置在href上
       * */  
      let href="data:text/css;base64,LmxvZ2luUGFuZWwgLnRpdGxlew0KICBkaXNwbGF5OiBub25lOw0KfQ0KLmltcG93ZXJCb3ggLnFyY29kZXsNCiAgd2lkdGg6IDE2MHB4Ow0KfQ=="
      new WxLogin({
          self_redirect: false,
          id: "wx_login_container",
          appid: "wx3c857b771dbcd5fa", //微信开放平台网站应用appid
          scope: "snsapi_login",
          redirect_uri: qrObj.redirectUri, //设置扫码成功后回调页面
          state: qrObj.state,
          style: "black",
          href: href, //location.origin + "/css/wx_qrcode.css", //自定义微信二维码样式文件
      });      
    }    
    if(getSearchString('code')&&getSearchString('state')){
      //微信登录
      wxlogin(getSearchString('code'),getSearchString('state'))
    }
    // wxlogin('001sjvPY1yU7LV0O7ALY1F4zPY1sjvPr','2323')
  }, [type]);

  const getUrl=()=>{
    qrcode({}).then(res=>{
      if(res.result){
        setQrObj(res.data)
      }
    })
  }

  const wxlogin =(code:string,state:string)=>{
    wechatLogin({code:code,state:state}).then(res=>{
      if(res.status==3001){
        setVisible(true)
        setOpenId(res.data.openId)
      }else if(res.result){
        localStorage.setItem('token',res.data.token) 
        localStorage.setItem('userInfo',JSON.stringify(res.data.user))
        localStorage.setItem('menuList',JSON.stringify(res.data.menuList||'[]'))
        window.location.href = '/';
      }else{
        window.location.href = '/user/login';
      }
    })
  }

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    let val={...values,bind:false}
    dispatch({
      type: 'login/login',
      payload: { ...val, type },
    });
  };

  const bindLogin = (values:LoginParamsType)=>{
    let val={...values,bind:true,openId:openId}
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: {...val, type },
    });
    setVisible(false)
  }
  
  const changeTag=(e:any)=>{
    setType(e)     
  }

  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={changeTag} onSubmit={handleSubmit}>
        <Tab key="account" tab="微信登录">
          <div className={styles.wx_login} id="wx_login_container"></div>
        
        </Tab>
        <Tab key="mobile" tab="手机号登录">
          {status === 'error' && loginType === 'mobile' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          <Mobile
            name="mobile"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={60}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        </Tab>
        <Submit loading={submitting}>登录</Submit>
      </LoginForm>
      <Modal title="账号绑定" visible={visible} footer={null} onCancel={()=>{setVisible(false)}}>
      <LoginForm onSubmit={bindLogin}>
          <Mobile
            name="mobile"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="bindcode"
            placeholder="验证码"
            countDown={60}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        <Submit loading={submitting}>绑定</Submit>
      </LoginForm>
      </Modal>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);

