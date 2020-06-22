import React, { useState, useEffect } from 'react';
import { Card ,Button ,Switch ,Pagination ,Form ,Input ,Select ,DatePicker, message } from 'antd';
import {getTaskPage ,showTask} from '@/services/task'
import moment from 'moment'
const { Option } = Select
import './index.less';

const color={
  '4':'#52C41A',
  '5':'#FAAD14',
  '6':'#1890FF',
}

export default (props:any) => {
  const [form] = Form.useForm();
  const [list,setList] = useState([]) 
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  useEffect(() => {
   form.setFieldsValue({status:'0'})
   getData()
  }, []);

  const getData = ()=>{
    let values = form.getFieldsValue()
    let data={
      page: pageInfo.page,
      limit: pageInfo.limit,
      status:values.status,
      search:values.search,
      showLoading:true,
      beginTime:values.beginTime?moment(values.beginTime).format('YYYY-MM-DD'):'',
      endTime:values.endTime?moment(values.endTime).format('YYYY-MM-DD'):'',
    }
    getTaskPage(data).then(res=>{
      setList(React.setKey(res.data.rows))
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

  const callback = ()=>{

  }

  const changeSwitch = (id:string)=>{
    showTask({taskId:id,showLoading:true}).then(res=>{
      getData()
    })
  }

  const toDetail = (row:any)=>{
    props.history.push({pathname:'task/detail',state:{info:row}})
  }

  const toAdd = ()=>{
    props.history.push('task/addTask')
  }


  return (
    <div className="task">
      <Card title="任务查询" className="mb24">
        <Form layout="inline" form={form} onFinish={getData}>
          <Form.Item name="status" className="w200">
            <Select>
              <Option value="0"> 全部</Option>
              <Option value="1"> 已审核</Option>
              <Option value="2"> 未审核</Option>
            </Select>
          </Form.Item>
          <Form.Item name="search" className="w200">
            <Input placeholder="请输入任务名称"></Input>
          </Form.Item>
          <Form.Item name="beginTime" className="w200">
            <DatePicker placeholder="开始时间" className="wall"></DatePicker>
          </Form.Item>
          <Form.Item name="endTime" className="w200">
            <DatePicker placeholder="结束时间" className="wall"></DatePicker>
          </Form.Item>
          <Button type="primary" htmlType="button" onClick={getData}>搜索</Button>
        </Form>
      </Card>
 
      <Card title="任务大厅" extra={<Button onClick={toAdd}>发布任务</Button>}>
        <div className="tables">
          {
            list.map((item:any)=>{
              return(
                <div className="list" key={item.id}>
                <div className="head">
                  <p className="lt">
                    {item.name}
                    {
                    <span style={{background:color[item.taskStatus]}}>{item.taskStatusName}</span>

                    }
        
                  </p>
                  <p>
              <span>任务编号：{item.taskNum}</span>
              <span>开始时间：{item.releaseTime}</span>
                  </p>
                </div>
                <div className="info">
                  <div className="lt">
                  <div className="line">
                    <span>任务预算单价</span>
                    <span>总预算</span>
                    <span>需要人数</span>
                    <span>报名人数</span>
                    <span>已录用人数</span>
                  </div>
                  <div className="line">
              <span className="num">{item.singleMinAmount}~{item.singleMaxAmount}</span>
              <span className="num">{item.totalBudgetAmount}</span>
              <span>{item.needNum}</span>
              <span>{item.signNum}</span>
              <span>{item.employNum}</span>
                  </div>
                  </div>
                  <div className="rt">
                  <Button onClick={toDetail.bind(this,item)}>查看</Button>
                  </div>
                  
    
                </div>
                <div className="footer">
                  <div className="lt">
              {item.businessLabel}>{item.industryLabel}<span className="mrlr20">{item.cityName}</span><span>报名截止时间:{item.signEndTime}</span>
                  </div>
                  <div className="rt">
                    <span>任务大厅中显示</span> <Switch defaultChecked={item.showFlag==1?true:false} onChange={changeSwitch.bind(this,item.id)} />
                  </div>
                </div>
              </div>
              )
            })
          }    
          <Pagination defaultCurrent={1} total={pageInfo.total} pageSize={pageInfo.limit} onChange={changePage} />
        </div>
      </Card>
    </div>
  );
};
