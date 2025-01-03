import { Alert, Divider, Skeleton, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Identifier, useDataProvider, useGetIdentity } from 'react-admin';

import { AppDataProvider } from '../providers/types';
import { ActivityLogContext } from './ActivityLogContext';
import { ActivityLogIterator } from './ActivityLogIterator';

type ActivityLogProps = {
    patientId?: Identifier;
    pageSize?: number;
    context?: 'patient' | 'consult' | 'all';
};

export function ActivityLog({
    pageSize = 10,
    context = 'all',
}: ActivityLogProps) {
    const { identity } = useGetIdentity();
    const dataProvider = useDataProvider<AppDataProvider>();
    const { data, isPending, error } = useQuery({
        queryKey: ['activityLog'],
        queryFn: () => {
            if (!identity) {
                throw new Error('User is not authenticated');
            }
            return dataProvider.getActivityLog(identity);
        },
    });

    if (isPending) {
        return (
            <Stack mt={0.5}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Stack spacing={2} sx={{ mt: 1 }} key={index}>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ alignItems: 'center' }}
                        >
                            <Skeleton
                                variant="circular"
                                width={20}
                                height={20}
                            />
                            <Skeleton width="100%" />
                        </Stack>
                        <Skeleton variant="rectangular" height={50} />
                        <Divider />
                    </Stack>
                ))}
            </Stack>
        );
    }

    if (error) {
        //console.info(error);
        return <Alert severity="error">Failed to load activity log</Alert>;
    }

    return (
        <ActivityLogContext.Provider value={context}>
            <ActivityLogIterator activities={data} pageSize={pageSize} />
        </ActivityLogContext.Provider>
    );
}
