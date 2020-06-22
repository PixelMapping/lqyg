import React, { useState, useEffect } from 'react';
import { AccountBookOutlined, FileTextOutlined } from '@ant-design/icons'
import iconAss from '@/assets/icon_ass.png'
import { Row, Col } from 'antd';
import { channelList } from '@/services/asset';
import './index.less';

export default (props: any) => {
  const [list, setList] = useState([])

  useEffect(() => {
    getData()
  }, []);
  


  const getData = () => {
    channelList({}).then(res => {
      setList(res.data)
    })
  }

  const toRecharge = (info:any) => {
    props.history.push({pathname:'recharge',state:{info:info}})
  }

  const toRecord = (id:string) => {
    props.history.push({pathname:'record',state:{id:id}})
  }

  return (
    <div className="assets">
      <Row gutter={32}>
        {
          list.map((item: any) => {
            return (
              <Col span="8" key={item.channelId}>
                <div className="card">
                  <div className="head">
                    <span>{item.name}</span>                    
                  </div>
                  <div className="amount">
                    <p className="pl16">账户余额</p>
                    <p className="num pl16">￥{item.balances}</p>
                  </div>
                  <div className="info">
                    <div className="tit">收款信息<img src={iconAss} /></div>
                    <p>单位名称：{item.name}</p>
                    <p>银行账号：{item.bankAccount}</p>
                    <p>开户行：{item.openBank}</p>
                  </div>
                  <div className="footer">
                  <div className="btns">
                      <span className="pr32" onClick={toRecharge.bind(this,item)}>
                        <AccountBookOutlined className="pr8" />
                      账户充值
                    </span>
                      <span onClick={toRecord.bind(this,item.channelId)}>
                        <FileTextOutlined className="pr8" />
                    充值记录
                    </span>
                    </div>
                  </div>
                </div>
              </Col>
            )
          })
        }


      </Row>
    </div>
  );
};
