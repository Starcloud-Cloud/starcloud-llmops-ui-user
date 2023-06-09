import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';

import CarryOut from 'views/template/carryOut';
function Deatail() {
    return (
        <Card sx={{ padding: 2 }}>
            <Breadcrumbs sx={{ padding: 2 }} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="#">
                    MUI
                </Link>
                <Link underline="hover" color="inherit" href="##">
                    Core
                </Link>
                <Typography color="text.primary">Breadcrumbs</Typography>
            </Breadcrumbs>
            <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <AccessAlarm sx={{ fontSize: '80px' }} />
                    <Box>
                        <Box>
                            <Typography variant="h2">生成亚马逊Listing</Typography>
                        </Box>
                        <Box my={1}>
                            <span>#sbc</span>
                            <Chip sx={{ marginRight: 1 }} size="small" label="Chip Outlined" variant="outlined" />
                        </Box>
                        <Box sx={{ verticalAlign: 'middle' }}>
                            <AccessAlarm />
                            <span>826</span>
                        </Box>
                    </Box>
                </Box>
                <Button variant="contained" color="info">
                    收藏模板
                </Button>
            </Box>
            <CarryOut />
        </Card>
    );
}
export default Deatail;
