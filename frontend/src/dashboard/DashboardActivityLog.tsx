import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { ActivityLog } from '../activity/ActivityLog';
import { Stack } from '@mui/material';

export function DashboardActivityLog() {
    return (
        <Stack>
            <Box display="flex" alignItems="center" mb={1}>
                <Box mr={1} display="flex">
                    <AccessTimeIcon color="disabled" fontSize="medium" />
                </Box>
                <Typography variant="h5" color="textSecondary">
                    Latest Activity
                </Typography>
            </Box>
            <Card sx={{ mb: 2, px: 2 }}>
                <ActivityLog pageSize={10} />
            </Card>
        </Stack>
    );
}
