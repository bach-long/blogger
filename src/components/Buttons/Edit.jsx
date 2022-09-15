import React from 'react'
import { EditOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const Edit = ({articleId, userId}) => {
  return (
    <div className='flex items-center text-2xl ml-4 mb-2'>
      <Link to={`/edit/${articleId}/${userId}`} className='text-black hover:text-teal-400'>
          <EditOutlined/>
      </Link>
    </div>
  )
}

export default Edit