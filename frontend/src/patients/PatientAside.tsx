import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import { Box, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import {
    DateField,
    DeleteButton,
    EditButton,
    EmailField,
    FunctionField,
    ReferenceField,
    ReferenceManyField,
    SelectField,
    ShowButton,
    TextField,
    ListContextProvider,
    useGetList,
    useList,
    useRecordContext,
} from 'react-admin';
import { AddTask } from '../tasks/AddTask';
import { TasksIterator } from '../tasks/TasksIterator';

import { useLocation } from 'react-router';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { Patient, Dentist } from '../types';

export const PatientAside = ({ link = 'edit' }: { link?: 'edit' | 'show' }) => {
    const record = useRecordContext<Patient>();

    const {
        data: tasks,
        total,
        isPending,
    } = useGetList('tasks', {
        filter: {
            patient_id: record ? record.id : {},
        },
    });

    // console.info(
    //     'Received following tasks:',
    //     JSON.stringify({ tasks, total }, null, 2)
    // );

    const listContext = useList({
        data: tasks,
        isPending,
        resource: 'tasks',
        perPage: 50,
    });
    if (!record) return null;
    return (
        <Box ml={4} width={250} minWidth={250}>
            <Box mb={2} ml="-5px">
                {/* Commenting out the Edit Patient button */}
                {/*
                {link === 'edit' ? (
                    <EditButton label="Edit Patient" />
                ) : (
                    <ShowButton label="Show Patient" />
                )}
                */}
            </Box>
            <Typography variant="subtitle2">Patient Info</Typography>
            <Divider sx={{ mb: 2 }} />
            {record.email && (
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    minHeight={24}
                >
                    <EmailIcon color="disabled" fontSize="small" />
                    <EmailField source="email" />
                </Stack>
            )}

            {record.phone_number && (
                <Stack direction="row" alignItems="center" gap={1}>
                    <PhoneIcon color="disabled" fontSize="small" />
                    <Box>
                        <TextField source="phone_number" />{' '}
                    </Box>
                </Stack>
            )}

            <Typography variant="subtitle2" mt={2}>
                Smile Goals
            </Typography>
            <Divider />
            <Typography variant="body2" mt={2}>
                {record && record.smile_goals}
            </Typography>
            <br />
            <Box mb={3}>
                <Typography variant="subtitle2">Tasks</Typography>
                <Divider />
                <ReferenceManyField target="patient_id" reference="tasks">
                    <ListContextProvider value={listContext}>
                        <TasksIterator />
                    </ListContextProvider>
                </ReferenceManyField>
                <AddTask />
            </Box>
        </Box>
    );
};
