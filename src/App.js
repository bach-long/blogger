import logo from './logo.svg';
import './App.css';
import Detail from './pages/Detail';
import Create from './pages/Create';
import Home from './pages/Home';
import {Routes, Route} from 'react-router-dom';
import CategoryArticles from './pages/CategoryArticles';
import User from './pages/User';
import AuthPage from './pages/AuthPage';
import Edit from './pages/Edit';

function App() {
  return (
    <Routes>
        <Route path='/authenticate' element={<AuthPage/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/detail/:articleId' element={<Detail/>}/>
        <Route path='/create' element={localStorage.getItem('token') ? <Create/> : <AuthPage/>}/>
        <Route path='/edit/:articleId/:userId' element={localStorage.getItem('token') ? <Edit/> : <AuthPage/>}/>
        <Route path='/category/:categoryId/articles' element={<CategoryArticles/>}/>
        <Route path='/user/:id' element={localStorage.getItem('token') ? <User/> : <AuthPage/>}/>
    </Routes>
  );
}

export default App;
