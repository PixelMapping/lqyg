import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Row, Table, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {enterpriseChannels,taskList} from '@/services/settlement'
const { Option } = Select
import './index.less';


export default (props:any) => {
  const [channelList,setList] = useState([]) 
  const [data, setData] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [form] = Form.useForm()
  const columns = [
    {
      title: '发起时间',
      dataIndex: 'submitTime',
      key: "submitTime",
    },
    {
      title: '打款金额',
      dataIndex: 'payAmount',
      key: "payAmount",
    },
    {
      title: '收款人',
      dataIndex: 'name',
      key: "name",
    },
    {
      title: '收款账户',
      dataIndex: 'bankAccount',
      key: "bankAccount",
    },
    {
      title: '批次号',
      dataIndex: 'bathNo',
      key: "bathNo",
    },
    {
      title: '打款状态',
      dataIndex: 'status',
      key: "status",
      render:(tags:any)=>{
        let arr = ['打款完成','打款审核中','打款失败']
        return (arr[tags-1])
      }
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: "reason",
    },
    {
      title: '证件号码',
      dataIndex: 'idcard',
      key: "idcard",
    },
    {
      title: '打款通道',
      dataIndex: 'channelName',
      key: "channelName",
    },

  ];

  useEffect(() => {
    if(props.location.state){
      form.setFieldsValue({batchNo:props.location.state.bcatchNo})
      getList()
      getData()
    }else{
      getList()
      getData()
    }
  }, []);

  const getList=()=>{
    enterpriseChannels({}).then(res=>{
      if(res.result){
        setList(res.data)
      }
    })
  }

  const getData=()=>{
    let val = form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      status:val.status||'',
      taskInfo:val.taskInfo||'',
      channelId:val.channelId||'',
      userName:val.userName||'',
      batchNo:val.batchNo||'',
      batchId:''
    }
    taskList(data).then(res=>{
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

  const toDetail = () => {
    props.history.push('detail')
  }


  return (
    <div className="record">
      <Card title="批次查询" className="mb24">
        <Form layout="inline" form={form}>
          <Form.Item className="w150 mb10" name="status">
          <Select placeholder="打款状态" allowClear>
              <Option value="1"> 打款完成</Option>
              <Option value="2"> 打款审核中</Option>
              <Option value="3"> 打款失败</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w150" name="taskInfo">
            <Input maxLength={10} placeholder="任务名称"></Input>
          </Form.Item>
          <Form.Item className="w150" name="channelId">
            <Select placeholder="打款通道" allowClear>
              {
                channelList.map((item:any)=>{
                  return (
                  <Option value={item.id} key={item.id}> {item.name}</Option>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="userName">
            <Input maxLength={20} placeholder="收款人/手机号/证件号码"></Input>
          </Form.Item>
          <Form.Item className="w200" name="batchNo">
          <Input maxLength={20} placeholder="打款批次号"></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
          </Form.Item>
          {/* <Row className="mt16">
            <Form.Item className="w200">
              <Select placeholder="打款状态">
                <Option value="测试"> 测试</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Input.Group compact>
                <Button>充值金额</Button>
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
            </Form.Item>
            <Form.Item className="w200">
              <Select placeholder="打款方式">
                <Option value="测试"> 测试</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w200">
              <Input placeholder="收款账号"></Input>
            </Form.Item>
          </Row>
          <Row className="mt16">
            <Form.Item className="w200">
              <Select placeholder="结算方式">
                <Option value="测试"> 测试</Option>
              </Select>
            </Form.Item>
            <Form.Item className="w200">
              <Input placeholder="任务编号/任务名称"></Input>
            </Form.Item>
            <Form.Item className="w200">
              <Input placeholder="收款人/证件号码/手机号码"></Input>
            </Form.Item>
          </Row> */}
        </Form>
      </Card>

      <Card title="明细列表">

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
