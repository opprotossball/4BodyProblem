import {backendApi} from "./backendApi";

const websocketClient = backendApi('/local-ws');

export const websocketApi = {
    get: (userId) => {
        return websocketClient.post('', null, {
            params:
                {
                    user_id: userId
                }
        });
    }
}