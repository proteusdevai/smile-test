import * as React from 'react';
import {
    Divider,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    AutocompleteInput,
    BooleanInput,
    RadioButtonGroupInput,
    ReferenceInput,
    SelectInput,
    TextInput,
    email,
    required,
    useCreate,
    useGetIdentity,
    useNotify,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { Dentist } from '../types';

import { useConfigurationContext } from '../root/ConfigurationContext';

export const PatientInputs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Stack gap={2} p={1}>
            <Stack gap={4} direction={isMobile ? 'column' : 'row'}>
                <Stack gap={4} flex={1}>
                    <PatientIdentityInputs />
                </Stack>
                <Divider
                    orientation={isMobile ? 'horizontal' : 'vertical'}
                    flexItem
                />
                <Stack gap={4} flex={1}>
                    <PatientPersonalInformationInputs />
                    <PatientMiscInputs />
                </Stack>
            </Stack>
        </Stack>
    );
};

const PatientIdentityInputs = () => {
    return (
        <Stack>
            <Typography variant="h6">Identity</Typography>
            <TextInput
                source="first_name"
                validate={required()}
                helperText={false}
            />
            <TextInput
                source="last_name"
                validate={required()}
                helperText={false}
            />
        </Stack>
    );
};

const PatientPersonalInformationInputs = () => {
    const { getValues, setValue } = useFormContext();
    console.info('HOW ABOUT NOW PATIENT');
    // set first and last name based on email
    const handleEmailChange = (email: string) => {
        const { first_name, last_name } = getValues();
        if (first_name || last_name || !email) return;
        const [first, last] = email.split('@')[0].split('.');
        setValue('first_name', first.charAt(0).toUpperCase() + first.slice(1));
        setValue(
            'last_name',
            last ? last.charAt(0).toUpperCase() + last.slice(1) : ''
        );
    };

    const handleEmailPaste: React.ClipboardEventHandler<HTMLDivElement> = e => {
        const email = e.clipboardData?.getData('text/plain');
        handleEmailChange(email);
    };

    const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const email = e.target.value;
        handleEmailChange(email);
    };

    return (
        <Stack>
            <Typography variant="h6">Personal info</Typography>
            <TextInput
                source="email"
                helperText={false}
                validate={email()}
                onPaste={handleEmailPaste}
                onBlur={handleEmailBlur}
            />
            <Stack gap={1} flexDirection="row">
                <TextInput
                    source="phone_number"
                    label="Phone number"
                    helperText={false}
                />
            </Stack>
        </Stack>
    );
};

const PatientMiscInputs = () => {
    return (
        <Stack>
            <Typography variant="h6">Misc</Typography>
            <TextInput
                source="Smile Goals"
                label="Details about your ideal smile"
                multiline
                helperText={false}
            />
            <BooleanInput source="has_newsletter" helperText={false} />
            <ReferenceInput reference="dentists" source="dentist_id">
                <SelectInput
                    helperText={false}
                    label="Dentist"
                    optionText={dentistOptionRenderer}
                    validate={required()}
                />
            </ReferenceInput>
        </Stack>
    );
};

const dentistOptionRenderer = (choice: Dentist) => {
    console.info('Dentist Option', choice);
    return `${choice.first_name} ${choice.last_name}`;
};
