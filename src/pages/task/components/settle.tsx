import React, { useState, useEffect ,useContext  } from 'react';
import { Card ,Form ,Input ,Select ,DatePicker ,Button ,Table } from 'antd';
import { getTaskDetail,taskSettlementList} from '@/services/task'
import moment from 'moment';
import excel from '@/utils/excel'
const {Option} = Select
import  '../index.less';
import myContext from './creatContext'

export default () => {
  const [data,setData] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [form] = Form.useForm();
  const cur = useContext(myContext).cur
  const id = useContext(myContext).id
  const columns = [
    {
      title:'姓名',
      key:'userName',
      dataIndex:'userName'
    },
    {
      title:'手机号',
      key:'userPhone',
      dataIndex:'userPhone'
    },
    {
      title:'证件类型',
      key:'certifiteType',
      dataIndex:'certifiteType',
    },
    {
      title:'证件号码',
      key:'idcard',
      dataIndex:'idcard'
    },
    {
      title:'报名类型',
      key:'typeName',
      dataIndex:'typeName',    
    },
    {
      title:'收款方式',
      key:'paymentMethod',
      dataIndex:'paymentMethod'
    },
    {
      title:'收款账户',
      key:'bankAccount',
      dataIndex:'bankAccount'
    },
    {
      title:'任务验收时间',
      key:'checkTime',
      dataIndex:'checkTime'
    },
    {
      title:'结算状态',
      key:'statusName',
      dataIndex:'statusName'
    },
  ]


  useEffect(() => {
    if(id){
      getData()

    }
  }, [id]);

  const getData=()=>{
    let values = form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      status:3,
      taskId:id,
      search:values.search||'',
      certifiteType:values.certifiteType||'',
      settleStatus:values.settleStatus||'',
      checkTime: values.checkTime?moment(values.checkTime).format('YYYY-MM-DD'):''
    }
    getTaskDetail(data).then(res=>{
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
  

  const exTable = ()=>{
    let col = [{
      title:'结算金额',
      key:'total'
    },{
      title:'报名Id',
      key:'enrollId'
    },{
      title:'userId',
      key:'userId'
    }]
    let exCol=[...columns,...col]
    taskSettlementList({taskId:id}).then(res=>{
      if(res.result){
        excel.exportExcel(exCol,res.data,'结算名单.xlsx')
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
          <Form.Item className="w200" name="enrollType">
            <Select placeholder="报名类型" allowClear>
              <Option value="1">小程序报名</Option>
              <Option value="2">平台导入</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="settleStatus">
            <Select placeholder="结算状态" allowClear>
              <Option value="0">结算中</Option>
              <Option value="1">已结算</Option>
              <Option value="2">未结算</Option>
            </Select>
          </Form.Item>
          <Form.Item className="w200" name="checkTime">
            <DatePicker placeholder="任务验收时间" style={{width:'100%'}}></DatePicker>
          </Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Form>
      </Card>
      <Card 
        title="结算名单" 
        extra={
          <div>           
            <Button onClick={exTable}>下载名单</Button>
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
        ></Table>
      </Card>
    </div>
  );
};
