import { Grid, Typography } from '@mui/material';
import Header from './Header';
import MiddleCards from './MiddleCards';
import BottomCards from './BottomCards';
import { t } from 'hooks/web/useI18n';
const Redemption = () => {
    return (
        <Grid>
            <Header />
            <Typography variant="h3" textAlign="center" sx={{ my: 5 }}>
                {t('redemption.obtain')}
            </Typography>
            <MiddleCards />
            <BottomCards />
        </Grid>
    );
};

export default Redemption;
