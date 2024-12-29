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
    const resource = useResourceContext(); // Current resource context
    const record = useRecordContext(); // The receiver's record
    const { identity } = useGetIdentity(); // The logged-in user's identity

    if (!record || !identity) return null;

    return (
        <CreateBase resource={resource} redirect={false}>
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
    const [update] = useUpdate();
    const notify = useNotify();
    const { identity } = useGetIdentity();
    const { reset } = useFormContext();
    const { refetch } = useListContext();

    if (!record || !identity) return null;

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
            transform={data => {
                const isPatientSender = identity.role === 'patient';

                return {
                    ...data,
                    patient: isPatientSender ? identity.id : record.patient_id,
                    dentist: isPatientSender ? record.dentist_id : identity.id,
                    sender_id: identity.id,
                    sender_type: isPatientSender ? 'patient' : 'dentist',
                    created_at: data.created_at || getCurrentDate(),
                };
            }}
            mutationOptions={{
                onSuccess: handleSuccess,
            }}
        />
    );
};
