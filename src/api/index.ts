import axios from 'axios'

export const BASE_URL = 'http://localhost:5165/'

export const ENDPOINTS = {
    // Account
    register: 'Account/Register',
    login: 'Account/Login',
    logout: 'Account/Logout',
    resetPassword: 'Account/ResetPassword',
    
    // Participant
    participants: 'Participants',

    // Questions 
    questions: 'Questions',
    answers: 'Questions/Answers',
}

export const createAPIEndpoint = (endpoint: string) => {
    let url = `${BASE_URL}api/${endpoint}/`

    return {
        fetch: () => axios.get(url),
        fetchById: (id: string | number) => axios.get(url + id),
        post: (newRecord: any) => axios.post(url, newRecord),
        put: (id: string | number, updatedRecord: any) => axios.put(url + id, updatedRecord),
        delete: (id: string | number) => axios.delete(url + id),
    }
}
