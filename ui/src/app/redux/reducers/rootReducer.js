import {combineReducers} from 'redux'
import { snackBarStateData } from './snackBarReducer'
import { spinnerStateData } from './spinnerReducer'
import { testCaseListStateData } from './testcaseReducer'
import { testSuiteListStateData } from './testsuiteReducer'
import { testplanListStateData } from './testplanReducer'

export default combineReducers({
    spinnerStateData,
    snackBarStateData,
    testCaseListStateData,
    testSuiteListStateData,
    testplanListStateData
})