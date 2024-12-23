import { ImageList, ImageListItem, Stack } from '@mui/material';
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
    const otherAttachments = message.attachments.filter(
        (attachment: AttachmentMessage) => !isImageMimeType(attachment.type)
    );

    return (
        <Stack direction="column">
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
        </Stack>
    );
};

const isImageMimeType = (mimeType?: string): boolean => {
    if (!mimeType) {
        return false;
    }
    return mimeType.startsWith('image/');
};
