import { Layout } from '../components'
import React from 'react'
import { FormCreate } from '../components'
import { useParams } from 'react-router-dom'

const Edit = () => {
  const params = useParams();

  return (
    <Layout>
        <FormCreate articleId={params.articleId} userId={params.userId}/>
    </Layout>
  )
}

export default Edit