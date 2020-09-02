import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Input, Select, Button, Row, Table, Card, message } from 'antd';
import { SearchOutlined ,CheckCircleOutlined ,InfoCircleOutlined} from '@ant-design/icons';
import { recordPage, confirmReceive } from '@/services/invoice'
import moment from "moment";
import { invoiceChannelList } from '@/services/global'
const { Option } = Select
import './index.less';



export default (props) => {

  const [data, setData] = useState([])
  const [selectedRowKeys, setKeys] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [list,setList] = useState([])
  const [form] = Form.useForm()
  const columns = [
    {
      title: '申请时间',
      dataIndex: 'submitTime',
      key: "submitTime",
    },
    {
      title: '充值通道',
      dataIndex: 'channelName',
      key: "channelName",
    },
    {
      title: '发票金额',
      dataIndex: 'invoiceMoney',
      key: "invoiceMoney",
    },
    {
      title: '开票内容',
      dataIndex: 'invoiceContent',
      key: "invoiceContent",
    },
    {
      title: '开票状态',
      dataIndex: 'invoiceStatus',
      key: "invoiceStatus",
      render: (tags: any) => {
        let arr = ['审核中', '开票中', '已开票', '已驳回', '已邮寄', '已签收']
        return (
          <span>{arr[tags - 1]}</span>
        )
      }
    },
    {
      title: '收票状态',
      dataIndex: 'receiveStatus',
      key: "receiveStatus",
      render: (tags: any) => {
        let arr = ['已收票', '未收票']
        return (
          <span>{arr[tags - 1]}</span>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (tags: any) => (
        <div>
          <Button type="link" icon={<CheckCircleOutlined />} disabled={ tags.invoiceStatus ==5 ? false : true} onClick={confirm.bind(this, tags.applyInvoiceId)}>确认收票</Button>
          <Button type="link" icon={<InfoCircleOutlined />} onClick={toDetail.bind(this, tags.applyInvoiceId)}>查看详情</Button>
        </div>

      )
    }
  ];

  useEffect(() => {
    getData()
    getList()
  }, []);

  const getList=()=>{
    invoiceChannelList({}).then(res=>{
      if(res){
        setList(res.data)
        // form.setFieldsValue({channelId:res.data[0].channelId})
      }
    })
  }
  const getData = () => {
    let val = form.getFieldsValue()
    let data = {
      page: pageInfo.page,
      limit: pageInfo.limit,
      channelId: val.channelId||'',
      startDate:val.startDate?moment(val.startDate).format('YYYY-MM-DD'):'',
      endDate:val.endDate?moment(val.endDate).format('YYYY-MM-DD'):'',
      invoiceStatus:val.invoiceStatus||'',
      receiveStatus:val.receiveStatus||''
    }
    recordPage(data).then(res => {
      setData(React.setKey(res.data.rows))
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

  const confirm = (id: string) => {
    confirmReceive({ applyInvoiceId: id }).then(res => {
      if(res.result){
        message.info('收票成功！')
        getData()
      }

    })
  }


  const toDetail = (id: string) => {
    props.history.push({ pathname: 'detail', state: { id: id } })
  }
  return (
    <div className="record">
      <Card title="记录查询" className="mb24">
        <Form form={form}>
          <Row>
            <Form.Item className="w150 mr10" name="channelId">
            <Select placeholder="通道列表">
            {
              list.map((item:any)=>{
                return (
                <Option value={item.channelId} key={item.channelId}> {item.name}</Option>
                )
              })
            }
              </Select>
            </Form.Item>
            <Form.Item  name="startDate">
              <DatePicker className="w150 mr10" placeholder="开始时间"></DatePicker>
            </Form.Item>
            <Form.Item name="endDate">
              <DatePicker className="w150 mr10" placeholder="结束时间"></DatePicker>
            </Form.Item>
            <Form.Item className="w150 mr10" name="invoiceStatus">
              <Select allowClear placeholder="开票状态">
                <Option value="0">未开票</Option>
                <Option value="1">审核中</Option>
                <Option value="2">开票中</Option>
                <Option value="3">已开票</Option>
                <Option value="4">已驳回</Option>
                <Option value="5">已邮寄</Option>
                <Option value="6">已签收</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w150 mr10" name="receiveStatus">
              <Select allowClear placeholder="收票状态">
                <Option value="1">已收票</Option>
                <Option value="2">未收票</Option>
              </Select>
            </Form.Item>
            {/* <Form.Item className="w200 mr10">
              <Select placeholder="申请方式">
                <Option value="测试"> 测试</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w200 mr10">
              <Input placeholder="通道"></Input>
            </Form.Item>
            <Form.Item className="mr10">
              <Input.Group compact>
                <Button>发票金额</Button>
                <Input style={{ width: 130, textAlign: 'center' }} placeholder="最小值" />
                <Input
                  className="site-input-split"
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: 'none',
                  }}
                  placeholder="~"
                  disabled
                />
                <Input
                  className="site-input-right"
                  style={{
                    width: 126,
                    textAlign: 'center',
                    borderLeft: 0,
                  }}
                  placeholder="最大值"
                />
                <Button>元</Button>
              </Input.Group>
            </Form.Item> */}
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
            </Form.Item>
          </Row>
          {/* <Row>
            <Form.Item className="w200 mr10">
              <Select placeholder="开票状态">
                <Option value="测试"> 测试</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w200 mr10">
              <DatePicker placeholder="开票时间" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item className="w200 mr10">
              <Select placeholder="收票状态">
                <Option value="测试"> 测试</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w200 mr10">
              <DatePicker placeholder="收票时间" style={{ width: '100%' }} />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item className="w200 mr10">
              <Input placeholder="开票内容"></Input>
            </Form.Item>            
          </Row> */}
        </Form>
      </Card>
      
      <Card title="发票列表">
        <Table
       
          pagination={{
            pageSize: pageInfo.limit,
            total: pageInfo.total,
            onChange: changePage
          }}
          columns={columns}
          dataSource={data}
        />
      </Card>
    </div>

  );
};
