import { SvgIconComponent } from '@mui/icons-material';
import { Identifier, RaRecord } from 'react-admin';
import {
    PATIENT_CREATED,
    MESSAGE_CREATED,
    CONSULT_CREATED,
    CONSULT_NOTE_CREATED,
} from './consts';

export type SignUpData = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
};

export type DentistFormData = {
    avatar: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    administrator: boolean;
    disabled: boolean;
};

export type Dentist = {
    first_name: string;
    last_name: string;
    administrator: boolean;
    avatar?: RAFile;
    disabled?: boolean;
    user_id: string;

    /**
     * This is a copy of the user's email, to make it easier to handle by react admin
     * DO NOT UPDATE this field directly, it should be updated by the backend
     */
    email: string;

    /**
     * This is used by the fake rest provider to store the password
     * DO NOT USE this field in your code besides the fake rest provider
     * @deprecated
     */
    password?: string;
} & Pick<RaRecord, 'id'>;

export type Patient = {
    first_name: string;
    last_name: string;
    email: string;
    smile_goals: string;
    first_seen: string;
    last_seen: string;
    tags: Identifier[];
    dentist_id: Identifier;
    stage: string;
    category: string;
    phone_number: string;
    nb_tasks?: number;
} & Pick<RaRecord, 'id'>;

export type Message = {
    sender_id: Identifier;
    receiver_id: Identifier;
    sender_type: string;
    text: string;
    date: string;
    attachments?: AttachmentNote[];
} & Pick<RaRecord, 'id'>;

export type Consult = {
    name: string;
    patient_id: Identifier;
    category: string;
    stage: string;
    description: string;
    amount: number;
    created_at: string;
    updated_at: string;
    archived_at?: string;
    expected_visit_date: string;
    dentist_id: Identifier;
    index: number;
} & Pick<RaRecord, 'id'>;

export type ConsultNote = {
    consult_id: Identifier;
    text: string;
    date: string;
    dentist_id: Identifier;
    attachments?: AttachmentNote[];
} & Pick<RaRecord, 'id'>;

export type Tag = {
    name: string;
    color: string;
} & Pick<RaRecord, 'id'>;

export type Task = {
    patient_id: Identifier;
    dentist_id: Identifier;
    type: string;
    text: string;
    due_date: string;
    done_date?: string | null;
} & Pick<RaRecord, 'id'>;

export type ActivityPatientCreated = {
    type: typeof PATIENT_CREATED;
    patient_id: Identifier;
    dentist_id?: Identifier;
    patient: Patient;
    date: string;
};

export type ActivityMessageCreated = {
    type: typeof MESSAGE_CREATED;
    dentist_id: Identifier;
    message: Message;
    date: string;
};

export type ActivityConsultCreated = {
    type: typeof CONSULT_CREATED;
    patient_id: Identifier;
    dentist_id?: Identifier;
    consult: Consult;
    date: string;
};

export type ActivityConsultNoteCreated = {
    type: typeof CONSULT_NOTE_CREATED;
    dentist_id?: Identifier;
    consultNote: ConsultNote;
    date: string;
};

export type Activity = RaRecord &
    (
        | ActivityPatientCreated
        | ActivityMessageCreated
        | ActivityConsultCreated
        | ActivityConsultNoteCreated
    );

export interface RAFile {
    src: string;
    title: string;
    path?: string;
    rawFile: File;
    type?: string;
}

export type AttachmentNote = RAFile;
export interface Stage {
    value: string;
    label: string;
}
