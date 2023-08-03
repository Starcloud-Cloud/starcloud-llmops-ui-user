// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { t } from 'hooks/web/useI18n';
import { useState } from 'react';

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
    };
    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                {open && (
                    <>
                        <DialogTitle id="form-dialog-title">{t('chat.createRobot')}</DialogTitle>
                        <DialogContent className="w-[325px]">
                            <Stack spacing={3}>
                                <div className="pt-[10px]">
                                    <TextField
                                        error={checked && !value}
                                        autoFocus
                                        size="small"
                                        id="name"
                                        label={t('chat.name')}
                                        placeholder={t('chat.typeName')}
                                        fullWidth
                                        helperText={checked && !value && t('chat.createRobotRequire')}
                                        onChange={(e) => {
                                            setChecked(true);
                                            setValue(e.target.value);
                                        }}
                                    />
                                </div>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ pr: 2.5 }}>
                            <Button sx={{ color: theme.palette.error.dark }} onClick={handleClose} color="secondary">
                                取消
                            </Button>
                            <Button variant="contained" size="small" onClick={handleOk}>
                                创建
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}
