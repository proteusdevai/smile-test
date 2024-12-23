import { useQuery } from '@tanstack/react-query';
import { useDataProvider } from 'react-admin';
import { Navigate } from 'react-router-dom';
import { AppDataProvider } from '../providers/types';
import { LoginForm } from './LoginForm';
import { LoginSkeleton } from './LoginSkeleton';

export const LoginPage = () => {
    const dataProvider = useDataProvider<AppDataProvider>();
    const {
        data: isInitialized,
        error,
        isPending,
    } = useQuery({
        queryKey: ['init'],
        queryFn: async () => {
            return dataProvider.isInitialized();
        },
    });

    if (isPending) return <LoginSkeleton />;
    if (error) return <LoginForm />;
    if (isInitialized) return <LoginForm />;

    return <Navigate to="/sign-up" />;
};
