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

const foreignKeyMapping = {
    patient: 'patient_id',
    dentits: 'dentist_id',
};

export const MessageCreate = ({
    showStatus,
    reference,
}: {
    showStatus?: boolean;
    reference: 'patients | dentists';
}) => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const { identity } = useGetIdentity();

    if (!record || !identity) return null;
    return (
        <CreateBase resource={resource} redirect={false}>
            <Form>
                <MessageInputs showStatus={showStatus} />
                <Stack direction="row">
                    <MessageCreateButton
                        reference={reference}
                        record={record}
                    />
                </Stack>
            </Form>
        </CreateBase>
    );
};

const MessageCreateButton = ({
    reference,
    record,
}: {
    reference: 'patients' | 'dentists';
    record: RaRecord<Identifier>;
}) => {
    const [update] = useUpdate();
    const notify = useNotify();
    const { identity } = useGetIdentity();
    const { reset } = useFormContext();
    const { refetch } = useListContext();

    if (!record || !identity) return null;

    const resetValues: {
        date: string;
        text: null;
        attachments: null;
    } = {
        date: getCurrentDate(),
        text: null,
        attachments: null,
    };

    const handleSuccess = (data: any) => {
        reset(resetValues, { keepValues: false });
        refetch();
        update(reference, {
            id: (record && record.id) as unknown as Identifier,
            data: { last_seen: new Date().toISOString() },
            previousData: record,
        });
        notify('Nessage Sent');
    };
    return (
        <SaveButton
            type="button"
            label="Send Message"
            variant="contained"
            transform={data => ({
                ...data,
                [foreignKeyMapping[reference]]: record.id,
                dentist_id: record.patient_id,
                patient_id: record.dentist_id,
                date: data.date || getCurrentDate(),
            })}
            mutationOptions={{
                onSuccess: handleSuccess,
            }}
        />
    );
};
