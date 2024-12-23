import * as React from 'react';
import { CreateBase, Form, Toolbar, useGetIdentity } from 'react-admin';
import { Card, CardContent, Box } from '@mui/material';

import { PatientInputs } from './PatientInputs';
import { Contact } from '../types';

export const PatientCreate = () => {
    const { identity } = useGetIdentity();
    return (
        <CreateBase
            redirect="show"
            transform={(data: Contact) => ({
                ...data,
                first_seen: new Date().toISOString(),
                last_seen: new Date().toISOString(),
                tags: [],
            })}
        >
            <Box mt={2} display="flex">
                <Box flex="1">
                    <Form defaultValues={{ sales_id: identity?.id }}>
                        <Card>
                            <CardContent>
                                <PatientInputs />
                            </CardContent>
                            <Toolbar />
                        </Card>
                    </Form>
                </Box>
            </Box>
        </CreateBase>
    );
};
