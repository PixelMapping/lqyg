import React, { useState, useEffect } from 'react';
import { SearchOutlined ,InfoCircleOutlined ,StopOutlined ,FileOutlined ,createFromIconfontCN} from '@ant-design/icons';
import {iconUrl} from '@/utils/utils'
const MyIcon = createFromIconfontCN({
  scriptUrl: iconUrl, // 在 iconfont.cn 上生成
});
import { Card,Form,Input,Button,Table,Modal ,Row ,Select, message,Col} from 'antd';
import {signUserPage,sendSignList,sendOneSign,cancelSignList,cancelContract,setBlacklist} from '@/services/sign'
const {Option} = Select
import './index.less';


export default (props:any) => {
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const columns=[
    {
      title:'姓名',
      dataIndex:'name',
      key:'name',
    },
    {
      title:'证件类型',
      dataIndex:'certifiteType',
      key:'certifiteType',
      render:(tags:any)=>(
      <div>{tags=='1'?'身份证':''}</div>
      )
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
      title:'添加时间',
      dataIndex:'crtTime',
      key:'crtTime',
    },  
    {
      title:'操作',
      dataIndex:'',
      key:'',
      render:(tags:any)=>(
        <div>
          <Button type="link" icon={<InfoCircleOutlined />} onClick={toDetail.bind(this,tags.userId)}>查看详情</Button>
          {/* <Button type="link">编辑手机号</Button> */}
          {
            tags.isBlacklist==0 ? (
              <Button type="link" icon={<StopOutlined />} onClick={changeBlack.bind(this,1,tags.userId)}>禁止签约</Button>
            ):(
              <Button type="link" icon={<MyIcon type="icon-liuchenghuifu" />} onClick={changeBlack.bind(this,0,tags.userId)}>恢复签约</Button>
            )
          }
          {
            tags.isBlacklist==0 &&(
              <Button type="link" icon={<FileOutlined />} onClick={setModal.bind(this,1,tags.userId)}>发起签约</Button>
            )
          }
        </div>
      )
    },
  ]
  const [data,setData] = useState([])
  const [isAdd,setStatus] = useState(true)
  const [visible,setVisible] = useState(false)
  const [list,setList] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    getData()

  }, []);

  const setModal=(type:number,id:string)=>{
    if(type==1){
      getList(id)
      setStatus(true)
    }else{
      getRecall(id)
      setStatus(false)
    }
    setVisible(true)
  }  

  const getRecall = (id:string)=>{
    cancelSignList({userId:id}).then(res=>{
      if(res.result){
        setList(res.data)
      }
    })
  }

  const getList = (id:string)=>{
    sendSignList({userId:id}).then(res=>{
      if(res.result){
        setList(res.data)
      }
    })
  }

  const getData = () =>{
    let val=form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      name:val.name?val.name:'',
      phone:val.phone?val.phone:'',
      idcard:val.idcard?val.idcard:'',
      authentFlag:val.authentFlag?val.authentFlag:''
    }
    signUserPage(data).then(res=>{
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
    props.history.push({pathname:'detail',state:{id:id}})
  }

  const onFinish = (value:any)=>{

    if(isAdd){
      sendOneSign({enrollId:value.enrollId}).then(res=>{
        if(res.result){
          message.info('签约成功！')
        }
        setVisible(false)
      })
    }else{
      cancelContract({signId:value.enrollId}).then(res=>{
        if(res.result){
          message.info('取消成功')
        }
        setVisible(false)
      })
    }
    
  }

  const changeBlack = (type:number,id:string)=>{
    setBlacklist({userId:id,isBlacklist:type}).then(res=>{
      if(res.result){
        message.info(res.message)
        getData()
      }
    })
  }

  return (
    <div >
        <Card title="个人信息查询" className="mb24">
          <Form layout="inline" className="w1200" form={form}>
            <Form.Item className="w200" name="name">
              <Input maxLength={10} placeholder="姓名"></Input>
            </Form.Item>      
            <Form.Item className="w200" name="phone">
              <Input maxLength={11} placeholder="手机号"></Input>
            </Form.Item> 
            <Form.Item className="w200" name="idcard">
              <Input maxLength={20} placeholder="证件号码"></Input>
            </Form.Item>             
            <Form.Item className="w200" name="authentFlag">
              <Select placeholder="证件类型">
                <Option value="1">个人认证</Option>
                <Option value="2">个体工商户</Option>
              </Select>
            </Form.Item> 
            <Form.Item className="w200">
              <Button type="primary" icon={<SearchOutlined />} onClick={getData}>搜索</Button>
            </Form.Item> 
            <Row className="mt16">
           
            </Row>
          </Form>
        </Card>
        <Card title="个体列表">
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

        <Modal title={isAdd?'发起签约':'取消签约'} visible={visible} footer={null} onCancel={()=>{setVisible(false)}}>
          <Form form={form}  onFinish={onFinish}>
            <Form.Item label="报名列表" name="enrollId" rules={[{ required: true}]}>
              <Select>
                {
                  list.map((item:any)=>{
                    return (
                    <Option value={item.enrollId} key={item.enrollId}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            </Form.Item>
            <Row justify="end">
              <Col>
              <Button  type="primary" htmlType="submit">确定</Button>
                
              </Col>
            </Row>
          </Form>
        </Modal>
    </div>

  );
};
