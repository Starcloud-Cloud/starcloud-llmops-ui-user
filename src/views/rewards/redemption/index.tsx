import { Grid, Typography } from '@mui/material';
import { t } from 'hooks/web/useI18n';
import { useState } from 'react';
import BottomCards from './BottomCards';
import BijibottomCards from './bijiBottomCards';
import Header from './Header';
import MiddleCards from './MiddleCards';
import Record from './Record';
import { InviteMatrix } from './inviteMatrix';
import { ENUM_TENANT, getTenant } from 'utils/permission';
const Redemption = () => {
    const [openRecord, setOpenRecord] = useState(false); // 新增的状态
    const handleOpenRecord = () => setOpenRecord(true); // 新增的打开函数
    const handleCloseRecord = () => setOpenRecord(false); // 新增的关闭函数
    return (
        <Grid className="bg-[#f5f5f5] min-h-screen">
            <Header />
            <Typography variant="h3" textAlign="center" sx={{ my: 3 }}>
                {t('redemption.obtain')}
            </Typography>
            <Typography
                variant="h5"
                textAlign="right"
                sx={{ cursor: 'pointer', color: '#7e7e7e', my: 3, mr: 2 }}
                onClick={handleOpenRecord}
            >
                {'查看权益记录 >'}
            </Typography>
            {openRecord && <Record open={openRecord} handleClose={handleCloseRecord} />}
            {getTenant() === ENUM_TENANT.AI ? (
                <>
                    <MiddleCards />
                    <BottomCards />
                </>
            ) : (
                <>
                    <InviteMatrix />
                    <BijibottomCards />
                </>
            )}
        </Grid>
    );
};

export default Redemption;
