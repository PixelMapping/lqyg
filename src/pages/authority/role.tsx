import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Card, Form, Input, Button, Table, Modal, Select, message, Drawer, Tree, Row } from 'antd';
const { Option } = Select
const { TreeNode } = Tree;
import { roleList, addOrUpdateRole, menuList ,deleteRole,saveRoleMenut,configRoleMenu} from '@/services/auth'

import './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export default (props: any) => {
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
    },
    {
      title: '添加时间',
      dataIndex: 'createTimeStr',
      key: 'createTimeStr',
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      render: (tags: any) => (
        <div>
          <Button type="link" onClick={edit.bind(this,tags)}>编辑</Button>
          <Button type="link" onClick={openModal.bind(this,tags)}>授权</Button>
          <Button type="link" onClick={del.bind(this,tags)}>删除</Button>
        </div>
      )
    },
  ]
  const [data, setData] = useState([])
  const [isAdd, setStatus] = useState(true)
  const [id, setId] = useState('')
  const [cur,setCur] = useState<any>({})
  const [visible, setVisible] = useState(false)
  const [showVisible, setShow] = useState(false)
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()
  const [treeData, setTree] = useState<any>([])
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState(['78']);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [halfKeys,setHalfKeys] = useState([])

  useEffect(() => {
    getData()
    getList()
  }, []);

  const getList = () => {
    menuList({}).then(res => {
      if(res.result){
        let arr = res.data.map((item:any)=>{
          return {
            title:item.menuName,
            pid:item.parentid,
            id:item.id,
            key:item.id+''
          }
        })
      
        let data = toTree(arr)
        setTree(data)        
      }

    })

  }
  const  toTree=(data:any)=> {
    let result:any[] = []
    if(!Array.isArray(data)) {
        return result
    }
    data.forEach(item => {
        delete item.children;
    });
    let map = {};
    data.forEach(item => {
        map[item.id] = item;
    });
    data.forEach(item => {
        let parent = map[item.pid];
        if(parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            result.push(item);
        }
    });
    return result;
}

  const getData = () => {
    let val = form.getFieldsValue()
    let enterpriseId = JSON.parse(localStorage.getItem('userInfo')).enterpriseId
    let data = {
      page: pageInfo.page,
      limit: pageInfo.limit,
      name: val.name || '',
      enterpriseId: enterpriseId
    }
    roleList(data).then(res => {
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


  const confirm = () => {
    let enterpriseId = JSON.parse(localStorage.getItem('userInfo')).enterpriseId
    modalForm.validateFields().then(val => {
      let data = {
        describe: val.describe,
        name: val.name,
        type: val.type,
        enterpriseId: enterpriseId
      }
      if (!isAdd) {
        data.id = id
      }
      addOrUpdateRole(data).then(res => {
        if (res.result) {
          if (isAdd) {
            message.info('添加成功！')
          } else {
            message.info('修改成功！')
          }
          getData()
          setVisible(false)
        }
      })
    })
  }
  const openModal = (row:any)=>{
    setCur(row)
    setShow(true)
    configRoleMenu({roleId:row.id}).then(res=>{
      if(res.result){
        let arr = res.data.map((item:any)=>item.id+'')
        let expands=['78',...arr]
        onExpand(expands)
        setCheckedKeys(arr)
      }
    })
  }

  const edit = (row: any) => {
    setStatus(false)
    setId(row.id)
    modalForm.setFieldsValue({ describe: row.describe, name: row.name, type: row.type })
    setVisible(true)
  }

  const del = (row:any) => {
    deleteRole({id:row.id}).then(res=>{
      if(res.result){
        message.info('删除成功！')
        getData()
      }
    })
  }

  const onCheck = (checkedKeys:any,checkedNodes:any) => {
    setHalfKeys(checkedNodes.halfCheckedKeys)
    setCheckedKeys(checkedKeys)
  };

  const submit=()=>{
    let arr = [...checkedKeys,...halfKeys]
    saveRoleMenut({
        roleId:cur.id,
        menuIds:arr.join(',')
      }).then(res=>{
        if(res.result){
          message.info('授权成功！')
        }
    })
    setShow(false)
  }

  const onExpand = (expandedKeys:any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  return (
    <div className="detail">
      <Card title="角色查询" className="mb24">
        <Form layout="inline" form={form}>
          <Form.Item className="w200" name="name">
            <Input placeholder="角色名称"></Input>
          </Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
        </Form>
      </Card>
      <Card title="角色列表" extra={<Button onClick={add}>添加角色</Button>}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: pageInfo.limit,
            total: pageInfo.total,
            onChange: changePage
          }}
        ></Table>
      </Card>
      <Modal title={isAdd ? '新增角色' : '修改角色'} onCancel={() => { setVisible(false) }} onOk={confirm} visible={visible}>
        <Form {...layout} form={modalForm}>
          <Form.Item label="角色名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入角色名称"></Input>
          </Form.Item>
          <Form.Item label="角色类型" name="type" rules={[{ required: true }]}>
            <Select placeholder="请选择">
              <Option value="0">管理员</Option>
              <Option value="1">普通角色</Option>
            </Select>
          </Form.Item>
          <Form.Item label="角色描述" name="describe" rules={[{ required: true }]}>
            <Input.TextArea placeholder="请输入描述"></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        title={`编辑权限 - ${cur.name}`}
        placement="right"
        onClose={() => { setShow(false) }}
        width="400"
        visible={showVisible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={()=>{setShow(false)}}  style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" onClick={submit}>
              确定
            </Button>
          </div>
        }
      >
        {
          treeData.length >0 && (
            <Tree
            checkable
            onExpand={onExpand}
            selectable={false}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}              
            />
          )
        }
        
      </Drawer>
    </div>
  );
};
