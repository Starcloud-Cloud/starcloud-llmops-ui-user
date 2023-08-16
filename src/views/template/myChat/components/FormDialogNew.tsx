// material-ui
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, CardActions, CardContent, Divider, Grid, IconButton, Modal, TextField } from '@mui/material';
import { getChatTemplate } from 'api/chat';
import { t } from 'hooks/web/useI18n';
import { useEffect, useState } from 'react';
import { dispatch } from 'store';
import { gridSpacing } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import Template from './template';

// ===============================|| UI DIALOG - FORMS ||=============================== //

export default function FormDialogNew({
    open,
    setOpen,
    handleOk,
    setValue,
    value
}: {
    open: boolean;
    value: string | '';
    setOpen: (open: boolean) => void;
    handleOk: (uid: string) => void;
    setValue: (value: string) => void;
}) {
    const [checked, setChecked] = useState(false);
    const [recommendList, setRecommends] = useState([]);
    const [uid, setUid] = useState('');

    const handleClose = () => {
        setOpen(false);
        setChecked(false);
        setValue('');
    };

    useEffect(() => {
        getChatTemplate({ model: 'CHAT' }).then((res) => {
            setRecommends(res);
        });
    }, []);

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={t('chat.createRobot')}
                content={false}
                className="sm:w-[800px] xs:w-[300px]"
                secondary={
                    <IconButton
                        onClick={() => {
                            handleClose();
                            setUid('');
                        }}
                        size="large"
                        aria-label="close modal"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <Grid container spacing={gridSpacing} className="w-full flex justify-center pt-[24px] ml-0">
                        <div className={'w-full'}>
                            <TextField
                                error={checked && !value}
                                autoFocus
                                size="small"
                                id="name"
                                inputProps={{ maxLength: 20 }}
                                label={t('chat.name')}
                                placeholder={t('chat.typeName')}
                                fullWidth
                                onChange={(e) => {
                                    setChecked(true);
                                    setValue(e.target.value);
                                }}
                            />
                            <div className="flex justify-between">
                                {checked && !value ? <div className="text-[#f44336] mt-1">请填写名称</div> : <div className="h-[20px]" />}
                                <div className="text-right text-stone-600 mr-1 mt-1">{value?.length || 0}/20</div>
                            </div>
                        </div>
                        <div className="pt-[16px] w-full text-base">选择模版</div>
                        <div className="w-full mt-[8px] grid xs:grid-cols-1 gap-4 sm:grid-cols-3">
                            {recommendList.map((item: any, index) => (
                                <Box
                                    key={index}
                                    // style={{ width: '203.33px' }}
                                    className={
                                        `xs:w-full sm:w-[203.33px] hover:border-[1px] hover:border-solid hover:border-[#673ab7] rounded-[8px]` +
                                        (uid === item?.uid ? ' border-[1px] border-solid border-[#673ab7]' : '')
                                    }
                                    onClick={() => setUid(item?.uid)}
                                >
                                    <Template data={item} />
                                </Box>
                            ))}
                        </div>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button
                            variant="contained"
                            type="button"
                            onClick={() => {
                                setChecked(true);
                                if (!value) {
                                    return;
                                }
                                if (!uid) {
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '请选择模版',
                                            variant: 'alert',
                                            alert: {
                                                color: 'error'
                                            },
                                            close: false
                                        })
                                    );
                                    return;
                                }
                                handleOk(uid);
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
