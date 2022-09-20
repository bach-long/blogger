import React, { useState } from 'react'
import Follow from './Buttons/Follow';
import { Link } from 'react-router-dom';

const PeopleList = ({list, userId}) => {
  const [amount, setAmount] = useState(6);
  return (
    <div>
    <div className='grid grid-cols-1 lg:grid-cols-9 gap-12 px-10 flex items-stretch items-center'>
        {list.slice(0,amount).map((user)=>(
          <div className='lg:col-span-3 col-span-1 py-4 rounded' key={user.id}>
            <div className='flex justify-start'>
                <Link to={`/user/${user.id}`}>
                <img src={user.avatar} className='rounded-full' style={{width: '60px', height: '60px'}}/>
                </Link>
                <div className='ml-4'>
                    <Link to={`/user/${user.id}`}>
                        <div className='text-black text-base font-medium'>{user.username}</div>
                    </Link>
                    <div className='pr-2'>
                        <Follow follow={true} userId={userId} followingId={user.id}/>
                    </div>
                </div>
            </div>
          </div>
        ))}
    </div>
    {list.length > 6 &&
    <div className='flex justify-center text-black hover:text-teal-400 cursor-pointer mt-10'>
        <span className='text-xl font-semibold' onClick={()=>setAmount((prev)=>(prev > list.length + 6 ? prev : prev + 6 ))}>More...</span>
    </div>}
    </div>
  )
}

export default PeopleList