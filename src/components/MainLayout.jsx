import React from 'react'
import Postwidget from './Postwidget'
import Categories from './Categories'
import FeaturedPostList from '../sections/FeaturedPostList'
import { LayoutContext } from '../context/LayoutProvider'
import { memo } from 'react'

const MainLayout = ({children}) => {
  const {recentArticles, mostViewed} = React.useContext(LayoutContext)  
  return (
    <div className='container mx-auto bx-10 mb-8 '>
      <FeaturedPostList list={mostViewed} mostViewed={true}/>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 px-10'>
        <div className='lg:col-span-8 col-span-1'>
          {children}
        </div>
        <div className='lg:col-span-4 col-span-1'>
          <div className='lg:sticky relative top-8'>
            <Postwidget articles={recentArticles}/>
            <Categories/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(MainLayout);