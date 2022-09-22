import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FeaturedPostcard } from '../components';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 768, min: 640 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1,
  },
};

const FeaturedPostList = ({list, mostViewed, related}) => {
  const customLeftArrow = (
    <div className="absolute arrow-btn left-0 flex justify-center py-3 cursor-pointer bg-teal-400 hover:bg-teal-300 rounded-full" style={{width: '50px', height: '50px'}}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </div>
  );

  const customRightArrow = (
    <div className="absolute arrow-btn right-0 flex justify-center py-3 cursor-pointer bg-teal-400 hover:bg-teal-300 rounded-full" style={{width: '50px', height: '50px'}}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </div>
  );

  return (
    <div className={`mb-8 ${related ? 'mx-5 mt-40' : 'mt-10'}`}>
      <div className='mb-4 ml-5 inline-block'>
          <span className='font-bold text-2xl text-white'>
              {mostViewed ? 'Most Viewed Articles' : 'Related Articles'}
          </span>
      </div>
      <div className='mb-4 ml-5 inline-block ml-[78%]'>
        {(related && list.length > 5) && <Link to={`/category/${related}/articles`}><span className='hover:text-teal-400 font-normal text-2xl text-white'>
                See more...
        </span></Link>}
      </div>
      <Carousel infinite customLeftArrow={customLeftArrow} customRightArrow={customRightArrow} responsive={responsive} 
       itemClass="px-3 text-[14px]" sliderClass='react-multi-carousel-track' autoPlay={true}>
          {list.map((article)=>(
            <FeaturedPostcard article={article} key={article.id}/>
          ))}
      </Carousel>
    </div>
  );
};

export default memo(FeaturedPostList);