import drfProvider, {
    tokenAuthProvider,
    fetchJsonWithAuthToken,
} from 'ra-data-django-rest-framework';

import {
    CreateParams,
    DataProvider,
    GetListParams,
    Identifier,
    UpdateParams,
    withLifecycleCallbacks,
} from 'react-admin';
import {
    Patient,
    Message,
    Consult,
    ConsultNote,
    RAFile,
    Dentist,
    DentistFormData,
    SignUpData,
} from '../../types';
import { getActivityLog } from '../commons/activity';
import { getIsInitialized } from './authProvider';

const baseDataProvider = drfProvider('/api', fetchJsonWithAuthToken);

const dataProviderWithCustomMethods = {
    ...baseDataProvider,
    async getList(resource: string, params: GetListParams) {
        if (resource === 'patients') {
            return baseDataProvider.getList('patients_summary', params);
        }

        return baseDataProvider.getList(resource, params);
    },
    async getOne(resource: string, params: any) {
        if (resource === 'patients') {
            return baseDataProvider.getOne('patients_summary', params);
        }

        return baseDataProvider.getOne(resource, params);
    },

    async signUp({ email, password, first_name, last_name }: SignUpData) {
        const response = await fetch('/api/auth/sign-up/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, first_name, last_name }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('signUp.error', data);
            throw new Error('Failed to create account');
        }

        getIsInitialized._is_initialized_cache = true;

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
        const response = await fetch(`/api/dentists/${id}/update_password/`, {
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
    async unarchiveconsult(consult: Consult) {
        // get all consults where stage is the same as the consult to unarchive
        const consults = await baseDataProvider.getList<Consult>('consults', {
            filter: { stage: consult.stage },
            pagination: { page: 1, perPage: 1000 },
            sort: { field: 'index', order: 'ASC' },
        });

        // set index for each consult starting from 1, if the consult to unarchive is found, set its index to the last one
        const updatedconsults = consults.map((d, index) => ({
            ...d,
            index: d.id === consult.id ? 0 : index + 1,
            archived_at: d.id === consult.id ? null : d.archived_at,
        }));

        return await Promise.all(
            updatedconsults.map(updatedconsult =>
                baseDataProvider.update('consults', {
                    id: updatedconsult.id,
                    data: updatedconsult,
                    previousData: consults.find(d => d.id === updatedconsult.id),
                })
            )
        );
    },
    async getActivityLog(companyId?: Identifier) {
        return getActivityLog(baseDataProvider, companyId);
    },
    async isInitialized() {
        return getIsInitialized();
    },
} satisfies DataProvider;

export type CrmDataProvider = typeof dataProviderWithCustomMethods;

export const dataProvider = withLifecycleCallbacks(
    dataProviderWithCustomMethods,
    [
        {
            resource: 'messages',
            beforeSave: async (data: Message, _, __) => {
                if (data.attachments) {
                    for (const file of data.attachments) {
                        await uploadToBucket(file);
                    }
                }
                return data;
            },
        },
        {
            resource: 'consultNotes',
            beforeSave: async (data: ConsultNote, _, __) => {
                if (data.attachments) {
                    for (const file of data.attachments) {
                        await uploadToBucket(file);
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
                    'company_name',
                    'title',
                    'email',
                    'phone_1_number',
                    'phone_2_number',
                    'background',
                ])(params);
            },
        },
        {
            resource: 'patients_summary',
            beforeGetList: async params => {
                return applyFullTextSearch(['first_name', 'last_name'])(params);
            },
        },
        {
            resource: 'consults',
            beforeGetList: async params => {
                return applyFullTextSearch(['name', 'type', 'description'])(
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

const uploadToBucket = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error('File upload failed');
    return { path: data.path, url: data.url };
};
