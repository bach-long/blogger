import React, { useState, useRef } from 'react'
import { CloseCircleFilled } from '@ant-design/icons';
import { Image } from 'antd';
import { PlusSquareFilled } from '@ant-design/icons'; 
import {upload} from '../api/imageApi';

const Images = ({list}) => {
  const[images, setImages] = useState(list);
  const [amount, setAmount] = useState(6);
  const inputFile = useRef(null);
  const handleFiles = async (e) => {
    let fileList = [...e.target.files];
    //console.log(files);
    let data = new FormData();

    fileList.forEach((file) => {
        data.append('images[]', file)
    });

    let res = await upload(data);
    setImages((prev)=>([...prev, ...res.data]));
  }
  return (
    <div>
    <div className='flex justify-end'>
      <div className='cursor-pointer hover:text-gray-500 text-gray-400 text-2xl mb-4'>
        <PlusSquareFilled onClick={(e)=>{inputFile.current.click()}}/> 
        <input type='file' ref={inputFile} style={{display: 'none'}} accept='image/png,image/jpeg' multiple 
        onChange={handleFiles}></input>
      </div>
    </div>
    <div className='grid grid-cols-1 lg:grid-cols-9 gap-12 px-10 flex items-stretch items-center'>
        {images.slice(0,amount).map((image)=>(
          <div className='lg:col-span-3 col-span-1 py-4 rounded'>
          <div className='flex justify-start relative'>
              <Image className='flex-none' src={image.img_link}/>
              <div className='absolute text-gray-400 -right-2 -top-2 hover:text-gray-500 cursor-pointer'>
                  <CloseCircleFilled style={{fontSize: '1.5rem'}}/>
              </div>
          </div>
        </div>
        ))}
    </div>
    {images.length > 6 &&
    <div className='flex justify-center text-black hover:text-teal-400 cursor-pointer mt-10'>
        <button className='text-xl font-semibold' onClick={()=>{
          setAmount((prev)=>(prev + 6));
          console.log(amount)}}>More...</button>
    </div>}
    </div>
  )
}

export default Images