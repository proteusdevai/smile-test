import * as React from 'react';
import {
    EditBase,
    Form,
    SaveButton,
    Toolbar,
    useEditContext,
} from 'react-admin';
import { Card, CardContent, Box } from '@mui/material';

import { PatientInputs } from './PatientInputs';
import { PatientAside } from './PatientAside';
import { Patient } from '../types';

export const PatientEdit = () => (
    <EditBase redirect="show">
        <ContactEditContent />
    </EditBase>
);

const ContactEditContent = () => {
    const { isPending, record } = useEditContext<Patient>();
    if (isPending || !record) return null;
    return (
        <Box mt={2} display="flex">
            <Box flex="1">
                <Form>
                    <Card>
                        <CardContent>
                            <PatientInputs />
                        </CardContent>
                        <Toolbar>
                            <SaveButton />
                        </Toolbar>
                    </Card>
                </Form>
            </Box>
            <PatientAside link="show" />
        </Box>
    );
};
