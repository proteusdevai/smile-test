import {
    CreateButton,
    ExportButton,
    FilterButton,
    ListBase,
    ListToolbar,
    ReferenceInput,
    SearchInput,
    SelectInput,
    Title,
    TopToolbar,
    useGetIdentity,
    useListContext,
} from 'react-admin';
import { matchPath, useLocation } from 'react-router';

import { Card, Stack } from '@mui/material';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { ConsultArchivedList } from './ConsultArchivedList';
import { ConsultCreate } from './ConsultCreate';
import { ConsultEdit } from './ConsultEdit';
import { ConsultEmpty } from './ConsultEmpty';
import { ConsultListContent } from './ConsultListContent';
import { ConsultShow } from './ConsultShow';

const ConsultList = () => {
    const { identity } = useGetIdentity();

    if (!identity) return null;
    return (
        <ListBase
            perPage={100}
            filter={{
                'archived_at@is': null,
            }}
            sort={{ field: 'index', order: 'DESC' }}
        >
            <ConsultLayout />
        </ListBase>
    );
};

const ConsultLayout = () => {
    const location = useLocation();
    const matchCreate = matchPath('/consults/create', location.pathname);
    const matchShow = matchPath('/consults/:id/show', location.pathname);
    const matchEdit = matchPath('/consults/:id', location.pathname);

    const { consultCategories } = useConfigurationContext();

    const consultFilters = [<SearchInput source="q" alwaysOn />];

    const { data, isPending, filterValues } = useListContext();
    const hasFilters = filterValues && Object.keys(filterValues).length > 0;

    if (isPending) return null;
    if (!data?.length && !hasFilters)
        return (
            <>
                <ConsultEmpty>
                    <ConsultShow open={!!matchShow} id={matchShow?.params.id} />

                </ConsultEmpty>
            </>
        );

    return (
        <Stack component="div" sx={{ width: '100%' }}>
            <Title title={'Deals'} />
            <ListToolbar
                filters={consultFilters}
                actions={<ConsultActions />}
            />
            <Card>
                <ConsultListContent />
            </Card>
            <ConsultCreate open={!!matchCreate} />
            <ConsultEdit
                open={!!matchEdit && !matchCreate}
                id={matchEdit?.params.id}
            />
            <ConsultShow open={!!matchShow} id={matchShow?.params.id} />
        </Stack>
    );
};

const ConsultActions = () => {
    return (
        <TopToolbar>
            <CreateButton
                variant="contained"
                label="New Consult"
                sx={{ marginLeft: 2 }}
            />
        </TopToolbar>
    );
};

export default ConsultList;
