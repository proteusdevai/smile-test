import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import {
    Create,
    Form,
    GetListResult,
    SaveButton,
    Toolbar,
    useDataProvider,
    useGetIdentity,
    useListContext,
    useRedirect,
} from 'react-admin';
import { DialogCloseButton } from '../misc/DialogCloseButton';
import { Consult } from '../types';
import { ConsultInputs } from './ConsultInputs';

export const ConsultCreate = ({ open }: { open: boolean }) => {
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const { data: allConsults } = useListContext<Consult>();

    const handleClose = () => {
        redirect('/consults');
    };

    const queryClient = useQueryClient();

    const onSuccess = async (consult: Consult) => {
        if (!allConsults) {
            redirect('/consults');
            return;
        }
        // increase the index of all consults in the same stage as the new consult
        // first, get the list of consults in the same stage
        const consults = allConsults.filter(
            (c: Consult) => c.stage === consult.stage && c.id !== consult.id
        );
        // update the actual consults in the database
        await Promise.all(
            consults.map(async oldConsult =>
                dataProvider.update('consults', {
                    id: oldConsult.id,
                    data: { index: oldConsult.index + 1 },
                    previousData: oldConsult,
                })
            )
        );
        // refresh the list of deals in the cache as we used dataProvider.update(),
        // which does not update the cache
        const consultsById = consults.reduce(
            (acc, c) => ({
                ...acc,
                [c.id]: { ...c, index: c.index + 1 },
            }),
            {} as { [key: string]: Consult }
        );
        const now = Date.now();
        queryClient.setQueriesData<GetListResult | undefined>(
            { queryKey: ['consults', 'getList'] },
            res => {
                if (!res) return res;
                return {
                    ...res,
                    data: res.data.map((c: Consult) => consultsById[c.id] || c),
                };
            },
            { updatedAt: now }
        );
        redirect('/consults');
    };

    const { identity } = useGetIdentity();

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <Create<Consult>
                resource="consults"
                mutationOptions={{ onSuccess }}
                sx={{ '& .RaCreate-main': { mt: 0 } }}
            >
                <DialogCloseButton onClose={handleClose} />
                <DialogTitle
                    sx={{
                        paddingBottom: 0,
                    }}
                >
                    Create a new consult
                </DialogTitle>
                <Form
                    defaultValues={{
                        dentist_id: identity?.id,
                        patient_id: 0,
                        index: 0,
                    }}
                >
                    <DialogContent>
                        <ConsultInputs />
                    </DialogContent>
                    <Toolbar>
                        <SaveButton />
                    </Toolbar>
                </Form>
            </Create>
        </Dialog>
    );
};
