import { Link, Stack, Typography } from '@mui/material';
import { useListContext } from 'react-admin';
import { Link as RouterLink } from 'react-router-dom';

export const PatientList = () => {
    const { data, error, isPending } = useListContext();
    if (isPending || error) return <div style={{ height: '2em' }} />;
    return (
        <Stack direction="row" flexWrap="wrap" gap={3} mt={1}>
            {data.map(patient => (
                <Stack direction="row" key={patient.id} gap={1}>
                    <Stack>
                        <Link
                            component={RouterLink}
                            to={`/patients/${patient.id}/show`}
                            variant="body2"
                        >
                            {patient.first_name} {patient.last_name}
                        </Link>
                    </Stack>
                </Stack>
            ))}
        </Stack>
    );
};
