import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';
import { createComment, deleteComment, editComment } from '../api/userApi';
import { LayoutContext } from '../context/LayoutProvider';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import CommentForm from './CommentForm';

const Comment = ({comments, comment, parentId, setComment}) => {
    const [value, setValue] = useState('');
    const [out, setOut] = useState(false);
    const [edit, setEdit] = useState(false);
    const [childs, setChilds] = useState(comment.childs ? comment.childs : []);
    const [editVal, setEditVal] = useState(comment.content)
    const [show, setShow] = useState(false);

    const handleSubmit = async (articleId, content, parentId, replyId) => {
      let res = await createComment(articleId, content, parentId, replyId);
      return res.data;
    }
    const handleEdit = async (commentId, content) => {
      await editComment(commentId, content);
    }
    const handleDelete = async () => {
      await deleteComment(comment.id);
    }

    const {mainUser} = React.useContext(LayoutContext);
    return (
        <div key={comment.id} className={`mt-3 ${childs.length > 0 ? '' : 'mb-4 pb-4'} ${!comment.parent_id ? '': 'ml-12'}`}>
                <div className="md:flex items-center lg:mb-0 lg:w-auto items-center">
                    <Link to={`/user/${comment.user.id}`}>
                      <img
                        alt={comment.user.username}
                        style={{
                          width: '40px',
                          height: '40px'
                        }}
                        className="align-middle rounded-full"
                        src={comment.user.avatar}
                      />
                    </Link>
                    <p className="whitespace-pre-line text-black font-normal w-full mt-3 ml-2">  
                        on
                        {' '}
                        <span className='font-semibold'>{moment(comment.updated_at).format('MMM Do YYYY/ h:mm:ss a')}</span>
                    </p>
                </div>
                <div>
                  {!edit ?  
                  <div className='p-4 bg-gray-100 rounded pb-3 border-b border-gray-400 mt-1'>
                      <Link to={`/user/${comment.user.id}`}>
                        <p className="inline align-middle text-gray-700 ml-2 font-medium text-lg mt-5 hover:text-teal-400">{comment.user.username}</p>
                      </Link>
                      <p>{editVal ? editVal : comment.content}</p>
                  </div> : 
                  <div>
                    <div className='p-4 bg-gray-100 rounded pb-3 border-b border-gray-400 mt-1 flex '>
                        <textarea value={editVal} onChange={(e)=>{setEditVal(e.target.value)}} 
                        className="w-full p-2 outline-none rounded-lg focus:ring-2 focus:ring-gray-200 text-gray-700" />
                    </div>
                    <div className='flex justify-end'>
                      <button className='text-black hover:text-teal-400 cursor-pointer mx-2' onClick={()=>{
                        setEdit(false);
                        if(out) {
                          setOut(false);
                        } 
                        setEditVal(comment.content)}}>
                        Cancel
                      </button>
                      <button className='text-black hover:text-teal-400 cursor-pointer mx-2' onClick={async ()=>{
                        handleEdit(comment.id, editVal);
                        setEdit(false);
                        if(out) {
                          setOut(false);
                        }
                      }}>
                        Submit
                      </button>
                    </div>
                  </div>
                  }

                  {!edit &&
                  <div>
                    <div className='flex justify-end items-center' onClick={()=>{setOut((prev)=>(!prev))}}>
                      <button className='text-black hover:text-teal-400 cursor-pointer mx-2'>
                        Reply
                      </button>
                      {mainUser.id === comment.user.id && 
                      <button className='text-black hover:text-teal-400 cursor-pointer mx-2' onClick={()=>{
                        setValue('');
                        if(out) {
                          setOut(false);
                        }
                        setEdit(true);
                      }}>
                        Edit
                      </button>}
                      {mainUser.id === comment.user.id && 
                      <button className='text-black hover:text-teal-400 cursor-pointer mx-2' onClick={()=>{
                        handleDelete();
                        let copy = comments.filter(item => item.id != comment.id);
                        setComment(copy);}}>
                        Delete
                      </button>}
                    </div>
                  </div>}
                  {childs.length > 0 &&
                        <div className='flex justify-start'><button className='text-sm font-bold hover:text-teal-400 cursor-pointer' 
                        onClick={()=>{setShow((prev)=>(!prev));}}>{show ? <UpOutlined/> : <DownOutlined/>}</button></div>
                  }
                  {out && !edit &&
                  <div>
                    <div className='mt-4 flex'>
                      <textarea value={value} onChange={(e)=>{setValue(e.target.value)}} className="ml-10 w-full p-2 outline-none border border-gray-500 rounded-lg focus:ring-2 focus:ring-gray-200 text-gray-700" 
                      placeholder="Reply"/>
                    </div>
                    <div className='flex justify-end mt-2'>
                      <div className='mx-2'>
                        <button className='text-black hover:text-teal-400 cursor-pointer' onClick={()=>{setOut((prev)=>(!prev))}}>
                          Cancel
                        </button>
                      </div>
                      <div className='mx-2' onClick={async ()=>{
                        let tempt = await handleSubmit(comment.article_id, value, comment.id, comment.id);
                        setChilds((prev)=>[...prev, tempt]);
                        setOut(false);
                        setShow(true)
                        }}>
                        <button className='text-black hover:text-teal-400 cursor-pointer'>
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>}
                  {childs.length > 0 && show && childs.map((child)=>(<Comment comments={childs} comment={child} parentId={comment.id} key={child.id} setComment={setChilds}/>))}
                </div>
        </div>
    );
}

const Comments = ({comments, article}) => {
     const [Comments, setComments] = useState([]);
     const [total, setTotal] = useState([]);

     useEffect(() => {
      setComments(comments.data);
      setTotal(comments.total)
     }, [comments, article])

     return (
    <>
      <CommentForm articleId={article.data.id} setComments={setComments} setTotal={setTotal} comments={Comments}/>
      {total > 0 && 
        <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
          <h3 className="text-xl mb-8 font-semibold border-b pb-4">
            {total}
            {' '}
            Comments
          </h3>
            {Comments.map((comment) => (
              <Comment comments={Comments} comment={comment} className='mb-6' key={comment.id} setComment={setComments}/>
            ))}
        </div>
      }
    </>
  );
}

export default Comments