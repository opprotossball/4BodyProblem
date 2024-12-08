import {backendApi} from "./backendApi";

const lightTimeClient = backendApi('http://localhost:8000/api/v1/astronomy')

export const lightTimeApi = {
    getLightTime: () => {
        console.log('Sending request to lightTimeApi')
        return lightTimeClient.get('/lightTime')
    }

}