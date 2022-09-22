import React from 'react'
import { useState, useEffect } from 'react'
import { Menu } from 'antd';
import { ProfileOutlined, PictureOutlined, BookOutlined, FileTextOutlined, BarChartOutlined, DeleteOutlined, PlusSquareFilled } from '@ant-design/icons';
import { getArticlesOfUser, getBookmark, getInfo, getSoftDeletedArticles, getStatistic } from '../api/userApi';
import { Spin } from 'antd';
import Info from './Info';
import Paginate from './Paginate';
import Postcard from './Postcard';
import Chart from './Chart';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PeopleList from './PeopleList';
import Images from './Images';
import { LayoutContext } from '../context/LayoutProvider';
import Follow from './Buttons/Follow';
import { Link } from 'react-router-dom';

const UserDetail = () => {
  const location = useLocation();

  const [articles, setArticles] = useState();
  const [bookmark, setBookmark] = useState();
  const [trash, setTrash] = useState();
  const [info, setInfo] = useState();
  const [articlePage, setArticlePage] = useState(1);
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const [trashPage, setTrashPage] = useState(1)
  const [statistic, setStatistic] = useState();
  const [item, setItem] = useState(location.state?.item ? location.state.item : 'info');
  const {mainUser} = React.useContext(LayoutContext);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(()=>{
    const getData = async () => {
      let res = await getArticlesOfUser(params.id);
      let res1 = await getBookmark(params.id);
      let res2 = await getInfo(params.id);
      let res3 = await getStatistic(params.id);
      let res4 = await getSoftDeletedArticles(params.id);
      setInfo(res2.data);
      setArticles(res.data);
      setBookmark(res1.data);
      setStatistic(res3.data);
      setTrash(res4.data);
    }
    getData();
  }, [params.id]);
  const handleChangeArticlePage = async (page) => {
    let res;
    res = await getArticlesOfUser(params.id, page)

    if (res) {
        setArticles(res.data)
        setArticlePage(page)
    }
  }

  const handleChangeBookmarkPage = async (page) => {
    let res;
    res = await getBookmark(params.id, page)

    if (res) {
        setBookmark(res.data)
        setBookmarkPage(page)
    }
  }

  const handleChangeTrashPage = async (page) => {
    let res;
    res = await getArticlesOfUser(params.id, page)

    if (res) {
        setTrash(res.data)
        setTrashPage(page)
    }
  }

  return (
    <div className='container mx-auto bx-10 mb-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 px-10'>
        <div className='lg:col-span-8 col-span-1'>
          <div className="bg-white shadow-lg rounded-lg lg:p-8 pb-12 mb-8">
            <div className="flex items-center mb-4 ml-3 lg:mb-0 w-full lg:w-auto items-center">
                <img
                  style={{
                    height: "60px",
                    width: "60px"
                  }}
                  className="align-middle rounded-full"
                  src={info?.avatar}
                />
                <p className="inline align-middle text-gray-700 ml-2 mt-4 font-medium text-2xl">{info?.username}</p>
                {mainUser && info && mainUser.id !== info.id &&
                <Follow follow={info.isFollowing} userId={mainUser.id} followingId={info.id}/>
                }
            </div>
            <div className={`mt-4`}>
            <Menu mode="horizontal" defaultSelectedKeys={[item]}
              onClick={({items, key, keyPath, domEvent})=>{
                setItem(key);
              }}
            >
              <Menu.Item key="info" icon={<ProfileOutlined />}>
                <span className='mt-3'>Infomration</span>
              </Menu.Item>
              <Menu.Item key="articles" icon={<FileTextOutlined />}>
                <span>Articles</span>
              </Menu.Item>
              <Menu.Item key="bookmark" icon={<BookOutlined />}>
                <span>Bookmark</span>
              </Menu.Item>
              {mainUser.id == info?.id &&
              <Menu.Item key="deleted" icon={<DeleteOutlined />}>
                <span>Deleted</span>
              </Menu.Item>
              }
              {mainUser.id == info?.id &&
              <Menu.Item key="images" icon={<PictureOutlined />}>
                <span>Images</span> 
              </Menu.Item>
              }
              <Menu.Item key="statistic" icon={<BarChartOutlined/>}>
                <span>Statistic</span>
              </Menu.Item>
              <Menu.Item key="following">
                <span>Following</span>
              </Menu.Item>
              <Menu.Item key="followed">
                <span>Followed</span>
              </Menu.Item>
            </Menu>
            </div> 
            <div className='mt-6'>
              {
                (()=>{
                  if(info && articles && bookmark && statistic) {
                    if(item == 'info') {
                      return (
                        <Info info={info}/>
                      )
                    } else if (item=='articles') {
                      return (
                        <div>
                          <div className='flex justify-end'>
                            <Link to='/create'>
                            <div className='cursor-pointer hover:text-gray-500 text-gray-400 text-2xl mb-4'>
                              <PlusSquareFilled/>
                            </div>
                            </Link>
                          </div>
                          {articles.data.map((article)=>(
                            <Postcard article={article} key={article.id} list={articles} setList={setArticles} 
                            deleteList={trash} setDeleteList={setTrash}/>
                          ))}
                          {articles.total > 6 && <Paginate page={articlePage} total={articles.total} onChange={handleChangeArticlePage}/>}
                        </div>
                      )
                    } else if (item =='bookmark') {
                      return (
                        <div>
                          {bookmark.data.map((article)=>(
                            <Postcard article={article} key={article.id} list={bookmark} setList={setBookmark}
                            deleteList={trash} setDeleteList={setTrash}/>
                          ))}
                          {bookmark.total > 6 && <Paginate page={bookmarkPage} total={bookmark.total} onChange={handleChangeBookmarkPage}/>}
                        </div>
                      )
                    } else if (item == 'statistic') {
                      return (
                      <div>
                        <Chart data={statistic.create} create={true}/>
                        <Chart data={statistic.read} read={true}/>
                      </div>
                      )
                    } else if (item == 'following'){
                      return(
                        <PeopleList list={info.following} userId={info.id}/>
                      )
                    } else if (item == 'followed'){
                      return(
                        <PeopleList list={info.followers} userId={info.id}/>
                      )
                    } else if (item == 'images'){
                      return <Images list={info.images}/>
                    } else {
                      return (
                        <div>
                          {trash.data.map((article)=>(
                            <Postcard article={article} key={article.id} deleted={true} list={trash} setList={setTrash}/>
                          ))}
                          {trash.total > 6 && <Paginate page={trashPage} total={trash.total} onChange={handleChangeTrashPage}/>}
                        </div>
                      )
                    }
                  } else {
                    return (
                      <div className='flex justify-center'>
                        <Spin size='large' className='flex justify-center' tip="Almost done ..."/>
                      </div>
                    )
                  }
                })()
              }
            </div> 
          </div>
        </div>
        <div className='lg:col-span-4 col-span-1'>
          <div className='lg:sticky top-8'>
            <div className="bg-white shadow-lg rounded-lg lg:p-8 pb-12 mb-8">
              <h3 className='text-xl mb-8 font-semibold border-b pb-4 text-center'>Overall</h3>
              <div className='drop-shadow-lg pb-3 mb-3 text-xl font-semibold'>
                <span>{`Articles: ${articles?.total}`}</span>
              </div>
              <div className='drop-shadow-lg pb-3 mb-3 text-xl font-semibold'>
                <span>{`Viewed: ${info?.view?.length}`}</span>
              </div>
              <div className='drop-shadow-lg pb-3 mb-3 text-xl font-semibold'>
                <span>{`Following: ${info?.following?.length}`}</span>
              </div>
              <div className='drop-shadow-lg pb-3 mb-3 text-xl font-semibold'>
                <span>{`Followers: ${info?.followers?.length}`}</span>
              </div>
              <div className='drop-shadow-lg pb-3 mb-3 text-xl font-semibold'>
                <span>{`Bookmarks: ${bookmark?.total}`}</span>
              </div>
              <div className='drop-shadow-lg pb-3 mb-3 text-xl font-semibold'>
                <span>{`Imagess: ${info?.images?.length}`}</span>
              </div>
            </div> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail