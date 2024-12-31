import * as React from 'react';
import { useListContext } from 'react-admin';
import { isAfter } from 'date-fns';
import { List, SxProps } from '@mui/material';

import { Task } from './Task';

export const TasksIterator = ({
    showPatient,
    sx,
}: {
    showPatient?: boolean;
    sx?: SxProps;
}) => {
    const { data, error, isPending } = useListContext();
    console.info('TRYING TO PULL PATIENT SPECIFIC TASKS');
    if (isPending || error || data.length === 0) return null;
    console.info('TRYING TO PULL PATIENT ccccc SPECIFIC TASKS');
    console.info('HERE IS DATA: ', JSON.stringify(data, null, 2));
    // Keep only tasks that are not done or done less than 5 minutes ago
    const tasks = data.filter(
        task =>
            !task.done_date ||
            isAfter(
                new Date(task.done_date),
                new Date(Date.now() - 5 * 60 * 1000)
            )
    );

    return (
        <List dense sx={sx}>
            {tasks.map(task => (
                <Task task={task} showPatient={showPatient} key={task.id} />
            ))}
        </List>
    );
};
