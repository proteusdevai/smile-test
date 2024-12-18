import { LinearProgress, Stack, Typography } from '@mui/material';
import { CreateButton, useGetList } from 'react-admin';
import useAppBarHeight from '../misc/useAppBarHeight';
import { matchPath, useLocation } from 'react-router';
import { ConsultCreate } from './ConsultCreate';
import { Patient } from '../types';
import { Link } from 'react-router-dom';

export const ConsultEmpty = ({ children }: { children?: React.ReactNode }) => {
    const location = useLocation();
    const matchCreate = matchPath('/consults/create', location.pathname);
    const appbarHeight = useAppBarHeight();

    // get Patient data
    const { data: patients, isPending: patientsLoading } = useGetList<Patient>(
        'patients',
        {
            pagination: { page: 1, perPage: 1 },
        }
    );

    if (patientsLoading) return <LinearProgress />;

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            gap={3}
            sx={{
                height: `calc(100dvh - ${appbarHeight}px)`,
            }}
        >
            <img src="./img/empty.svg" alt="No consults found" />
            {patients && patients.length > 0 ? (
                <>
                    <Stack gap={0} alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                            No consults found
                        </Typography>
                        <Typography
                            variant="body2"
                            align="center"
                            color="text.secondary"
                            gutterBottom
                        >
                            It seems your consult list is empty.
                        </Typography>
                    </Stack>
                    <Stack spacing={2} direction="row">
                        <CreateButton variant="contained" label="Create deal" />
                    </Stack>
                    <ConsultCreate open={!!matchCreate} />
                    {children}
                </>
            ) : (
                <Stack gap={0} alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                        No consults found
                    </Typography>
                    <Typography
                        variant="body2"
                        align="center"
                        color="text.secondary"
                        gutterBottom
                    >
                        It seems your patient list is empty.
                        <br />
                        <Link to="/contacts/create">
                            Add your first patient
                        </Link>{' '}
                        before creating a consult.
                    </Typography>
                </Stack>
            )}
        </Stack>
    );
};
