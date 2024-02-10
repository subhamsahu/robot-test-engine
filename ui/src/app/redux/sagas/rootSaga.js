import { takeEvery, all } from 'redux-saga/effects'
import testcaseSaga from './testcaseSaga'

function* rootSaga() {
    yield all(
        [
            testcaseSaga
        ]
    )
}

export default rootSaga