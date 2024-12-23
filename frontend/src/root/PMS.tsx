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
    defaultConsultPipelineStatuses,
    defaultStages,
    defaultLogo,
    defaultTaskTypes,
    defaultTitle,
} from './defaultConfiguration';

// Define the interface for the PMS component props
export type CRMProps = {
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

/**
 * PMS Component
 *
 * This component sets up and renders the main PMS application using `react-admin`. It provides
 * default configurations and themes but allows for customization through props. The component
 * wraps the application with a `ConfigurationProvider` to provide configuration values via context.
 *
 * @param {Array<ContactGender>} contactGender - The gender options for contacts used in the application.
 * @param {string[]} companySectors - The list of company sectors used in the application.
 * @param {RaThemeOptions} darkTheme - The theme to use when the application is in dark mode.
 * @param {string[]} dealCategories - The categories of deals used in the application.
 * @param {string[]} dealPipelineStatuses - The statuses of deals in the pipeline used in the application.
 * @param {DealStage[]} dealStages - The stages of deals used in the application.
 * @param {RaThemeOptions} lightTheme - The theme to use when the application is in light mode.
 * @param {string} logo - The logo used in the PMS application.
 * @param {NoteStatus[]} noteStatuses - The statuses of messages used in the application.
 * @param {string[]} taskTypes - The types of tasks used in the application.
 * @param {string} title - The title of the PMS application.
 *
 * @returns {JSX.Element} The rendered PMS application.
 *
 * @example
 * // Basic usage of the PMS component
 * import { PMS } from './PMS';
 *
 * const App = () => (
 *     <PMS
 *         logo="/path/to/logo.png"
 *         title="My Custom PMS"
 *         lightTheme={{
 *             ...defaultTheme,
 *             palette: {
 *                 primary: { main: '#0000ff' },
 *             },
 *         }}
 *     />
 * );
 *
 * export default App;
 */
export const PMS = ({
    darkTheme,
    consultCategories = defaultConsultCategories,
    consultPipelineStatuses = defaultConsultPipelineStatuses,
    stages = defaultStages,
    lightTheme = defaultLightTheme,
    logo = defaultLogo,
    taskTypes = defaultTaskTypes,
    title = defaultTitle,
    dataProvider = defaultDataProvider,
    authProvider = defaultAuthProvider,
    ...rest
}: CRMProps) => (
    <ConfigurationProvider
        consultCategories={consultCategories}
        consultPipelineStatuses={consultPipelineStatuses}
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
            <Resource name="consults" {...consults} />
            <Resource name="patients" {...patients} />
            <Resource name="patientMessages" />
            <Resource name="consultNotes" />
            <Resource name="tasks" list={ListGuesser} />
            <Resource name="dentists" {...dentists} />
            <Resource name="tags" list={ListGuesser} />
        </Admin>
    </ConfigurationProvider>
);
