import drfProvider, {
    fetchJsonWithAuthToken,
} from 'ra-data-django-rest-framework';

import {
    DataProvider,
    GetListParams,
    Identifier,
    withLifecycleCallbacks,
} from 'react-admin';
import {
    Message,
    Consult,
    RAFile,
    DentistFormData,
    SignUpData,
} from '../../types';
import { getActivityLog } from '../commons/activity';

const baseDataProvider = drfProvider(
    'http://127.0.0.1:8000/api',
    fetchJsonWithAuthToken
);

const dataProviderWithCustomMethods = {
    ...baseDataProvider,
    async signUp({ email, password, first_name, last_name }: SignUpData) {
        const response = await fetch('/api/patient-signup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, first_name, last_name }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('signUp.error', data);
            throw new Error('Failed to create account');
        }
        return {
            id: data.id,
            email,
            password,
        };
    },
    async dentistsUpdate(
        id: Identifier,
        data: Partial<Omit<DentistFormData, 'password'>>
    ) {
        const response = await fetch(`/api/dentists/${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok) {
            console.error('dentistsUpdate.error', result);
            throw new Error('Failed to update dentists data');
        }

        return result;
    },
    async updatePassword(id: Identifier, newPassword: string) {
        const response = await fetch(`/api/patients/${id}/update_password/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPassword }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('passwordUpdate.error', data);
            throw new Error('Failed to update password');
        }

        return data;
    },
    async unarchiveConsult(consult: Consult) {
        try {
            // Send a PATCH request to unarchive the consult
            const response = await fetch(`/api/consults/unarchive/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: consult.id }), // Pass the consult ID in the body
            });

            // Parse the response JSON
            const data = await response.json();

            // Check if the response is not OK and throw an error
            if (!response.ok) {
                console.error('unarchiveConsult.error', response.status, data);
                throw new Error(
                    data?.error ||
                        `Failed to unarchive consult with ID: ${consult.id}`
                );
            }

            return data; // Return the successful response
        } catch (error) {
            console.error('unarchiveConsult.error', error);
            throw error; // Rethrow the error for higher-level handling
        }
    },
    async getActivityLog(companyId?: Identifier) {
        return getActivityLog(baseDataProvider, companyId);
    },
} satisfies DataProvider;

export type AppDataProvider = typeof dataProviderWithCustomMethods;

export const dataProvider = withLifecycleCallbacks(
    dataProviderWithCustomMethods,
    [
        {
            resource: 'messages',
            beforeSave: async (data: Message, _, __) => {
                if (data.attachments) {
                    for (const file of data.attachments) {
                        const uploadResult = await uploadToBucket(file);
                        file.path = uploadResult.path;
                        file.src = uploadResult.url;
                    }
                }
                return data;
            },
        },
        {
            resource: 'consultNotes',
            beforeSave: async (data: Message, _, __) => {
                if (data.attachments) {
                    for (const file of data.attachments) {
                        const uploadResult = await uploadToBucket(file);
                        file.path = uploadResult.path;
                        file.src = uploadResult.url;
                    }
                }
                return data;
            },
        },
        {
            resource: 'patients',
            beforeGetList: async params => {
                return applyFullTextSearch([
                    'first_name',
                    'last_name',
                    'email',
                ])(params);
            },
        },
        {
            resource: 'consults',
            beforeGetList: async params => {
                return applyFullTextSearch(['patient', 'name', 'description'])(
                    params
                );
            },
        },
    ]
);

const applyFullTextSearch = (columns: string[]) => (params: GetListParams) => {
    if (!params.filter?.q) {
        return params;
    }
    const { q, ...filter } = params.filter;
    return {
        ...params,
        filter: {
            ...filter,
            '@or': columns.reduce(
                (acc, column) => ({
                    ...acc,
                    [`${column}@ilike`]: q,
                }),
                {}
            ),
        },
    };
};

const uploadToBucket = async (file: RAFile) => {
    const formData = new FormData();
    formData.append('file', file.rawFile);

    try {
        const response = await fetch('/api/upload/', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('uploadToBucket.error', data);
            throw new Error('File upload failed');
        }

        return { path: data.path, url: data.url }; // Use the returned path and URL
    } catch (error) {
        console.error('uploadToBucket.error', error);
        throw error; // Rethrow for higher-level handling
    }
};
