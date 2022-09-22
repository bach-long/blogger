import React, {useState, useRef, useEffect} from 'react'
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Modal, Spin} from 'antd';
import { AiOutlineFileImage } from "react-icons/ai";
import {upload} from '../api/imageApi';
import { Select } from 'antd';
import { LayoutContext } from '../context/LayoutProvider';
import { useNavigate } from 'react-router-dom';
import { create, editArticle, getById } from '../api/articleApi';

const { Option } = Select;

const FormCreate = ({articleId, userId}) => {
  const [value, setValue] = useState('');
  const [thumbnail, setThumbnail] = useState([]);
  const inputFile = useRef(null);
  const [categoryId, setCategoryId] = useState();
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [title, setTitle] = useState('');
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [check, setCheck] = useState(true);

  const navigate = useNavigate();
  const {categories, mainUser} = React.useContext(LayoutContext);

  useEffect(()=>{
      if(articleId && userId) {
        const getData = async () => {
          let {data} = await getById(articleId);
          if(data.author.id == userId){
            setValue(data.content);
            setTitle(data.title);
            setCategoryId(data.category_id);
            setThumbnail([
              {
                uid: data.id,
                name: data.thumbnail.substring(data.thumbnail.lastIndexOf('/') + 1, data.thumbnail.length),
                url: data.thumbnail,
                state: 'done',
                inDb: true
              }
            ]);
          } else {
            setCheck(false)
          }
        }
        getData();
      } else {
        return;
      }
  }, [articleId, userId]);

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

  const handleChange = ({ fileList: newFileList }) => {newFileList = newFileList.slice(-1); setThumbnail(newFileList)};

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
        styles={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleRemove = (file) => {
    if(file.inDb) 
    setDeletedFiles((prev)=>([...prev, file]))
  }

  const handleFile = async (e)=>{
    let fileList = [...e.target.files];
    //console.log(files);
    let data = new FormData();

    fileList.forEach((file) => {
        data.append('images[]', file)
    });

    let res = await upload(data);
    let images = ''
    res.data.forEach((i) => {
      images += `![image](${i.img_link})\n`
    })
    setValue(value + '\n' + images);
  }

  const handleCreate = async () => {
    if (thumbnail.length <=0 || categoryId == 0 || title == '' || value == '') {
      console.log('viet het vao dmm');
    } else {
      let data = new FormData();
      data.append('images[]', thumbnail[0].originFileObj);
      data.append('user_id', mainUser.id);
      data.append('title', title);
      data.append('content', value);
      data.append('category_id', categoryId);
      let res = await create(data);
      //if(!res.data.success) {
      //  console.log(res.data.message);
      //} else {
      //}
      navigate(`/detail/${res.data.id}`)
    }
  }

  const handleEdit = async () => {
    //console.log(form.getFieldValue('dateBirth')._d.toISOString());
    if(value && title && categoryId && thumbnail.length > 0) {
      let data = new FormData();
      data.append('content', value);
      data.append('title', title);
      data.append('categoryId', categoryId);
      data.append('images[]', thumbnail[0].originFileObj);
      data.append('articleId', articleId);
      if(deletedFiles.length > 0) {
        data.append('deleted[]', JSON.stringify(deletedFiles[0]));
      }
      let res = await editArticle(data);
      navigate(`/detail/${articleId}}`);
    } else {
      console.log('fill all neccessary fields');
    }
  }

  if(check) {
    return (
      <div className='container mx-auto bx-10 mb-8'>
        <div className='mb-10 cursor-pointer hover:bg-teal-400 inline-block rounded p-1'>
          <ArrowLeftOutlined style={{fontSize: '2rem', color: 'white'}} onClick={() => navigate(-1)}/>
        </div>
      <div className='bg-white shadow-lg flex justify-center rounded-lg p-0 lg:p-8 pb-12 mb-8'>
          <div className='w-full'>
            <div className='mb-2 inline-block'>
              <span className='font-bold text-xl'>
                  Thumbnail :
              </span>
            </div>
            <div className="mb-4 w-auto">
              <Upload className=''
                listType="picture-card"
                fileList={thumbnail}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                accept="image/png, image/jpg, image/jpeg"
                onRemove={handleRemove}
               >
                {thumbnail.length >= 1 ? null : uploadButton}
              </Upload>
              <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                  alt="example"
                  styles={{
                    width: '100%',
                  }}
                  src={previewImage}
                />
              </Modal>
            </div>
            <div className='mb-2 inline-block'>
              <span className='font-bold text-xl'>
                  Category :
              </span>
            </div>
            <div className='mb-4 xl:w-auto'>
              <Select
                placeholder='select category'
                styles={{
                  width: 120,
                }}
                onChange={
                  (value) => {
                    setCategoryId(value);
                  }
                }
                value={categoryId}
              >
                {categories.map((category) => (
                  <Option value={category.id} key={category.id}>{category.name}</Option>
                ))}
              </Select>
            </div>
            <div className="mb-4 xl:w-auto">
              <div className='mb-2 inline-block'>
                <span className='font-bold text-xl'>
                    Title :
                </span>
              </div>
              <input
                type="text"
                className="
                  form-control
                  block
                  w-full
                  px-3
                  py-1.5
                  text-base
                  font-normal
                  text-gray-700
                  bg-white bg-clip-padding
                  border border-solid border-gray-300
                  rounded
                  transition
                  ease-in-out
                  m-0
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
                id="exampleFormControlInput1"
                placeholder="Example label"
                value={title}
                onChange={(e)=>{setTitle(e.target.value)}}
              />
            </div>
            <div className='mb-2 inline-block'>
              <span className='font-bold text-xl'>
                  Content :
              </span>
            </div>
            <div className="mb-3 xl:w-auto">
            <MDEditor
              height={500}
              value={value}
              onChange={setValue}
              components={{
                toolbar: (command, disabled, executeCommand) => {
                  if (command.keyCommand === 'image') {
                    return (
                      <button
                        aria-label="Insert Image"
                        onClick={(e)=> {
                          inputFile.current.click();
                        }}
                      >
                        <AiOutlineFileImage/>
                      </button>
                    )
                  }
                }
              }}
            />
            </div>
            <div className='grid justify-items-end mt-4'>
              <input type='file' ref={inputFile} style={{display: 'none'}} accept='image/png,image/jpeg' multiple onChange={handleFile}/>
              <button className="p-1 shadow-sm rounded bg-teal-400 hover:bg-teal-300 text-white" onClick={articleId && userId ? handleEdit : handleCreate }>Submit</button>
            </div>
          </div>
      </div>
      </div>
    )
  } else {
    return <div className='flex justify-center text-2xl text-black p-2 border-b border-black font-bold mt-36'>This article is not yours, get out</div>
  }
}

export default FormCreate

