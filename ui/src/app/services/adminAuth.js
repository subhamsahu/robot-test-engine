import axios from 'axios';
import { BACKEND_URL, headersConfig } from '../core/constants'

// change file

export const adminLoginService = async (credentials) => {
    const url = `${BACKEND_URL}/auth/login`
    const body = {
        'email': credentials.email,
        'password': credentials.password
    }
    console.log(url)
    const response = await axios.post(url, body, headersConfig)
        .then(res => { return res })
        .catch(err => { return err.response });
    const data = response?.data || null
    return data
}