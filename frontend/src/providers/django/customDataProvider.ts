import { stringify } from 'query-string';
import {
    DataProvider,
    fetchUtils,
    GetListParams,
    GetOneParams,
    GetManyParams,
    GetManyReferenceParams,
    CreateParams,
    UpdateParams,
    DeleteParams,
} from 'ra-core';
import { fetchJsonWithAuthJWTToken } from './authProvider';

const apiUrl = 'http://127.0.0.1:8000/api'; // Base API URL

const customDataProvider: DataProvider = {
    getList: async (resource: string, params: GetListParams) => {
        const { page, perPage } = params.pagination || { page: 1, perPage: 10 }; // Provide default values
        const { field, order } = params.sort || { field: 'id', order: 'ASC' }; // Provide default values

        const query = {
            ...params.filter,
            page,
            page_size: perPage,
            ordering: `${order === 'ASC' ? '' : '-'}${field}`,
        };
        const url = `${apiUrl}/${resource}/?${stringify(query)}`;

        const { json } = await fetchJsonWithAuthJWTToken(url);

        return {
            data: json.results,
            total: json.count,
        };
    },

    getOne: async (resource: string, params: GetOneParams) => {
        const url = `${apiUrl}/${resource}/${params.id}/`;
        const { json } = await fetchJsonWithAuthJWTToken(url);

        return { data: json };
    },

    getMany: async (resource: string, params: GetManyParams) => {
        const responses = await Promise.all(
            params.ids.map(id =>
                fetchJsonWithAuthJWTToken(`${apiUrl}/${resource}/${id}/`)
            )
        );
        const data = responses.map(({ json }) => json);

        return { data };
    },

    getManyReference: async (
        resource: string,
        params: GetManyReferenceParams
    ) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const query = {
            ...params.filter,
            [params.target]: params.id,
            page,
            page_size: perPage,
            ordering: `${order === 'ASC' ? '' : '-'}${field}`,
        };
        const url = `${apiUrl}/${resource}/?${stringify(query)}`;

        const { json } = await fetchJsonWithAuthJWTToken(url);

        return {
            data: json.results,
            total: json.count,
        };
    },

    create: async (resource: string, params: CreateParams) => {
        const url = `${apiUrl}/${resource}/`;
        const { json } = await fetchJsonWithAuthJWTToken(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
        });

        return { data: json };
    },

    update: async (resource: string, params: UpdateParams) => {
        const url = `${apiUrl}/${resource}/${params.id}/`;
        const { json } = await fetchJsonWithAuthJWTToken(url, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
        });

        return { data: json };
    },

    updateMany: async (
        resource: string,
        params: GetManyParams & { data: any }
    ) => {
        if (!params.data) {
            throw new Error('Data is required for updateMany');
        }

        const responses = await Promise.all(
            params.ids.map(id =>
                fetchJsonWithAuthJWTToken(`${apiUrl}/${resource}/${id}/`, {
                    method: 'PATCH',
                    body: JSON.stringify(params.data),
                })
            )
        );

        return { data: responses.map(({ json }) => json.id) };
    },

    delete: async (resource: string, params: DeleteParams) => {
        const url = `${apiUrl}/${resource}/${params.id}/`;
        await fetchJsonWithAuthJWTToken(url, { method: 'DELETE' });

        return { data: params.previousData };
    },

    deleteMany: async (resource: string, params: GetManyParams) => {
        await Promise.all(
            params.ids.map(id =>
                fetchJsonWithAuthJWTToken(`${apiUrl}/${resource}/${id}/`, {
                    method: 'DELETE',
                })
            )
        );

        return { data: [] };
    },
};

export default customDataProvider;