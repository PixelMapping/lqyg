import {  SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { history, ConnectProps, connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import { DownOutlined } from '@ant-design/icons';
import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;
    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    if(key === 'remove'){
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/remover',
        });
      }

      return;
    }

    // history.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    let {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;
    let user = JSON.parse(localStorage.getItem('userInfo')) 
    currentUser.name=user.name
    currentUser.avatar=''
    currentUser.account=user.enterpriseName
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}
          
        <Menu.Item key="logout">
          退出登录
        </Menu.Item>
        {
          (user.openId!=''&&user.openId)&&(
            <Menu.Item key="remove">
              解除微信绑定
            </Menu.Item>
          )
        }        
      </Menu>
    );
    return currentUser && currentUser.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" /> */}
          <span style={{padding:'0 15px'}}>{currentUser.account }</span>
          <span style={{paddingRight:'10px'}} className={styles.name}>{currentUser.name}</span>
          <DownOutlined></DownOutlined>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
