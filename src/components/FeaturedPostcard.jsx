import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'

const FeaturedPostcard = ({article}) => {
  return (
  <Link to={`/detail/${article.id}`}>
  <div className="relative h-72">
    <div className="absolute rounded-lg bg-center bg-no-repeat bg-cover shadow-md inline-block w-full h-72" style={{ backgroundImage: `url(${article.thumbnail})` }} />
    <div className="absolute rounded-lg bg-center bg-gradient-to-b opacity-50 from-gray-400 via-gray-700 to-black w-full h-72" />
    <div className="flex flex-col rounded-lg p-4 items-center justify-center absolute w-full h-full">
      <p className="text-white mb-4 text-shadow font-semibold text-xs">{moment(article.updated_at).format('MMM Do YYYY')}</p>
      <p className="text-white mb-4 text-shadow font-bold text-2xl text-center">{article.title}</p>
      <div className="flex items-center absolute bottom-5 w-full justify-center">
        <img
          style={{
            height: "35px",
            width: "35px"
          }}
          className="align-middle drop-shadow-lg rounded-full"
          src={article.author.avatar}
        />
          <p className="inline align-middle text-white text-shadow ml-2 mt-3 font-semibold">{article.author.username}</p>
      </div>
    </div>
    <span className="cursor-pointer absolute w-full h-full" />
  </div>
  </Link>
  )
}

export default FeaturedPostcard