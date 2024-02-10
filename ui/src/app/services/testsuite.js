import { BACKEND_URL, headersConfig } from '../core/constants';
import { get } from './api'


export const fetchTestsuiteList = () => {
    const url = BACKEND_URL + '/test-manager/suite/list'
    let params = {}
    const response = get(url, params)
    return response
}