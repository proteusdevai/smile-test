import Typography from '@mui/material/Typography';
import { ReferenceField } from 'react-admin';

import type { ActivityConsultNoteCreated } from '../types';
import { DentistName } from '../dentists/DentistName';
import { RelativeDate } from '../misc/RelativeDate';
import { ActivityLogNote } from './ActivityLogNote';
import { useActivityLogContext } from './ActivityLogContext';

type ActivityLogConsultNoteCreatedProps = {
    activity: ActivityConsultNoteCreated;
};

export function ActivityLogConsultNoteCreated({
    activity,
}: ActivityLogConsultNoteCreatedProps) {
    const context = useActivityLogContext();
    const { consultNote } = activity;
    return (
        <ActivityLogNote
            header={
                <>
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
                            link={false}
                        >
                            <DentistName />
                        </ReferenceField>{' '}
                        added a note about consult{' '}
                        <ReferenceField
                            source="consult_id"
                            reference="consults"
                            record={consultNote}
                            link="show"
                        />
                    </Typography>{' '}
                    at{' '}
                    <Typography
                        color="textSecondary"
                        variant="body2"
                        component="span"
                    >
                        <RelativeDate date={activity.date} />
                    </Typography>
                </>
            }
            text={consultNote.text}
        />
    );
}
