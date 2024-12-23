import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Stack,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
    Form,
    Labeled,
    TextField,
    TextInput,
    useDataProvider,
    useNotify,
    useRecordContext,
    useGetOne,
} from 'react-admin';
import { useFormState } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { AppDataProvider } from '../providers/django/dataProvider';

// Main Settings Page Component
export const SettingsPage = () => {
    const [isEditMode, setEditMode] = useState(false);
    const notify = useNotify();
    const dataProvider = useDataProvider<AppDataProvider>();

    // Fetch the current user data using their ID
    const { data: record, refetch } = useGetOne('users', { id: 'me' }); // Fetches the current user's data

    // Handle form submission
    const handleOnSubmit = async (values: any) => {
        try {
            await dataProvider.updateUser('me', values); // Call the updateUser function
            notify('Your profile has been updated');
            refetch(); // Refresh the user data
            setEditMode(false);
        } catch (error) {
            notify('An error occurred. Please try again.', { type: 'error' });
        }
    };

    if (!record) return null; // Prevent rendering if record is undefined

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Form onSubmit={handleOnSubmit} record={record}>
                <SettingsForm
                    isEditMode={isEditMode}
                    setEditMode={setEditMode}
                />
            </Form>
        </Container>
    );
};

// Settings Form Component
const SettingsForm = ({
    isEditMode,
    setEditMode,
}: {
    isEditMode: boolean;
    setEditMode: (value: boolean) => void;
}) => {
    const notify = useNotify();
    const { isDirty } = useFormState();
    const record = useRecordContext(); // Retrieves the record from the form context
    const dataProvider = useDataProvider<AppDataProvider>();

    // Password update mutation
    const { mutate: updatePassword } = useMutation({
        mutationKey: ['updatePassword'],
        mutationFn: async (newPassword: string) => {
            // @ts-ignore
            return dataProvider.updatePassword(record.id, newPassword);
        },
        onSuccess: () => {
            notify('Your password has been updated.');
        },
        onError: e => {
            notify(`An error occurred: ${e}`, { type: 'error' });
        },
    });

    // Handle password change
    const handlePasswordChange = async () => {
        const newPassword = prompt('Enter your new password:');
        if (newPassword) {
            updatePassword(newPassword);
        } else {
            notify('Password change canceled.', { type: 'info' });
        }
    };

    if (!record) return null; // Prevent rendering if record is undefined

    return (
        <Stack gap={4}>
            <Card>
                <CardContent>
                    <Stack
                        mb={2}
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Typography variant="h5" color="textSecondary">
                            My Info
                        </Typography>
                    </Stack>
                    <Stack gap={2} mb={2}>
                        <TextRender
                            source="first_name"
                            isEditMode={isEditMode}
                        />
                        <TextRender
                            source="last_name"
                            isEditMode={isEditMode}
                        />
                        <TextRender source="email" isEditMode={isEditMode} />
                    </Stack>
                    {!isEditMode && (
                        <Button
                            variant="outlined"
                            onClick={handlePasswordChange}
                        >
                            Change Password
                        </Button>
                    )}
                </CardContent>

                <CardActions
                    sx={{
                        paddingX: 2,
                        background: theme => theme.palette.background.default,
                        justifyContent: isEditMode
                            ? 'space-between'
                            : 'flex-end',
                    }}
                >
                    {isEditMode && (
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={!isDirty}
                        >
                            Save
                        </Button>
                    )}
                    <Button
                        variant="text"
                        size="small"
                        startIcon={
                            isEditMode ? <VisibilityIcon /> : <EditIcon />
                        }
                        onClick={() => setEditMode(!isEditMode)}
                    >
                        {isEditMode ? 'Show' : 'Edit'}
                    </Button>
                </CardActions>
            </Card>
        </Stack>
    );
};

// Text Render Component
const TextRender: React.FC<{ source: string; isEditMode: boolean }> = ({
    source,
    isEditMode,
}) => {
    if (isEditMode) {
        return <TextInput source={source} helperText={false} />;
    }
    return (
        <Labeled sx={{ mb: 0 }}>
            <TextField source={source} />
        </Labeled>
    );
};

SettingsPage.path = '/settings';
