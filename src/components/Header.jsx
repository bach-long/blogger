import React, {useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutContext } from '../context/LayoutProvider'
import { Button, Dropdown, Menu, Space, Image } from 'antd';
import { logout } from '../api/userApi';
import { LogoutOutlined, UserOutlined, FormOutlined, LoginOutlined } from '@ant-design/icons';

const Header = () => {
  const {categories, mainUser} = React.useContext(LayoutContext);
  const navigate = useNavigate();
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div className='flex items-center' onClick={()=>{navigate(`/create`)}}>
              <span className='mr-2'>Create article</span>
              <FormOutlined/>
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div className='flex items-center' onClick={()=>{navigate(`/user/${mainUser.id}`)}}>
              <span className='mr-2'>Profile</span>
              <UserOutlined/>
            </div>
          ),
        },
        {
          key: '3',
          label: (
            <div className='flex items-center' onClick={async ()=> {await logout(); navigate('/')}}>
              <span className='mr-2 '>Logout</span>
              <LogoutOutlined/>
            </div>
          ),
        },
      ]}
    />
  );
  return (
    <div className='container mx-auto px-10 mb-8'>
      <div className='border-b w-full inline-block border-white-400 py-8 sticky'>
        <div className='md:float-left block'>
          <Link to='/'>
            <span className='cursor-pointer font-bold text-4xl text-white'>
              Blogger
            </span>
          </Link>
        </div>
        <div className='hidden md:float-left md:contents relative'>
          {localStorage.getItem('token') ? 
          <div className="md:float-right mb-3 align-middle text-white ml-3 cursor-pointer rounded-full border-white border-4">
            <Dropdown overlay={menu} placement="bottomRight" arrow>
            <img
              style={{
                height: "60px",
                width: "60px"
              }}
              src={mainUser.avatar}
              className='rounded-full'
            />
            </Dropdown>
            </div> :
              <div onClick={()=>(navigate('/authenticate'))}>
                <span className='flex items-center md:float-right mt-3 mb-3 ml-6 align-middle text-white font-semibold cursor-pointer hover:bg-teal-300 hover:text-black py-1 px-1 rounded'>
                  <LoginOutlined/>
                  Login
                </span>
              </div>
          }
          {categories.map(i=>(
          <Link to={`/category/${i.id}/articles`} key={i.id}>
            <span className='md:float-right mt-3 mb-3 align-middle text-white ml-3 font-semibold cursor-pointer hover:bg-teal-300 hover:text-black py-1 px-1 rounded'>
              {i.name}
            </span>
          </Link>))}
        </div>
      </div>
    </div>
  )
}

export default Header