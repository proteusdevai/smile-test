import {Box, Button, ImageList, ImageListItem, Stack, Typography} from '@mui/material';
import { AttachmentMessage, Message } from '../types';
import { FileField } from 'react-admin';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export const MessageAttachments = ({ message }: { message: Message }) => {
    if (!message.attachments || message.attachments.length === 0) {
        return null;
    }

    const imageAttachments = message.attachments.filter(
        (attachment: AttachmentMessage) => isImageMimeType(attachment.type)
    );

    const videoAttachments = message.attachments.filter(
        (attachment: AttachmentMessage) => isVideoMimeType(attachment.type)
    );

    const fileAttachments = message.attachments.filter(
        (attachment: AttachmentMessage) =>
            !isImageMimeType(attachment.type) &&
            !isVideoMimeType(attachment.type)
    );

    return (
        <Stack direction="column" spacing={2}>
            {/* Render image attachments */}
            {imageAttachments.length > 0 && (
                <ImageList cols={4} gap={8}>
                    {imageAttachments.map(
                        (attachment: AttachmentMessage, index: number) => (
                            <ImageListItem key={index}>
                                <img
                                    src={attachment.src}
                                    alt={attachment.title}
                                    style={{
                                        width: '200px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        objectPosition: 'left',
                                        border: '1px solid #e0e0e0',
                                    }}
                                    onClick={() =>
                                        window.open(attachment.src, '_blank')
                                    }
                                />
                            </ImageListItem>
                        )
                    )}
                </ImageList>
            )}

            {/* Render video attachments */}
            {videoAttachments.length > 0 && (
                <Box>
                    {videoAttachments.map(
                        (attachment: AttachmentMessage, index: number) => (
                            <video
                                key={index}
                                controls
                                style={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    marginBottom: '8px',
                                }}
                            >
                                <source
                                    src={attachment.src}
                                    type={attachment.type}
                                />
                                Your browser does not support the video tag.
                            </video>
                        )
                    )}
                </Box>
            )}

            {/* Render other file attachments */}
            {fileAttachments.length > 0 && (
                <Stack spacing={1}>
                    {fileAttachments.map(
                        (attachment: AttachmentMessage, index: number) => (
                            <Box key={index} display="flex" alignItems="center">
                                <Typography
                                    variant="body2"
                                    style={{ marginRight: '8px' }}
                                >
                                    {attachment.title}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() =>
                                        window.open(attachment.src, '_blank')
                                    }
                                >
                                    Download
                                </Button>
                            </Box>
                        )
                    )}
                </Stack>
            )}
        </Stack>
    );
};

const isImageMimeType = (mimeType?: string): boolean => {
    return mimeType?.startsWith('image/') || false;
};

const isVideoMimeType = (mimeType?: string): boolean => {
    return mimeType?.startsWith('video/') || false;
};
