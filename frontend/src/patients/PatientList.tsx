/* eslint-disable import/no-anonymous-default-export */
import { Card, Stack } from '@mui/material';
import jsonExport from 'jsonexport/dist';
import type { Exporter } from 'react-admin';
import {
    BulkActionsToolbar,
    BulkDeleteButton,
    BulkExportButton,
    CreateButton,
    downloadCSV,
    ExportButton,
    ListBase,
    ListToolbar,
    Pagination,
    SortButton,
    Title,
    TopToolbar,
    useGetIdentity,
    useListContext,
} from 'react-admin';


import { PatientEmpty } from './PatientEmpty';
import { PatientListContent } from './PatientListContent';
import { PatientListFilter } from './PatientListFilter';

export const PatientList = () => {
    const { identity } = useGetIdentity();

    if (!identity) return null;

    return (
        <ListBase perPage={25} sort={{ field: 'last_seen', order: 'DESC' }}>
            <ContactListLayout />
        </ListBase>
    );
};

const ContactListLayout = () => {
    const { data, isPending, filterValues } = useListContext();
    const { identity } = useGetIdentity();

    const hasFilters = filterValues && Object.keys(filterValues).length > 0;

    if (!identity || isPending) return null;

    if (!data?.length && !hasFilters) return <PatientEmpty />;

    return (
        <Stack direction="row">
            <PatientListFilter />
            <Stack sx={{ width: '100%' }}>
                <Title title={'Inbox'} />
                <br />
                <br />
                <BulkActionsToolbar>
                    <BulkExportButton />
                    <BulkDeleteButton />
                </BulkActionsToolbar>
                <Card>
                    <PatientListContent />
                </Card>
                <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
            </Stack>
        </Stack>
    );
};