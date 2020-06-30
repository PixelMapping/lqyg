import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Card,Form,Input,Button,Table ,Select, message ,DatePicker} from 'antd';
import { signDetailPage,cancelContract ,smsAlert} from '@/services/sign'
import moment from "moment";
const {Option} = Select
import './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export default (props:any) => {
  const columns=[
    {
      title:'发起时间',
      dataIndex:'signTime',
      key:'signTime',
    },
    {
      title:'个体姓名',
      dataIndex:'name',
      key:'name',
    },
    {
      title:'证件类型',
      dataIndex:'key',
      key:'key',
      render:()=>('身份证')
    },    
    {
      title:'证件号码',
      dataIndex:'idcard',
      key:'idcard',
    },  
    {
      title:'手机号',
      dataIndex:'phone',
      key:'phone',
    },  
    {
      title:'协议模板',
      dataIndex:'title',
      key:'title',
    }, 
    {
      title:'签约状态',
      dataIndex:'signStatus',
      key:'signStatus',
      render:(tags:any)=>{
        let arr = ['签约中','已签约','已撤销']
        return (
        <div>{arr[tags]}</div>
        )
      }
    }, 
    {
      title:'生效状态',
      dataIndex:'effectStatus',
      key:'effectStatus',
      render:(tags:any)=>{
        let arr = ['生效中','已生效','已失效']
        return (
        <div>{arr[tags]}</div>
        )
      }
    }, 
    {
      title:'批次号',
      dataIndex:'batchNo',
      key:'batchNo',
    }, 
    {
      title:'协议号',
      dataIndex:'contractNo',
      key:'contractNo',
    },     
    {
      title:'操作',
      dataIndex:'',
      key:'',
      render:(tags:any)=>(
        <div>
          <Button type="link" onClick={toDetail.bind(this,tags)}>详情</Button>
          {
            tags.effectStatus==0 &&(
              <Button type="link" onClick={recall.bind(this,tags.signId)}>撤回合约</Button>
            )

          }
          {
            tags.signStatus==0&&(
          <Button type="link" onClick={remind.bind(this,tags.signId)}>短信提醒</Button>

            )
          }
        </div>
      )
    },
  ]
  const [data,setData] = useState([])
  const [form] = Form.useForm()
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })

  useEffect(() => {
    if(props.location.state){
      form.setFieldsValue({batchNo:props.location.state.batchNo})
    }
    getData()
  }, []);

  const getData=()=>{
    let val = form.getFieldsValue()
    let data={
      page:pageInfo.page,
      limit:pageInfo.limit,
      userId:'',
      batchNo:val.batchNo||'',
      search:val.search||'',
      sendTime:val.sendTime?moment(val.sendTime).format('YYYY-MM-DD'):'',
      signTime:val.signTime?moment(val.signTime).format('YYYY-MM-DD'):''
    }
    signDetailPage(data).then(res=>{
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


  
  const toDetail = (tag:any)=>{
    props.history.push({pathname:'detail',state:{id:tag.userId}})
  }

  const recall = (id:string)=>{
    cancelContract({signId:id}).then(res=>{
      if(res.result){
        message.info(res.message)
        getData()
      }
    })
  }

  const remind = (id:string)=>{
    let data ={
      signId:id
    }
    smsAlert(data).then(res=>{
      if(res.result){
        message.info(res.message)
        getData()
      }
    })
  }

  return (
    <div >
        <Card title="签约明细查询" className="mb24">
          <Form layout="inline" className="w1300" form={form}>
          <Form.Item className="w200" name="batchNo">
              <Input placeholder="批次号"></Input>
            </Form.Item>   
            <Form.Item className="w200" name="search">
              <Input placeholder="姓名/手机号"></Input>
            </Form.Item>   
            <Form.Item className="w200" name="sendTime">
              <DatePicker className="w200" placeholder="发起签约时间"></DatePicker>
            </Form.Item>
            <Form.Item className="w200" name="signTime">
              <DatePicker className="w200" placeholder="签约时间"></DatePicker>
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
            </Form.Item>         
          </Form>
        </Card>
        <Card title="签约明细列表">
          <Table 
          pagination={{
            pageSize: pageInfo.limit,
            total: pageInfo.total,
            onChange: changePage
          }}
            columns={columns} dataSource={data} ></Table>
        </Card>

        
    </div>

  );
};
