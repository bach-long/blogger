import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'

const Postwidget = ({articles}) => {
  return (
    <div className='bg-white shadow-lg rounded-lg p-0 lg:p-5 mb-8'>
      <h3 className='text-xl mb-8 font-semibold border-b pb-4 text-center'>Recent Posts</h3>
        {articles.map((article)=>(
        <div className='flex items-center w-full mb-4' key={article.id}>
          <div className='w-16 flex-none'>
            <img style={{height: '60px', width: '60px'}} className='align-middle rounded-full' src={article.author.avatar}/>
          </div>
          <div className='flex-grow ml-4 align-middle mt-3'>
            <Link to={`/detail/${article.id}`}>
              <p className='font-bold mb-0 text-black hover:text-teal-400'>
                {article.title}
              </p>
            </Link>
            <p className='font-xs'>
              {moment(article.updated_at).format('MMM DD/YYYY')}
            </p>
          </div>
        </div>
        ))}
    </div>
  )
}

export default Postwidget