import {
    CreateBase,
    Form,
    Identifier,
    RaRecord,
    SaveButton,
    useGetIdentity,
    useListContext,
    useNotify,
    useRecordContext,
    useResourceContext,
    useUpdate,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';

import { Stack } from '@mui/material';
import { MessageInputs } from './MessageInputs';
import { getCurrentDate } from './utils';

export const MessageCreate = ({ showStatus }: { showStatus?: boolean }) => {
    const record = useRecordContext(); // The receiver's record
    const { identity } = useGetIdentity(); // The logged-in user's identity

    if (!record || !identity) return null;

    return (
        <CreateBase resource="messages" redirect={false}>
            <Form>
                <MessageInputs showStatus={showStatus} />
                <Stack direction="row">
                    <MessageCreateButton record={record} />
                </Stack>
            </Form>
        </CreateBase>
    );
};

const MessageCreateButton = ({ record }: { record: RaRecord<Identifier> }) => {
    const notify = useNotify();
    const { identity } = useGetIdentity();
    const { reset } = useFormContext();
    const { refetch } = useListContext();

    if (!record || !identity) return null;
    console.info('here is the record', JSON.stringify(record, null, 2));
    const resetValues = {
        created_at: getCurrentDate(),
        text: null,
        attachments: null,
    };

    const handleSuccess = () => {
        reset(resetValues, { keepValues: false });
        refetch();
        notify('Message Sent');
    };

    return (
        <SaveButton
            type="button"
            label="Send Message"
            variant="contained"
            resource="messages"
            transform={data => {

                return {
                    ...data,
                    patient_id: 'dentist' in record ? record.id : identity.id,
                    dentist_id: 'dentist' in record ? identity.id : record.id,
                    sender_id: identity.id,
                    created_at: data.created_at || getCurrentDate(),
                };
            }}
            mutationOptions={{
                onSuccess: handleSuccess,
            }}
        />
    );
};
