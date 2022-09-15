import React from 'react'
import { Layout } from '../components'
import { MainLayout } from '../components'
import { PostDetail } from '../components'
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom'
import { getById, getByIdWithAuth, getComments, getRelated } from '../api/articleApi';
import FeaturedPostList from '../sections/FeaturedPostList';

const Detail = () => {
  const params = useParams();
  const [article, setArticle] = useState();
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(()=>{
    const getData = async () =>  {
      let res = await getById(params.articleId);
      let res1 = await getRelated(res.data.category.id)
      let res2 = await getComments(params.articleId)
      setArticle(res);
      setRelatedArticles(res1.data);
      setComments(res2.data)
    }
    getData();
  }, [params.articleId])

  return (
    <Layout>
      <MainLayout>
        <PostDetail article={article} comments={comments}/>
      </MainLayout>
      <FeaturedPostList list={relatedArticles} related={article?.category?.id} />
    </Layout>
  )
}

export default Detail