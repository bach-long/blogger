import React from 'react'
import { LayoutContext } from '../context/LayoutProvider'
import { Link } from 'react-router-dom';

const Categories = () => {
  const {categories} = React.useContext(LayoutContext);
  return (
    <div className='bg-white shadow-lg rounded-lg p-0 lg:p-5 mb-8'>
        <h3 className='text-xl mb-8 font-semibold border-b pb-4 text-center'>Categories</h3>
        {categories.map((category)=>(
          <div className='drop-shadow-lg pb-3 mb-3' key={category.id}>
          <Link to={`/category/${category.id}/articles`}> 
            <span className='cursor-pointer block hover:text-teal-400 text-black'>
              {category.name}
            </span>
          </Link> 
          </div>
        ))}
    </div>

  )
}

export default Categories