import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import AlbumIcon from '@mui/icons-material/Album';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import FormExecute from 'views/template/components/form';

function CarryOut() {
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item lg={7} md={7} sm={7}>
                    <Typography variant="h5" my={2}>
                        我是产品描述
                    </Typography>
                    <Button startIcon={<AlbumIcon />} variant="contained">
                        全部执行
                    </Button>
                    <Tooltip title="点击全部执行">
                        <IconButton size="small">
                            <ErrorOutlineIcon />
                        </IconButton>
                    </Tooltip>
                    <form>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={6} sm={12}>
                                <FormExecute form={{ value: '', label: 'age', des: '我是描述', default: 'default' }} />
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
                <Grid item lg={5} md={5} sm={5}>
                    1111111
                </Grid>
            </Grid>
        </Box>
    );
}
export default CarryOut;
