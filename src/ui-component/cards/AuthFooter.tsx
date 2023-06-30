// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="flex-end">
        {/* <Typography variant="subtitle2" component={Link} href="https://berrydashboard.io" target="_blank" underline="hover">
            berrydashboard.io
        </Typography> */}
        <Typography variant="subtitle2" component={Link} href="http://mofaai.com.cn" target="_blank" underline="hover">
            &copy; mofaai.com.cn
        </Typography>
    </Stack>
);

export default AuthFooter;
