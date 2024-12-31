import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {
    Box,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Tooltip,
} from '@mui/material';
import { useState } from 'react';
import {
    AutocompleteInput,
    CreateBase,
    DateInput,
    Form,
    RecordRepresentation,
    ReferenceInput,
    SaveButton,
    SelectInput,
    TextInput,
    Toolbar,
    required,
    useDataProvider,
    useGetIdentity,
    useNotify,
    useRecordContext,
    useUpdate,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { patientInputText, patientOptionText } from '../misc/PatientOption';
import { DialogCloseButton } from '../misc/DialogCloseButton';
import { useConfigurationContext } from '../root/ConfigurationContext';

export const AddTask = ({
    selectPatient,
    display = 'chip',
}: {
    selectPatient?: boolean;
    display?: 'chip' | 'icon';
}) => {
    const { identity } = useGetIdentity();
    const dataProvider = useDataProvider();
    const [update] = useUpdate();
    const notify = useNotify();
    const { taskTypes } = useConfigurationContext();
    const patient = useRecordContext();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleSuccess = async (data: any) => {
        setOpen(false);
        const patient = await dataProvider.getOne('patients', {
            id: data.patient_id,
        });
        if (!patient.data) return;

        await update('patients', {
            id: patient.data.id,
            data: { last_seen: new Date().toISOString() },
            previousData: patient.data,
        });

        notify('Task added');
    };

    if (!identity) return null;

    return (
        <>
            {display === 'icon' ? (
                <Tooltip title="Create task">
                    <IconButton
                        size="small"
                        sx={{
                            color: 'text.secondary',
                            ml: 'auto',
                        }}
                        component={Link}
                        to={'#'}
                        onClick={handleOpen}
                    >
                        <ControlPointIcon fontSize="inherit" color="primary" />
                    </IconButton>
                </Tooltip>
            ) : (
                <Box mt={2} mb={2}>
                    <Chip
                        icon={<ControlPointIcon />}
                        size="small"
                        variant="outlined"
                        onClick={handleOpen}
                        label="Add task"
                        color="primary"
                    />
                </Box>
            )}

            <CreateBase
                resource="tasks"
                record={{
                    type: 'None',
                    patient_id: patient?.id,
                    due_date: new Date().toISOString().slice(0, 10),
                    dentist_id: identity.id,
                }}
                transform={data => {
                    const dueDate = new Date(data.due_date);
                    dueDate.setHours(0, 0, 0, 0);
                    data.due_date = dueDate.toISOString();
                    return {
                        ...data,
                        due_date: new Date(data.due_date).toISOString(),
                    };
                }}
                mutationOptions={{ onSuccess: handleSuccess }}
            >
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="form-dialog-title"
                    fullWidth
                    disableRestoreFocus
                    maxWidth="sm"
                >
                    <Form>
                        <DialogCloseButton onClose={() => setOpen(false)} />
                        <DialogTitle id="form-dialog-title">
                            {!selectPatient
                                ? 'Create a new task for '
                                : 'Create a new task'}
                            {!selectPatient && (
                                <RecordRepresentation
                                    record={patient}
                                    resource="patients"
                                />
                            )}
                        </DialogTitle>
                        <DialogContent>
                            <Stack gap={2}>
                                <TextInput
                                    autoFocus
                                    source="text"
                                    label="Description"
                                    validate={required()}
                                    multiline
                                    sx={{ margin: 0 }}
                                    helperText={false}
                                />
                                {selectPatient && (
                                    <ReferenceInput
                                        source="patient_id"
                                        reference="patients_summary"
                                    >
                                        <AutocompleteInput
                                            label="Patient"
                                            optionText={patientOptionText}
                                            inputText={patientInputText}
                                            helperText={false}
                                            validate={required()}
                                            TextFieldProps={{
                                                margin: 'none',
                                            }}
                                        />
                                    </ReferenceInput>
                                )}

                                <Stack direction="row" spacing={1}>
                                    <DateInput
                                        source="due_date"
                                        validate={required()}
                                        helperText={false}
                                    />
                                    <SelectInput
                                        source="type"
                                        validate={required()}
                                        choices={taskTypes.map(type => ({
                                            id: type,
                                            name: type,
                                        }))}
                                        helperText={false}
                                    />
                                </Stack>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 0 }}>
                            <Toolbar
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <SaveButton onClick={() => setOpen(false)} />
                            </Toolbar>
                        </DialogActions>
                    </Form>
                </Dialog>
            </CreateBase>
        </>
    );
};
