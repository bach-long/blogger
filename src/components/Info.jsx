import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  DatePicker,
  Upload,
  message,
  Modal,
  Button,
} from 'antd';
import moment from 'moment';
import { editProfile } from '../api/userApi';
import { LayoutContext } from '../context/LayoutProvider';

const Info = ({info}) => {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [deletedFiles, setDeletedFiles] = useState([]);  
  const [avatar, setAvatar] = useState([{
    uid: info.id,
    name: info.avatar.substring(info.avatar.lastIndexOf('/') + 1, info.avatar.length),
    url: info.avatar,
    state: 'done',
    inDb: true
  }]);

  const {mainUser} = React.useContext(LayoutContext);

  useEffect(()=>{
    const data = {};

    Object.keys(info).forEach((element)=>{
      if(!['avatar', 'followers', 'following', 'date_birth', 'updated_at', 'created_at'].includes(element)) {
        data[element] = info[element];
      }
    })

    data['avatar'] = avatar;
    data['dateBirth'] = moment(info.date_birth);

    form.setFieldsValue(data);
  })

  const [form] = Form.useForm();

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
  
  const handleRemove = (file) => {
    if(file.inDb) 
    setDeletedFiles((prev)=>([...prev, file]))
  }

  const handleEdit = async () => {
    let check = true;
    //console.log(form.getFieldValue('dateBirth')._d.toISOString());
    let date
    if(!form.getFieldValue('dateBirth')) {
      check = false;
    } else {
      let tempt = form.getFieldValue('dateBirth')._d;
      date = tempt.getFullYear() + '-' + (tempt.getMonth() + 1) + '-' + tempt.getDate();
    }
    let tempt = form.getFieldsValue();
    let data = new FormData();
    Object.keys(tempt).forEach((element)=>{
      if(element !== 'avatar' && element !== 'dateBirth'){
        if(form.getFieldValue(element) == '' || !form.getFieldValue(element)) {
          check = false;
        }
        data.append(element, form.getFieldValue(element));
      }
    })
    data.append('dateBirth', date);
    if(avatar.length > 0 && !avatar[0].inDb) {
      data.append('images[]', avatar[0].originFileObj);
    }
    if(deletedFiles.length > 0) {
      data.append('deleted[]', JSON.stringify(deletedFiles[0]));
    }
    if(check) {
      let res = await editProfile(data);
      console.log(res);
      window.location.reload();
    } else {
      console.log('fill all neccessary fields');
    }
  }

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
    <div className='w-full ml-10'>
        <Form
            disabled={mainUser.id === info.id ? false : true}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            form={form}
        > 
            <Form.Item label="Avatar" name='avatar'>
                <Upload className=''
                    listType="picture-card"
                    fileList={avatar}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={beforeUpload}
                    onRemove={handleRemove}
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
            <Form.Item label="Username" name='username' rules={[
                  {required: true, message: 'Please input your username'}
                ]}>
                  <Input />
            </Form.Item>
            <Form.Item label="Email" name='email' rules={[
                  {required: true, message: 'Please input your email'},
                  {pattern: new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
                  message: 'Email format is incorrect'}
                ]}>
                  <Input />
            </Form.Item>
            <Form.Item label="Date of Birth" name='dateBirth' rules={[
                  {required: true, message: 'Please pick your birthday'}
                ]}>
                  <DatePicker />
            </Form.Item>
            <Form.Item label="Company" name='company' rules={[
                  {required: true, message: 'Please input your company name'}
                ]}>
                  <Input />
            </Form.Item>
            <Form.Item className='mt-4'>
            {mainUser.id === info.id &&
            <button className="ml-72 px-4 py-2 font-semibold text-sm bg-teal-400 text-white rounded shadow-sm font-semibold" onClick={handleEdit}>Save</button>}
            </Form.Item>
        </Form>
    </div>
  )
}

export default Info