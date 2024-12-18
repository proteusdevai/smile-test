import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetIdentity, useGetList } from 'react-admin';
import { ConsultCardContent } from './ConsultCard';
import { Consult } from '../types';
import { DialogCloseButton } from '../misc/DialogCloseButton';

export const ConsultArchivedList = () => {
    const { identity } = useGetIdentity();
    const {
        data: archivedLists,
        total,
        isPending,
    } = useGetList('consults', {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'archived_at', order: 'DESC' },
        filter: { 'archived_at@not.is': null },
    });
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (!isPending && total === 0) {
            setOpenDialog(false);
        }
    }, [isPending, total]);

    useEffect(() => {
        setOpenDialog(false);
    }, [archivedLists]);

    if (!identity || isPending || !total || !archivedLists) return null;

    // Group archived lists by date
    const archivedListsByDate: { [date: string]: Consult[] } =
        archivedLists.reduce(
            (acc, consult) => {
                const date = new Date(consult.archived_at).toDateString();
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(consult);
                return acc;
            },
            {} as { [date: string]: Consult[] }
        );

    return (
        <>
            <Button
                variant="text"
                onClick={() => setOpenDialog(true)}
                sx={{ my: 1 }}
            >
                View archived consults
            </Button>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth="lg"
            >
                <DialogCloseButton onClose={() => setOpenDialog(false)} />
                <DialogTitle>Archived Consults</DialogTitle>
                <DialogContent>
                    <Stack gap={2}>
                        {Object.entries(archivedListsByDate).map(
                            ([date, consults]) => (
                                <Stack key={date} gap={1}>
                                    <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                    >
                                        {getRelativeTimeString(date)}
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {consults.map((consult: Consult) => (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                key={consult.id}
                                            >
                                                <ConsultCardContent consult={consult} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Stack>
                            )
                        )}
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

export function getRelativeTimeString(dateString: string): string {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diff = date.getTime() - today.getTime();
    const unitDiff = Math.round(diff / (1000 * 60 * 60 * 24));

    // Check if the date is more than one week old
    if (Math.abs(unitDiff) > 7) {
        return new Intl.DateTimeFormat(undefined, {
            day: 'numeric',
            month: 'long',
        }).format(date);
    }

    // Intl.RelativeTimeFormat for dates within the last week
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    return ucFirst(rtf.format(unitDiff, 'day'));
}

function ucFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
