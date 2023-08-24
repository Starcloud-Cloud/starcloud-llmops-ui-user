import { Modal, IconButton, CardContent, Divider, CardActions, Grid, Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
const AddRuleModal = ({ open, handleClose }: { open: boolean; handleClose: (open: boolean) => void }) => {
    return (
        <Modal open={open} onClose={() => handleClose(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '80%',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)'
                }}
                headerSX={{ p: '16px !important' }}
                contentSX={{ p: '16px !important' }}
                title="添加文档"
                content={false}
                secondary={
                    <IconButton onClick={() => handleClose(false)}>
                        <Close fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent sx={{ p: '16px !important' }}>1111111111</CardContent>
                <Divider sx={{ mt: 2 }} />
                <CardActions sx={{ p: 2 }}>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" color="secondary">
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};
export default AddRuleModal;
