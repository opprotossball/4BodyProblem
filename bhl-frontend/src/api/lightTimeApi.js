import {backendApi} from "./backendApi";

const lightTimeClient = backendApi('')

export const lightTimeApi = {
    getLightTime: () => {
        console.log('Sending request to lightTimeApi')
        return lightTimeClient.get('/lightTime')
    }

}