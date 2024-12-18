import { Stack } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { Patient } from '../types';

const PatientOptionRender = () => {
    const record: Patient | undefined = useRecordContext();
    if (!record) return null;
    return (
        <Stack direction="row" gap={1} alignItems="center">
            <Stack>
                {record.first_name} {record.last_name}
            </Stack>
        </Stack>
    );
};
export const patientOptionText = <PatientOptionRender />;
export const patientInputText = (choice: {
    first_name: string;
    last_name: string;
}) => `${choice.first_name} ${choice.last_name}`;
