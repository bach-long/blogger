import React, { useEffect } from 'react'
import { Button } from 'antd'
import { BookOutlined, BookFilled } from '@ant-design/icons'
import { useState } from 'react';
import { bookmarkHandle } from '../../api/userApi';

const Bookmark = ({bookmark, userId, authorId, articleId, sends}) => {
  //console.log(bookmark);
  const a = [<BookFilled style={{fontSize: '2rem'}}/>, <BookOutlined style={{fontSize: '2rem'}}/>];
  const [icon, setIcon] = useState(1)
  useEffect(()=> {
    setIcon(bookmark ? 0 : 1)
  }, [bookmark, articleId, userId])
  const handle = async () => {
    await bookmarkHandle(userId, articleId);
    if(sends) { 
      await sends(3)
    }
    setIcon((prev)=>(1-prev))
  }
  return (
    <div className='flex justify-end' onClick={handle}>
        <Button type="text" size='large' icon={a[icon]}/>
    </div>
  )
}

export default Bookmark