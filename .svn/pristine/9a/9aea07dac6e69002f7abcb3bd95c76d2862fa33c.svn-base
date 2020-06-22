import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button } from 'antd';
import { personDetailBasic ,signPage ,getPreviewURL} from '@/services/sign'
import './index.less';


const columns1 = [
  {
    title: '时间',
    key: 'crtTime',
    dataIndex: 'crtTime',
  },
  {
    title: '统一社会信用代码',
    key: 'creditCode',
    dataIndex: 'creditCode',
  },
  {
    title: '名称',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '注册日期',
    key: 'registTime',
    dataIndex: 'registTime',
  },
  {
    title: '签约通道',
    key: '',
    dataIndex: '',
  },
  {
    title: '企业状态',
    key: 'enterpriseType',
    dataIndex: 'enterpriseType',
  }
]
const columns2 = [
  // {
  //   title: '姓名',
  //   key: 'name',
  //   dataIndex: 'name',
  // },
  {
    title: '银行账号',
    key: 'bankAccount',
    dataIndex: 'bankAccount',
  },
  {
    title: '添加时间',
    key: 'crtTime',
    dataIndex: 'crtTime',
  }
]

export default (props: any) => {

  const [data, setData] = useState([])
  const [data1, setData1] = useState([])
  const [data2, setData2] = useState([])
  const [info, setInfo] = useState<any>({})
  const columns = [
    {
      title: '签约时间',
      key: 'signTime',
      dataIndex: 'signTime',
    },
    {
      title: '生效状态',
      key: 'effectStatus',
      dataIndex: 'effectStatus',
      render:(tags:any)=>{
        let arr=['待签约','生效中','已失效']
        return (
        <span>{arr[tags]}</span>
        )
      }
    },
    {
      title: '打款通道',
      key: '',
      dataIndex: '',
    },
    {
      title: '签约模板',
      key: 'title',
      render:(tags:any)=>{
        
        return (<Button type="link" onClick={toPreview.bind(this,tags.contractNo)}>{tags.title}</Button>)
        
      }
    },
    
  ]
  useEffect(() => {
    if (props.location.state) {

      getData(props.location.state.id)
    }
  }, []);

  const getData = (id: string) => {

    signPage({page:1,limit:200,userId:id}).then(res=>{
      if(res.result){
        setData(React.setKey(res.data.rows))
      }
    })

    personDetailBasic({ userId: id }).then(res => {
      if (res) {
        setInfo(res.data.basicData)
        setData1(React.setKey(res.data.businessLicense))
        setData2(React.setKey(res.data.bankData))
      }
    })
  }

  const toPreview = (account:string)=>{
    getPreviewURL({contractNo:account}).then(res=>{
      if(res.result){
        window.open(res.data);
      }
    })
  }

  return (
    <div className="detail">

      <Card title="基础信息" className="mb24">
        <Row>
          <Col span="12"><span>姓名</span> <span>{info.userName}</span></Col>
          <Col span="12"><span>添加时间</span> <span>{info.crtTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>证件类型</span>    <span>{info.certifiteType}</span></Col>
          <Col span="12"><span>证件号码</span>    <span>{info.idcard}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>手机号</span>    <span>{info.userPhone}</span></Col>
          <Col span="12"><span>备注</span>    <span></span></Col>
        </Row>

      </Card>
      <Card title="签约信息" className="mb24">
        <Table columns={columns} dataSource={data}></Table>
      </Card>
      <Card title="营业执照" className="mb24">
        <Table columns={columns1} dataSource={data1}></Table>
      </Card>
      <Card title="银行卡账号信息">
        <Table columns={columns2} dataSource={data2}></Table>
      </Card>
    </div>

  );
};
