import * as React from 'react';
import { Card, Box, Stack, Typography } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { AddTask } from '../tasks/AddTask';
import { getDay } from 'date-fns';
import { TasksListFilter } from './TasksListFilter';
import { TasksListEmpty } from './TasksListEmpty';

const today = new Date();

export const TasksList = () => {
    return (
        <Stack>
            <Box display="flex" alignItems="center" mb={1}>
                <Box mr={1} display="flex">
                    <AssignmentTurnedInIcon
                        color="disabled"
                        fontSize="medium"
                    />
                </Box>
                <Typography variant="h5" color="textSecondary">
                    Upcoming Tasks
                </Typography>
                <AddTask display="icon" selectPatient />
            </Box>
            <Card sx={{ p: 2 }}>
                <Stack>
                    <TasksListEmpty />
                    <TasksListFilter title="Tasks" />
                </Stack>
            </Card>
        </Stack>
    );
};
