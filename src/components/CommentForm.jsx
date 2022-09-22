import create from '@ant-design/icons/lib/components/IconFont';
import React, {useState} from 'react'
import { createComment } from '../api/userApi';

const CommentForm = ({articleId, setComments, setTotal}) => {
  const [input, setInput] = useState('');
  const handleChange = (e) => {
    setInput(e.target.value);
  }

  const handleSubmit = async () => {
    let res = await createComment(articleId, input, null, null);
    return res.data;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 pb-2 mb-2">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Leave a Reply</h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <textarea value={input} onChange={handleChange} className="p-4 outline-none w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700" name="comment" placeholder="Comment" />
      </div>
      <div className="mt-8 flex justify-end">
        <button type="button" onClick={async ()=>{
          let res = await handleSubmit();
          setComments((prev)=>([res, ...prev]));
          setTotal((prev)=>(prev+1));
          setInput('');  
          }} className="inline-block bg-teal-400 text-lg font-medium rounded-full text-white px-4 py-3 cursor-pointer">Post Comment</button>
      </div>
    </div>
  )
}

export default CommentForm