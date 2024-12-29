import { createContext, ReactNode, useContext } from 'react';
import {
    defaultConsultCategories,
    defaultStages,
    defaultLogo,
    defaultTaskTypes,
    defaultTitle,
} from './defaultConfiguration';
import { Stage } from '../types';

// Define types for the context value
export interface ConfigurationContextValue {
    consultCategories: string[];
    stages: Stage[];
    taskTypes: string[];
    title: string;
    logo: string;
}

export interface ConfigurationProviderProps extends ConfigurationContextValue {
    children: ReactNode;
}

// Create context with default value
export const ConfigurationContext = createContext<ConfigurationContextValue>({
    consultCategories: defaultConsultCategories,
    stages: defaultStages,
    taskTypes: defaultTaskTypes,
    title: defaultTitle,
    logo: defaultLogo,
});

export const ConfigurationProvider = ({
    children,
    consultCategories,
    stages,
    logo,
    taskTypes,
    title,
}: ConfigurationProviderProps) => (
    <ConfigurationContext.Provider
        value={{
            consultCategories,
            stages,
            logo,
            title,
            taskTypes,
        }}
    >
        {children}
    </ConfigurationContext.Provider>
);

export const useConfigurationContext = () => useContext(ConfigurationContext);
