import {backendApi} from "./backendApi";

export const websocketApi = {
    get: (userId) => {
        let websocketClient;
        if (userId === 'MARS') {
            websocketClient = backendApi('http://localhost:8000/api/v1');
        } else {
            websocketClient = backendApi('http://localhost:8001/api/v1');
        }
        websocketClient.post('/interplanetary-connect');
        return websocketClient.post('/local-ws', null, {
            params:
                {
                    user_id: userId
                }
        });
    }
}