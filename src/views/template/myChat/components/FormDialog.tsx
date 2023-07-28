import React, { useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from '@mui/material';

// ===============================|| UI DIALOG - FORMS ||=============================== //

export default function FormDialog({ open, setOpen, handleOk }: { open: boolean; setOpen: (open: boolean) => void; handleOk: () => void }) {
    const theme = useTheme();

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                {open && (
                    <>
                        <DialogTitle id="form-dialog-title">新建机器人</DialogTitle>
                        <DialogContent>
                            <Stack spacing={3}>
                                <DialogContentText>
                                    <Typography variant="body2" component="span">
                                        Let Google help apps determine location. This means sending anonymous location data to Google, even
                                        when no apps are running.
                                    </Typography>
                                </DialogContentText>
                                <TextField autoFocus size="small" id="name" label="机器人名称" type="email" fullWidth />
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
