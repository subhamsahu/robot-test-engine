import { GET_TESTPLAN_LIST, SET_TESTPLAN_LIST, CREATE_TESTPLAN, DELETE_TESTPLAN } from "../constant"

const initialState = {
    testplanList: []
}

export const testplanListStateData = (testplanListState = initialState, action) => {
    switch (action.type) {
        case GET_TESTPLAN_LIST:
            console.warn(GET_TESTPLAN_LIST)
            return testplanListState
        case SET_TESTPLAN_LIST:
            console.warn(SET_TESTPLAN_LIST)
            return action.payload
        default:
            console.warn("default action at test suite reducer")
            return testplanListState
    }
}