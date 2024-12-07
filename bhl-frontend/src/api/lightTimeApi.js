import {backendApi} from "./backendApi";

const lightTimeClient = backendApi('/astronomy')

export const lightTimeApi = {
    getLightTime: () => {
        console.log('Sending request to lightTimeApi')
        return lightTimeClient.get('/lightTime')
    }

}