import {
    ListContextProvider,
    ResourceContextProvider,
    useGetIdentity,
    useGetList,
    useList,
} from 'react-admin';
import { Link, Stack, Typography } from '@mui/material';

import { TasksIterator } from '../tasks/TasksIterator';

export const TasksListFilter = ({ title }: { title: string }) => {
    const { identity } = useGetIdentity();

    const {
        data: tasks,
        total,
        isPending,
    } = useGetList(
        'tasks',
        {
            filter: {
                dentist_id: identity?.id,
            },
        },
        { enabled: !!identity }
    );

    console.info(
        'Received following tasks:',
        JSON.stringify({ tasks, total }, null, 2)
    );

    const listContext = useList({
        data: tasks,
        isPending,
        resource: 'tasks',
        perPage: 5,
    });

    return (
        <Stack>
            <Typography variant="overline">{title}</Typography>
            <ResourceContextProvider value="tasks">
                <ListContextProvider value={listContext}>
                    <TasksIterator showPatient sx={{ pt: 0, pb: 0 }} />
                </ListContextProvider>
            </ResourceContextProvider>
            {typeof total === 'number' && total > listContext.perPage && (
                <Stack justifyContent="flex-end" direction="row">
                    <Link
                        href="#"
                        onClick={e => {
                            listContext.setPerPage(listContext.perPage + 5);
                            e.preventDefault();
                        }}
                        variant="body2"
                    >
                        Load more
                    </Link>
                </Stack>
            )}
        </Stack>
    );
};
