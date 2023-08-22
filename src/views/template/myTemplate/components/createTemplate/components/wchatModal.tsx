// material-ui
import CloseIcon from '@mui/icons-material/Close';
import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal, TextField } from '@mui/material';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

export default function WechatModal({
    open,
    setOpen,
    handleOk,
    setValue,
    value
}: {
    open: boolean;
    value: string | '';
    setOpen: (open: boolean) => void;
    handleOk: () => void;
    setValue: (value: string) => void;
}) {
    const [checked, setChecked] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={'创建微信群聊'}
                content={false}
                className="sm:w-[700px] xs:w-[300px]"
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <Grid container spacing={gridSpacing} className="w-full flex justify-center pt-[24px] ml-0">
                        <div className={'w-full'}>
                            <TextField
                                error={checked && !value.match(/^1[3-9]\d{9}$/)}
                                InputLabelProps={{ shrink: true }}
                                color="secondary"
                                name="phone"
                                label={'手机号'}
                                placeholder={'请输入手机号'}
                                fullWidth
                                helperText={checked && !value.match(/^1[3-9]\d{9}$/) && '请输入正确的手机号'}
                                onChange={(e) => {
                                    setChecked(true);
                                    setValue(e.target.value);
                                }}
                            />
                        </div>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button
                            variant="contained"
                            type="button"
                            color="secondary"
                            onClick={() => {
                                setChecked(true);
                                if (!value.match(/^1[3-9]\d{9}$/)) {
                                    return;
                                }
                                handleOk();
                            }}
                        >
                            创建
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
}
