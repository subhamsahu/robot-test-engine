import axios from 'axios';
// const FormData = require('form-data');

import { BACKEND_URL, headersConfig } from '../core/constants';

export const commonService = async () => {
    const url = `${BACKEND_URL}/someendpoint`
    console.log(url)
    const response = await axios.post(url, headersConfig)
        .then(res => { return res })
        .catch(err => { return err });
    console.log(response)
    const data = response?.data || []
    return data
}


export const getCurrentUserToken = () => {
    let token = localStorage.getItem('Token')
    token = JSON.parse(token || '{}')
    return token
}

export const getUserData = () => {
    let user = localStorage.getItem('User');
    user = JSON.parse(user || '{}');
    return user
}

export const generateGlobalHeader = () => {
    let token = getCurrentUserToken()
    const headersData = {
        headers: {
            'bearer': token
        }
    }
    return headersData
}

export const post = async (url, payload) => {
    const headersData = generateGlobalHeader()
    const body = payload
    console.log(url)
    const response = await axios.post(url, body, headersData)
        .then(res => { return res })
        .catch(err => { return err.response });
    console.log(response)
    const data = response?.data || []
    return data
}

export const get = async (url, params) => {
    const headersData = generateGlobalHeader()
    if (Object.keys(params).length != 0) {
        const searchParams = new URLSearchParams();

        // Loop through the params object and append each key-value pair to the URLSearchParams
        for (const [key, value] of Object.entries(params)) {
            searchParams.append(key, value);
        }

        // Append the serialized parameters to the URL
        url += '?' + searchParams.toString();
    }

    console.log(url)

    const response = await axios.get(url, headersData)
        .then(res => { return res })
        .catch(err => { return err.response });
    console.debug(response)
    const data = response?.data || []
    return data
}

export const remove = async (url, params) => {
    const headersData = generateGlobalHeader()
    console.log(Object.keys(params).length === 0)
    if (Object.keys(params).length != 0) {
        const searchParams = new URLSearchParams();

        // Loop through the params object and append each key-value pair to the URLSearchParams
        for (const [key, value] of Object.entries(params)) {
            searchParams.append(key, value);
        }

        // Append the serialized parameters to the URL
        url += '?' + searchParams.toString();
    }

    console.log(url)
    const response = await axios.delete(url, headersData)
        .then(res => { return res })
        .catch(err => { return err });
    const data = response?.data || []
    return data
}

export const put = async (url, payload, params) => {
    const headersData = generateGlobalHeader()
    if (Object.keys(params).length != 0) {
        const searchParams = new URLSearchParams();

        // Loop through the params object and append each key-value pair to the URLSearchParams
        for (const [key, value] of Object.entries(params)) {
            searchParams.append(key, value);
        }

        // Append the serialized parameters to the URL
        url += '?' + searchParams.toString();
    }
    console.log(url)
    const body = payload
    const response = await axios.put(url, body, headersData)
        .then(res => { return res })
        .catch(err => { return err });
    const data = response?.data || []
    return data
}

export const uploadImage = async (url, formData) => {
    const headersData = generateGlobalHeader()
    const response = await axios.post(url, formData, headersData)
        .then(res => { return res })
        .catch(err => { return err });
    const data = response?.data || []
    return data
}

export const call = async (url, method = 'GET', data = null, params = {}) => {
    try {
        if (Object.keys(params).length != 0) {
            const searchParams = new URLSearchParams();
    
            // Loop through the params object and append each key-value pair to the URLSearchParams
            for (const [key, value] of Object.entries(params)) {
                searchParams.append(key, value);
            }
    
            // Append the serialized parameters to the URL
            url += '?' + searchParams.toString();
        }
        const headers = generateGlobalHeader()
        const response = await axios({
            method,
            url: url,
            data,
            headers,
        });

        // You can handle the response data here
        console.log('Response:', response.data);

        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error:', error.message);
        throw error;
    }
}

