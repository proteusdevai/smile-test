/* eslint-disable import/no-anonymous-default-export */
import type { Theme } from '@mui/material';
import {
    Checkbox,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { formatRelative } from 'date-fns';
import {
    RecordContextProvider,
    ReferenceField,
    SimpleListLoading,
    TextField,
    useListContext,
} from 'react-admin';
import { Link } from 'react-router-dom';

import { Patient } from '../types';

export const PatientListContent = () => {
    const {
        data: patients,
        error,
        isPending,
        onToggleItem,
        selectedIds,
    } = useListContext<Patient>();
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('md')
    );
    if (isPending) {
        return <SimpleListLoading hasLeftAvatarOrIcon hasSecondaryText />;
    }
    if (error) {
        return null;
    }
    const now = Date.now();

    return (
        <>
            <List dense>
                {patients.map(patient => (
                    <RecordContextProvider key={patient.id} value={patient}>
                        <ListItem
                            button
                            component={Link}
                            to={`/patients/${patient.id}/show`}
                        >
                            <ListItemIcon sx={{ minWidth: '2.5em' }}>
                                <Checkbox
                                    edge="start"
                                    checked={selectedIds.includes(patient.id)}
                                    tabIndex={-1}
                                    disableRipple
                                    onClick={e => {
                                        e.stopPropagation();
                                        onToggleItem(patient.id);
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={`${patient.first_name} ${patient.last_name ?? ''}`}
                            />
                            {patient.last_seen && (
                                <ListItemSecondaryAction
                                    sx={{
                                        top: '10px',
                                        transform: 'none',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        title={patient.last_seen}
                                    >
                                        {!isSmall && 'last activity '}
                                        {formatRelative(
                                            patient.last_seen,
                                            now
                                        )}{' '}
                                    </Typography>
                                </ListItemSecondaryAction>
                            )}
                        </ListItem>
                    </RecordContextProvider>
                ))}

                {patients.length === 0 && (
                    <ListItem>
                        <ListItemText primary="No patients found" />
                    </ListItem>
                )}
            </List>
        </>
    );
};
