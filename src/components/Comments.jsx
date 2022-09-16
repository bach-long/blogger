import React, { useState } from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';
import { createComment, editComment } from '../api/userApi';
import { LayoutContext } from '../context/LayoutProvider';
import { DownOutlined } from '@ant-design/icons';

const Comment = ({comment, parentId}) => {
    const [value, setValue] = useState('');
    const [out, setOut] = useState(false);
    const [edit, setEdit] = useState(false);
    const [childs, setChilds] = useState(comment.childs ? comment.childs : []);
    const [editVal, setEditVal] = useState(comment.content)
    const [show, setShow] = useState(false);
    const handleSubmit = async (articleId, content, parentId, replyId) => {
      let res = await createComment(articleId, content, parentId, replyId);
      console.log(res.data);
      return res.data;
    }
    const handleEdit = async (commentId, content) => {
      await editComment(commentId, content);
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
                      <button className='text-black hover:text-teal-400 cursor-pointer mx-2' onClick={()=>{setEdit(false); 
                        setEditVal(comment.content); setOut(false)}}>
                        Cancel
                      </button>
                      <button className='text-black hover:text-teal-400 cursor-pointer mx-2' onClick={async ()=>{
                        handleEdit(comment.id, editVal);
                        setEdit(false);
                        setOut(false);
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
                        setOut(false);
                        setEdit(true);
                      }}>
                        Edit
                      </button>}
                      {mainUser.id === comment.user.id && 
                      <button className='text-black hover:text-teal-400 cursor-pointer mx-2'>
                        Delete
                      </button>}
                    </div>
                  </div>}
                  {childs.length > 0 &&
                        <div className='flex justify-start'><button className='text-sm font-bold hover:text-teal-400 cursor-pointer' 
                        onClick={()=>{setShow((prev)=>(!prev))}}><DownOutlined/></button></div>
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
                        let tempt = await handleSubmit(comment?.article_id, value, comment.id, comment.id);
                        console.log(tempt);
                        setChilds((prev)=>[...prev, tempt]);
                        setOut(false);
                        }}>
                        <button className='text-black hover:text-teal-400 cursor-pointer'>
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>}
                  {childs.length > 0 && show && childs.map((child)=>(<Comment comment={child} parentId={comment.id} key={child.id}/>))}
                </div>
        </div>
    );
}

const Comments = ({comments}) => {
     return (
    <>
      {comments.total > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
          <h3 className="text-xl mb-8 font-semibold border-b pb-4">
            {comments.total}
            {' '}
            Comments
          </h3>
            {comments.data.map((comment) => (
              <Comment comment={comment} className='mb-6' key={comment.id}/>
            ))}
        </div>
      )}
    </>
  );
}

export default Comments