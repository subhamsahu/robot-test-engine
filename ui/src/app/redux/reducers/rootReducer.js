import {combineReducers} from 'redux'
import { snackBarStateData } from './snackBarReducer'
import { spinnerStateData } from './spinnerReducer'
import { testCaseListStateData } from './testcaseReducer'
import { testSuiteListStateData } from './testsuiteReducer'

export default combineReducers({
    spinnerStateData,
    snackBarStateData,
    testCaseListStateData,
    testSuiteListStateData
})