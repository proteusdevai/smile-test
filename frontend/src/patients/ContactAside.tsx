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
    UrlField,
    useRecordContext,
} from 'react-admin';
import { AddTask } from '../tasks/AddTask';
import { TasksIterator } from '../tasks/TasksIterator';
import { TagsListEdit } from './TagsListEdit';

import { useLocation } from 'react-router';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { Contact, Sale } from '../types';

export const ContactAside = ({ link = 'edit' }: { link?: 'edit' | 'show' }) => {
    const record = useRecordContext<Contact>();
    if (!record) return null;
    return (
        <Box ml={4} width={250} minWidth={250}>
            <Box mb={2} ml="-5px">
                {link === 'edit' ? (
                    <EditButton label="Edit Contact" />
                ) : (
                    <ShowButton label="Show Contact" />
                )}
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

            {record.phone_1_number && (
                <Stack direction="row" alignItems="center" gap={1}>
                    <PhoneIcon color="disabled" fontSize="small" />
                    <Box>
                        <TextField source="phone_1_number" />{' '}
                        {record.phone_1_type !== 'Other' && (
                            <TextField
                                source="phone_1_type"
                                color="textSecondary"
                            />
                        )}
                    </Box>
                </Stack>
            )}
            {record.phone_2_number && (
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    minHeight={24}
                >
                    <PhoneIcon color="disabled" fontSize="small" />
                    <Box>
                        <TextField source="phone_2_number" />{' '}
                        {record.phone_2_type !== 'Other' && (
                            <TextField
                                source="phone_2_type"
                                color="textSecondary"
                            />
                        )}
                    </Box>
                </Stack>
            )}
            <Typography variant="subtitle2" mt={2}>
                Smile Goals
            </Typography>
            <Divider />
            <Typography variant="body2" mt={2}>
                {record && record.background}
            </Typography>
            <br />
            <Box mb={3}>
                <Typography variant="subtitle2">Tasks</Typography>
                <Divider />
                <ReferenceManyField
                    target="contact_id"
                    reference="tasks"
                    sort={{ field: 'due_date', order: 'ASC' }}
                >
                    <TasksIterator />
                </ReferenceManyField>
                <AddTask />
            </Box>
        </Box>
    );
};