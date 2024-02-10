import { GET_TESTCASE_LIST, SET_TESTCASE_LIST, ADD_TESTCASE_TO_LIST, REMOVE_TESTCASE_FROM_LIST } from "../constant"

const initialState = {
    testcaseList: []
}

export const testCaseListStateData = (testcaseListState = initialState, action) => {
    switch (action.type) {
        case GET_TESTCASE_LIST:
            console.warn(GET_TESTCASE_LIST)
            return testcaseListState
        case SET_TESTCASE_LIST:
            console.warn(SET_TESTCASE_LIST)
            return action.payload
        default:
            console.warn("default action at test case reducer")
            return testcaseListState
    }
}