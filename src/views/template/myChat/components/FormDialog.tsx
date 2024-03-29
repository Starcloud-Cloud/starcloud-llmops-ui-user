// material-ui
import CloseIcon from '@mui/icons-material/Close';
import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { t } from 'hooks/web/useI18n';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

// ===============================|| UI DIALOG - FORMS ||=============================== //

export default function FormDialog({
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
    const theme = useTheme();
    const [checked, setChecked] = useState(false);

    const handleClose = () => {
        setOpen(false);
        setChecked(false);
        setValue('');
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
                title={t('chat.createRobot')}
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
                                error={checked && !value}
                                autoFocus
                                inputProps={{ maxLength: 20 }}
                                size="small"
                                id="name"
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
