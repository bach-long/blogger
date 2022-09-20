import React, {useEffect, useState} from 'react'
import { Button } from 'antd/lib/radio';
import { followHandle } from '../../api/userApi';

const Follow = ({follow, userId, followingId, sends}) => {
  //console.log(follow, userId, followingId);
  const [icon, setIcon] = useState(0);
  useEffect(()=>{
    setIcon(follow ? 1 : 0);
  },[follow, userId, followingId])
  //console.log(follow);
  const handleChange = async () => {
    await followHandle(userId, followingId);
    if(sends) {
      await sends(2)
    }
    setIcon((prev)=>(1-prev))
  } 
  if(icon == 0) {
    return (
        <div className='flex justify-end ml-2'>
            <Button type='text' size='small' onClick={handleChange}>Follow</Button>
        </div>
    )
  } else {
    return (
        <div className='flex justify-end ml-2'>
            <Button size='small' style={{background: 'rgb(14 165 233)', color: 'white'}} shape="round" onClick={handleChange}>Following</Button>
        </div>
    )
  }
}

export default Follow