/* eslint-disable import/no-anonymous-default-export */
import { PatientShow } from './PatientShow';
import { PatientList } from './PatientList';
import { PatientEdit } from './PatientEdit';
import { PatientCreate } from './PatientCreate';
import { Contact } from '../types';

export default {
    list: PatientList,
    show: PatientShow,
    edit: PatientEdit,
    create: PatientCreate,
    recordRepresentation: (record: Contact) =>
        record?.first_name + ' ' + record?.last_name,
};
