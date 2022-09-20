import React, {useRef, useState} from 'react'
import { search } from '../api/searchApi';
import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Avatar, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Search = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState();
  const typingTimeout = useRef(null);

  const handleSearch = (e) => {
    let value = e.target.value
    setInput(value);
    if(typingTimeout.current) {
        clearTimeout(typingTimeout.current);
    }
    if(value === ''){
        setResults();
    } else {
        typingTimeout.current = setTimeout(async ()=>{
            let tempt = await search(value);
            setResults(tempt.data)
        }, 300)
    }
  }
  
  return (
    <div className='container mx-auto'>
        <div className='flex justify-center'>
            <div className='inline-block relative'>
              <input value={input} onChange={handleSearch} className="border-2 border-gray-300 bg-white h-10 w-96 px-5 pr-6 rounded-lg text-sm font-medium focus:outline-none"
                type="search" name="search" placeholder="Search"></input>
                {input !== '' ?
                <CloseCircleFilled className='absolute right-2 top-3 text-black hover:text-gray-400 cursor-pointer' style={{fontSize: '1rem'}}
                onClick={
                  ()=>{setInput(''); 
                  clearTimeout(typingTimeout.current); 
                  setResults()}}/> :
                <SearchOutlined className='absolute right-2 top-3 text-black'/>
                } 
            </div> 
        </div>
        {results &&
        <div className='flex justify-center'>
            <div
              id="scrollableDiv"
              style={{
                height: 200,
                overflow: 'auto',
                width: 415,
                
              }}
              className="bg-white shadow-lg mb-8 p-8 mt-2 rounded absolute z-10"
            >
                <InfiniteScroll
                  dataLength={results.articles.length}
                  loader={
                    <Skeleton
                      avatar
                      paragraph={{
                        rows: 1,
                      }}
                      active
                    />
                  }
                  endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                  scrollableTarget="scrollableDiv"
                >
                    <List
                      dataSource={results.articles}
                      renderItem={(item) => (
                        <List.Item key={item.id}>
                          <List.Item.Meta
                            avatar={<img src={item.thumbnail} style={{width: '50px', height: '50px'}}/>}
                            title={<Link to={`/detail/${item.id}`}><div className={'text-black hover:text-teal-400'}>{item.title}</div></Link>}
                          />
                          <div className='ml-6'>{moment(item.updated_at).format('MMM Do YYYY')}</div>
                        </List.Item>
                      )}
                    />
                </InfiniteScroll>
            </div> 
        </div> 
        }
    </div>
  )
}

export default Search