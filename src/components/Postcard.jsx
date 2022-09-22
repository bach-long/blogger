import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Bookmark from './Buttons/Bookmark'
import { LayoutContext } from '../context/LayoutProvider'
import {EyeFilled, BookFilled, CommentOutlined, EditOutlined, DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import Edit from './Buttons/Edit'
import { Tooltip } from 'antd'
import Delete from './Buttons/Delete'
import { softDeleteArticle, restore } from '../api/articleApi'
import { useNavigate } from 'react-router-dom'

const Postcard = ({article, deleted, list, setList, deleteList, setDeleteList}) => {
  const {mainUser} = React.useContext(LayoutContext);
  const navigate = useNavigate();

  return (
    <div className='bg-white shadow-lg rounded-lg p-0 lg:p-8 pb-12 mb-8'>
      <div className="relative overflow-hidden shadow-md pb-80 mb-6">
        <img src={article.thumbnail}
        className='object-top absolute h-80 w-full object-cover shadow-lg rounded-t-lg lg:rounded-lg'/>
      </div>
      <div className="flex items-center justify-center mb-8 w-full">
        <div className="md:flex items-center lg:mb-0 lg:w-auto items-center">
          <div className='flex items-center text-2xl'>
            <EyeFilled/>
            <span className='ml-2'>{article.view_count}</span>
          </div>
          <div className='flex items-center text-2xl ml-4'>
            <BookFilled/>
            <span className='ml-2'>{article.bookmark.length}</span>
          </div>
          <div className='flex items-center text-2xl ml-4'>
            <CommentOutlined/>
            <span className='ml-2'>{article.comments.length}</span>
          </div>
          {mainUser.id == article.author.id && !deleted &&
           <Edit articleId ={article.id} userId={mainUser.id}/>
          }
          {mainUser.id == article.author.id && !deleted &&
            <div onClick={async ()=>{
              await softDeleteArticle(article.id);
              if(setDeleteList) {
                let copy = list.data.filter(item => item.id !== article.id);
                let copy1 = [article, ...deleteList.data]
                setList((prev)=>({...prev, data: copy}));
                setDeleteList((prev)=>({...prev, data: copy1})) 
              } else {
                navigate(`/user/${mainUser.id}`, {state: {item: 'deleted'}})
              }
            }}>
            <Delete />
            </div>
          }
        </div>
      </div>
      {!deleted ? 
      <Link to={`/detail/${article.id}`} className='inline-block flex justify-center'>
      <h1 className='inline align-middle transition duration-700 mb-8 cursor-pointer 
        hover:text-teal-400 text-3xl font-semibold inline-block'>
          {article.title}
      </h1>
      </Link> : 
      <div className='inline-block flex justify-center'>
        <h1 className='inline align-middle transition duration-700 mb-8 text-3xl font-semibold inline-block'>
            {article.title}
        </h1>
      </div>
      }
      <div className="block text-center items-center justify-center mb-8 w-full">
        <div className="flex items-center justify-center mb-4 lg:mb-0 w-full lg:w-auto items-center">
          <img
            style={{
              height : "35px",
              width : "35px"
            }}
            className="align-middle rounded-full"
            src={article.author.avatar}
          />
          <p className="inline align-middle text-gray-700 ml-2 mt-4 font-medium text-lg">{article.author.username}</p>
        </div>
        <div className="flex items-center justify-center font-medium text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="align-middle">{moment(article.updated_at).format('MMM Do YYYY')}</span>
        </div>
      </div>
      {!deleted ?
      <Link to={`/detail/${article.id}`} className='inline-block flex justify-center'>
        <span className="transition duration-500 ease transform hover:-translate-y-1 inline-block bg-teal-500 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer">Continue Reading</span>
      </Link> : 
      <div className='inline-block flex justify-center items-center mt-4'>
        <Tooltip title='restore' placement='right'>
          <RedoOutlined style={{fontSize: '3rem'}} className="text-black hover:text-teal-400 cursor-pointer" onClick={
            async () => {
              await restore(article.id);
              let copy = list.data.filter(item => item.id !== article.id)
              setList((prev)=>({...prev, data: copy}));
              navigate(`/detail/${article.id}`)
            }
          }/>
        </Tooltip>
      </div>
      }
    </div>
  )
}

export default Postcard