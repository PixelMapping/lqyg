import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Input, Select, Button, Row  ,Table, Card } from 'antd';
import { recordPage,channelList} from '@/services/asset';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment'
const { Option } = Select
import './index.less';


export default (props:any) => {

  const [data,setData] = useState([])
  const [selectedRowKeys,setKeys]= useState([])
  const [list,setList] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [channelId,setChannelId] = useState('')
  const [form] = Form.useForm()
  const columns = [
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key:"applyTime",
    },
    {
      title: '申请方式',
      dataIndex: 'applyType',
      key:"applyType",
      render:()=>(<div>商户申请</div>)
    },
    {
      title: '充值通道',
      dataIndex: 'channelName',
      key:"channelName",
    },
    {
      title: '充值金额',
      dataIndex: 'amount',
      key:"amount",
    },
    {
      title: '实际到账金额',
      dataIndex: 'actualAmount',
      key:"actualAmount",
    },
    {
      title: '服务费',
      dataIndex: 'serviceAmount',
      key:"serviceAmount",
    },
    {
      title: '充值状态',
      dataIndex: 'rechargeStatus',
      key:"rechargeStatus",
      render:(tags:any)=>{
        let arr=['充值成功','审核中','充值失败']
        return(
        <span>{arr[tags-1]}</span>
        )
      }
    },
    {
      title: '流水号',
      dataIndex: 'serialNumber',
      key:"serialNumber",
    },
    {
      title: '开票状态',
      dataIndex: 'invoiceStatus',
      key:"invoiceStatus",
      render:(tags:any)=>{
        let arr=['未开票','审核中','开票中','已开票','已驳回','已邮寄','已签收']
        return(
        <span>{arr[tags]}</span>
        )
      }
    },
    {
      title: '收票状态',
      dataIndex: 'receiveStatus',
      key:"receiveStatus",
      render:(tags:any)=>{
        let arr=['已收票','未收票']
        return(
        <span>{arr[tags-1]}</span>
        )
      }
    },
    {
      title:'操作',
      key:'action',
      render:(tags:any)=>(
        <Button type="link" onClick={toDetail.bind(this,tags.rechargeId)}>详情</Button>
        // <div onClick={toDetail.bind(this,tags.rechargeId)}>详情</div>
      )
    }
  ];

  useEffect(() => {
    if(props.location.state){
      setChannelId(props.location.state.id)
      form.setFieldsValue({channelId:props.location.state.id})
    }
    if(channelId){
      getData()
      getList()
    }
    // if(props.loa)
   
  }, [channelId]);

  const getList=()=>{
    channelList({}).then(res=>{
      if(res){
        setList(res.data)
        if(channelId==''){
        form.setFieldsValue({channelId:res.data[0].channelId})

        }
      }
    })
  }

  const getData=()=>{
    let val = form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      channelId:val.channelId,
      serialNumber:val.serialNumber||'',
      rechargeStatus:val.rechargeStatus||'',
      invoiceStatus:val.invoiceStatus||'',
      receiveStatus:val.receiveStatus||'',
      startDate:val.startDate?moment(val.startDate).format('YYYY-MM-DD'):'',
      endDate:val.endDate?moment(val.endDate).format('YYYY-MM-DD'):''

    }
    recordPage(data).then(res=>{
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


  const toDetail = (id:string)=>{
    props.history.push({pathname:'detail',state:{rechargeId:id}})
  }


  return (
    <div className="record">
      <Card title="充值记录查询" className="mb24">
      <Form layout="inline" form={form} 
              style={{width:1200}}
              >
        {/* <Form.Item className="w200">
          <DatePicker placeholder="日期" style={{ width: '100%' }} />
        </Form.Item> */}
         <Form.Item className="w200 mb10" name="channelId">
          <Select placeholder="充值通道" allowClear>
            {
              list.map((item:any)=>{
                return (
                <Option value={item.channelId} key={item.channelId}> {item.name}</Option>
                )
              })
            }
       
          </Select>
        </Form.Item>
        <Form.Item className="w200" name="serialNumber">
          <Input placeholder="流水号"></Input>
        </Form.Item>
        <Form.Item className="w200" name="rechargeStatus">
          <Select placeholder="充值状态" allowClear>
            <Option value="1"> 充值成功</Option>
            <Option value="2"> 审核中</Option>
            <Option value="3"> 充值失败</Option>
          </Select>
        </Form.Item>
        <Form.Item className="w200" name="invoiceStatus">
          <Select placeholder="开票状态" allowClear>
            <Option value="0"> 未开票</Option>
            <Option value="1"> 审核中</Option>
            <Option value="2"> 开票中</Option>
            <Option value="3"> 已开票</Option>
            <Option value="4"> 已驳回</Option>
            <Option value="5"> 已邮寄</Option>
            <Option value="6"> 已签收</Option>
          </Select>
        </Form.Item>
        <Form.Item className="w200" name="receiveStatus">
          <Select placeholder="收票状态" allowClear>
            <Option value="1"> 已收票</Option>
            <Option value="2"> 未收票</Option>  
          </Select>
        </Form.Item>
        <Form.Item name="startDate">
            <DatePicker className="w200" placeholder="开始时间"></DatePicker>
        </Form.Item>
        <Form.Item name="endDate">
            <DatePicker className="w200" placeholder="结束时间"></DatePicker>
        </Form.Item>
        <Form.Item className="w200">
          <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
        </Form.Item>
        <Row className="mt16">
          {
            /* <Form.Item>
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
            </Form.Item>           */
          }
         
        </Row>
      </Form>
      </Card>
      
      <Card title="充值记录列表">

      <Table     
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: pageInfo.limit,
          total: pageInfo.total,
          onChange: changePage
        }}
      />
      </Card>
      
    </div>

  );
};
