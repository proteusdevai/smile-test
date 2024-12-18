import { useGetIdentity, useRecordContext } from 'react-admin';
import { Patient } from '../types';

export const PatientName = ({ patient }: { patient?: Patient }) => {
    const { identity, isPending } = useGetIdentity();
    const patientFromContext = useRecordContext<Patient>();
    const finalPatient = patient || patientFromContext;
    if (isPending || !finalPatient) return null;
    return finalPatient.id === identity?.id
        ? 'You'
        : `${finalPatient.first_name} ${finalPatient.last_name}`;
};
