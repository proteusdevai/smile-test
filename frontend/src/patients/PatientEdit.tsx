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
        <PatientEditContent />
    </EditBase>
);

const PatientEditContent = () => {
    const { isPending, record } = useEditContext<Patient>();
    console.info('EDITING A PAITENT');
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
