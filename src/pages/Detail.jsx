import React from 'react'
import { Layout } from '../components'
import { MainLayout } from '../components'
import { PostDetail } from '../components'
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { getById, getComments, getRelated } from '../api/articleApi';
import FeaturedPostList from '../sections/FeaturedPostList';
import { Spin } from 'antd';
import error from '../assets/404error.gif';

const Detail = () => {
  const params = useParams();
  const [article, setArticle] = useState();
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(()=>{
    const getData = async () =>  {
      let res = await getById(params.articleId);
      if(res.success) {
        let res1 = await getRelated(res.data.category.id)
        let res2 = await getComments(params.articleId)
        setRelatedArticles(res1.data);
        setComments(res2.data);
      }
      setArticle(res);
    }
    getData();
  }, [params.articleId])

  return (
    <Layout>
      <MainLayout>
        {article && !article.success &&
        <div className="bg-white shadow-lg rounded-lg lg:p-8 pb-12 mb-8">
          <div className='flex justify-center rounded'>
            <img src={error} className='p-4'/>
          </div>
          <div className='flex justify-center'>
              <Link to="/">
                <span className='text-2xl mt-4 text-black hover:text-teal-400 font-medium'>Go back Home</span>
              </Link>
            </div>
        </div> 
        }
        {
        article && article.success &&
        <PostDetail article={article} comments={comments}/>
        /*<div className='flex justify-center'><Spin size='large' tip="Almost done ..."/></div>*/
        }
      </MainLayout>
      <FeaturedPostList list={relatedArticles} related={article?.data?.category?.id} />
    </Layout>
  )
}

export default Detail