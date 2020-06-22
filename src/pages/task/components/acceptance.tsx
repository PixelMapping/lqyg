import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Table, Row, message, Modal } from 'antd';
import { getTaskDetail, employmentAll, checkTask ,taskAcceptanceList} from '@/services/task'
import excel from '@/utils/excel'
import Zmage from 'react-zmage'
const { Option } = Select

import moment from 'moment';
import '../index.less';
import myContext from './creatContext'

export default () => {
  const [data, setData] = useState([])
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false)
  const cur = useContext(myContext).cur
  const [urls, setUrls] = useState<any>([{src:''}])
  const id = useContext(myContext).id
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const columns = [
    {
      title: '姓名',
      key: 'userName',
      dataIndex: 'userName'
    },
    {
      title: '手机号',
      key: 'userPhone',
      dataIndex: 'userPhone'
    },
    {
      title: '证件类型',
      key: 'certifiteType',
      dataIndex: 'certifiteType',
    },
    {
      title: '证件号码',
      key: 'idcard',
      dataIndex: 'idcard'
    },
    {
      title: '报名类型',
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: '提交验收时间',
      key: 'submitTime',
      dataIndex: 'submitTime'
    },
    {
      title: '工作状态',
      key: 'statusName',
      dataIndex: 'statusName',

    },
    {
      title: '验收/驳回时间',
      key: 'checkTime',
      dataIndex: 'checkTime'
    },
    {
      title: '任务反馈',
      key: 'action',
      render: (tags: any) => (<Button type="link" onClick={toView.bind(this, tags.dataUrls)}>查看</Button>)
    },
    {
      title: '操作',
      key: "action",
      render: (tags: any) => (
        <div>
          <Button type="link" disabled={tags.status == 5 ? false : true} className="mr10" onClick={check.bind(this, tags.enrollId, 1)}>通过</Button>
          <Button type="link" disabled={tags.status == 5 ? false : true} className="mr10" onClick={check.bind(this, tags.enrollId, 2)}>不通过</Button>
        </div>
      )
    }
  ]


  useEffect(() => {
    if (id) {
      getData()
    }
  }, [id]);

  const getData = () => {
    let values = form.getFieldsValue()
    let data = {
      page: pageInfo.page,
      limit: pageInfo.limit,
      status: 2,
      taskId: id,
      search: values.search||'',
      certifiteType: values.certifiteType||'',
      enrollType: values.enrollType||'',
      enrollStatus: values.enrollStatus||'',
      enrollTime: values.enrollTime ? moment(values.enrollTime).format('YYYY-MM-DD') : '',
      checkTime: values.checkTime ? moment(values.checkTime).format('YYYY-MM-DD') : ''
    }
    getTaskDetail(data).then(res => {
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

  const exTable = ()=>{
    let exCol=[...columns]
    exCol.pop()
    taskAcceptanceList({taskId:id}).then(res=>{
      if(res.result){
        excel.exportExcel(exCol,res.data,'验收名单.xlsx')
      }
    })
  }

  const check = (enrollId: string, type: number) => {
    checkTask({ enrollId: enrollId, type: type }).then(res => {
      if (res.result) {
        message.info('验收成功！')
        getData()
      }
    })
  }

  const checkAll = () => {
    employmentAll({ taskId: id }).then(res => {
      if (res.result) {
        message.info('验收成功！')
        getData()
      }
    })
  }

  const toView = (urls: any) => {
    let arr = urls.split(',')
    if (urls.length == 0) {
      message.info('暂无验收图片！')
      return
    }
    let obj = arr.map((item: string) => {
      return {
        src: item,
        alt: item
      }
    })
    console.log(obj)
    setUrls(obj)

    setVisible(true)
  }

  return (
    <div>
      <Card title="任务信息" className="mb24">
        <Form layout="inline" form={form} onFinish={getData}>
          <Form.Item className="w200" name="search">
            <Input placeholder="姓名/手机号/证件号码"></Input>
          </Form.Item>
          <Form.Item className="w200" name="enrollType">
            <Select placeholder="证件类型" allowClear>
              <Option value="1">身份证</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="certifiteType">
            <Select placeholder="报名类型" allowClear>
              <Option value="1">小程序报名</Option>
              <Option value="2">平台导入</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="enrollStatus">
            <Select placeholder="验收状态" allowClear>
              <Option value="5">提交验证</Option>
              <Option value="6">验收通过</Option>
              <Option value="7">验收未通过</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="submitTime">
            <DatePicker placeholder="提交验收时间" style={{ width: '100%' }}></DatePicker>
          </Form.Item>
          <Form.Item className="w200" name="checkTime">
            <DatePicker placeholder="验收/驳回时间" style={{ width: '100%' }}></DatePicker>
          </Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Form>
      </Card>
      <Card
        title="验收名单"
        extra={
          <div>
            {/* <Button onClick={checkAll} className="mr10">全部录用</Button> */}
            <Button onClick={exTable}>下载名单</Button>
          </div>
        }
      >
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
      <Modal
        title="查看反馈"
        visible={visible}
        width="600px"
        onCancel={()=>{setVisible(false)}}
        onOk={()=>{setVisible(false)}}
      >
        <div className="imgs">
        <Zmage
          src={urls[0].src}
          alt="展示序列图片"
          set={urls}
        />
        <p style={{color:"#ff0000"}}>点击查看多张图片</p>
        </div>
        
      </Modal>
    </div>
  );
};
