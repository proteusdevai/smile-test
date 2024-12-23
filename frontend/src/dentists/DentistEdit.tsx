import { Card, Container, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import {
    SaveButton,
    SimpleForm,
    Toolbar,
    useDataProvider,
    useEditController,
    useNotify,
    useRecordContext,
    useRedirect,
} from 'react-admin';
import { SubmitHandler } from 'react-hook-form';
import { AppDataProvider } from '../providers/types';
import { Dentist, DentistFormData } from '../types';
import { DentistInputs } from './DentistInputs';

function EditToolbar() {
    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SaveButton />
        </Toolbar>
    );
}

export function DentistEdit() {
    const { record } = useEditController();

    const dataProvider = useDataProvider<AppDataProvider>();
    const notify = useNotify();
    const redirect = useRedirect();

    const { mutate } = useMutation({
        mutationKey: ['signup'],
        mutationFn: async (data: DentistFormData) => {
            if (!record) {
                throw new Error('Record not found');
            }
            return dataProvider.dentistUpdate(record.id, data);
        },
        onSuccess: () => {
            redirect('/dentists');
        },
        onError: () => {
            notify('An error occurred. Please try again.');
        },
    });

    const onSubmit: SubmitHandler<DentistFormData> = async data => {
        mutate(data);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Card>
                <SimpleForm
                    toolbar={<EditToolbar />}
                    onSubmit={onSubmit as SubmitHandler<any>}
                    record={record}
                >
                    <DentistEditTitle />
                    <DentistInputs />
                </SimpleForm>
            </Card>
        </Container>
    );
}

const DentistEditTitle = () => {
    const record = useRecordContext<Dentist>();
    if (!record) return null;
    return (
        <Typography variant="h6">
            Edit {record?.first_name} {record?.last_name}
        </Typography>
    );
};
