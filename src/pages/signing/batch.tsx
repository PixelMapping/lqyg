import React, { useState, useEffect } from 'react';
import { SearchOutlined ,FileTextOutlined} from '@ant-design/icons';
import { Card, Form, Input, DatePicker, Button, Table, Modal, Select } from 'antd';
const { Option } = Select
import moment from 'moment'
import { signBatchPage } from '@/services/sign'
import { tempPage } from '@/services/global'
import './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export default (props: any) => {
  const columns = [
    {
      title: '批次号',
      dataIndex: 'batchNo',
      key: 'batchNo',
    },
    {
      title: '签约发起时间',
      dataIndex: 'crtTime',
      key: 'crtTime',
    },
    {
      title: '协议模板',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '协议发送数量',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '已签约人数',
      dataIndex: 'signCount',
      key: 'signCount',
    },
    {
      title: '撤销协议数量',
      dataIndex: 'cancelCount',
      key: 'cancelCount',
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      render: (tags: any) => (
        <div>
          <Button type="link" icon={<FileTextOutlined />} onClick={toDetail.bind(this, tags.batchNo)}>签约明细</Button>
        </div>
      )
    },
  ]
  const [data, setData] = useState([])
  const [isAdd, setStatus] = useState(true)
  const [visible, setVisible] = useState(false)
  const [list, setList] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [form] = Form.useForm()


  useEffect(() => {
    getData()
    getList()
  }, []);

  const getList = () => {
    tempPage({}).then(res => {
      if (res.result) {
        setList(res.data)
      }
    })
  }

  const getData = () => {
    let val = form.getFieldsValue()
    let data = {
      page: pageInfo.page,
      limit: pageInfo.limit,
      batchNo: val.batchNo || '',
      templateId: val.templateId || '',
      crtTime: val.crtTime ? moment(val.crtTime).format('YYYY-MM-DD') : ''
    }
    signBatchPage(data).then(res => {
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

  const toDetail = (batchNo: string) => {
    props.history.push({ pathname: 'detailInfo', state: { batchNo: batchNo } })
  }





  const importData = () => {
    props.history.push('import')
  }

  return (
    <div >
      <Card title="签约批次查询" className="mb24">
        <Form layout="inline" className="w1200" form={form}>

          <Form.Item className="w200" name="batchNo">
            <Input maxLength={20} placeholder="批次号"></Input>
          </Form.Item>
          <Form.Item className="w200" name="crtTime">
            <DatePicker className="w200" placeholder="签约发起时间"></DatePicker>
          </Form.Item>
          <Form.Item className="w200" name="templateId">
            <Select placeholder="协议模板" allowClear>
              {
                list.map((item: any) => {
                  return (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item className="w200" >
            <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="个体列表" className="batch-card" extra={<Button onClick={importData}>导入并批量签约</Button>}>
        <div className="des">3天内没有签约的个体，智企舜联会帮助您发送短信提醒，时间在每天上午9:00和下午6:00</div>
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

      <Modal title={isAdd ? '新增收件人' : '修改收件人'} visible={visible}>
        <Form {...layout}>
          <Form.Item label="姓名">
            <Input placeholder="请输入姓名"></Input>
          </Form.Item>
          <Form.Item label="手机号码">
            <Input placeholder="请输入手机号码"></Input>
          </Form.Item>
          <Form.Item label="地址">
            <Input.TextArea placeholder="请输入地址"></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </div>

  );
};
