import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, List, Avatar } from 'antd';
import customer from '@/assets/customer.png'
import { homeInfo ,actions} from '@/services/global'
import './index.less';

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

export default () => {

  const [comInfo, setCom] = useState<any>({})
  const [count, setCount] = useState<any>({})
  const [list,setList] = useState([])
  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    homeInfo({}).then(res => {
      if (res.result) {
        window.localStorage.setItem('comInfo', JSON.stringify(res.data.enterpriseInfo))
        let user = JSON.parse( window.localStorage.getItem('userInfo'))
        user.enterpriseName = res.data.enterpriseInfo.enterpriseName
        window.localStorage.setItem('userInfo',JSON.stringify(user))
        setCom(res.data.enterpriseInfo)
        setCount(res.data.count)
      }
    })
    actions({}).then(res=>{
      if(res.result){
        setList(res.data)
      }
    })
  }

  return (
    <div>
      <Row className="mb24">
        <Col span="24">
          <Card>
            <div className="top">
              <div className="user">
                <p>您好，{comInfo.enterpriseName}</p>
                <p><span className="phone">{comInfo.loginName}</span> <span className="role">{comInfo.roleName}</span></p>
              </div>
              <div className="amount">
                <p>账户总余额</p>
                <div>
                  <span className="total">￥{count.balances}</span>
                  {/* <Button type="primary">充值</Button> */}
                </div>
              </div>
              <div className="item">
                <div>
                  <p>进行中的项目</p>
                  <p className="num">{count.ongoingNum}</p>
                </div>
                <div>
                  <p>已签约人员</p>
                  <p className="num">{count.signNum}</p>
                </div>
                <div>
                  <p>待结算批次</p>
                  <p className="num">{count.settleNum}</p>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span="18">
          <Card title="动态">
            <List
              className="news"
              itemLayout="horizontal"
              dataSource={list}
              renderItem={(item:any) => (
                <List.Item>
                  <List.Item.Meta
          
                    title={<span >{item.content}</span>}
                    description={item.crtTime}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span="6">
          <Card title="业务客服">
            <div className="flex phone">
              <div className="lt">
                <img src={customer} />
              </div>
              <div className="rt">
                <p>客服电话</p>
                <p className="phone">400-9600-888</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
};
