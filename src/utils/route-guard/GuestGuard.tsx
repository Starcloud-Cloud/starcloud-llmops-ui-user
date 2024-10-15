import { useLocation, useNavigate } from 'react-router-dom';

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
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const redirect_url = query.get('redirect_url');

    useEffect(() => {
        if (isLoggedIn) {
            if (!jsCookie.get('isClient')) {
                if (redirect_url) {
                    window.location.href = redirect_url;
                } else {
                    navigate(DASHBOARD_PATH, { replace: true });
                }
            }
        }
    }, [isLoggedIn, navigate]);

    return children;
};

export default GuestGuard;
