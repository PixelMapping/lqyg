import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Table, message, Upload } from 'antd';
import { getTaskDetail, employment, employmentAll, enrollmentManagementList } from '@/services/task'
import excel from '@/utils/excel'
import myContext from './creatContext'
import moment from 'moment';
const { Option } = Select
import '../index.less';
import info from '@/pages/signing/info';


const exCol = [
  {
    title: '任务编号*',
    key: 'taskNum'
  },
  {
    title: '姓名*',
    key: 'userName'
  },
  {
    title: '证件类型*',
    key: 'certifiteType'
  },
  {
    title: '证件号码*',
    key: 'idcard'
  },
  {
    title: '手机号*',
    key: 'userPhone'
  },
]

export default () => {
  const [data, setData] = useState([])
  const [keys, setKeys] = useState([])
  const id = useContext(myContext).id
  const taskStatus = useContext(myContext).taskStatus
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [form] = Form.useForm();
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
      title: '签约状态',
      key: 'signSuccessFlagName',
      dataIndex: 'signSuccessFlagName'
    },
    {
      title: '报名类型',
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: '收款方式',
      key: 'paymentMethod',
      dataIndex: 'paymentMethod'
    },
    {
      title: '报名时间',
      key: 'crtTime',
      dataIndex: 'crtTime'
    },
    {
      title: '报名状态',
      key: 'statusName',
      dataIndex: 'statusName'
    },
    {
      title: '操作',
      key: "action",
      render: (tags: any) => (
        <div>
          <Button type="link" disabled={tags.status == 0 ? false : true} onClick={handClick.bind(this, tags.enrollId, '1')}>录用</Button>
          <Button type="link" disabled={tags.status == 0 ? false : true} onClick={handClick.bind(this, tags.enrollId, '2')}>不录用</Button>
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
      status: 1,
      taskId: id,
      search: values.search || '',
      certifiteType: values.certifiteType || '',
      enrollType: values.enrollType || '',
      enrollStatus: values.enrollStatus || '',
      enrollTime: values.enrollTime ? moment(values.enrollTime).format('YYYY-MM-DD') : ''
    }
    getTaskDetail(data).then(res => {
      let arr = res.data.rows.map((item: any) => {
        return {
          ...item,
          key: item.enrollId
        }
      })
      setData(arr)
      let obj = { ...pageInfo }
      obj.total = res.data.total
      setPage(obj)
    })
  }

  const changePage = (current: number) => {
    pageInfo.page = current
    setPage(pageInfo)
    getData()
  }


  const handClick = (id: string, type: string) => {
    employment({ enrollIds: id, type: type, showLoading: true }).then(res => {
      if(res.result){
        setData([])
        getData()
        message.info(res.message)
      }
      
    })
  }


  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setKeys(selectedRowKeys)
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    // getCheckboxProps: (record:any) => ({
    //   disabled: record.status != '0', // Column configuration not to be checked
    // }),
  };

  const batch = (type: string) => {
    if (keys.length == 0) {
      message.info('请选中数据！')
      return
    }
    let id = keys.join(',')
    handClick(id, type)
  }

  const allEmploy = () => {
    employmentAll({ taskId: info.id }).then(res => {
      if (res.result) {
        message.info(res.message)
        getData()
      }
    })
  }

  const uploadProps = {
    name: 'file',
    action: '/client/enroll/importEmployUser.do',
    headers: {
      authorization: localStorage.getItem('token'),
      "User-Client": 'client'
    },
    data:{
      taskId: id
    },
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status === 'done') {
        let text = info.fileList[info.fileList.length - 1].response.message
        message.info(text)
        getData()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const exportTable = () => {
    let data = {
      taskId: id,
    }

    enrollmentManagementList(data).then(res => {
      if (res.result) {
        let col = [...exCol]
        excel.exportExcel(col, res.data, '报名名单下载.xlsx')
      }
    })
  }




  return (
    <div>
      <Card title="任务信息" className="mb24">
        <Form layout="inline" form={form} onFinish={getData}>
          <Form.Item className="w200" name="search">
            <Input placeholder="姓名/手机号/证件号码"></Input>
          </Form.Item>
          <Form.Item className="w200" name="certifiteType">
            <Select placeholder="证件类型" allowClear>
              <Option value="1">身份证</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="enrollStatus">
            <Select placeholder="报名状态" allowClear>
              <Option value="0">已报名</Option>
              <Option value="1">已录用</Option>
              <Option value="2">未录用</Option>
              <Option value="3">已签约</Option>
              <Option value="4">未签约</Option>
              <Option value="5">提交验证</Option>
              <Option value="6">验收通过</Option>
              <Option value="7">验收未通过</Option>
              <Option value="8">结算完成</Option>
              <Option value="9">未结算</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="enrollTime">
            <DatePicker placeholder="报名时间" style={{ width: '100%' }}></DatePicker>
          </Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Form>
      </Card>
      <Card
        title="报名名单"
        extra={
          <div>
            {/* <Button className="mr10" onClick={allEmploy}>全部录用</Button> */}
            <Button className="mr10" onClick={batch.bind(this, '1')}>批量录用</Button>
            {/* <Button className="mr10" onClick={handleDownExcel}>下载导入模板</Button> */}
            <Button href="http://lqyg.shunshuitong.net/resource/template/employUserTemplate.xlsx" download="导入名单模板" className="mr10">下载导入模板</Button>
            <Upload disabled={(taskStatus == 1 || taskStatus == 2) ? true : false} {...uploadProps}><Button className="mr10" disabled={(taskStatus == 1 || taskStatus == 2) ? true : false}>导入名单并录用</Button></Upload>
            <Button className="mr10" onClick={batch.bind(this, '2')}>批量不录用</Button>
            <Button onClick={exportTable}>导出名单</Button>
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
          rowSelection={{
            ...rowSelection,
          }}
        ></Table>
      </Card>
    </div>
  );
};
