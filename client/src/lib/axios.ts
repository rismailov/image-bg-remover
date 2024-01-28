import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
})

export default axios
