import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Select, Input, Button, DatePicker, Checkbox, Switch, Row, Col, Cascader, message ,Radio } from 'antd';
import moment from 'moment'
import myContext from '@/components/ImgUpload/creatContext'
import { allTaskType, getAllRegion, taskAdd, tempList } from '@/services/task'
import ImgUpload from '@/components/ImgUpload'
const { Option } = Select
import './index.less';
import FormSearch from '@ant-design/pro-table/lib/Form';

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 },
};

export default (props:any) => {
  const childRef = useRef();
  const [taskList, setTask] = useState([])
  const [cityList, setCity] = useState([])
  const [agreeList, setAgree] = useState([])
  const [form] = Form.useForm();

  useEffect(() => {
    getSelect()
    getArgee()
    form.setFieldsValue({taskType:'1'})
  }, []);

  const getArgee = () => {
    tempList({}).then(res => {
      setAgree(res.data)
    })
  }

  const getSelect = () => {
    allTaskType({}).then(res => {
      setTask(res.data)
    })
    getAllRegion({}).then(res => {
      setCity(res.data)
    })
  }

  const release = () => {
    // console.log(form.)
    form.validateFields().then(values => {
      let data = { ...values }
      let fileList = childRef.current.getUpFile()||[]
      // if(fileList.length==0){
      //   message.info('请上传附件！')
      //   return
      // }
      data.businessValue = values.taskId[0]
      data.industryValue = values.taskId[1]
      data.provinceId = values.cityId[0]
      data.cityId = values.cityId[1]
      data.needNum = values.needCheck ? '' : values.needNum
      data.signEndTime = values.signEndCheck ? '' : moment(values.signEndTime).format('YYYY-MM-DD')
      data.releaseTime = moment(values.releaseTime).format('YYYY-MM-DD')
      data.showFlag = values.showFlag ? 1 : 2
      data.urls = fileList.join(',')
      if (data.signEndTime != '' && !data.signEndTime) {
        message.info('请选择报名截止时间！')
        return
      }
      if (data.needNum != '' && !data.needNum) {
        message.info('请选择需要人数')
        return
      }
      taskAdd(data).then(res => {
        if(res.result){
          message.info('添加成功！')
          // form.resetFields()
          props.history.goBack();
        }        
      })
    })
  }


  return (
    <div className="add">
      <Card title="基本信息">
        <Form {...layout} form={form}>
          <Form.Item label="任务类型" name="taskId" rules={[{ required: true, message: '请选择任务类型' }]}>
            <Cascader options={taskList} placeholder="请选择类型" />
          </Form.Item>
          <Form.Item label="工作地区" name="cityId" rules={[{ required: true, message: '请选择工作地区' }]}>
            <Cascader options={cityList} placeholder="请选择工作地区" />
          </Form.Item>
          <Form.Item label="任务名称" name="name" rules={[{ required: true, message: '请输入任务名称' }]}>
            <Input maxLength={20} placeholder="请输入任务名称"></Input>
          </Form.Item>
          <Form.Item label="任务描述" name="description" rules={[{ required: true, message: '请输入任务描述' }]}>
            <Input.TextArea placeholder="请输入任务描述"></Input.TextArea>
          </Form.Item>
          <Form.Item label="发布类型" name="taskType" rules={[{ required: true, message: '请选择发布任务类型' }]}>
          <Radio.Group>
            <Radio value="1">自然人任务</Radio>
            <Radio value="2">个体户任务</Radio>
          </Radio.Group>
          </Form.Item>
          <Form.Item label="上传附件" >
            <myContext.Provider value={{count:10,type:1}}>
              <ImgUpload cRef={childRef}></ImgUpload>

            </myContext.Provider >
          </Form.Item>
          <div className="title">时间与预算</div>
          <Form.Item label="任务发布日期" name="releaseTime" rules={[{ required: true, message: '请选择任务发布时间' }]}>
            <DatePicker className="w250"></DatePicker>
          </Form.Item>
          <Form.Item label="* 报名截止时间" >
            <Form.Item
              name="signEndTime"
              style={{ display: 'inline-block' }}
              className="mr10"
            >
              <DatePicker className="w250"></DatePicker>
            </Form.Item>
            <Form.Item
              name="signEndCheck"
              style={{ display: 'inline-block' }}
              valuePropName="checked"
            >
              <Checkbox>不限</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item label="任务总预算" name="totalBudgetAmount" rules={[{ required: true, message: '请输入任务总预算' }]}>
            <Input maxLength={10} placeholder="请输入任务总预算"></Input>
          </Form.Item>
          <Form.Item label="* 任务单价">
            <Form.Item
              name="singleMinAmount"
              rules={[{ required: true, message: "请输入最大单价" }]}
              style={{ display: 'inline-block', width: 'calc(50% - 4px)' }}
            >
              <Input maxLength={10} placeholder="请输入最小单价" />
            </Form.Item>
            <Form.Item
              name="singleMaxAmount"
              rules={[{ required: true, message: "请输入最大单价" }]}
              style={{ display: 'inline-block', width: 'calc(50% - 4px)', marginLeft: '8px' }}
            >
              <Input maxLength={10} placeholder="请输入最大单价" />
            </Form.Item>
          </Form.Item>
          <Form.Item label="* 需要人数" >
            <Form.Item
              name="needNum"
              style={{ display: 'inline-block' }}
              className="mr10"
            >
              <Input className="w250 mr10" placeholder="请输入需要的人数"></Input>
            </Form.Item>
            <Form.Item
              name="needCheck"
              style={{ display: 'inline-block' }}
              valuePropName="checked"
            >
              <Checkbox>不限</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item label="选择协议" name="templateId" rules={[{ required: true, message: '请选择协议' }]}>
            <Select placeholder="请选择协议">
              {
                agreeList.map((item: any) => {
                  return (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  )
                })
              }

            </Select>
          </Form.Item>
          <Form.Item label="任务广场展示" name="showFlag" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
        <Row>
          <Col span="2"></Col>
          <Col>
            <Button type="primary" onClick={release}>发布任务</Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};