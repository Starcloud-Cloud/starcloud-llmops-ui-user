import {
    Box,
    Card,
    Grid,
    Typography,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button
} from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';

import { useState } from 'react';

function BootstrapDialogTitle(props: any) {
    const { children, onClose, ...other } = props;
    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}
function Upload() {
    const [open, setOpen] = useState(false);
    return (
        <Box>
            <Typography variant="h2">概况</Typography>
            <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                    <SubCard contentSX={{ height: '78px' }}>11111</SubCard>
                    {/* <Card elevation={5} sx={{ height: '200px', padding: 2 }} onClick={() => setOpen(true)}>
                        <Box display="flex" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                                <ShareIcon />
                                <Box ml={2}>
                                    <Typography variant="body1">应用市场</Typography>
                                    <Typography variant="body1">可发布到应用市场，让所有的用户可以使用</Typography>
                                </Box>
                            </Box>
                            <Chip variant="outlined" label="运行中" color="primary"></Chip>
                        </Box>
                    </Card> */}
                </Grid>
            </Grid>
            <Dialog onClose={() => setOpen(false)} aria-labelledby="customized-dialog-title" open={open}>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={() => setOpen(false)}>
                    Modal title
                </BootstrapDialogTitle>
                <DialogContent dividers sx={{ width: '500px' }}>
                    <form>
                        <TextField fullWidth id="variable" name="variable" label="variable" InputLabelProps={{ shrink: true }} />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Save changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default Upload;
