import * as React from 'react';
import { Box, Divider, Stack } from '@mui/material';
import { useListContext } from 'react-admin';

import { Message } from './Message';
import { MessageCreate } from './MessageCreate';

export const MessagesIterator = ({
    showStatus,
    reference,
}: {
    showStatus?: boolean;
    reference: 'patients' | 'dentists';
}) => {
    const { data, error, isPending } = useListContext();
    if (isPending || error) return null;
    return (
        <Box mt={2}>
            <MessageCreate showStatus={showStatus} reference={reference} />
            {data && (
                <Stack mt={2} gap={1}>
                    {data.map((note, index) => (
                        <React.Fragment key={index}>
                            <Message
                                note={note}
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
