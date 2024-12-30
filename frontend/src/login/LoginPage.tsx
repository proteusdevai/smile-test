import { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { LoginSkeleton } from './LoginSkeleton';

export const LoginPage = () => {
    const [isServerUp, setIsServerUp] = useState<boolean | null>(null);

    // Check if the Django server is up
    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                console.info('Checking server health at /api/health-check/...');
                const response = await fetch('/api/health-check/');
                console.info(
                    'Received response from /api/health-check/:',
                    response
                );
                if (response.ok) {
                    console.info('Server is up and running.');
                    setIsServerUp(true);
                } else {
                    setIsServerUp(false);
                }
            } catch (error) {
                console.error('Server health check failed:', error);
                setIsServerUp(false);
            }
        };
        checkServerStatus();
    }, []);

    if (isServerUp === null) return <LoginSkeleton />; // Show skeleton while checking the server status
    if (!isServerUp) return <div>Server is down. Please try again later.</div>; // Handle server down case

    return <LoginForm />; // Render the login form if the server is up
};
