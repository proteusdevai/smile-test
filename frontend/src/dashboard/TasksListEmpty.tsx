import { useGetIdentity, useGetList } from 'react-admin';
import { Typography } from '@mui/material';

export const TasksListEmpty = () => {
    const { identity } = useGetIdentity();

    const { total } = useGetList(
        'tasks',
        {
            pagination: { page: 1, perPage: 1 },
            filter: {
                dentist_id: identity?.id,
            },
        },
        { enabled: !!identity }
    );

    if (total) return null;

    return (
        <Typography variant="body2">
            Tasks added to your patients will appear here.
        </Typography>
    );
};
