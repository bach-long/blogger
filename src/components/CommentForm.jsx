import React, {useState} from 'react'

const CommentForm = () => {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value);
  }

  const handleSubmit = () => {console.log(input)}

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 pb-2 mb-2">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Leave a Reply</h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <textarea value={input} onChange={handleChange} className="p-4 outline-none w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700" name="comment" placeholder="Comment" />
      </div>
      <div className="mt-8 flex justify-end">
        <button type="button" onClick={handleSubmit} className="inline-block bg-teal-400 text-lg font-medium rounded-full text-white px-4 py-3 cursor-pointer">Post Comment</button>
      </div>
    </div>
  )
}

export default CommentForm