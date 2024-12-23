import { Collapse, Stack } from '@mui/material';
import { FileField, FileInput, TextInput } from 'react-admin';

export const NoteInputs = ({
    edition,
}: {
    showStatus?: boolean;
    edition?: boolean;
}) => {
    const displayMore = true;
    return (
        <>
            <TextInput
                source="text"
                label={edition ? 'Edit note' : 'Add a message'}
                variant="filled"
                size="small"
                multiline
                minRows={3}
                helperText={false}
            />
            <Collapse in={displayMore}>
                <Stack gap={1} mt={1}>
                    <FileInput source="attachments" multiple>
                        <FileField source="src" title="title" />
                    </FileInput>
                </Stack>
            </Collapse>
        </>
    );
};
