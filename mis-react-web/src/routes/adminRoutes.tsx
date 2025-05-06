import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/useAuth';

type Props = { children: React.ReactNode };

const AdminRoutes = ({ children }: Props) => {
    const location = useLocation ();
    const { user } = useAuth ();

    return  (user?.Role === 1) ||
            (user?.Role === 2) ||
            (user?.Role === 3) ||
            (user?.Role === 4)
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

export default AdminRoutes;