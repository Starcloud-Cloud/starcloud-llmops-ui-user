import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import { DASHBOARD_PATH } from 'config';
import { getPermission, ENUM_PERMISSION } from 'utils/permission';
import { GuardProps } from 'types';
import { useEffect } from 'react';
import jsCookie from 'js-cookie';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }: GuardProps) => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            if (!jsCookie.get('isClient')) {
                navigate(DASHBOARD_PATH, { replace: true });
            }
        }
    }, [isLoggedIn, navigate]);

    return children;
};

export default GuestGuard;
