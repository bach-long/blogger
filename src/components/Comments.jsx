import React from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';

const Comment = ({comment}) => {
    return (
        <div key={comment.id} className={`ml-10 mt-3 ${comment.childs.length > 0 ? '' : 'mb-4 pb-4'}`}>
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
                <div className={`p-4 bg-gray-100 rounded pb-3 border-b border-gray-400 mt-1 ${comment.childs.length > 0 ? 'mb-6' : ''}`}>
                    <Link to={`/user/${comment.user.id}`}>
                      <p className="inline align-middle text-gray-700 ml-2 font-medium text-lg mt-5 hover:text-teal-400">{comment.user.username}</p>
                    </Link>
                    <p>{comment.content}</p>
                </div>
                {comment.childs.length > 0 && comment.childs.map((child)=>(<Comment comment={child} key={child.id}/>))}
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