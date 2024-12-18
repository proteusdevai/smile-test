/* eslint-disable import/no-anonymous-default-export */
import { Dentist } from '../types';
import { DentistCreate } from './DentistCreate';
import { DentistEdit } from './DentistEdit';
import { DentistList } from './DentistList';

export default {
    list: DentistList,
    create: DentistCreate,
    edit: DentistCreate,
    recordRepresentation: (record: Dentist) =>
        `${record.first_name} ${record.last_name}`,
};
