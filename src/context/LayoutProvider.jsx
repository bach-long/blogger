import React, { useEffect } from 'react'
import { useState, useMemo } from 'react';
import { getAllCategories } from '../api/categoryApi';
import { getRecentArticles, getMostViewed} from '../api/articleApi';
import { me } from '../api/userApi';
import { memo } from 'react';
import { io } from 'socket.io-client';
import { getAll } from '../api/notificationApi';

export const LayoutContext = React.createContext(); 

const LayoutProvider = ({ children }) => {
  const [recentArticles, setRecentArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [mainUser, setMainUser] = useState({});
  const [socket, setSocket] = useState();
  const [notifications, setNotifications] = useState([]);

  useEffect(()=>{
    const getData = async () =>  {
      let res = await getRecentArticles();
      let res1 = await getAllCategories();
      let res2 = await getMostViewed();
      let res3 = await me();
      if(res3.success) {
        let newSocket = io('http://localhost:5000'); 
        newSocket.emit("newUser", res3.data.username);
        let res4 = await getAll();
        setMainUser(res3.data);
        setSocket(newSocket);
        setNotifications(res4);
      } else {
        localStorage.clear();
      }
      setRecentArticles(res.data);
      setCategories(res1.data);
      setMostViewed(res2.data);
    } 
      getData();
  }, [localStorage.getItem('token')])
  useEffect(() => {
    if(socket) {
      socket.on("getNotification", (data) => {
        setNotifications((prev)=>([data, ...prev]))
      });
    } else {
      return;
    }
  }, [socket]);
  
  return (
    <LayoutContext.Provider
      value={{
        categories,
        mostViewed,
        recentArticles,
        mainUser,
        setMainUser,
        socket,
        notifications,
        setNotifications,
      }}
    >
      { children }
    </LayoutContext.Provider>
  )
}

export default memo(LayoutProvider)