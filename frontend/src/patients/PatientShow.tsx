import * as React from 'react';
import {
    ShowBase,
    RecordContextProvider,
    useShowContext,
    useList,
    ListContextProvider,
    useGetList,
} from 'react-admin';
import { Box, Card, CardContent, Typography } from '@mui/material';

import { PatientAside } from './PatientAside';
import { MessagesIterator } from '.././messages';
import { Patient } from '../types';

export const PatientShow = () => (
    <ShowBase>
        <PatientShowContent />
    </ShowBase>
);

const PatientShowContent = () => {
    const { record, isPending } = useShowContext<Patient>();

    const {
        data: messages,
        total,
        isLoading,
    } = useGetList('messages', {
        filter: record ? { patient_id: record.id } : {},
    });

    const listContext = useList({
        data: messages,
        isFetching: isPending,
        resource: 'messages',
        perPage: 50,
    });

    // Handle loading or empty states
    if (isLoading || isPending || !messages || messages.length === 0) {
        return (
            <Box mt={2} mb={2} display="flex">
                <Box flex="1">
                    <Card>
                        <CardContent>
                            <Typography variant="body2">
                                No messages found.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        );
    }

    // @ts-ignore
    return (
        <Box mt={2} mb={2} display="flex">
            <Box flex="1">
                <Card>
                    <CardContent>
                        <Box ml={2} flex="1">
                            <Typography variant="h5">
                                {record.first_name} {record.last_name}
                            </Typography>
                        </Box>
                        <RecordContextProvider value={record}>
                            <ListContextProvider value={listContext}>
                                <MessagesIterator />
                            </ListContextProvider>
                        </RecordContextProvider>
                    </CardContent>
                </Card>
            </Box>
            <PatientAside />
        </Box>
    );
};
