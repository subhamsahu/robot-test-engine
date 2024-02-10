import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Layout from './Layout/Layout'
import { fetchTestcaseList } from '../../services/testcase'
import { fetchTestsuiteList } from '../../services/testsuite'
import { setTestcaseList } from '../../redux/actions/testcaseAction'
import { setTestsuiteList } from '../../redux/actions/testsuiteAction'


const AppLayout = ({ children }) => {
  const dispatch = useDispatch()
  const initializeSuiteData = async () => {
    console.warn("Fetching Test Suite List")
    let testsuitedate = await fetchTestsuiteList()
    console.warn(testsuitedate)
    if (testsuitedate?.data && testsuitedate?.success === true) {
      dispatch(setTestsuiteList(testsuitedate.data))
    }
  }
  const initializeTestcaseData = async () => {
    console.warn("Fetching Test Case List...")
    let testcasedate = await fetchTestcaseList()
    console.warn(testcasedate)
    if (testcasedate?.data && testcasedate?.success === true) {
      dispatch(setTestcaseList(testcasedate.data))
    }

  }
  useEffect(() => {
    async function initializeApp() {
      console.warn("Fetching App Data")
      await initializeTestcaseData()
      await initializeSuiteData()
    }
    initializeApp()
  }, [])

  return (
    <Layout>
      {children}
    </Layout>
  )
}

export default AppLayout