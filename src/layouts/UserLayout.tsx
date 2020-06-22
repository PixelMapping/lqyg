import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useIntl, ConnectProps, connect } from 'umi';
import React from 'react';
import SelectLang from '@/components/SelectLang';
import { ConnectState } from '@/models/connect';
import logo from '../assets/home_logo.png';
import styles from './UserLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>登录</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        
        <div className={styles.left}>
          <div className={styles.uselogo}> 
           <img src={logo} />          
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.phone}>服务热线：400-9600-888</div>
        {children}
          <div className={styles.bottom}>            
          
          南京智企舜联信息科技有限公司版权所有 © 2020
          <br/>          
          Copyright © 2020 zhiqishunlian.All Rights Reserved.                            
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
