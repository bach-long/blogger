import React, {useState, useEffect} from 'react'
import { Layout, MainLayout } from '../components'
import { getArticleOfCategory } from '../api/articleApi';
import { Postcard } from '../components';
import { Paginate } from '../components';
import { useParams } from 'react-router-dom';
import {LayoutContext} from '../context/LayoutProvider';

const CategoryArticles = () => {
  const params = useParams()
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [category, setCategory] = useState('');
  useEffect(()=>{
    const getAll = async () =>  {
      let res = await getArticleOfCategory(params.categoryId);
      setList(res.data.articles.data);
      setTotal(res.data.articles.total);
      setCategory(res.data.category.name);
    }
    getAll();
  }, [params.categoryId])

  const handleChangePage = async (page) => {
    let res
    res = await getArticleOfCategory(params.categoryId, page)

    if (res) {
        setList(res.data.articles.data)
        setPage(page)
    }
  }

  return (
    <Layout>
        <MainLayout>
        <div className='flex justify-start mb-8'>
            <span className='cursor-pointer font-bold text-4xl text-white'>
                {`Articles related to ${category}`}
            </span>
        </div>
        {list.length > 0 ? list.map((element)=>(<Postcard article={element} key={element.id}/>)) : 
          <div className='pb-4 mt-40 inline-block flex justify-center border-b border-black'>
            <span className='font-semibold text-5xl'>
              No articles for this category
            </span>
          </div>}
        {total > 6 &&  <Paginate page={page} total={total} onChange={handleChangePage}/>}
        </MainLayout>
    </Layout>
  )
}

export default CategoryArticles