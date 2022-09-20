import React, { useEffect } from 'react'
import Header from './Header'
import { memo } from 'react'
import Search from './Search'
import { LayoutContext } from '../context/LayoutProvider'

const Layout = ({children, profile}) => {
  const {socket, mainUser} = React.useContext(LayoutContext);
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