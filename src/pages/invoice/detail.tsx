import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Timeline, Button, message } from 'antd';
import { getInfo, confirmReceive } from '@/services/invoice'
import Zmage from 'react-zmage'
import './index.less';

const stateList = ['审核中', '开票中', '已开票', '已驳回', '已邮寄', '已签收']

export default (props: any) => {
  const [id, setId] = useState('')
  const [info, setInfo] = useState<any>({})
  const [packag, setPackag] = useState<any>({ data: [] })
  const [urls, setUrls] = useState<any>([{ src: '' }])
  useEffect(() => {
    if (props.location.state) {
      setId(props.location.state.id)
      getData(props.location.state.id)
    }
  }, []);


  const getData = (id: string) => {
    getInfo({ applyInvoiceId: id }).then(res => {
      let info = res.data.info
      setInfo(res.data.info)
      let arr = info.invoiceUrl.split(',')

      let obj = arr.map((item: string) => {
        return {
          src: item,
        }
      })
      setUrls(obj)
      if (res.data.packag.data) {
        setPackag(res.data.packag)
      }
    })
  }

  const confirm = () => {
    confirmReceive({ applyInvoiceId: id }).then(res => {
      if (res.result) {
        message.info('收票成功！')
        getData(id)
      }

    })
  }

  return (
    <div className="detail">
      <Card title="申请信息" className="mb24" extra={
        <div>
          {/* <Button type="link" disabled={info.invoiceStatus>2?false:true} href={info.invoiceUrl} target="_blank" className="mr10">查看发票</Button>  */}
          <Button type="primary" disabled={info.invoiceStatus == 5 ? false : true} onClick={confirm}>确认收票</Button>
        </div>
      }>
        <Row>
          <Col span="12"><span>申请人</span> <span>{info.applyName}</span></Col>
          <Col span="12"><span>申请时间 </span> <span>{info.submitTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>申请方式</span>    <span>{info.applyType == 1 ? '商户申请' : ''}</span></Col>
          <Col span="12"><span>通道</span>    <span>{info.channelName}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>编号</span>    <span>{info.applyNumber}</span></Col>
          <Col span="12"><span>期望开票日期</span>    <span>{info.hopeTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>开票状态 </span>   <span> {stateList[info.invoiceStatus - 1]}</span></Col>
          <Col span="12"><span>开票时间</span>    <span>{info.billingTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>收票状态 </span>  <span>{info.receiveStatus == '1' ? '已收票' : '未收票'}</span></Col>
          <Col span="12"><span>收票时间</span>    <span>{info.receiveTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>备注</span> <span>{info.remarks}</span></Col>
          <Col span="12"></Col>
        </Row>
      </Card>
      <Card title="发票信息" className="mb24">
        <Row>
          <Col span="12"><span>开票金额</span> <span>{info.invoiceMoney}</span></Col>
          <Col span="12"><span>实际开票日期</span> <span>{info.billingTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>发票类型</span> <span>{info.invoiceType == '1' ? '增值税普通发票' : '增值税专用发票'}</span></Col>
          <Col span="12"><span>开票内容</span> <span>{info.invoiceContent}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>发票抬头</span> <span>{info.invoiceTitle}</span></Col>
          <Col span="12"><span>单位税号</span> <span>{info.taxNumber}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>银行账号</span> <span>{info.bankAccount}</span></Col>
          <Col span="12"><span>开户行</span> <span>{info.openBank}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>单位地址</span> <span>{info.unitAddress}</span></Col>
          <Col span="12"><span>单位电话</span> <span>{info.unitTel}</span></Col>
        </Row>
        <Row>
        <Col span="12">
            <span>发票图片</span>
            <span className="imgs">
              <Zmage
                src={urls[0].src}
                set={urls}
              />
              {
                urls[0].src && (
                  <p style={{color:'#ff0000'}}>点击查看多张图片</p>
                )
              }
            </span>
          </Col>
        <Col span="12"><span>驳回原因</span> <span className="reject">{info.reason}</span></Col>
         
        </Row>
      </Card>
      <Card title="邮寄信息">
        <Row>
          <Col span="12"><span>收件地址</span> <span>{info.address}</span></Col>
          <Col span="12"><span>收件人</span> <span>{info.addressee}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>联系电话</span> <span>{info.addresseePhone}</span></Col>
          <Col span="12"><span></span> <span></span></Col>
        </Row>
        <Row>
          <Col span="12"><span>快递品牌</span> <span>{info.postName}</span></Col>
          <Col span="12"><span>运单号</span> <span>{info.expressNumber}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>备注</span> <span>{info.postRemarks}</span></Col>
          <Col span="12"><span></span> <span></span></Col>
        </Row>
        <Row>
          <Col span="24">
            <span>快递信息</span>
            <Timeline mode="left" style={{ marginTop: 8 }}>
              {
                packag.data.map((item: any) => {
                  return (
                    <Timeline.Item label={item.time}>{item.context}</Timeline.Item>
                  )
                })
              }
            </Timeline>
          </Col>

        </Row>


      </Card>
    </div>

  );
};
