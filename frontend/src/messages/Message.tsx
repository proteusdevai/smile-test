
import ContentSave from '@mui/icons-material/Save';
import {
    Box,
    Button,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import {
    Form,
    ReferenceField,
    useDelete,
    useNotify,
    useResourceContext,
    useUpdate,
    WithRecord,
} from 'react-admin';
import { FieldValues, SubmitHandler } from 'react-hook-form';

import { Message as MessageData } from '../types';
import { MessageAttachments } from './MessageAttachments';
import { MessageInputs } from './MessageInputs';

export const Message = ({
    showStatus,
    message,
}: {
    showStatus?: boolean;
    message: MessageData;
    isLast: boolean;
}) => {
    const [isHover, setHover] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const resource = useResourceContext();
    const notify = useNotify();

    const [update, { isPending }] = useUpdate();

    const [deteleMessage] = useDelete(
        resource,
        { id: message.id, previousData: message },
        {
            mutationMode: 'undoable',
            onSuccess: () => {
                notify('Message deleted', { type: 'info', undoable: true });
            },
        }
    );

    const handleDelete = () => {
        deteleMessage();
    };

    const handleEnterEditMode = () => {
        setEditing(!isEditing);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setHover(false);
    };

    const handleMessageUpdate: SubmitHandler<FieldValues> = values => {
        update(
            resource,
            { id: message.id, data: values, previousData: message },
            {
                onSuccess: () => {
                    setEditing(false);
                    setHover(false);
                },
            }
        );
    };

    return (
        <Box
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            pb={1}
        >
            <Stack direction="row" spacing={1} alignItems="center" width="100%">
                <Typography color="text.secondary" variant="body2">
                    <ReferenceField
                        source="sender_id"
                        reference={
                            message.sender_type === 'patient'
                                ? 'patients'
                                : 'dentists'
                        }
                        link="show"
                    >
                        {message.sender_type === 'patient' ? (
                            <WithRecord
                                render={record =>
                                    `${record.first_name} ${record.last_name}`
                                }
                            />
                        ) : (
                            <WithRecord
                                render={record =>
                                    `${record.first_name} ${record.last_name}`
                                }
                            />
                        )}
                    </ReferenceField>{' '}
                    sent a message to{' '}
                    <ReferenceField
                        source="receiver_id"
                        reference={
                            message.sender_type === 'patient'
                                ? 'dentists'
                                : 'patients'
                        }
                        link="show"
                    >
                        {message.sender_type === 'patient' ? (
                            <WithRecord
                                render={record =>
                                    `${record.first_name} ${record.last_name}`
                                }
                            />
                        ) : (
                            <WithRecord
                                render={record =>
                                    `${record.first_name} ${record.last_name}`
                                }
                            />
                        )}
                    </ReferenceField>{' '}
                    on{' '}
                    <Typography
                        color="textSecondary"
                        variant="body2"
                        component="span"
                    >
                        {new Date(message.created_at).toLocaleString()}
                    </Typography>
                </Typography>
            </Stack>

            {isEditing ? (
                <Form onSubmit={handleMessageUpdate} record={message}>
                    <MessageInputs showStatus={showStatus} edition />
                    <Box display="flex" justifyContent="flex-start" mt={1}>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={isPending}
                            startIcon={<ContentSave />}
                        >
                            Update Message
                        </Button>
                        <Button
                            sx={{ ml: 1 }}
                            onClick={handleCancelEdit}
                            color="primary"
                        >
                            Cancel
                        </Button>
                    </Box>
                </Form>
            ) : (
                <Stack
                    sx={{
                        paddingTop: '0.5em',
                        display: 'flex',
                        '& p:empty': {
                            minHeight: '0.75em',
                        },
                    }}
                >
                    {message.text
                        ?.split('\n')
                        .map((paragraph: string, index: number) => (
                            <Typography
                                component="p"
                                variant="body2"
                                lineHeight={1.5}
                                margin={0}
                                key={index}
                            >
                                {paragraph}
                            </Typography>
                        ))}

                    {message.attachments && (
                        <MessageAttachments message={message} />
                    )}
                </Stack>
            )}
        </Box>
    );
};
