


export const menuData=[
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              name: '首页',
              icon: 'HomeOutlined',
              path: '/home',
              component: './home',
            },
            {
              name: '资产管理',
              icon: 'WalletOutlined',
              path: '/assets',
              routes: [
                {
                  path: '/assets/account',
                  name: '账号管理',
                  component: './assets',
                },
                {
                  path: '/assets/recharge',
                  name: '账户充值',
                  hideInMenu: true,
                  component: './assets/recharge',
                },
                {
                  path: '/assets/record',
                  name: '充值记录',
                  hideInMenu: true,
                  component: './assets/record',
                },
                {
                  path: '/assets/detail',
                  name: '充值记录详情',
                  hideInMenu: true,
                  component: './assets/detail',
                },
                {
                  path: '/assets/card',
                  name: '银行账户',
                  component: './assets/card',
                },
              ],
            },
            {
              name: '发票管理',
              icon: 'FileTextOutlined',
              path: '/invoice',
              routes: [
                {
                  path: '/invoice/apply',
                  name: '申请发票',
                  component: './invoice/apply',
                },
                {
                  path: '/invoice/record',
                  name: '发票记录',
                  component: './invoice/record',
                },
                {
                  path: '/invoice/detail',
                  name: '发票记录详情',
                  hideInMenu: true,
                  component: './invoice/detail',
                },
                {
                  path: '/invoice/receiving',
                  name: '收件信息',
                  component: './invoice/receiving',
                },
                {
                  path: '/invoice/invoice',
                  name: '发票信息',
                  component: './invoice/invoice',
                },
              ],
            },
            {
              name: '任务大厅',
              icon: 'CarryOutOutlined',
              path: '/task',
              component: './task',
            },
            {
              path: '/task/addTask',
              name: '发布任务',
              hideInMenu: true,
              component: './task/addTask',
            },
            {
              path: '/task/detail',
              name: '任务详情',
              hideInMenu: true,
              component: './task/detail',
            },
            {
              name: '结算管理',
              icon: 'PropertySafetyOutlined',
              path: '/settlement',
              routes: [
                {
                  path: '/settlement/money',
                  name: '批量打款',
                  component: './settlement/money',
                },
                {
                  path: '/settlement/batch',
                  name: '打款批次',
                  component: './settlement/batch',
                },
                {
                  path: '/settlement/detail',
                  name: '打款详情',
                  hideInMenu: true,
                  component: './settlement/detail',
                },
                {
                  path: '/settlement/detailTable',
                  name: '打款明细',
                  component: './settlement/detailTable',
                },
              ],
            },
            {
              name: '签约管理',
              icon: 'AuditOutlined',
              path: '/signing',
              routes: [
                {
                  path: '/signing/info',
                  name: '个人信息',
                  component: './signing/info',
                },
                {
                  path: '/signing/detail',
                  name: '个人详情',
                  hideInMenu: true,
                  component: './signing/detail',
                },
                {
                  path: '/signing/batch',
                  name: '签约批次',
                  component: './signing/batch',
                },
                {
                  path: '/signing/import',
                  name: '导入批量签约',
                  component: './signing/import',
                },
                {
                  path: '/signing/detailInfo',
                  name: '签约明细',
                  component: './signing/detailInfo',
                },
              ],
            },
           
            {
              path: '/',
              redirect: '/home',
            },
             {
              name: '权限管理',
              icon: 'LockOutlined',
              path: '/authority',
              authority: ['admin'],
              routes: [
                {
                  path: '/authority/user',
                  name: '用户管理',
                  component: './authority/user',
                },
                {
                  path: '/authority/role',
                  name: '角色管理',
                  component: './authority/role',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ]
 
