import React, { useState } from 'react'
import { Layout } from '../components'
import { MainLayout } from '../components'
import { Postcard } from '../components' 
import { useEffect } from 'react'
import { getAllArticles } from '../api/articleApi'
import { Paginate } from '../components'
import { Link } from 'react-router-dom'

const Home = () => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState();
  const [total, setTotal] = useState();

  useEffect(()=>{
    const getAll = async () =>  {
      let res = await getAllArticles();
      setList(res.data.data);
      setTotal(res.data.total);
    }
    getAll();
  }, [])
  const handleChangePage = async (page) => {
    let res;
    res = await getAllArticles(page)

    if (res) {
        setList(res.data.data)
        setPage(page)
    }
  }

  return (
    <Layout>
      <MainLayout>
          {list.map((element)=>(<Postcard article={element} key={element.id}/>))}
          {total > 6 &&  <Paginate page={page} total={total} onChange={handleChangePage}/>}
      </MainLayout>
    </Layout>
  )
}

export default Home