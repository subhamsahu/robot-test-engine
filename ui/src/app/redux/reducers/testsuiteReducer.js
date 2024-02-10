import { GET_TESTSUITE_LIST, SET_TESTSUITE_LIST, CREATE_TESTSUITE, DELETE_TESTSUITE } from "../constant"

const initialState = {
    testsuiteList: []
}

export const testSuiteListStateData = (testsuiteListState = initialState, action) => {
    switch (action.type) {
        case GET_TESTSUITE_LIST:
            console.warn(GET_TESTSUITE_LIST)
            return testsuiteListState
        case SET_TESTSUITE_LIST:
            console.warn(SET_TESTSUITE_LIST)
            return action.payload
        default:
            console.warn("default action at test suite reducer")
            return testsuiteListState
    }
}