import { tokenAuthProvider } from 'ra-data-django-rest-framework';
import { AuthProvider } from 'react-admin';
import { canAccess } from '../commons/canAccess';

const baseAuthProvider = tokenAuthProvider();

export async function getIsInitialized() {
    if (getIsInitialized._is_initialized_cache == null) {
        const { data } = await supabase
            .from('init_state')
            .select('is_initialized');

        getIsInitialized._is_initialized_cache =
            data?.at(0)?.is_initialized > 0;
    }

    return getIsInitialized._is_initialized_cache;
}

export namespace getIsInitialized {
    export var _is_initialized_cache: boolean | null = null;
}

export const authProvider: AuthProvider = {
    ...baseAuthProvider,
    login: async params => {
        const result = await baseAuthProvider.login(params);
        // clear cached sale
        cachedSale = undefined;
        return result;
    },
    checkAuth: async params => {
        // Users are on the set-password page, nothing to do
        if (
            window.location.pathname === '/set-password' ||
            window.location.hash.includes('#/set-password')
        ) {
            return;
        }
        // Users are on the forgot-password page, nothing to do
        if (
            window.location.pathname === '/forgot-password' ||
            window.location.hash.includes('#/forgot-password')
        ) {
            return;
        }
        // Users are on the sign-up page, nothing to do
        if (
            window.location.pathname === '/sign-up' ||
            window.location.hash.includes('#/sign-up')
        ) {
            return;
        }

        const isInitialized = await getIsInitialized();

        if (!isInitialized) {
            await supabase.auth.signOut();
            // eslint-disable-next-line no-throw-literal
            throw {
                redirectTo: '/sign-up',
                message: false,
            };
        }

        return baseAuthProvider.checkAuth(params);
    },
    canAccess: async params => {
        const isInitialized = await getIsInitialized();
        if (!isInitialized) return false;

        // Get the current user
        const sale = await getSaleFromCache();
        if (sale == null) return false;

        // Compute access rights from the sale role
        const role = sale.administrator ? 'admin' : 'user';
        return canAccess(role, params);
    },
};

let cachedSale: any;
const getSaleFromCache = async () => {
    if (cachedSale != null) return cachedSale;

    const { data: dataSession, error: errorSession } =
        await supabase.auth.getSession();

    // Shouldn't happen after login but just in case
    if (dataSession?.session?.user == null || errorSession) {
        return undefined;
    }

    const { data: dataSale, error: errorSale } = await supabase
        .from('sales')
        .select('id, first_name, last_name, avatar, administrator')
        .match({ user_id: dataSession?.session?.user.id })
        .single();

    // Shouldn't happen either as all users are sales but just in case
    if (dataSale == null || errorSale) {
        return undefined;
    }

    cachedSale = dataSale;
    return dataSale;
};
