import axios from "axios";

export const backendApi = (url) => {
    const client = axios.create({
        baseURL: url,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });

    client.interceptors.response.use((response) => {
        return response.data;
    }, async (error) => {
        console.log('An error occurred while calling backend', error);
        if (error.response) {
            if (error.response.status === 404) {
                return {
                    status: error.response.status
                };
            }
        } else {
            return error.response;
        }
    });

    return client;
};