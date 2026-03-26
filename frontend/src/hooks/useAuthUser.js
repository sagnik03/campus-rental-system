import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getAuthState } from '../utils/auth';

const useAuthUser = () => {
    const location = useLocation();
    const [authState, setAuthState] = useState(getAuthState);

    useEffect(() => {
        setAuthState(getAuthState());
    }, [location.pathname]);

    return authState;
};

export default useAuthUser;
