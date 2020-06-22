import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Card,Form,Input,DatePicker,Button,Table,Modal,Select} from 'antd';
const {Option} = Select
import { channelList} from '@/services/asset'
import { enterprisePage} from '@/services/merchant'
import './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export default (props:any) => {
  const [form] = Form.useForm()
  const columns=[
    {
      title:'实际开票日期',
      dataIndex:'billingTime',
      key:'billingTime',
    },
    {
      title:'开票金额',
      dataIndex:'invoiceMoney',
      key:'invoiceMoney',
    },
    {
      title:'发票类型',
      dataIndex:'invoiceType',
      key:'invoiceType',
      render:(tags:any)=>{
      return (<span>{tags=='1'?'增值税发票':'增值税专用发票'}</span>)
      }
    },    
    {
      title:'开票内容',
      dataIndex:'invoiceContent',
      key:'invoiceContent',
    },  
    {
      title:'发票抬头',
      dataIndex:'invoiceTitle',
      key:'invoiceTitle',
    },  
    {
      title:'税号',
      dataIndex:'taxNumber',
      key:'taxNumber',
    },  
    {
      title:'银行账号',
      dataIndex:'bankAccount',
      key:'bankAccount',
    },  
    {
      title:'开户行',
      dataIndex:'openBank',
      key:'openBank',
    },  
    {
      title:'单位地址',
      dataIndex:'unitAddress',
      key:'unitAddress',
    },  
    {
      title:'单位电话',
      dataIndex:'unitTel',
      key:'unitTel'      
    },
  ]
  const [data,setData] = useState([{name:222}])
  const [isAdd,setStatus] = useState(true)
  const [visible,setVisible] = useState(false)
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })

  useEffect(() => {
    getData()
  }, []);

  const getData =()=>{
    let val = form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      search:val.search?val.search:'',
      crtTime:val.crtTime?val.crtTime:'',
      channelId:val.channelId?val.channelId:''
    }
    enterprisePage(data).then(res=>{
      
      // setData(React.setKey(res.data.rows))
      // let obj = { ...pageInfo }
      // obj.total = res.data.total
      // setPage(obj)
    })
  }



  const changePage = (current: number) => {
    pageInfo.page = current
    setPage(pageInfo)
    getData()
  }

  return (
    <div className="detail">
        <Card title="商户查询" className="mb24">
          <Form layout="inline" form={form}>
            <Form.Item className="w200" name="search">
              <Input placeholder="姓名/手机号/地址"></Input>
            </Form.Item>      
            <Form.Item className="w200" name="crtTime">
              <DatePicker placeholder="请选择日期"></DatePicker>
            </Form.Item>    
            <Form.Item className="w200" name="channelId">
              <Select placeholder="签约通道">
                <Option value="测试">测试</Option>
              </Select>
            </Form.Item>    
            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          </Form>
        </Card>
        <Card title="发票信息列表" >
          {/* <div className="mb10"><Button className="mr10">导出选中</Button> <Button>导出检索结果</Button></div> */}
          <Table 
          
            pagination={{
              pageSize: pageInfo.limit,
              total: pageInfo.total,
              onChange: changePage
            }}
            columns={columns} dataSource={data} ></Table>
        </Card>

        <Modal title={isAdd?'新增收件人':'修改收件人'} visible={visible}>
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
