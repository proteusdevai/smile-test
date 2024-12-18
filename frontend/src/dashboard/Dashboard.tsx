import { Grid, Stack } from '@mui/material';
import { DashboardActivityLog } from './DashboardActivityLog';
import { ConsultsChart } from './ConsultsChart';
import { TasksList } from './TasksList';

export const Dashboard = () => {

    return (
        <Grid container spacing={2} mt={1} rowGap={4}>
            <Grid item xs={12} md={8}>
                <Stack gap={4}>
                    <ConsultsChart />
                    <DashboardActivityLog />
                </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
                <TasksList />
            </Grid>
        </Grid>
    );
};
