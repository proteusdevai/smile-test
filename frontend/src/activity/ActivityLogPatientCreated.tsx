import { ListItem, Stack, Typography } from '@mui/material';
import { Link, ReferenceField } from 'react-admin';

import { Avatar } from '../contacts/Avatar';
import type { ActivityPatientCreated } from '../types';
import { SaleName } from '../sales/SaleName';
import { RelativeDate } from '../misc/RelativeDate';
import { useActivityLogContext } from './ActivityLogContext';

type ActivityLogContactCreatedProps = {
    activity: ActivityPatientCreated;
};

export function ActivityLogPatientCreated({
    activity,
}: ActivityLogContactCreatedProps) {
    const context = useActivityLogContext();
    const { patient } = activity;
    return (
        <ListItem disableGutters>
            <Stack direction="row" spacing={1} alignItems="center" width="100%">
                <Typography
                    component="p"
                    variant="body2"
                    color="text.secondary"
                    flexGrow={1}
                >
                    <Link to={`/patients/${patient.id}/show`}>
                        {patient.first_name} {patient.last_name}
                    </Link>{' signed up.'}
                </Typography>
            </Stack>
        </ListItem>
    );
}
