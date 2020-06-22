import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Select } from 'antd';
const { Option } = Select
import { enBatchPaymentInfo, taskList } from '@/services/settlement'
import Zmage from 'react-zmage'
import './index.less';

const statusList = ['打款完成', '打款审核中', '打款失败']
const columns = [
  {
    title: '打款金额',
    key: 'payAmount',
    dataIndex: 'payAmount',
  },
  {
    title: '收款人',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '打款状态',
    key: 'status',
    dataIndex: 'status',
    render: (tags: any) => {
      let obj = {
        '1': '打款完成',
        '2': '打款审核中',
        '3': '打款失败'
      }
      return (
        <span>{obj[tags]}</span>
      )
    }
  },
  {
    title: '原因',
    key: 'reason',
    dataIndex: 'reason',
  },
  {
    title: '收款账户',
    key: 'bankAccount',
    dataIndex: 'bankAccount',
  },
  {
    title: '证件号码',
    key: 'idcard',
    dataIndex: 'idcard',
  },
]

export default (props: any) => {
  const [id, setId] = useState()
  const [info, setInfo] = useState<any>({})
  const [data, setData] = useState([])
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const [urls, setUrls] = useState<any>([{ src: '' }])

  useEffect(() => {
    if (props.location.state) {
      setId(props.location.state.id)
      getInfo(props.location.state.id)
      getData(props.location.state.id)
    }
  }, []);


  const getData = (id: string) => {
    taskList({ page: pageInfo.page, limit: pageInfo.limit, batchId: id }).then(res => {
      if (res.result) {
        setData(res.data.rows)
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

  const getInfo = (id: string) => {
    enBatchPaymentInfo({ id }).then(res => {
      if (res) {
        setInfo(res.data)
        let arr = res.data.settlementVoucher.split(',')
        let obj = arr.map((item: string) => {
          return {
            src: item,
          }
        })
        setUrls(obj)
      }
    })
  }

  return (
    <div className="detail">
      <Card className="mb24">
        <Row>
          <Col span="12">合计总额（笔|元）</Col>
          <Col span="12">打款成功（笔|元）</Col>
        </Row>
        <Row>
          <Col span="12" className="total">{info.settleNum} | ￥{info.settleAmount}</Col>
          <Col span="12" className="total primary">{info.successSettleNum} {'| ￥' + info.successSettlePay}</Col>
        </Row>
      </Card>
      <Card title="打款信息" className="mb24">
        <Row>
          <Col span="12"><span>批次号</span> <span>{info.batchNo}</span></Col>
          <Col span="12"><span>打款时间 </span> <span>{info.submitTime}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>申请人</span>    <span>{info.name}</span></Col>
          <Col span="12"><span>打款状态</span>    <span>{statusList[info.status - 1]}</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>打款通道</span>    <span>{info.channelName}</span></Col>
          <Col span="12"><span>打款方式</span>    <span>银行打款</span></Col>
        </Row>
        <Row>
          <Col span="12"><span>打款凭证 </span>
            <span className="imgs">
              <Zmage
                src={urls[0].src}
                set={urls}
              />
              {
                urls[0].src && (
                  <p style={{ color: '#ff0000' }}>点击查看多张图片</p>
                )
              }
            </span>
          </Col>
        </Row>

      </Card>
      <Card title="打款信息">
        <Table
          pagination={{
            pageSize: pageInfo.limit,
            total: pageInfo.total,
            onChange: changePage
          }} columns={columns} dataSource={data}></Table>
      </Card>

    </div>

  );
};

