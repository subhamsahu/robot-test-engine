import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Layout from './Layout/Layout'
import { fetchTestcaseList } from '../../services/testcase'
import { fetchTestsuiteList } from '../../services/testsuite'
import { setTestcaseList } from '../../redux/actions/testcaseAction'
import { setTestsuiteList } from '../../redux/actions/testsuiteAction'
import { fetchTestPlanList } from '../../services/testplan'
import { setTestplanList } from '../../redux/actions/testplanAction'


const AppLayout = ({ children }) => {
  const dispatch = useDispatch()
  const initializeSuiteData = async () => {
    console.warn("Fetching Test Suite List")
    let testsuitedata = await fetchTestsuiteList()
    console.warn(testsuitedata)
    if (testsuitedata?.data && testsuitedata?.success === true) {
      dispatch(setTestsuiteList(testsuitedata.data))
    }
  }
  const initializeTestcaseData = async () => {
    console.warn("Fetching Test Case List...")
    let testcasedata = await fetchTestcaseList()
    console.warn(testcasedata)
    if (testcasedata?.data && testcasedata?.success === true) {
      dispatch(setTestcaseList(testcasedata.data))
    }

  }

  const initializeTestplanData = async () => {
    console.warn("Fetching Test plan List...")
    let testplandata = await fetchTestPlanList()
    console.warn(testplandata)
    if (testplandata?.data && testplandata?.success === true) {
      dispatch(setTestplanList(testplandata.data))
    }

  }
  useEffect(() => {
    async function initializeApp() {
      console.warn("Fetching App Data")
      await initializeTestcaseData()
      await initializeSuiteData()
      await initializeTestplanData()
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