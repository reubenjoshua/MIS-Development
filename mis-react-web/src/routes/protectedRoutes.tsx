import React from 'react';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/useAuth';

type Props = { children: React.ReactNode };

const ProtectedRoutes = ({ children }: Props) => {
    const location = useLocation ();
    const { isLoggedIn } = useAuth ();

    useEffect (() => {}, [ isLoggedIn ]);

    return isLoggedIn ()
        ? (
            <>{ children }</>
          )
        : (
            <Navigate
                to = "/mis/login"
                state = {{ from: location }}
                replace
            />
          )
};

export default ProtectedRoutes;