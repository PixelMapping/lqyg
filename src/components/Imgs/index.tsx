import React, { useState, useEffect , useContext,useImperativeHandle} from 'react';
import Zmage from 'react-zmage'
import myContext from './creatContext'
import './index.less';

export default ({cRef}) => {
  const [urls, setUrl] = useState([{src:''}])
  const src = useContext(myContext).src

  
  useImperativeHandle(cRef, () => ({
		// changeVal 就是暴露给父组件的方法
	   
  	}));

  useEffect(() => {
    if(src){
      let arr = src.split(',')
      let newUrl = arr.map((item:any)=>{
        return {
          src:item
        }
      })
      setUrl(newUrl)
    }
  }, [src]);

  
  return (
    <div className="imgs">
      <Zmage
        src={urls[0].src}
        set={urls}
    />
    <p style={{color:'#ff0000'}}>点击查看多图</p>
    </div>
  );
};
