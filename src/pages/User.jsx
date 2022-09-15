import React from 'react'
import { UserDetail } from '../components'
import { Layout } from '../components'

const User = () => {
  return (
    <Layout profile={true}>
        <UserDetail/>
    </Layout>
  )
}

export default User