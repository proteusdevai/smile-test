import { Button, DialogContent, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import {
    DeleteButton,
    EditBase,
    Form,
    ReferenceField,
    SaveButton,
    Toolbar,
    useNotify,
    useRecordContext,
    useRedirect,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { DialogCloseButton } from '../misc/DialogCloseButton';
import { Consult } from '../types';
import { ConsultInputs } from './ConsultInputs';

export const ConsultEdit = ({ open, id }: { open: boolean; id?: string }) => {
    const redirect = useRedirect();
    const notify = useNotify();

    const handleClose = () => {
        redirect('/consults', undefined, undefined, undefined, {
            _scrollToTop: false,
        });
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
            {!!id ? (
                <EditBase
                    id={id}
                    mutationMode="pessimistic"
                    mutationOptions={{
                        onSuccess: () => {
                            notify('Consult updated');
                            redirect(
                                `/consults/${id}/show`,
                                undefined,
                                undefined,
                                undefined,
                                {
                                    _scrollToTop: false,
                                }
                            );
                        },
                    }}
                >
                    <DialogCloseButton onClose={handleClose} top={13} />
                    <EditHeader />
                    <Form>
                        <DialogContent>
                            <ConsultInputs />
                        </DialogContent>
                        <EditToolbar />
                    </Form>
                </EditBase>
            ) : null}
        </Dialog>
    );
};

function EditHeader() {
    const consult = useRecordContext<Consult>();
    if (!consult) {
        return null;
    }

    return (
        <DialogTitle
            sx={{
                paddingBottom: 0,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
            >
                <Stack direction="row" alignItems="center" gap={2}>
                    <Typography variant="h6">
                        Edit {consult.name} consult
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ pr: 3 }}>
                    <Button
                        component={Link}
                        to={`/deals/${consult.id}/show`}
                        size="small"
                    >
                        Back to consult
                    </Button>
                </Stack>
            </Stack>
        </DialogTitle>
    );
}

function EditToolbar() {
    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SaveButton />
            <DeleteButton mutationMode="undoable" />
        </Toolbar>
    );
}
