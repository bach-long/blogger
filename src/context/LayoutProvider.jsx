import React, { useEffect } from 'react'
import { useState, useMemo } from 'react';
import { getAllCategories } from '../api/categoryApi';
import { getRecentArticles, getMostViewed} from '../api/articleApi';
import { me } from '../api/userApi';
import { memo } from 'react';

export const LayoutContext = React.createContext(); 

const LayoutProvider = ({ children }) => {
  const [recentArticles, setRecentArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [mainUser, setMainUser] = useState({});

  useEffect(()=>{
    const getData = async () =>  {
      let res = await getRecentArticles();
      let res1 = await getAllCategories();
      let res2 = await getMostViewed();
      let token = localStorage.getItem('token'); 
      if(token) {
        let res3 = await me();
        setMainUser(res3)
      }
      setRecentArticles(res.data);
      setCategories(res1.data);
      setMostViewed(res2.data);
    }
    getData();
  }, [localStorage.getItem('token')])
  return (
    <LayoutContext.Provider
      value={{
        categories,
        mostViewed,
        recentArticles,
        mainUser,
        setMainUser
      }}
    >
      { children }
    </LayoutContext.Provider>
  )
}

export default memo(LayoutProvider)