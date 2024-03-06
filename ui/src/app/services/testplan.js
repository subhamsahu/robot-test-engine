import { BACKEND_URL, headersConfig } from '../core/constants';
import { get } from './api'


export const fetchTestPlanList = () => {
    const url = BACKEND_URL + '/test-manager/testplan/list'
    let params = {}
    const response = get(url, params)
    return response
}