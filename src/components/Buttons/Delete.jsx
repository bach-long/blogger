import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'

const Delete = (articleId) => {
  return (
    <div className='flex items-center text-2xl ml-4 mb-2 cursor-pointer'>
      <div className='text-black hover:text-teal-400'>
          <DeleteOutlined/>
      </div>
    </div>
  )
}

export default Delete