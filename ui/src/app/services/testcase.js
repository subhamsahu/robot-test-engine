import { BACKEND_URL, headersConfig } from '../core/constants';
import { get } from './api'


export const fetchTestcaseList = () => {
    const url = BACKEND_URL + '/test-manager/testcase/list'
    let params = {}
    const response = get(url, params)
    return response
}