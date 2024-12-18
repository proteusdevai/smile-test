import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { format, isValid } from 'date-fns';
import {
    DeleteButton,
    EditButton,
    ReferenceArrayField,
    ReferenceField,
    ReferenceManyField,
    ShowBase,
    useDataProvider,
    useNotify,
    useRecordContext,
    useRedirect,
    useRefresh,
    useUpdate,
} from 'react-admin';

import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { DialogCloseButton } from '../misc/DialogCloseButton';
import { NotesIterator } from '../notes';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { Consult } from '../types';
import { PatientList } from './PatientList';
import { findConsultLabel } from './consult';

export const ConsultShow = ({ open, id }: { open: boolean; id?: string }) => {
    const redirect = useRedirect();
    const handleClose = () => {
        redirect('list', 'consults');
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            sx={{
                '& .MuiDialog-container': {
                    alignItems: 'flex-start',
                },
            }}
        >
            <DialogContent sx={{ padding: 0 }}>
                {!!id ? (
                    <ShowBase id={id}>
                        <ConsultShowContent handleClose={handleClose} />
                    </ShowBase>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};

const CLOSE_TOP_WITH_ARCHIVED = 14;
const ConsultShowContent = ({ handleClose }: { handleClose: () => void }) => {
    const { stages } = useConfigurationContext();
    const record = useRecordContext<Consult>();
    if (!record) return null;

    return (
        <>
            <DialogCloseButton
                onClose={handleClose}
                top={record.archived_at ? CLOSE_TOP_WITH_ARCHIVED : 16}
                right={10}
                color={record.archived_at ? 'white' : undefined}
            />
            <Stack gap={1}>
                {record.archived_at ? <ArchivedTitle /> : null}
                <Box display="flex" p={2}>
                    <Box flex="1">
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            mb={4}
                        >
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Typography variant="h5">
                                    {record.name}
                                </Typography>
                            </Stack>
                            <Stack
                                gap={1}
                                direction="row"
                                pr={record.archived_at ? 0 : 6}
                            >
                                {record.archived_at ? (
                                    <>
                                        <UnarchiveButton record={record} />
                                        <DeleteButton />
                                    </>
                                ) : (
                                    <>
                                        <ArchiveButton record={record} />
                                        <EditButton scrollToTop={false} />
                                    </>
                                )}
                            </Stack>
                        </Stack>

                        <Box display="flex" m={2}>
                            <Box display="flex" mr={5} flexDirection="column">
                                <Typography
                                    color="textSecondary"
                                    variant="caption"
                                >
                                    Expected closing date
                                </Typography>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={1}
                                >
                                    <Typography variant="body2">
                                        {isValid(
                                            new Date(record.expected_visit_date)
                                        )
                                            ? format(
                                                  new Date(
                                                      record.expected_visit_date
                                                  ),
                                                  'PP'
                                              )
                                            : 'Invalid date'}
                                    </Typography>
                                    {new Date(record.expected_visit_date) <
                                    new Date() ? (
                                        <Chip
                                            label="Past"
                                            color="error"
                                            size="small"
                                        />
                                    ) : null}
                                </Stack>
                            </Box>

                            <Box display="flex" mr={5} flexDirection="column">
                                <Typography
                                    color="textSecondary"
                                    variant="caption"
                                >
                                    Budget
                                </Typography>
                                <Typography variant="body2">
                                    {record.amount.toLocaleString('en-US', {
                                        notation: 'compact',
                                        style: 'currency',
                                        currency: 'USD',
                                        currencyDisplay: 'narrowSymbol',
                                        minimumSignificantDigits: 3,
                                    })}
                                </Typography>
                            </Box>

                            {record.category && (
                                <Box
                                    display="flex"
                                    mr={5}
                                    flexDirection="column"
                                >
                                    <Typography
                                        color="textSecondary"
                                        variant="caption"
                                    >
                                        Category
                                    </Typography>
                                    <Typography variant="body2">
                                        {record.category}
                                    </Typography>
                                </Box>
                            )}

                            <Box display="flex" mr={5} flexDirection="column">
                                <Typography
                                    color="textSecondary"
                                    variant="caption"
                                >
                                    Stage
                                </Typography>
                                <Typography variant="body2">
                                    {findConsultLabel(stages, record.stage)}
                                </Typography>
                            </Box>
                        </Box>

                        {
                            <Box m={2}>
                                <Box
                                    display="flex"
                                    mr={5}
                                    flexDirection="column"
                                    minHeight={48}
                                >
                                    <Typography
                                        color="textSecondary"
                                        variant="caption"
                                    >
                                        Contacts
                                    </Typography>
                                    <ReferenceArrayField
                                        source="patient_id"
                                        reference="patients_summary"
                                    >
                                        <PatientList />
                                    </ReferenceArrayField>
                                </Box>
                            </Box>
                        }

                        {record.description && (
                            <Box m={2} sx={{ whiteSpace: 'pre-line' }}>
                                <Typography
                                    color="textSecondary"
                                    variant="caption"
                                >
                                    Description
                                </Typography>
                                <Typography variant="body2">
                                    {record.description}
                                </Typography>
                            </Box>
                        )}

                        <Box m={2}>
                            <Divider />
                            <ReferenceManyField
                                target="consult_id"
                                reference="consultNotes"
                                sort={{ field: 'date', order: 'DESC' }}
                            >
                                <NotesIterator reference="consults" />
                            </ReferenceManyField>
                        </Box>
                    </Box>
                </Box>
            </Stack>
        </>
    );
};

const ArchivedTitle = () => (
    <Box
        sx={{
            background: theme => theme.palette.warning.main,
            px: 3,
            py: 2,
        }}
    >
        <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
                color: theme => theme.palette.warning.contrastText,
            }}
        >
            Archived Consult
        </Typography>
    </Box>
);

const ArchiveButton = ({ record }: { record: Consult }) => {
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();
    const refresh = useRefresh();
    const handleClick = () => {
        update(
            'consults',
            {
                id: record.id,
                data: { archived_at: new Date().toISOString() },
                previousData: record,
            },
            {
                onSuccess: () => {
                    redirect('list', 'consults');
                    notify('Consult archived', {
                        type: 'info',
                        undoable: false,
                    });
                    refresh();
                },
                onError: () => {
                    notify('Error: consult not archived', { type: 'error' });
                },
            }
        );
    };

    return (
        <Button onClick={handleClick} startIcon={<ArchiveIcon />} size="small">
            Archive
        </Button>
    );
};

const UnarchiveButton = ({ record }: { record: Consult }) => {
    const dataProvider = useDataProvider();
    const redirect = useRedirect();
    const notify = useNotify();
    const refresh = useRefresh();

    const { mutate } = useMutation({
        mutationFn: () => dataProvider.unarchiveDeal(record),
        onSuccess: () => {
            redirect('list', 'consults');
            notify('Consult unarchived', {
                type: 'info',
                undoable: false,
            });
            refresh();
        },
        onError: () => {
            notify('Error: consult not unarchived', { type: 'error' });
        },
    });

    const handleClick = () => {
        mutate();
    };

    return (
        <Button
            onClick={handleClick}
            startIcon={<UnarchiveIcon />}
            size="small"
        >
            Send back to the board
        </Button>
    );
};
