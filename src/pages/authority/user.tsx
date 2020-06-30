import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Card, Form, Input, Button, Table, Modal, Select, message ,Popconfirm} from 'antd';
const { Option } = Select
import { userList, addSubUser, getRoleList, forbidLogin, disableUser } from '@/services/auth'

import './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export default (props: any) => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '登录手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '添加时间',
      dataIndex: 'crtTime',
      key: 'crtTime',
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      render: (tags: any) => (
        <div>
          <Button type="link" onClick={edit.bind(this, tags)}>编辑</Button>
          {
            tags.loginFlag == 0 ? (
              <Button type="link" onClick={forbid.bind(this, tags, 1)}>禁止登陆</Button>
            ) : (
                <Button type="link" onClick={forbid.bind(this, tags, 0)}>启用登陆</Button>
              )
          }
          <Popconfirm placement="top" title='确定要禁用吗？' onConfirm={disable.bind(this, tags)} okText="是" cancelText="否">
            <Button type="link" >禁用</Button>
          </Popconfirm>
        </div>
      )
    },
  ]
  const [data, setData] = useState([])
  const [isAdd, setStatus] = useState(true)
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [userId, setId] = useState('')
  const [modalForm] = Form.useForm()
  const [list, setList] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })

  useEffect(() => {
    getData()
    getList()
  }, []);

  const getList = () => {
    getRoleList({}).then(res => {
      if (res.result) {
        setList(res.data)
      }
    })
  }
  const getData = () => {
    let val = form.getFieldsValue()
    let data = {
      phone: val.phone || '',
      name: val.name || '',
      loginFlag: val.loginFlag || '',
      page: pageInfo.page,
      limit: pageInfo.limit,
      roleId: val.roleId || ''
    }
    userList(data).then(res => {
      if (res.result) {
        setData(React.setKey(res.data.rows))
        let obj = { ...pageInfo }
        obj.total = res.data.total
        setPage(obj)
      }
    })
  }

  const changePage = (current: number) => {
    pageInfo.page = current
    setPage(pageInfo)
    getData()
  }

  const add = () => {
    setVisible(true)
    setStatus(true)
    modalForm.resetFields()
  }

  const edit = (row: any) => {
    setStatus(false)
    modalForm.setFieldsValue({ name: row.name, phone: row.phone, idcard: row.idcard, roleId: row.roleId })
    setVisible(true)
    setId(row.userId)
  }

  const confirm = () => {
    modalForm.validateFields().then(val => {
      let data = {
        phone: val.phone,
        name: val.name,
        idcard: val.idcard,
        roleId: val.roleId
      }

      if (!isAdd) {
        data.userId = userId
      }

      addSubUser(data).then(res => {
        if (res.result) {
          if (isAdd) {
            message.info('添加成功！')
          } else {
            message.info('修改成功！')
          }
          getData()

        }
      })
      setVisible(false)
    })
  }

  const forbid = (row: any, type) => {
    forbidLogin({ userId: row.userId, loginFlag: type }).then(res => {
      if (res.result) {
        if (type == 1) {
          message.info('禁止登陆成功')
        } else {
          message.info('启用登陆成功')
        }
        getData()
      }
    })
  }

  const disable = (row: any) => {
    disableUser({ userId: row.userId, delFlag: 1 }).then(res => {
      if (res.result) {
        message.info('禁用成功！')
        getData()
      }
    })
  }


  return (
    <div className="detail">
      <Card title="用户管理查询" className="mb24">
        <Form layout="inline" form={form}>
          <Form.Item className="w200" name="name">
            <Input placeholder="姓名"></Input>
          </Form.Item>
          <Form.Item className="w200" name="phone">
            <Input placeholder="登陆手机号"></Input>
          </Form.Item>
          <Form.Item className="w200" name="roleId">
            <Select placeholder="角色" allowClear>
              {
                list.map((item: any) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="loginFlag">
            <Select placeholder="是否禁止登录" allowClear>
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          </Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
        </Form>
      </Card>
      <Card title="用户列表" extra={<Button onClick={add}>添加用户</Button>}>
        <Table
          pagination={{
            pageSize: pageInfo.limit,
            total: pageInfo.total,
            onChange: changePage
          }}
          columns={columns}
          dataSource={data}
        ></Table>
      </Card>

      <Modal title={isAdd ? '新增用户' : '修改用户'} onCancel={() => { setVisible(false) }} onOk={confirm} visible={visible}>
        <Form {...layout} form={modalForm}>
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名"></Input>
          </Form.Item>
          <Form.Item label="手机号码" name="phone" rules={[{ required: true }]}>
            <Input placeholder="请输入手机号码"></Input>
          </Form.Item>
          <Form.Item label="身份证号" name="idcard" >
            <Input placeholder="请输入身份证号"></Input>
          </Form.Item>
          <Form.Item label="角色" name="roleId" rules={[{ required: true }]}>
            <Select placeholder="请选择角色" >
              {
                list.map((item: any) => {
                  return (
                    <Option value={item.id+''} key={item.id}>{item.name}</Option>
                  )
                })
              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
