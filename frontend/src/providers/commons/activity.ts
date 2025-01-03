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

    const dentistId = identity.id;
    //console.info('Trying to fetch activities now.');
    //console.info(dentistId);
    // Filter for messages where the dentist is involved
    const messageFilter = {
        or: [
            { dentist_id: dentistId }, // Messages sent to the dentist
        ],
    };

    // Fetch messages
    const { data: messages } = await dataProvider.getList<Message>('messages', {
        filter: messageFilter,
    });
    //console.info('Messages:', JSON.stringify(messages, null, 2));

    // Map messages to the Activity type
    return messages.map(
        (message): Activity => ({
            id: `message.${message.id}`, // Ensure an id field is present
            type: MESSAGE_CREATED,
            dentist_id: message.dentist_id,
            patient_id: message.patient_id,
            message,
            date: message.date,
        })
    );
}
