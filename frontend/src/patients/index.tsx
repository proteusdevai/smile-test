/* eslint-disable import/no-anonymous-default-export */
import { PatientShow } from './PatientShow';
import { PatientList } from './PatientList';
import { PatientEdit } from './PatientEdit';
import { PatientCreate } from './PatientCreate';
import { Patient } from '../types';

export default {
    list: PatientList,
    show: PatientShow,
    edit: PatientEdit,
    create: PatientCreate,
    recordRepresentation: (record: Patient) =>
        record?.first_name + ' ' + record?.last_name,
};
