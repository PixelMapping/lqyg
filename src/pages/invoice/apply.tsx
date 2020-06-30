import React, { useState, useEffect } from 'react';
import { Card, Table, Radio, Button, Modal, Form, Input, Select, DatePicker, Row, Col,message } from 'antd';
import { unbilledPage,applyData,applyInvoice } from '@/services/invoice'
import { channelList } from '@/services/asset'
import moment from "moment";
const { Option } = Select
import './index.less';
import { getMenuData } from '@ant-design/pro-layout';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
export default (props: any) => {
  const [curren, setCurren] = useState("1")
  const [curName,setCurName] = useState('')
  const [list, setList] = useState([])
  const [formList,setFormList] = useState<any>({addressList:[],invoiceContentList:[]})
  const [data, setData] = useState([])
  const [invoiceData,setInvoice] = useState({})
  const [selectedRowKeys, setKeys] = useState([])
  const [visible, setVisible] = useState(false)
  const [total, setTotal] = useState(0)
  const [form] = Form.useForm()
  const [searFrom] = Form.useForm()
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const columns = [
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime'
    },
    {
      title: '打款通道',
      dataIndex: 'channelName',
      key: 'channelName'
    },
    {
      title: '充值方式',
      dataIndex: 'rechargeType',
      key: 'rechargeType',
      render: (tags: any) => {
        let arr = ['线下支付(银行转账)', '支付宝支付', '微信支付']
        return (
          <span>{arr[tags - 1]}</span>
        )
      }
    },
    {
      title: '充值金额',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: '实际到账金额',
      dataIndex: 'actualAmount',
      key: 'actualAmount'
    },
    {
      title: '操作',
      key: 'action',
      render: (tags: any) => (
        <Button type="link" onClick={toDetail.bind(this, tags.rechargeId)}>查看详情</Button>
      )
    },
  ];
  useEffect(() => {
    if(curren=='1'){
      getList()
    }
    getData()

  }, [curren]);
  const getList = () => {
    channelList({}).then(res => {
      setList(res.data)
    })

    applyData({}).then(res=>{
      setFormList(res.data)
      let obj={
        invoiceTitle:res.data.invoiceTitle==''?'':res.data.invoiceTitle,
        taxNumber:res.data.taxNumber,
        unitAddress:res.data.unitAddress,
        unitTel:res.data.unitTel
      }
      // form.setFieldsValue(obj)
      setInvoice(obj)
      
    })
  }
  const getData = () => {
    let val = searFrom.getFieldsValue()
    let data = {
      page: pageInfo.page,
      limit: pageInfo.limit,
      channelId: curren == '1'?'':curren,
      startDate:val.startDate?moment(val.startDate).format('YYYY-MM-DD'):'',
      endDate:val.endDate?moment(val.endDate).format('YYYY-MM-DD'):''
    }
    unbilledPage(data).then(res => {
      let rows=res.data.rows.map(item=>{
        return {...item,key:item.rechargeId}
      })
      setData(rows)
    })
  }

  const changePage = (current: number) => {
    pageInfo.page = current
    setPage(pageInfo)
    getData()
    
  }
  
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setKeys(selectedRowKeys)
      let total =  0
      selectedRows.forEach((item:any)=>{
        total+=rmoney(item.actualAmount)
      })
      setTotal(financial(total))
      function rmoney(e:any) { 
            return parseFloat(e.replace(/[^\d\.-]/g, "")); 
        } 
    },
    getCheckboxProps: (record: any) => ({
      disabled: curren == '1' ? true : false, // Column configuration not to be checked
      name: record.name,
    }),
  };
  const financial=(x:string)=> {
    return Number.parseFloat(x).toFixed(2);
  }
  const toDetail = (id: string) => {
    props.history.push({ pathname: '/assets/detail', state: { rechargeId: id } })
  }
  const handRadio = async(e: any) => {    
    let val = e.target.value
    setKeys([])
    setTotal(0)
    setCurren(val)
    let arr = list.filter(item=>item.channelId==val)
    if(arr.length>0){
      setCurName(arr[0].name)
    }    
  }

  const Apply = ()=>{
    setVisible(true)
    form.setFieldsValue({...invoiceData,invoiceMoney:total})
  }

  const handleOk = (e: any) => {
    form.validateFields().then(values=>{
      let data = {...values}
      data.hopeTime=moment(values.hopeTime).format('YYYY-MM-DD')
      data.rechargeIds=selectedRowKeys.join(',')
      applyInvoice(data).then(res=>{
        if(res.result){
        message.info('申请成功')
        getData()
        setVisible(false)
        }
      })
    })
  };
  const handleCancel = (e: any) => {
    setVisible(false)
  };

  const selectAddress = (value:string)=>{
    let obj = formList.addressList.filter(item=>item.address==value)[0]
    form.setFieldsValue({addressee:obj.addressee,addresseePhone:obj.addresseePhone})
  }

  return (
    <div>
      <Card className="mb24">
        <p>
          1.选择通道后即可进行开票申请<br />
          2.请在每年度结束前完成本年度开票申请<br />
          3.页面仅显示未开票的记录，以便您勾选提交开票申请
        </p>
      </Card>
      <Card title="申请发票" className="mb24">
     
        <Form layout="inline" form={searFrom}>
        
          <Form.Item>
            <Radio.Group value={curren} onChange={handRadio} buttonStyle="solid">
              <Radio.Button value="1">全部</Radio.Button>
              {
                list.map((item: any) => {
                  return (
                    <Radio.Button value={item.channelId} key={item.channelId}>{item.name}</Radio.Button>
                  )
                })
              }
            </Radio.Group>
          </Form.Item>       
          <Form.Item name="startDate">
            <DatePicker placeholder="开始时间"></DatePicker>
          </Form.Item>
          <Form.Item name="endDate">
            <DatePicker placeholder="结束时间"></DatePicker>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={getData}>搜索</Button>
          </Form.Item>
        </Form>
        <Table
          rowSelection={{
            ...rowSelection,
          }}
          pagination={{
            pageSize: pageInfo.limit,
            total: pageInfo.total,
            onChange: changePage
          }}
          className="mt10"
          columns={columns}
          dataSource={data}
        />
      </Card>
          <Card>
        已选择到账金额 <span> {total>0?'￥'+total:' '} <Button onClick={Apply} disabled={selectedRowKeys.length>0?false:true} className="ml20" type="primary">申请发票</Button></span>
          </Card>
      <Modal title="申请发票" visible={visible} width={720} onOk={handleOk} onCancel={handleCancel}>
        <Form {...layout} form={form}>
          <Row>
            <Col span="12">
              <Form.Item label="通道">
        <span>{curName}</span>
              </Form.Item>
            </Col>
            <Col span="12">

            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form.Item label="到账金额" name="invoiceMoney">
                <Input  disabled></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="开票内容" name="invoiceContent" rules={[{ required: true }]}>
                <Select placeholder="请选择">
                {
                    formList.invoiceContentList.map((item:any,index:number)=>{
                      return (
                      <Option value={item} key={index}>{item}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form.Item label="发票类型" name="invoiceType" rules={[{ required: true }]}>
                <Select placeholder="请选择">
                  <Option value="1" key="1">增值税普通发票</Option>
                  <Option value="2" key="2">增值税专用发票</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="期望开票日期" name="hopeTime" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }}></DatePicker>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form.Item label="发票抬头" name="invoiceTitle">
              <Input disabled ></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="单位税号" name="taxNumber">
                <Input disabled ></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>

            <Col span="12">
              <Form.Item label="银行账号" name="bankAccount" rules={[{ required: true }]}>
                <Input placeholder="输入内容"></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="开户行" name="openBank" rules={[{ required: true }]}>
                <Input placeholder="输入内容"></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form.Item label="单位地址" name="unitAddress" >
                <Input disabled ></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="单位电话" name="unitTel" >
                <Input disabled ></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form.Item label="收件地址" name="address" rules={[{ required: true }]}>
                <Select placeholder="请选择" notFoundContent={('请先添加收件地址')} onChange={selectAddress}>
                  {
                    formList.addressList.map((item:any,index:number)=>{
                      return (
                      <Option value={item.address} key={index}>{item.address}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="收件人" name="addressee" rules={[{ required: true }]}>
                <Input placeholder="输入内容"></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form.Item label="联系电话" name="addresseePhone" rules={[{ required: true }]}>
                <Input placeholder="输入内容"></Input>
              </Form.Item>
            </Col>
            <Col span="12"></Col>
          </Row>
          <Row>
            <Col span="12">
              <Form.Item label="备注" name="remarks">
                <Input placeholder="输入内容"></Input>
              </Form.Item>
            </Col>
            <Col span="12"></Col>
          </Row>
        </Form>
      </Modal>
      <div></div>
    </div>
  );
};
