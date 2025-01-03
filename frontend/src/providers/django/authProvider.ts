import { AuthProvider, fetchUtils } from 'ra-core';

export interface Options {
    obtainAuthTokenUrl?: string;
}

function jwtTokenAuthProvider(options: Options = {}): AuthProvider {
    const opts = {
        obtainAuthTokenUrl: '/api/token/',
        ...options,
    };

    return {
        login: async ({ email, password }) => {
            //console.info('Sending a login request.');
            const header = new Headers({ 'Content-Type': 'application/json' });
            const request = new Request(opts.obtainAuthTokenUrl, {
                method: 'POST',
                body: JSON.stringify({ username: email, password }),
                headers: header,
            });
            //console.info('Sending requsest with header:');
            //console.info('Logging all headers in the request:');
            for (const [key, value] of request.headers.entries()) {
                console.info(`${key}: ${value}`);
            }
            const response = await fetch(request);
            // Check if the response is successfulSt
            if (response.ok) {
                //console.info('Received a valid login.');
                const responseJSON = await response.json(); // Parse JSON
                localStorage.setItem('access_token', responseJSON.access);
                localStorage.setItem('refresh_token', responseJSON.refresh);
                return;
            }

            // Handle errors
            if (response.status === 415) {
                console.error(
                    'Unsupported Media Type: Check Content-Type header or body formatting.'
                );
                throw new Error('Unsupported Media Type.');
            }

            // Handle other errors
            const error = await response.json();
            throw new Error(
                error?.non_field_errors || `Error: ${response.statusText}`
            );
        },

        logout: () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return Promise.resolve();
        },

        checkAuth: () => {
            return localStorage.getItem('access_token')
                ? Promise.resolve()
                : Promise.reject();
        },

        checkError: error => {
            const status = error.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return Promise.reject();
            }
            return Promise.resolve();
        },

        getPermissions: () => Promise.resolve(),

        getIdentity: async () => {
            const response = await fetchJsonWithAuthJWTToken(
                'http://localhost:8000/api/users/?id=me',
                {}
            );

            // @ts-ignore
            const { associated_id, first_name, last_name, email } =
                response.json;
            //console.info('Getting identity: ');
            //console.info(associated_id, first_name, email);
            return { id: associated_id, first_name, last_name, email }; // Identity object
        },
    };
}

export function createOptionsFromJWTToken() {
    const token = localStorage.getItem('access_token');
    if (!token) return {};

    return {
        user: {
            authenticated: true,
            token: 'Bearer ' + token,
        },
    };
}

export function fetchJsonWithAuthJWTToken(url: string, options: any = {}) {
    const new_options = Object.assign(createOptionsFromJWTToken(), options);
    // Log the full new_options object
    //console.log('Did we:', JSON.stringify(new_options, null, 2));
    console.log(url);
    return fetchUtils.fetchJson(url, new_options);
}

export const authProvider = jwtTokenAuthProvider({
    obtainAuthTokenUrl: 'http://127.0.0.1:8000/api/token/',
});
