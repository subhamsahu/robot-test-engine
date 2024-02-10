import { GET_TESTCASE_LIST, SET_TESTCASE_LIST } from "../constant"

export const getTestcaseList = () => {
    console.warn("Action getTestcaseList")
    return {
        type: GET_TESTCASE_LIST
    }
}

export const setTestcaseList = (data) => {
    console.warn("Action setTestcaseList")
    return {
        type: SET_TESTCASE_LIST,
        payload: data
    }
}
