import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  message,
  Modal,
} from 'antd';
import { signup, signin } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { LayoutContext } from '../context/LayoutProvider';

const Auth = () => {
  const [login, setLogin] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');  
  const [avatar, setAvatar] = useState([]);
  const {mainUser, setMainUser} = React.useContext(LayoutContext);

  const navigate = useNavigate();

  const [form] = Form.useForm()

  const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
  
    reader.onload = () => resolve(reader.result);
  
    reader.onerror = (error) => reject(error);
  });
  
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  
  const handleCancel = () => setPreviewVisible(false);
  
  const handleChange = ({ fileList: newFileList }) => {newFileList = newFileList.slice(-1); setAvatar(newFileList)};
  
  const beforeUpload = (file) => {
    const isJpgOrPng = (file.type === 'image/jpeg' || file.type === 'image/png');
  
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      file.status='error'
    }
  
    return false;
  };  

  const handleLogin = async () => {
    let tempt = form.getFieldsValue();
    let check = true;
    console.log(tempt);
    let data = new FormData();
    Object.keys(tempt).forEach((element)=>{
      if(form.getFieldValue(element) == '' || !form.getFieldValue(element)) {
        check=false;
      } else {
      data.append(element, form.getFieldValue(element));
      }
    })
    if(check) {
      let res = await signin(data);
      if(!res.success) {
        console.log(res.message);
      } else {
        console.log(res);
        setMainUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        navigate(-1);
      }
    } else {
      console.log('fill all neccessary fields')
    }
  }

  const handleSignup = async () => {
    if(form.getFieldValue('confirm') !== form.getFieldValue('password')) {
      console.log('nhap lai mk di dmm');
    } else {
      let check = true;
      //console.log(form.getFieldsValue())
      let date 
      if(form.getFieldValue('dateBirth')) {
        let tempt = form.getFieldValue('dateBirth')._d;
        date = tempt.getFullYear() + '-' + (tempt.getMonth() + 1) + '-' + tempt.getDate();
      } else {
        check = false
      }
      console.log(check)
      let tempt = form.getFieldsValue();
      let data = new FormData();
      Object.keys(tempt).forEach((element)=>{
        if(element !== 'avatar' && element !== 'dateBirth'){
          if(form.getFieldValue(element) == '' || !form.getFieldValue(element)) {
            check = false;
          } else {
          data.append(element, form.getFieldValue(element));
          }
        }
      })
      data.append('dateBirth', date);
      if(avatar.length > 0) {
        data.append('images[]', avatar[0].originFileObj);
      }
      if(check) {
        let res = await signup(data);
        if(!res.success) {
          console.log(res.message);
        } else {
          console.log(res);
          setMainUser(res.data.user);
          localStorage.setItem('token', res.data.token);
          navigate(-1);
        }
      } else {
        console.log('fill all neccessary fields')
      }
    }
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <div className='bg-white shadow-lg flex justify-center rounded-lg p-0 lg:p-8 mt-60 ml-96' 
    style={{width: '50%', height: '50%'}}>
      <div className='w-full'>
        <div className='flex justify-center mb-6 text-teal-400 border-b border-teal-500'>
          <span className="px-4 py-2 font-semibold text-2xl">Welcome to Blogger</span>
        </div>
          <Form
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 14,
              }}
              layout="horizontal"
              form={form}
          > 
              {!login && 
              <div>
                <Form.Item label="Avatar" name='avatar'>
                  <Upload className=''
                      listType="picture-card"
                      fileList={avatar}
                      onPreview={handlePreview}
                      onChange={handleChange}
                      beforeUpload={beforeUpload}
                      //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept="image/png, image/jpg, image/jpeg"
                  >
                  {avatar.length >= 1 ? null : uploadButton}
                  </Upload>
                </Form.Item>
                <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img
                    alt="example"
                    style={{
                      width: '100%',
                    }}
                    src={previewImage}
                  />
                </Modal>
                </div>
                }
              {login &&
                <Form.Item label="Username/Email" name='username/email' rules={[
                  {required: true, message: 'Please input your email or username'}
                ]}>
                  <Input />
                </Form.Item>}
              {!login &&
                <Form.Item label="Username" name='username' rules={[
                  {required: true, message: 'Please input your username'}
                ]}>
                  <Input />
                </Form.Item>
              }
              {!login &&
                <Form.Item label="Email" name='email' rules={[
                  {required: true, message: 'Please input your email'},
                  {pattern: new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
                  message: 'Email format is incorrect'}
                ]}>
                  <Input />
                </Form.Item>
              }
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              {!login && 
                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={['password']}
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
      
                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              }
              {!login && 
                <Form.Item label="Date of Birth" name='dateBirth' rules={[
                  {required: true, message: 'Please pick your birthday'}
                ]}>
                  <DatePicker />
                </Form.Item>
              }
              {!login &&
                <Form.Item label="Company" name='company' rules={[
                  {required: true, message: 'Please input your company name'}
                ]}>
                  <Input />
                </Form.Item>
              }
              <div className='flex justify-center mt-4'>
                <button className="px-4 py-2 font-semibold text-sm bg-teal-400 text-white rounded shadow-sm font-semibold" onClick={login ? handleLogin : handleSignup} >{login ? 'Sign in' : 'Sign up'}</button>
              </div>
          </Form>
          <div className='flex justify-center text-teal-400 cursor-pointer hover:text-teal-300 mt-6'>
            {login ? <span className="px-4 py-2 font-normal text-sm" onClick={()=>{setLogin(false)}}>Don't have an account? Create a new one</span> :
             <span className="px-4 py-2 font-normal text-sm" onClick={()=>{setLogin(true)}}>Already have an account</span>}
          </div>
          <div className='flex justify-center mb-6 text-teal-400 cursor-pointer hover:text-teal-300' onClick={()=>{navigate(-1)}}>
            <span>Cancel</span>
          </div>
      </div>
    </div>
  )
}

export default Auth