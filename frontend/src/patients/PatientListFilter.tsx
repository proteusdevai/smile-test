/* eslint-disable import/no-anonymous-default-export */
import * as React from 'react';
import {
    FilterList,
    FilterLiveSearch,
    FilterListItem,
    useGetIdentity,
    useGetList,
} from 'react-admin';
import { Box, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { endOfYesterday, startOfWeek, startOfMonth, subMonths } from 'date-fns';

import { Status } from '../misc/Status';
import { useConfigurationContext } from '../root/ConfigurationContext';

export const PatientListFilter = () => {
    const { noteStatuses } = useConfigurationContext();
    const { identity } = useGetIdentity();
    const { data } = useGetList('tags', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
    });
    return (
        <Box width="13em" minWidth="13em" order={-1} mr={2} mt={5}>
            <FilterLiveSearch
                hiddenLabel
                sx={{
                    display: 'block',
                    '& .MuiFilledInput-root': { width: '100%' },
                }}
                placeholder="Search name, company, etc."
            />
            <FilterList label="Status" icon={<EventNoteIcon />}>
                {noteStatuses.map(status => (
                    <FilterListItem
                        key={status.value}
                        label={
                            <>
                                {status.label} <Status status={status.value} />
                            </>
                        }
                        value={{ status: status.value }}
                    />
                ))}
            </FilterList>
            <FilterList label="Tasks" icon={<AssignmentTurnedInIcon />}>
                <FilterListItem
                    label="With pending tasks"
                    value={{ 'nb_tasks@gt': 0 }}
                />
            </FilterList>
        </Box>
    );
};