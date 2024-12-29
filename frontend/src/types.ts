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
    smile_goals: string;
    phone_number?: string;
    attachments?: AttachmentMessage[];
    dentist_id: Identifier;
};

export type DentistFormData = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    administrator: boolean;
    disabled: boolean;
};

export type Dentist = {
    id: Identifier;
    first_name: string;
    last_name: string;
    administrator: boolean;
    disabled?: boolean;
    email: string;
    password?: string;
} & Pick<RaRecord, 'id'>;

export type Patient = {
    id: Identifier;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    smile_goals: string;
    first_seen?: string | null;
    last_seen?: string | null;
    tags?: number[];
    dentist_id: Identifier;
    stage: string;
    category?: string;
} & Pick<RaRecord, 'id'>;

export type Message = {
    id: number;
    patient_id: Identifier;
    dentist_id: Identifier;
    sender_id: Identifier;
    sender_type: string;
    text: string;
    title: string;
    created_at: string;
    attachments?: AttachmentMessage[];
} & Pick<RaRecord, 'id'>;

export type Consult = {
    id: number;
    name: string;
    patient_id: Identifier;
    dentist_id: Identifier;
    category: string;
    description: string;
    amount: number;
    stage: string;
    created_at: string;
    updated_at: string;
    archived_at?: string;
    expected_visit_date: string;
    index?: number | null;
} & Pick<RaRecord, 'id'>;

export type ConsultNote = {
    id: number;
    consult_id: number;
    text: string;
    date: string;
    dentist_id: Identifier;
} & Pick<RaRecord, 'id'>;

export type Tag = {
    id: number;
    name: string;
    color: string;
    dentist_id: Identifier;
} & Pick<RaRecord, 'id'>;

export type Task = {
    id: number;
    patient_id: Identifier;
    dentist_id: Identifier;
    type: string;
    text?: string;
    due_date: string;
    done_date?: string | null;
} & Pick<RaRecord, 'id'>;

export type ActivityPatientCreated = {
    type: typeof PATIENT_CREATED;
    patient_id: Identifier;
    dentist_id: Identifier;
    patient: Patient;
    date: string;
};

export type ActivityMessageCreated = {
    type: typeof MESSAGE_CREATED;
    dentist_id: Identifier;
    patient_id: Identifier;
    message: Message;
    date: string;
};

export type Activity = RaRecord & ActivityMessageCreated;

export interface RAFile {
    src: string;
    title: string;
    path: string;
    rawFile: File;
    type?: string;
}

export type AttachmentMessage = RAFile;
export interface Stage {
    value: string;
    label: string;
}
