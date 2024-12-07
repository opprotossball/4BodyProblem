import axios from "axios";

export const backendApi = (url) => {
    const client = axios.create({
        baseURL: 'http://localhost:8080/api/v1',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });

    client.interceptors.response.use((response) => {
        return response;
    }, async (error) => {
        console.log('An error occurred while calling backend', error);
        if (error.response) {
                return {
                    status: error.response.status
                };
            }
        });

    return client;
};