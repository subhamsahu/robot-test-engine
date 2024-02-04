import React from 'react'
import Layout from './Layout/Layout'


const AppLayout = ({children}) => {
  return (
    <Layout>
        {children}
    </Layout>
  )
}

export default AppLayout