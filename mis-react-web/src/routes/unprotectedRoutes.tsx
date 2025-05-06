import React from 'react';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/useAuth';

type Props = { children: React.ReactNode };

const UnprotectedRoutes = ({ children }: Props) => {
    const location = useLocation ();
    const { isLoggedIn } = useAuth ();

    useEffect (() => {}, [ isLoggedIn ]);

    return isLoggedIn ()
        ? (
            <Navigate
                to = "/mis/dashboard"
                state = {{ from: location }}
                replace
            />
          )
        : (
            <>{ children }</>
          )
};

export default UnprotectedRoutes;