import React, { useState, useEffect, createContext , useContext,useImperativeHandle} from 'react';
import { Upload, Button, message ,Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import myContext from '@/components/ImgUpload/creatContext'
import './index.less';

export default ({cRef}) => {
  const [fileList, setFile] = useState([])
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
  })
  const count = useContext(myContext).count||10
  const type = useContext(myContext).type||1
  
  useImperativeHandle(cRef, () => ({
		// changeVal 就是暴露给父组件的方法
	    getUpFile: () => {
        if(fileList.length==0){
          return []
        }else{
          let arr = fileList.map((item:any)=>item.url)
	        return arr
        }
	    }
  	}));

  useEffect(() => {
   
  }, []);

  const upProps = {
    action: '/client/document/upload',
    listType: 'picture-card',
    accept:"image/*",
    fileList: fileList,
    data:{
      type:type,
    },
    headers: {
      "User-Client": 'client',
    },
    beforeUpload(file: any) {


      const isLt2M = file.size / 1024 / 1024 <= 8;
      let isMax = fileList.length<count
      if (!isLt2M) {
        message.error('单个文件不能超过8M！');
      }

      if(fileList.length>=count){
        message.info(`最多上传${count}张图片！`)
      }

      return isLt2M&&isMax;

     
    },
    onChange(info: any) {
      
      if(info.file.status=='uploading'){
        setFile(info.fileList)
      }
      if (info.file.status === 'done') {
        changeList(info.fileList)
      }
      if (info.file.status == "removed") {
        changeList(info.fileList)
      }    
    },
    onPreview(file:any){
      setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    }
  };

  const changeList = (list: any) => {
    let arr = [] 
    list.forEach((item:any)=>{
      if(item.response&&item.response.result){
        let obj = {...item}
        obj.url=item.response.data
        arr.push(obj)
      }
    })
    setFile(arr)

  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">点击上传</div>
    </div>
  )
  return (
    <div>
      <Upload {...upProps}>
        {fileList.length >= 10 ? null : uploadButton}
      </Upload>
      <p className="mt10">
  1、最多添加{count}个附件，单文件大小不超过8M <br />
        2、支持格式：jpeg、jpg、png
      </p>
      <Modal
          visible={state.previewVisible}
          title={state.previewTitle}
          footer={null}
          onCancel={()=>{setState({...state,previewVisible:false})}}
        >
          <img alt="example" style={{ width: '100%' }} src={state.previewImage} />
        </Modal>
    </div>
  );
};
