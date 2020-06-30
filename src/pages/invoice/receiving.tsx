import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Card, Form, Input, DatePicker, Button, Table, Modal, message ,Popconfirm} from 'antd';
import { addressPage, addressDefault, addressAdd, addressDelete, addressUpdate } from '@/services/invoice'
import './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export default (props: any) => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'addressee',
      key: 'addressee',
    },
    {
      title: '手机号',
      dataIndex: 'addresseePhone',
      key: 'addresseePhone',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      render: (tags: any) => (
        <div>
          <Button type="link" onClick={edit.bind(this, tags)}>编辑</Button>
          <Popconfirm title='确定要删除吗？' okText="是" cancelText="否" onConfirm={del.bind(this, tags.id)}>
            <Button type="link">删除</Button>
          </Popconfirm>
          {
            tags.useFlag == 1 ? (
              <Button type="link" disabled>默认</Button>
            ) : (
                <Button type="link" onClick={setDafult.bind(this, tags.id)}>设为默认</Button>
              )
          }
          <span></span>
        </div>
      )
    },
  ]
  const [data, setData] = useState([])
  const [isAdd, setStatus] = useState(true)
  const [curId, setCurId] = useState('')
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [formUser] = Form.useForm()
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })

  useEffect(() => {
    getData()
  }, []);


  const getData = () => {
    let val = form.getFieldsValue()
    let data = {
      page: pageInfo.page,
      limit: pageInfo.limit,
      search: val.search
    }
    addressPage(data).then(res => {
      if(res.result){
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

  const addUser = () => {
    formUser.resetFields()
    setStatus(true)
    setVisible(true)
  }

  const edit = (row: any) => {
    setStatus(false)
    setCurId(row.id)
    formUser.setFieldsValue(row)
    setVisible(true)
  }

  const setDafult = (id: string) => {
    addressDefault({ addressId: id }).then(res => {
      if (res.result) {
        message.info(res.message)
        getData()
      }
    })
  }

  const handleOk = () => {
    formUser.validateFields().then(values => {
      let obj = values
      if (isAdd) {
        addressAdd(obj).then(res => {
          if (res.result) {
            message.info('新增成功！')
            getData()
          }
        })
      } else {
        obj.id = curId
        addressUpdate(obj).then(res => {
          if (res.result) {
            message.info('修改成功')
            getData()
          }
        })
      }
      setVisible(false)
    })
  }

  const del = (id: string) => {
    addressDelete({ addressId: id }).then(res => {
      if (res.result) {
        message.info('删除成功！')
        getData()
      }
    })
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <div className="detail">
      <Card title="收件信息查询" className="mb24">
        <Form layout="inline" form={form}>
          <Form.Item className="w200" name="search">
            <Input placeholder="姓名/手机号/地址"></Input>
          </Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
        </Form>
      </Card>
      <Card title="收件信息列表" extra={<Button onClick={addUser}>添加收件人</Button>}>
        <Table
          pagination={{
            pageSize: pageInfo.limit,
            total: pageInfo.total,
            onChange: changePage
          }}
          columns={columns} dataSource={data} ></Table>
      </Card>

      <Modal title={isAdd ? '新增收件人' : '修改收件人'} visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Form {...layout} form={formUser}>
          <Form.Item label="姓名" name="addressee">
            <Input placeholder="请输入姓名"></Input>
          </Form.Item>
          <Form.Item label="手机号码" name="addresseePhone">
            <Input placeholder="请输入手机号码"></Input>
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input.TextArea placeholder="请输入地址"></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
