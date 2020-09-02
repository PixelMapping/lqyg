import React, { useState, useEffect } from 'react';
import './index.less';
import { Card, Steps, Form, Table, Select, Upload, message, Button, Radio, Row, Col } from 'antd'
import { UploadOutlined, CheckCircleFilled } from '@ant-design/icons';
import { enterpriseChannels, batchPaymentSumit, checkSetleTaskInfo, taskList, confirmPpayment,countImport } from '@/services/settlement'
const { Option } = Select
const { Step } = Steps;

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};


const columns = [
  {
    title: '姓名',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '手机号',
    key: 'phone',
    dataIndex: 'phone'
  },
  {
    title: '证件类型',
    key: 'cardType',
    render: (tags: any) => ('身份证')
  },
  {
    title: '证件号码',
    key: 'idcard',
    dataIndex: 'idcard'
  },
  {
    title: '报名类型',
    key: 'enrollType',
    dataIndex: 'enrollType',
    render: (tags: any) => (tags == 1 ? '小程序报名' : '平台导入')
  },
  {
    title: '收款账户',
    key: 'bankAccount',
    dataIndex: 'bankAccount'
  },
  {
    title: '任务验收时间',
    key: 'submitTime',
    dataIndex: 'submitTime'
  },
  {
    title: '结算状态',
    key: 'status',
    dataIndex: 'status',
    render: (tags: any) => {
      let arr = ['打款完成', '打款审核中', '打款失败']
      return (
        <span>{arr[tags - 1]}</span>
      )
    }
  },
  {
    title: '结算金额',
    key: 'payAmount',
    dataIndex: 'payAmount'
  },
  {
    title: '失败原因',
    key: 'reason',
    dataIndex: 'reason'
  }
]


export default (props: any) => {
  const [cur, setCur] = useState(0);
  const [list, setList] = useState([])
  const [subInfo, setInfo] = useState<any>()
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<any>({

  })
  const [file, setFile] = useState('')
  const [isSub, setIsSub] = useState('a')
  const [totals, setTotals] = useState<any>({})
  const [data, setData] = useState([])
  const [comInfo, setComInfo] = useState<any>({})
  const [pageInfo, setPage] = useState({ page: 1, limit: 20, total: 0 })
  const upProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    showUploadList: false,
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: (file: any) => {
      message.info('添加成功！')
      setFile(file)
      return false;
    }
  };
  const againProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    showUploadList: false,
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: (file: any) => {
      let obj = {
        channelId: formData.channelId,
        settlementMethod: formData.settlementMethod,
        batchId:subInfo.batchId
      }
      setCur(1)
      message.info('添加成功！')
      next(obj, file)
    }
  };
  useEffect(() => {
    if (localStorage.getItem('comInfo')) {
      setComInfo(JSON.parse(localStorage.getItem('comInfo')))
    }
    getList()
    if (cur == 1) {
      getCheck()
      // getDetail(1)
    }

  }, [cur]);

  const getList = () => {
    enterpriseChannels({}).then(res => {
      setList(res.data)
    })
  }

  const next = (values: any, files: any) => {
    let upFile = files ? files : file
    if (upFile == '') {
      message.info('请选择文件！')
      return
    }
    let channelName = list.filter((item: any) => item.id == values.channelId)[0].name


    let data = new FormData()
    data.append('channelId', values.channelId)
    data.append('channelName', channelName)
    data.append('settlementMethod', values.settlementMethod)
    data.append('file', upFile)
    batchPaymentSumit(data).then(res => {
      if (res.result) {
        setFormData(values)
        setInfo(res.data)
        setCur(1)
      }
    })
  }

  const getCheck = () => {
    countImport({ batchId: subInfo.batchId, showLoading: true }).then(res => {
      if (res.result) {
        setTotals(res.data)
        setIsSub('b')
        getDetail(1)
      }
    })
  }
  const getDetail = (type: number) => {
    let data = {
      page: pageInfo.page,
      limit: pageInfo.limit,
      batchId: subInfo.batchId,
      checkFlag: type
    }
    taskList(data).then(res => {
      if (res) {
        setData(React.setKey(res.data.rows))
      }
    })
  }

  const changePage = (current: number) => {
    pageInfo.page = current
    setPage(pageInfo)
    getDetail(cur)
  }

  const submit = () => {
    if (data.length == 0) {
      message.info('暂无结算数据！')
      return
    }
    let prames = {
      enterpriseId: subInfo.enterpriseId,
      channelId: subInfo.channelId,
      batchId: subInfo.batchId
    }
    confirmPpayment(prames).then(res => {
      if (res.result) {
        setCur(2)
      }
    })
  }

  const selectBtn = (e: any) => {
    if (e.target.value == 'a') {
      setIsSub('a')
      getDetail(-1)
    } else {
      setIsSub('b')
      getDetail(1)
    }
  }

  const toList = () => {
    props.history.push('batch')
  }

  return (
    <div className="money">
      <Card className="mb24">
        <Steps current={cur}>
          <Step title="上传数据" />
          <Step title="初步检验" />
          <Step title="确认打款" />
        </Steps>

        {
          cur == 2 && (
            <div className="sucess">
              <CheckCircleFilled style={{ fontSize: 60, color: '#1890ff' }} />
              <p className="tit">结算名单提交成功</p>
              <p className="des">预计1个工作日完成审核</p>
              <Button onClick={toList}>批次列表</Button>
            </div>
          )
        }
      </Card>
      {

        cur == 0 && (
          <Card>

            <Form {...layout} form={form} onFinish={next}>
              <Form.Item label="当前账户">
                {comInfo.enterpriseName}
              </Form.Item>
              <Form.Item label="打款通道" name="channelId" rules={[{ required: true }]}>
                <Select className="w200">
                  {
                    list.map((item: any) => {
                      return (
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="结算方式" name="settlementMethod" rules={[{ required: true }]}>
                <Select className="w200">
                  <Option value="1">一次性结算</Option>
                </Select>
              </Form.Item>
              <Form.Item label="上传文件">
                <Upload {...upProps} className="mr10">
                  <Button>
                    <UploadOutlined /> 上传文件
                </Button>
                </Upload>
                {/* <Button type="link" href="http://lqyg.shunshuitong.net/resource/template/结算名单.xlsx">下载导入模板</Button> */}
                <p className="mt10">(任务详情->结算名单->导出模板)<br />支持格式：xls,xlsx</p>
              </Form.Item>
              <Button type="primary" className="ml130" htmlType="submit">下一步</Button>
            </Form>
          </Card>

        )
      }


      {
        (cur == 1 || cur == 4) && (
          <div>
            <p className="describe">当前表格合计{totals.success+totals.fail}条  可发起打款{totals.success}条</p>
            <Card className="mb24">
              <div className="info">
                <div className="lt">
                  <p>通过验证（条）</p>
                  <p className="num">{totals.success}</p>
                </div>
                <div className="rt">
                  <p>未通过（条）</p>
                  <p className="num">{totals.fail}</p>
                </div>
              </div>
            </Card>
            <Card className="mb24">
              <Row justify="space-between">
                <Col>
                  <Radio.Group value={isSub} buttonStyle="solid" onChange={selectBtn}>
                    <Radio.Button value="a">未通过</Radio.Button>
                    <Radio.Button value="b">通过验证</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col>
                  {
                    isSub == 'b' && (
                      <Button className="mr10" onClick={submit}>提交结算</Button>
                    )
                  }
                  <Upload {...againProps}><Button>重新上传</Button></Upload>
                </Col>
              </Row>

              <Table
                pagination={{
                  pageSize: pageInfo.limit,
                  total: pageInfo.total,
                  onChange: changePage
                }}
                className="mt10"
                columns={columns}
                dataSource={data}
              ></Table>
            </Card>
          </div>

        )
      }

    </div>
  );
};
