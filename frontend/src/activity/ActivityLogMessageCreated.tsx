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
                        <ReferenceField
                            source="sender_id"
                            reference={
                                message.sender_type === 'dentist'
                                    ? 'dentists'
                                    : 'patients'
                            }
                            record={message}
                            link={false}
                        >
                            {message.sender_type === 'dentist' ? (
                                <DentistName />
                            ) : (
                                <PatientName />
                            )}
                        </ReferenceField>
                        sent a message to{' '}
                        <ReferenceField
                            source="receiver_id"
                            reference={
                                message.sender_type === 'patient'
                                    ? 'patients'
                                    : 'dentists'
                            }
                            record={message}
                            link={false}
                        >
                            {message.sender_type === 'dentist' ? (
                                <DentistName />
                            ) : (
                                <PatientName />
                            )}
                        </ReferenceField>
                        {' on '}
                        <RelativeDate date={activity.date} />
                    </Typography>
                </>
            }
            text={message.text}
            attachments={message.attachments}
        />
    );
}
