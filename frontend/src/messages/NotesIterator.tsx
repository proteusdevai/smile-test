import * as React from 'react';
import { Box, Divider, Stack } from '@mui/material';
import { useListContext } from 'react-admin';

import { Message } from './Message';
import { NoteCreate } from './NoteCreate';

export const NotesIterator = ({
    showStatus,
    reference,
}: {
    showStatus?: boolean;
    reference: 'patients' | 'consults';
}) => {
    const { data, error, isPending } = useListContext();
    if (isPending || error) return null;
    return (
        <Box mt={2}>
            <NoteCreate showStatus={showStatus} reference={reference} />
            {data && (
                <Stack mt={2} gap={1}>
                    {data.map((note, index) => (
                        <React.Fragment key={index}>
                            <Message
                                note={note}
                                isLast={index === data.length - 1}
                                showStatus={showStatus}
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
