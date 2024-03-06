import { GET_TESTPLAN_LIST, SET_TESTPLAN_LIST } from "../constant"

export const getTestplanList = () => {
    console.warn("Action getTestplanList")
    return {
        type: GET_TESTPLAN_LIST
    }
}

export const setTestplanList = (data) => {
    console.warn("Action setTestplanList")
    return {
        type: SET_TESTPLAN_LIST,
        payload: data
    }
}
