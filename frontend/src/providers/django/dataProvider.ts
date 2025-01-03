import customDataProvider from './customDataProvider';
import {
    DataProvider,
    GetListParams,
    Identifier,
    UserIdentity,
    withLifecycleCallbacks,
} from 'react-admin';
import {
    Consult,
    DentistFormData,
    Message,
    RAFile,
    SignUpData,
} from '../../types';
import { getActivityLog } from '../commons/activity';

const baseDataProvider = customDataProvider;

const dataProviderWithCustomMethods = {
    ...baseDataProvider,
    async signUp({
        email,
        password,
        first_name,
        last_name,
        phone_number,
        smile_goals,
        attachments,
        dentist_id, // Dentist ID passed from the form
    }: SignUpData) {
        // Step 1: Create the patient
        const signupResponse = await fetch('/api/patient-signup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                first_name,
                last_name,
                phone_number,
                smile_goals,
                dentist_id, // Embed dentist_id in patient creation
            }),
        });

        const signupData = await signupResponse.json();
        if (!signupResponse.ok) {
            console.error('signUp.error', signupData);
            throw new Error('Failed to create account');
        }

        const { id: patient_id } = signupData; // Patient ID from backend response

        // Step 2: Create the initial message
        const messageResponse = await fetch('/api/messages/', {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: JSON.stringify({
                patient_id,
                dentist_id,
                title: 'Initial Message',
                text: smile_goals,
                attachments: attachments,
            }),
        });

        if (!messageResponse.ok) {
            const messageError = await messageResponse.json();
            console.error('Message creation error:', messageError);
            throw new Error('Failed to send the initial message');
        }

        return {
            id: patient_id,
            email,
            password,
        };
    },
    async dentistCreate(data: DentistFormData) {
        try {
            const response = await fetch('/api/dentists/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json',
                }),
            });

            // Return the API response as expected by the frontend
            return response.json;
        } catch (error) {
            throw new Error('Failed to create dentist');
        }
    },
    async dentistUpdate(
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
        const response = await fetch(`/api/reset-password/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, password: newPassword }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('passwordUpdate.error', data);
            throw new Error('Failed to update password');
        }

        return data;
    },
    async updateUser(id: string, data: any) {
        const response = await fetch('/api/update-user/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, ...data }), // Include `id` in the body
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error?.message || 'Failed to update user');
        }

        return response.json();
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
    async getActivityLog(identity: UserIdentity) {
        return getActivityLog(baseDataProvider, identity);
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
                        file.id = uploadResult.id;
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
            resource: 'dentists',
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
                return applyFullTextSearch(['name', 'description'])(params);
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
        const response = await fetch('http://localhost:8000/api/upload/', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Replace with your token logic
            },
            body: formData,
        });

        // Safely parse JSON if the response body is not empty
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.warn('Response is not valid JSON or empty', jsonError);
            data = {}; // Default to an empty object if JSON parsing fails
        }

        if (!response.ok) {
            console.error('uploadToBucket.error', data);
            throw new Error(data?.error || 'File upload failed');
        }

        // Use the returned path and URL
        return { path: data.path, url: data.url, id: data.id };
    } catch (error) {
        console.error('uploadToBucket.error', error);
        throw error; // Rethrow for higher-level handling
    }
};
