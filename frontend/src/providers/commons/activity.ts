import { DataProvider, Identifier, UserIdentity } from 'react-admin';
import { MESSAGE_CREATED } from '../../consts';
import {
    Activity,
    Patient,
    ConsultNote,
    Message,
    Dentist,
    ActivityMessageCreated,
} from '../../types';
import { useGetIdentity } from 'react-admin';
export async function getActivityLog(
    dataProvider: DataProvider,
    identity: UserIdentity
): Promise<Activity[]> {
    if (!identity) {
        throw new Error('Need an identity to fetch activity logs.');
    }

    const dentistId = identity;

    // Filter for messages where the dentist is involved
    const messageFilter = {
        or: [
            { dentist_id: dentistId }, // Messages sent to the dentist
            { sender_id: dentistId, sender_type: 'dentist' }, // Messages sent by the dentist
        ],
    };

    // Fetch messages
    const { data: messages } = await dataProvider.getList<Message>('messages', {
        filter: messageFilter,
        pagination: { page: 1, perPage: 250 },
        sort: { field: 'created_at', order: 'DESC' },
    });

    // Map messages to the Activity type
    return messages.map(
        (message): Activity => ({
            id: `message.${message.id}`, // Ensure an id field is present
            type: MESSAGE_CREATED,
            dentist_id: message.dentist_id,
            patient_id: message.patient_id,
            message,
            date: message.created_at,
        })
    );
}
