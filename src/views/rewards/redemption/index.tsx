import { Grid, Typography } from '@mui/material';
import Header from './Header';
import MiddleCards from './MiddleCards';
import BottomCards from './BottomCards';
const Redemption = () => {
    return (
        <Grid>
            <Header />
            <Typography variant="h3" textAlign="center" sx={{ my: 5 }}>
                权益使用完可继续通过以下方式获取
            </Typography>
            <MiddleCards />
            <BottomCards />
        </Grid>
    );
};

export default Redemption;
