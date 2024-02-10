import { GET_TESTSUITE_LIST, SET_TESTSUITE_LIST } from "../constant"

export const getTestsuiteList = () => {
    console.warn("Action getTestsuiteList")
    return {
        type: GET_TESTSUITE_LIST
    }
}

export const setTestsuiteList = (data) => {
    console.warn("Action setTestsuiteList")
    return {
        type: SET_TESTSUITE_LIST,
        payload: data
    }
}
