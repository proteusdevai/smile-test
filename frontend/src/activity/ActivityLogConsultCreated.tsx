import { ListItem, Stack, Typography } from '@mui/material';
import { Link, ReferenceField } from 'react-admin';

import type { ActivityConsultCreated } from '../types';
import { DentistName } from '../dentists/DentistName';
import { PatientName } from '../patients/PatientName';

import { RelativeDate } from '../misc/RelativeDate';
import { useActivityLogContext } from './ActivityLogContext';

type ActivityLogConsultCreatedProps = {
    activity: ActivityConsultCreated;
};

export function ActivityLogConsultCreated({
    activity,
}: ActivityLogConsultCreatedProps) {
    const context = useActivityLogContext();
    const { consult } = activity;
    return (
        <ListItem disableGutters>
            <Stack direction="row" spacing={1} alignItems="center" width="100%">
                <Typography
                    component="p"
                    variant="body2"
                    color="text.secondary"
                    flexGrow={1}
                >
                    <ReferenceField
                        source="dentist_id"
                        reference="dentists"
                        record={activity}
                        link="show"
                    >
                        <DentistName />
                    </ReferenceField>{' '}
                    added consult{' '}
                    <Link to={`/consults/${consult.id}/show`}>{consult.name}</Link>{' '}
                    for patient{' '}
                    <ReferenceField
                        source="patient_id"
                        reference="patients"
                        record={activity}
                        link="show"
                    >
                        <PatientName />
                    </ReferenceField>{' '}
                </Typography>
            </Stack>
        </ListItem>
    );
}
