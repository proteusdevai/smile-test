import { Typography } from '@mui/material';
import { ReferenceField } from 'react-admin';

import type { ActivityMessageCreated } from '../types';
import { ActivityLogMessage } from './ActivityLogMessage';
import { RelativeDate } from '../misc/RelativeDate';
import { useActivityLogContext } from './ActivityLogContext';
import { DentistName } from '../dentists/DentistName';
import { PatientName } from '../patients/PatientName';

type ActivityLogMessageCreatedProps = {
    activity: ActivityMessageCreated;
};

export function ActivityLogMessageCreated({
    activity,
}: ActivityLogMessageCreatedProps) {
    const context = useActivityLogContext();
    const { message } = activity;
    return (
        <ActivityLogMessage
            header={
                <>
                    <Typography
                        component="p"
                        variant="body2"
                        color="text.secondary"
                        flexGrow={1}
                    >
                        <>
                            Dentist <strong>{message.dentist_id}</strong>
                        </>{' '}
                        sent a message to{' '}
                        <>
                            Patient <strong>{message.patient_id}</strong>
                        </>{' '}
                        on <RelativeDate date={message.date} />
                        <br />
                        <>
                            <strong>{message.title}</strong>
                        </>
                    </Typography>
                </>
            }
            text={message.text || 'No text provided'} // Display the message text, fallback to "No text provided"
            attachments={message.attachments || []} // Ensure attachments fallback to an empty array
        />
    );
}
