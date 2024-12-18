import { useGetIdentity, useRecordContext } from 'react-admin';
import { Dentist } from '../types';

export const DentistName = ({ dentist }: { dentist?: Dentist }) => {
    const { identity, isPending } = useGetIdentity();
    const dentistFromContext = useRecordContext<Dentist>();
    const finalDentist = dentist || dentistFromContext;
    if (isPending || !finalDentist) return null;
    return finalDentist.id === identity?.id
        ? 'You'
        : `${finalDentist.first_name} ${finalDentist.last_name}`;
};
