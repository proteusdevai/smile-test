import { Card, Container, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import {
    SimpleForm,
    useDataProvider,
    useNotify,
    useRedirect,
} from 'react-admin';
import { SubmitHandler } from 'react-hook-form';
import { DataProvider } from '../providers/types';
import { DentistFormData } from '../types';
import { DentistInputs } from './DentistInputs';

export function DentistCreate() {
    const dataProvider = DataProvider;
    const notify = useNotify();
    const redirect = useRedirect();

    const { mutate } = useMutation({
        mutationKey: ['signup'],
        mutationFn: async (data: DentistFormData) => {
            return dataProvider.salesCreate(data);
        },
        onSuccess: () => {
            notify(
                'Dentist created. They will soon receive an email to set their password.'
            );
            redirect('/dentists');
        },
        onError: () => {
            notify('An error occurred while creating the dentist.', {
                type: 'error',
            });
        },
    });
    const onSubmit: SubmitHandler<DentistFormData> = async data => {
        mutate(data);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Card>
                <SimpleForm onSubmit={onSubmit as SubmitHandler<any>}>
                    <Typography variant="h6">Create a new dentist</Typography>
                    <DentistInputs />
                </SimpleForm>
            </Card>
        </Container>
    );
}
