import * as React from 'react';
import { Box, Divider, Stack } from '@mui/material';
import { useListContext, useGetIdentity, useRecordContext } from 'react-admin';

import { Message } from './Message';
import { Patient } from '../types';
import { MessageCreate } from './MessageCreate';

export const MessagesIterator = ({
    patient,
    showStatus,
}: {
    patient?: Patient;
    showStatus?: boolean;
}) => {
    const { data, error, isPending } = useListContext(); // Fetch the messages
    const { identity } = useGetIdentity(); // Get logged-in user's identity
    const record = useRecordContext(); // The record for the receiver

    // Ensure that we have both the logged-in user and the receiver's record
    if (!identity || !record || isPending || error) return null;

    return (
        <Box mt={2}>
            {/* Render the message creation form */}
            <MessageCreate showStatus={showStatus} />

            {/* Iterate through and render each message */}
            {data && (
                <Stack mt={2} gap={1}>
                    {data.map((message, index) => (
                        <React.Fragment key={index}>
                            <Message
                                message={message}
                                patient={patient}
                                isLast={index === data.length - 1}
                                key={index}
                            />
                            {index < data.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </Stack>
            )}
        </Box>
    );
};
