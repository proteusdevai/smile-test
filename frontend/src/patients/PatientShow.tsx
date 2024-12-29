import * as React from 'react';
import { ShowBase, RecordContextProvider, useShowContext } from 'react-admin';
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
    if (isPending || !record) return null;

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
                            <MessagesIterator />
                        </RecordContextProvider>
                    </CardContent>
                </Card>
            </Box>
            <PatientAside />
        </Box>
    );
};
