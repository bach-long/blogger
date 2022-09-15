import React from 'react'
import Header from './Header'
import { memo } from 'react'
import Search from './Search'

const Layout = ({children, profile}) => {
  return (
    <div className='pb-10'>
    <Header/>
    {!profile &&
      <Search/>
    }
    {children}
    </div>
  )
}

export default Layout;