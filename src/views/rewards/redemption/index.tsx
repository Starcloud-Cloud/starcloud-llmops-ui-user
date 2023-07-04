import { Grid, Typography } from '@mui/material';
import Header from './Header';
import MiddleCards from './MiddleCards';
import BottomCards from './BottomCards';
import { t } from 'hooks/web/useI18n';
import Record from './Record';
import { useState } from 'react';
const Redemption = () => {
    const [openRecord, setOpenRecord] = useState(false); // 新增的状态
    const handleOpenRecord = () => setOpenRecord(true); // 新增的打开函数
    const handleCloseRecord = () => setOpenRecord(false); // 新增的关闭函数
    return (
        <Grid>
            <Header />
            <Typography variant="h3" textAlign="center" sx={{ my: 5 }}>
                {t('redemption.obtain')}
            </Typography>
            <Typography variant="h4" textAlign="right" sx={{ my: 5, mr: 2 }} onClick={handleOpenRecord}>
                权益记录
            </Typography>
            <Record open={openRecord} handleClose={handleCloseRecord} />
            <MiddleCards />
            <BottomCards />
        </Grid>
    );
};

export default Redemption;
