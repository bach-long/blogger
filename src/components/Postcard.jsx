import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Bookmark from './Buttons/Bookmark'
import { LayoutContext } from '../context/LayoutProvider'
import {EyeFilled, BookFilled, CommentOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Edit from './Buttons/Edit'

const Postcard = ({article}) => {
  const {mainUser} = React.useContext(LayoutContext);

  return (
    <div className='bg-white shadow-lg rounded-lg p-0 lg:p-8 pb-12 mb-8'>
      <div className="relative overflow-hidden shadow-md pb-80 mb-6">
        <img src={article?.thumbnail}
        className='object-top absolute h-80 w-full object-cover shadow-lg rounded-t-lg lg:rounded-lg'/>
      </div>
      <div className="flex items-center justify-center mb-8 w-full">
        <div className="md:flex items-center lg:mb-0 lg:w-auto mr-8 items-center">
          <div className='flex items-center text-2xl ml-4'>
            <EyeFilled/>
            <span className='ml-2'>{article?.view_count}</span>
          </div>
          <div className='flex items-center text-2xl ml-4'>
            <BookFilled/>
            <span className='ml-2'>{article?.bookmark?.length}</span>
          </div>
          <div className='flex items-center text-2xl ml-4'>
            <CommentOutlined/>
            <span className='ml-2'>{article?.comments?.length}</span>
          </div>
          {mainUser?.id == article?.author?.id &&
           <Edit articleId ={article?.id} userId={mainUser.id}/>
          }
          {mainUser?.id == article?.author?.id &&
          <div className='flex items-center text-2xl ml-4 mb-2'>
            <Link to={`/`} className='text-black hover:text-teal-400'>
              <DeleteOutlined/>
            </Link>
          </div>
          }
        </div>
      </div>
      <Link to={`/detail/${article.id}`} className='inline-block flex justify-center'>
      <h1 className='inline align-middle transition duration-700 mb-8 cursor-pointer 
        hover:text-teal-400 text-3xl font-semibold inline-block'>
          {article.title}
      </h1>
      </Link>
      <div className="block text-center items-center justify-center mb-8 w-full">
        <div className="flex items-center justify-center mb-4 lg:mb-0 w-full lg:w-auto items-center">
          <img
            style={{
              height : "35px",
              width : "35px"
            }}
            className="align-middle rounded-full"
            src={article?.author?.avatar}
          />
          <p className="inline align-middle text-gray-700 ml-2 mt-4 font-medium text-lg">{article?.author?.username}</p>
        </div>
        <div className="flex items-center justify-center font-medium text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="align-middle">{moment(article?.updated_at).format('MMM Do YYYY')}</span>
        </div>
      </div>
      <Link to={`/detail/${article.id}`} className='inline-block flex justify-center'>
        <span className="transition duration-500 ease transform hover:-translate-y-1 inline-block bg-teal-500 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer">Continue Reading</span>
      </Link>
    </div>
  )
}

export default Postcard