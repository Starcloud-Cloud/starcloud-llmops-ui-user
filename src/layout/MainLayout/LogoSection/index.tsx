import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link } from '@mui/material';

// project imports
import { DASHBOARD_PATH } from 'config';
import Logo from 'ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <Link component={RouterLink} to={'/'} aria-label="theme-logo" sx={{ textDecoration: 'none' }}>
        <Logo />
    </Link>
);

export default LogoSection;
