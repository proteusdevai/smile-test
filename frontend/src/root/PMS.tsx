import {
    Admin,
    CustomRoutes,
    ListGuesser,
    RaThemeOptions,
    Resource,
    defaultTheme,
    localStorageStore,
} from 'react-admin';
import type { AdminProps, AuthProvider, DataProvider } from 'react-admin';
import { deepmerge } from '@mui/utils';
import { Route } from 'react-router';
import { ForgotPasswordPage, SetPasswordPage } from 'ra-supabase';

import { Layout } from '../layout/Layout';
import { i18nProvider } from './i18nProvider';
import patients from '../patients';
import { Dashboard } from '../dashboard/Dashboard';
import consults from '../consults';
import { LoginPage } from '../login/LoginPage';
import { SignupPage } from '../login/SignupPage';
import {
    authProvider as defaultAuthProvider,
    dataProvider as defaultDataProvider,
} from '../providers/django';
import dentists from '../dentists';
import { SettingsPage } from '../settings/SettingsPage';
import {
    ConfigurationContextValue,
    ConfigurationProvider,
} from './ConfigurationContext';
import {
    defaultConsultCategories,
    defaultStages,
    defaultLogo,
    defaultTaskTypes,
    defaultTitle,
} from './defaultConfiguration';

// Define the interface for the PMS component props
export type PMSProps = {
    dataProvider?: DataProvider;
    authProvider?: AuthProvider;
    lightTheme?: RaThemeOptions;
    darkTheme?: RaThemeOptions;
} & Partial<ConfigurationContextValue> &
    Partial<AdminProps>;

const defaultLightTheme = deepmerge(defaultTheme, {
    palette: {
        background: {
            default: '#fafafb',
        },
        primary: {
            main: '#2F68AC',
        },
    },
    components: {
        RaFileInput: {
            styleOverrides: {
                root: {
                    '& .RaFileInput-dropZone': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
    },
});

export const PMS = ({
    darkTheme,
    consultCategories = defaultConsultCategories,
    stages = defaultStages,
    lightTheme = defaultLightTheme,
    logo = defaultLogo,
    taskTypes = defaultTaskTypes,
    title = defaultTitle,
    dataProvider = defaultDataProvider,
    authProvider = defaultAuthProvider,
    ...rest
}: PMSProps) => (
    <ConfigurationProvider
        consultCategories={consultCategories}
        stages={stages}
        logo={logo}
        taskTypes={taskTypes}
        title={title}
    >
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            store={localStorageStore(undefined, 'PMS')}
            layout={Layout}
            loginPage={LoginPage}
            dashboard={Dashboard}
            theme={lightTheme}
            darkTheme={darkTheme || null}
            i18nProvider={i18nProvider}
            requireAuth
            {...rest}
        >
            <CustomRoutes noLayout>
                <Route path={SignupPage.path} element={<SignupPage />} />
                <Route
                    path={SetPasswordPage.path}
                    element={<SetPasswordPage />}
                />
                <Route
                    path={ForgotPasswordPage.path}
                    element={<ForgotPasswordPage />}
                />
            </CustomRoutes>

            <CustomRoutes>
                <Route path={SettingsPage.path} element={<SettingsPage />} />
            </CustomRoutes>
            <Resource name="patients" {...patients} />
            <Resource name="consults" {...consults} />
            <Resource name="consultNotes" />
            <Resource name="tasks" list={ListGuesser} />
            <Resource name="dentists" {...dentists} />
            <Resource name="tags" list={ListGuesser} />
        </Admin>
    </ConfigurationProvider>
);
