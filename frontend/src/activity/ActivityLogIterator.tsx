import { Button, Divider, List } from '@mui/material';
import { useState, Fragment } from 'react';
import {
    PATIENT_CREATED,
    MESSAGE_CREATED,
    CONSULT_CREATED,
    CONSULT_NOTE_CREATED,
} from '../consts';
import { Activity } from '../types';
import { ActivityLogPatientCreated } from './ActivityLogPatientCreated';
import { ActivityLogMessageCreated } from './ActivityLogMessageCreated';
import { ActivityLogConsultCreated } from './ActivityLogDealCreated';
import { ActivityLogConsultNoteCreated } from './ActivityLogConsultNoteCreated';

type ActivityLogIteratorProps = {
    activities: Activity[];
    pageSize: number;
};

export function ActivityLogIterator({
    activities,
    pageSize,
}: ActivityLogIteratorProps) {
    const [activitiesDisplayed, setActivityDisplayed] = useState(pageSize);

    const filteredActivities = activities.slice(0, activitiesDisplayed);

    return (
        <List
            sx={{
                '& .MuiListItem-root': {
                    marginTop: 0,
                    marginBottom: 1,
                },
                '& .MuiListItem-root:not(:first-of-type)': {
                    marginTop: 1,
                },
            }}
        >
            {filteredActivities.map((activity, index) => (
                <Fragment key={index}>
                    <ActivityItem key={activity.id} activity={activity} />
                    <Divider />
                </Fragment>
            ))}

            {activitiesDisplayed < activities.length && (
                <Button
                    onClick={() =>
                        setActivityDisplayed(
                            activitiesDisplayed =>
                                activitiesDisplayed + pageSize
                        )
                    }
                    fullWidth
                >
                    Load more activity
                </Button>
            )}
        </List>
    );
}

function ActivityItem({ activity }: { activity: Activity }) {
    if (activity.type === PATIENT_CREATED) {
        return <ActivityLogPatientCreated activity={activity} />;
    }

    if (activity.type === MESSAGE_CREATED) {
        return <ActivityLogMessageCreated activity={activity} />;
    }

    if (activity.type === CONSULT_CREATED) {
        return <ActivityLogConsultCreated activity={activity} />;
    }

    if (activity.type === CONSULT_NOTE_CREATED) {
        return <ActivityLogConsultNoteCreated activity={activity} />;
    }

    return null;
}
