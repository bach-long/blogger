import React, { useState } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview';
import { ArrowLeftOutlined, EyeFilled, BookFilled, CommentOutlined,
   LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Follow from './Buttons/Follow';
import CommentForm from './CommentForm';
import { LayoutContext } from '../context/LayoutProvider';
import Bookmark from './Buttons/Bookmark';
import Comments from './Comments';
import { memo } from 'react';
import { Spin } from 'antd';
import moment from 'moment';
import { reactHandle } from '../api/userApi';

const PostDetail = ({article, comments}) => {
  const [like, setLike] = useState(article?.isLike);
  const [likeCount, setLikeCount] = useState(article?.likeCount);
  const [dislikeCount, setdislikeCount] = useState(article?.dislikeCount);
  const {mainUser} = React.useContext(LayoutContext);
  const navigate = useNavigate();

  const handleLike = async () => {
    if(like === 1) {
      let react = await reactHandle(article?.data?.id, -1);
      setLikeCount(react.data.likeCount);
      setdislikeCount(react.data.dislikeCount);
      setLike(-1)
    } else {
      let react = await reactHandle(article?.data?.id, 1);
      setLikeCount(react.data.likeCount);
      setdislikeCount(react.data.dislikeCount);
      setLike(1);
    }
  }

  const handleDislike = async () => {
    if(like === 0) {
      let react = await reactHandle(article?.data?.id, -1);
      setLikeCount(react.data.likeCount);
      setdislikeCount(react.data.dislikeCount);
      setLike(-1)
    } else {
      let react = await reactHandle(article?.data?.id, 0);
      setLikeCount(react.data.likeCount);
      setdislikeCount(react.data.dislikeCount);
      setLike(0)
    }
  }

  return (
    <div>
    {article? 
    <div className="bg-white shadow-lg rounded-lg lg:p-8 pb-12 mb-8">
        <div className='mb-5 cursor-pointer hover:bg-teal-400 inline-block rounded p-1'>
          <ArrowLeftOutlined style={{fontSize: '2rem', color: 'black'}} onClick={() => navigate(-1)}/>
        </div>
        <div className="relative overflow-hidden shadow-md mb-6">
          <img src={article?.data?.thumbnail} alt="" 
          className="object-top h-full w-full object-cover  shadow-lg rounded-t-lg lg:rounded-lg" />
        </div>
        <div className="px-4 lg:px-0">
          <div className="flex items-center mb-8 w-full">
            <div className="md:flex items-center justify-center lg:mb-0 lg:w-auto mr-8 items-center">
              <div className='flex items-center text-2xl ml-4'>
                <EyeFilled/>
                <span className='ml-2'>{article?.data?.view_count}</span>
              </div>
              <div className='flex items-center text-2xl ml-4'>
                <BookFilled/>
                <span className='ml-2'>{article?.data?.bookmark?.length}</span>
              </div>
              <div className='flex items-center text-2xl ml-4'>
                <CommentOutlined/>
                <span className='ml-2'>{article?.data?.comments?.length}</span>
              </div>
              {!localStorage.getItem('token') && 
               <div className='flex justify-end font-semibold ml-96 text-2xl'>
                  <Link to={'/authenticate'}><span className='mt-6 text-black cursor-pointer hover:text-teal-400 ml-16'><LoginOutlined style={{marginBottom: '12px'}}/></span></Link>
               </div>
              }
              {localStorage.getItem('token') && 
              <div className='flex justify-end ml-72'>
                {/*<Like count={likeCount} value={like} setLike={setLike} userId={mainUser.id} articleId={article?.data?.title}/>*/}
                <div className='flex items-center text-2xl ml-4'>
                {like === 1 || (article?.isLike === 1 && !like) ?
                  <LikeFilled style={{fontSize: '2rem'}} onClick={handleLike}/> :
                  <LikeOutlined style={{fontSize: '2rem'}} onClick={handleLike}/> 
                }
                <span className='ml-2'>{article?.likeCount}</span>
                </div>     
              </div>}
              {localStorage.getItem('token') && 
              <div className='flex justify-end ml-2'>
                {/*<Dislike count={dislikeCount} value={like} setLike={setLike} userId={mainUser.id} articleId={article?.data?.title}/>*/}
                <div className='flex items-center text-2xl ml-4'> 
                {like === 0 || (article?.isLike === 0 && !like) ?
                  <DislikeFilled style={{fontSize: '2rem'}} onClick={handleDislike}/> :
                  <DislikeOutlined style={{fontSize: '2rem'}} onClick={handleDislike}/> }
                  <span className='ml-2'>{article?.dislikeCount}</span>
                </div> 
              </div>}
              {localStorage.getItem('token') && 
              <div className='flex justify-end ml-2'>
                <div className='flex items-center text-2xl ml-4'>
                  <Bookmark bookmark = {article?.isBookmarked} userId={mainUser.id} articleId={article?.data?.id}/>
                </div>
              </div>}
            </div>
          </div>
          <div className="flex items-center mb-8 w-full">
            <div className="md:flex items-center justify-center lg:mb-0 lg:w-auto mr-8 items-center">
            <Link to={`/user/${article?.data?.author?.id}`}>
              <img
                alt={article?.data?.author?.username}
                style={{
                  width: '40px',
                  height: '40px'
                }}
                className="align-middle rounded-full"
                src={article?.data?.author?.avatar}
              />
            </Link>
            <Link to={`/user/${article?.data?.author?.id}`}>
              <p className="inline align-middle text-gray-700 ml-2 font-medium text-lg mt-5 hover:text-teal-400">{article?.data?.author?.username}</p>
            </Link>
            {localStorage.getItem('token') &&
              <Follow follow={article?.authorFollowed} userId={mainUser.id} followingId={article?.data?.author?.id} />}
            </div>
            <div className="font-medium text-gray-700 justify-end">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="align-middle">{moment(article?.data?.updated_at).format('MMM DD/YYYY')}</span>
            </div>
          </div>
          <div>
            <h1 className="mb-8 text-4xl font-semibold">{article?.data?.title}</h1>
          </div>
          <MarkdownPreview
           source={article?.data?.content}
           rehypeRewrite={(node, index, parent) => {
             if (node.tagName === "a" && parent && /^h(1|2|3|4|5|6)/.test(parent.tagName)) {
               parent.children = [parent.children[1]];
             }
           }} 
          />
        </div>
      </div> : <div className='flex justify-center'><Spin size='large' tip="Almost done ..."/></div>}
      {localStorage.getItem('token') ?  
        <div>
          <CommentForm/>
          <Comments comments={comments}/> 
        </div> :
        <div className='flex justify-center font-bold'>
          <Link to={'/authenticate'}><span className='mt-6 text-white text-2xl cursor-pointer hover:text-teal-500'>Login to see comments</span></Link>
        </div>
      }
      </div>
  )
  }
export default memo(PostDetail);