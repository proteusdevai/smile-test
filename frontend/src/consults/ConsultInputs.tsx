import {
    Divider,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    AutocompleteArrayInput,
    AutocompleteInput,
    DateInput,
    NumberInput,
    ReferenceArrayInput,
    ReferenceInput,
    required,
    SelectInput,
    TextInput,
    useCreate,
    useGetIdentity,
    useNotify,
} from 'react-admin';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { patientInputText, patientOptionText } from '../misc/PatientOption';

const validateRequired = required();

export const ConsultInputs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Stack gap={4} p={1}>
            <ConsultInfoInputs />

            <Stack gap={4} flexDirection={isMobile ? 'column' : 'row'}>
                <ConsultLinkedToInputs />
                <Divider
                    orientation={isMobile ? 'horizontal' : 'vertical'}
                    flexItem
                />
                <ConsultMiscInputs />
            </Stack>
        </Stack>
    );
};

const ConsultInfoInputs = () => {
    return (
        <Stack gap={1} flex={1}>
            <TextInput
                source="name"
                label="Consult name"
                validate={validateRequired}
                helperText={false}
            />
            <TextInput
                source="description"
                multiline
                rows={3}
                helperText={false}
            />
        </Stack>
    );
};

const ConsultLinkedToInputs = () => {
    const [create] = useCreate();
    const notify = useNotify();
    const { identity } = useGetIdentity();

    return (
        <Stack gap={1} flex={1}>
            <Typography variant="subtitle1">Linked to</Typography>

            <ReferenceArrayInput
                source="patient_id"
                reference="patients_summary"
            >
                <AutocompleteArrayInput
                    label="Patients"
                    optionText={patientOptionText}
                    inputText={patientInputText}
                    helperText={false}
                />
            </ReferenceArrayInput>
        </Stack>
    );
};

const ConsultMiscInputs = () => {
    const { stages, consultCategories } = useConfigurationContext();
    return (
        <Stack gap={1} flex={1}>
            <Typography variant="subtitle1">Misc</Typography>

            <SelectInput
                source="category"
                label="Category"
                choices={consultCategories.map(type => ({
                    id: type,
                    name: type,
                }))}
                helperText={false}
            />
            <NumberInput
                source="amount"
                defaultValue={0}
                validate={validateRequired}
                helperText={false}
            />
            <DateInput
                source="expected_closing_date"
                fullWidth
                validate={[validateRequired]}
                helperText={false}
                inputProps={{ max: '9999-12-31' }}
                defaultValue={new Date().toISOString().split('T')[0]}
            />
            <SelectInput
                source="stage"
                choices={stages.map(stage => ({
                    id: stage.value,
                    name: stage.label,
                }))}
                validate={validateRequired}
                defaultValue="opportunity"
                helperText={false}
            />
        </Stack>
    );
};
