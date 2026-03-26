export const decodeJwtPayload = (token) => {
    if (!token || typeof token !== 'string') {
        return null;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length < 2) {
        return null;
    }

    try {
        const payload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
        const normalized = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
        const jsonString = atob(normalized);
        const parsed = JSON.parse(jsonString);

        return parsed;
    } catch (_error) {
        return null;
    }
};

export const getAuthState = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return {
            token: null,
            user: null,
            isAuthenticated: false,
            isAdmin: false
        };
    }

    const payload = decodeJwtPayload(token);

    const role = payload?.role || 'customer';
    const userId = payload?.userId || null;

    return {
        token,
        user: {
            id: userId,
            role
        },
        isAuthenticated: true,
        isAdmin: role === 'admin'
    };
};
