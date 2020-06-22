import React, { useState, useEffect } from 'react';
import { Tabs, Steps, Card, Switch, Row, Col, Button, message } from 'antd';
import { TeamOutlined } from '@ant-design/icons'
const { Step } = Steps;
const { TabPane } = Tabs
import './index.less';
import Zmage from 'react-zmage'
import Sign from './components/sign' //报名管理
import Acceptance from './components/acceptance' //任务验收
import Settle from './components/settle' //结算管理
import myContext from './components/creatContext'
import { showTask, getTaskDetailNum, templatePreview, completeTask, getTaskDetailBasic } from '@/services/task'



export default (props: any) => {
  const [cur, setCur] = useState('0')
  const [info, setInfo] = useState<any>({})
  const [taskStatus, setStatus] = useState(0)
  const [urls, setUrls] = useState([{ src: '' }])
  const [numObj, setNum] = useState<any>({})
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (props.location.state) {

      let info = props.location.state.info
      getData(info.id)
      getTemplate(props.location.state.info)


    }
  }, []);

  const getData = (id: string) => {
    getTaskDetailBasic({ taskId: id }).then(res => {
      if (res.result) {
        let taskStatus = res.data.taskStatus
        switch (taskStatus) {
          case '3':
            setStatus(1);
            break;
          case '4':
            setStatus(2);
            break;
          case '5':
            setStatus(3);
            break;
          case '6':
            setStatus(4);
            break;
        }
        if (res.data.annexUrls) {
          let arr = res.data.annexUrls.split(',')
          let imgs = arr.map((item: any) => {
            return {
              src: item
            }
          })
          setUrls(imgs)
        }
        setInfo(res.data)

      }

    })
  }

  const changeTab = (key: any) => {
    if (key == '0') {
      setCur(key)
      return
    }
    let data = {
      status: key,
      taskId: info.id
    }
    getTaskDetailNum(data).then(res => {
      setNum(res.data)
      setCur(key)
    })
  }

  const changeSwitch = (id: string) => {
    let obj = { ...info }
    let showFlag = info.showFlag
    if (showFlag == 1) {
      obj.showFlag = 2
    } else {
      obj.showFlag = 1
    }
    setInfo(obj)

    showTask({ taskId: id, showLoading: true }).then(res => {

    })
  }

  const getTemplate = (info: any) => {
    templatePreview({ taskId: info.id }).then(res => {
      if (res.result) {
        setUrl(res.data)
      }
    })
  }

  const confirm = () => {
    completeTask({ taskId: info.id }).then(res => {
      if (res.result) {
        message.info(res.message)
      }
    })
  }

  return (
    <div className="task">
      <Card className="mb24">
        <Tabs
          activeKey={cur}
          onChange={changeTab}
          tabBarExtraContent={
            cur == '3' && (
              <Button onClick={confirm}>任务完成</Button>
            )
          }
        >
          <TabPane tab="基本信息" key="0">
            <Steps current={taskStatus} size="small" className="mt24">
              <Step title="发布任务" />
              <Step title="用户报名" />
              <Step title="任务验收" />
              <Step title="任务结算" />
              <Step title="任务完成" />
            </Steps>
          </TabPane>
          <TabPane tab="报名名单" key="1">
            <Row>
              <Col flex="1" className="flex">
                <div className="icon">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>总报名人数</p>
                  <p className="weight">{numObj.signNum}</p>
                </div>
              </Col>
              <Col flex="1" className="flex">
                <div className="icon">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>录用人数</p>
                  <p className="weight">{numObj.employNum}</p>
                </div>
              </Col>
              <Col flex="1" className="flex">
                <div className="icon">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>不录用人数</p>
                  <p className="weight">{numObj.notEmployNum}</p>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="验收名单" key="2">
            <Row>
              <Col flex="1" className="flex">
                <div className="icon">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>已录用人数</p>
                  <p className="weight">{numObj.employNum}</p>
                </div>
              </Col>
              <Col flex="1" className="flex">
                <div className="icon">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>待验收人数</p>
                  <p className="weight">{numObj.toBeCheckedNum}</p>
                </div>
              </Col>
              <Col flex="1" className="flex">
                <div className="icon">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>已验收人员</p>
                  <p className="weight">{numObj.hasCheckedNum}</p>
                </div>
              </Col>
              <Col flex="1" className="flex">
                <div className="icon waring">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>已驳回人数</p>
                  <p className="weight">{numObj.notCheckedNum}</p>
                </div>
              </Col>
              <Col flex="1" className="flex">
                <div className="icon waring">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>未提交人数</p>
                  <p className="weight">{numObj.notCommitNum}</p>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="结算名单" key="3">
            <Row>
              <Col flex="1" className="flex">
                <div className="icon">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>总用工人数</p>
                  <p className="weight">{numObj.hasCheckedNum}</p>
                </div>
              </Col>
              <Col flex="1" className="flex">
                <div className="icon">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>待结算人数</p>
                  <p className="weight">{numObj.toBeSettlementNum}</p>
                </div>
              </Col>
              <Col flex="1" className="flex">
                <div className="icon">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>已结算人数</p>
                  <p className="weight">{numObj.hasSettlementNum}</p>
                </div>
              </Col>
              <Col flex="1" className="flex">
                <div className="icon waring">
                  <TeamOutlined></TeamOutlined>
                </div>
                <div className="number">
                  <p>已发放</p>
                  <p className="weight">{numObj.grantAmount}</p>
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
      {
        cur == '0' && (
          <Card title="任务大厅" className="tables">
            <div className="list">
              <div className="head">
                <p className="lt">{info.name} </p>
                <p>
                  <span>任务编号：{info.taskNum}</span>
                  <span>发布时间：{info.releaseTime}</span>
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
                    <span className="num">{info.singleMinAmount}~{info.singleMaxAmount}</span>
                    <span className="num">{info.totalBudgetAmount}</span>
                    <span>{info.needNum}</span>
                    <span>{info.signNum}</span>
                    <span>{info.employNum}</span>
                  </div>
                </div>
              </div>
              <div className="footer">
                <div className="lt">
                  {info.businessLabel}>{info.industryLabel}<span className="mrlr20">{info.cityName}</span><span>报名截止时间:{info.signEndTime}</span>
                </div>
                <div className="rt">
                  <span>任务大厅中显示</span> <Switch checked={info.showFlag == 1 ? true : false} onChange={changeSwitch.bind(this, info.id)} />
                </div>
              </div>
            </div>
            <Row gutter={[20, 40]}>
              <Col span="2">任务描述</Col>
              <Col span="22">
                {info.description}
              </Col>
              <Col span="2">任务附件</Col>
              <Col span="22" >
                <div className="imgs">
                  <Zmage src={urls[0].src}
                    set={urls}></Zmage>
                </div>
                {
                  urls[0].src && (
                    <p style={{ color: '#ff0000' }}>点击查看多个附件</p>

                  )
                }
              </Col>
              <Col span="2">任务协议</Col>
              <Col span="22">
                <a href={url} target="_blank">预览</a>
              </Col>
            </Row>
          </Card>
        )
      }
      {
        cur == '1' && (
          <myContext.Provider value={{ id: info.id, taskStatus: info.taskStatus }} >
            <Sign></Sign>
          </myContext.Provider>
        )
      }
      {
        cur == '2' && (
          <myContext.Provider value={{ cur: cur, id: info.id }}>
            <Acceptance ></Acceptance>
          </myContext.Provider>
        )
      }
      {
        cur == '3' && (
          <myContext.Provider value={{ cur: cur, id: info.id }}>
            <Settle ></Settle>
          </myContext.Provider>
        )
      }

    </div>
  );
};
