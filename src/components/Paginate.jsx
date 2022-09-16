import React from 'react'
import { Pagination } from 'antd'

const Paginate= ({page, total, onChange}) => {
  return (
    <div className='flex justify-center mt-10 mb-20'>
      <Pagination
        page={page}
        total={total}
        onChange={onChange}
        pageSize={6}
        showSizeChanger={false}
        showQuickJumper={true}
      />
    </div>
  )
}

export default Paginate