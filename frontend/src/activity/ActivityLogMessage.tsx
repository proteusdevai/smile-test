import {
    ImageList,
    ImageListItem,
    ListItem,
    Stack,
    Typography,
} from '@mui/material';
import { ReactNode, Fragment } from 'react';
import { AttachmentNote } from '../types';

type ActivityLogMessageCreatedProps = {
    header: ReactNode;
    text: string;
    attachments?: AttachmentNote[];
};

export function ActivityLogMessage({
    header,
    text,
    attachments,
}: ActivityLogMessageCreatedProps) {
    if (!text) {
        return null;
    }
    const paragraphs = text.split('\n');
    if (attachments !== undefined) {
        const imageAttachments = attachments.filter(
            (attachment: AttachmentNote) => isImageMimeType(attachment.type)
        );
        return (
            <ListItem disableGutters>
                <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                        width="100%"
                    >
                        {header}
                    </Stack>
                    <div>
                        <Typography
                            variant="body2"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: '3',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {paragraphs.map(
                                (paragraph: string, index: number) => (
                                    <Fragment key={index}>
                                        {paragraph}
                                        {index < paragraphs.length - 1 && (
                                            <br />
                                        )}
                                    </Fragment>
                                )
                            )}
                        </Typography>
                    </div>
                    <Stack direction="column">
                        {imageAttachments.length > 0 && (
                            <ImageList cols={4} gap={8}>
                                {imageAttachments.map(
                                    (
                                        attachment: AttachmentNote,
                                        index: number
                                    ) => (
                                        <ImageListItem key={index}>
                                            <img
                                                src={attachment.src}
                                                alt={attachment.title}
                                                style={{
                                                    width: '100px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                    objectPosition: 'left',
                                                    border: '1px solid #e0e0e0',
                                                }}
                                                onClick={() =>
                                                    window.open(
                                                        attachment.src,
                                                        '_blank'
                                                    )
                                                }
                                            />
                                        </ImageListItem>
                                    )
                                )}
                            </ImageList>
                        )}
                    </Stack>
                </Stack>
            </ListItem>
        );
    } else {
        return (
            <ListItem disableGutters>
                <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                        width="100%"
                    >
                        {header}
                    </Stack>
                    <div>
                        <Typography
                            variant="body2"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: '3',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {paragraphs.map(
                                (paragraph: string, index: number) => (
                                    <Fragment key={index}>
                                        {paragraph}
                                        {index < paragraphs.length - 1 && (
                                            <br />
                                        )}
                                    </Fragment>
                                )
                            )}
                        </Typography>
                    </div>
                </Stack>
            </ListItem>
        );
    }
}

const isImageMimeType = (mimeType?: string): boolean => {
    if (!mimeType) {
        return false;
    }
    return mimeType.startsWith('image/');
};
