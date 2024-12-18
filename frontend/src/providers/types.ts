import drfProvider, {
    tokenAuthProvider,
    fetchJsonWithAuthToken,
} from 'ra-data-django-rest-framework';

export const authProvider = tokenAuthProvider();
export const DataProvider = drfProvider('/api', fetchJsonWithAuthToken);
